"""
Sentinel-2 Data Service via Copernicus Data Space Ecosystem (CDSE)
Provides authentication, catalog search, multispectral processing (RGB, NDVI, NDBI),
and automated sync of real satellite metrics for Riyadh Heatmap AI.
"""

import os
import json
import time
import requests
from typing import Dict, Any, List, Optional
from datetime import datetime, timedelta

# Load environment variables if .env exists
try:
    from dotenv import load_dotenv
    load_dotenv()
except ImportError:
    pass

CLIENT_ID = os.environ.get("SENTINEL_CLIENT_ID", "")
CLIENT_SECRET = os.environ.get("SENTINEL_CLIENT_SECRET", "")
TOKEN_URL = os.environ.get("COPERNICUS_AUTH_URL", "https://identity.dataspace.copernicus.eu/auth/realms/CDSE/protocol/openid-connect/token")
PROCESS_URL = os.environ.get("SENTINEL_PROCESS_API", "https://sh.dataspace.copernicus.eu/api/v1/process")
CATALOG_URL = os.environ.get("SENTINEL_CATALOG_API", "https://sh.dataspace.copernicus.eu/api/v1/catalog/1.0.0/search")

# Default Riyadh Bounds [min_lon, min_lat, max_lon, max_lat]
RIYADH_BBOX = [46.50, 24.50, 46.90, 24.90]

class SentinelService:
    def __init__(self, client_id: str = CLIENT_ID, client_secret: str = CLIENT_SECRET):
        self.client_id = client_id
        self.client_secret = client_secret
        self._access_token: Optional[str] = None
        self._token_expiry: float = 0

    def get_token(self) -> str:
        """Authenticate with CDSE OAuth2 endpoint and obtain access token."""
        if self._access_token and time.time() < self._token_expiry - 60:
            return self._access_token

        payload = {
            "grant_type": "client_credentials",
            "client_id": self.client_id,
            "client_secret": self.client_secret
        }
        res = requests.post(TOKEN_URL, data=payload, timeout=20)
        res.raise_for_status()
        data = res.json()
        self._access_token = data["access_token"]
        self._token_expiry = time.time() + data.get("expires_in", 1800)
        return self._access_token

    def search_scenes(self, bbox: List[float] = None, max_cloud: float = 20.0, limit: int = 5) -> List[Dict[str, Any]]:
        """Search recent Sentinel-2 L2A scenes with low cloud coverage."""
        bbox = bbox or RIYADH_BBOX
        token = self.get_token()

        end_date = datetime.utcnow()
        start_date = end_date - timedelta(days=90)
        time_range = f"{start_date.strftime('%Y-%m-%dT00:00:00Z')}/{end_date.strftime('%Y-%m-%dT23:59:59Z')}"

        body = {
            "collections": ["sentinel-2-l2a"],
            "datetime": time_range,
            "bbox": bbox,
            "limit": limit
        }

        headers = {
            "Authorization": f"Bearer {token}",
            "Content-Type": "application/json"
        }

        res = requests.post(CATALOG_URL, json=body, headers=headers, timeout=25)
        res.raise_for_status()
        data = res.json()
        features = data.get("features", [])

        # Filter by cloud cover if requested
        filtered = [
            f for f in features 
            if f.get("properties", {}).get("eo:cloud_cover", 100) <= max_cloud
        ]
        return filtered if filtered else features

    def fetch_image(self, evalscript: str, bbox: List[float] = None, width: int = 512, height: int = 512, 
                    time_range: Dict[str, str] = None, output_format: str = "image/png") -> bytes:
        """Execute a Sentinel-2 Process API request with custom evalscript."""
        bbox = bbox or RIYADH_BBOX
        token = self.get_token()

        if not time_range:
            end_date = datetime.utcnow()
            start_date = end_date - timedelta(days=60)
            time_range = {
                "from": start_date.strftime('%Y-%m-%dT00:00:00Z'),
                "to": end_date.strftime('%Y-%m-%dT23:59:59Z')
            }

        payload = {
            "input": {
                "bounds": {
                    "bbox": bbox
                },
                "data": [{
                    "type": "sentinel-2-l2a",
                    "dataFilter": {
                        "timeRange": time_range,
                        "maxCloudCoverage": 15
                    }
                }]
            },
            "output": {
                "width": width,
                "height": height,
                "responses": [{
                    "identifier": "default",
                    "format": {"type": output_format}
                }]
            },
            "evalscript": evalscript
        }

        headers = {
            "Authorization": f"Bearer {token}",
            "Content-Type": "application/json",
            "Accept": output_format
        }

        res = requests.post(PROCESS_URL, json=payload, headers=headers, timeout=40)
        res.raise_for_status()
        return res.content

    def get_true_color_rgb(self, bbox: List[float] = None, width: int = 512, height: int = 512) -> bytes:
        """Fetch Sentinel-2 Natural Color RGB image (B04, B03, B02)."""
        evalscript = """//VERSION=3
        function setup() {
          return {
            input: ["B02", "B03", "B04"],
            output: { bands: 3 }
          };
        }
        function evaluatePixel(samples) {
          return [samples.B04 * 2.5, samples.B03 * 2.5, samples.B02 * 2.5];
        }
        """
        return self.fetch_image(evalscript, bbox=bbox, width=width, height=height)

    def get_ndvi_heat_map(self, bbox: List[float] = None, width: int = 512, height: int = 512) -> bytes:
        """
        Fetch NDVI & Urban Heat Vulnerability color-coded image:
        - High NDVI (Vegetation) -> Green
        - Low NDVI + High Built-up (Heat Hotspots) -> Red / Orange
        - Bare Soil -> Yellow / Tan
        """
        evalscript = """//VERSION=3
        function setup() {
          return {
            input: ["B04", "B08", "B11", "dataMask"],
            output: { bands: 4 }
          };
        }
        function evaluatePixel(samples) {
          if (samples.dataMask === 0) return [0, 0, 0, 0];
          let ndvi = (samples.B08 - samples.B04) / (samples.B08 + samples.B04 + 0.0001);
          let ndbi = (samples.B11 - samples.B08) / (samples.B11 + samples.B08 + 0.0001);
          
          // Vegetation
          if (ndvi > 0.3) {
            return [0.0, 0.8, 0.2, 1.0];
          } else if (ndvi > 0.15) {
            return [0.4, 0.9, 0.1, 1.0];
          }
          
          // High Built-up / Urban Concrete (Heat Hotspot)
          if (ndbi > 0.05) {
            return [0.95, 0.2, 0.1, 1.0]; // Bright Red (Hotspot)
          } else if (ndbi > -0.05) {
            return [1.0, 0.55, 0.0, 1.0]; // Orange (Moderate Risk)
          }
          
          // Bare sand / soil
          return [0.85, 0.75, 0.45, 1.0];
        }
        """
        return self.fetch_image(evalscript, bbox=bbox, width=width, height=height)


def sync_project_satellite_data():
    """Sync real Sentinel-2 satellite data and metadata for the project."""
    service = SentinelService()
    print("Connecting to Copernicus Data Space Ecosystem (CDSE)...")
    token = service.get_token()
    print("Authenticated successfully!")

    print("Searching latest Sentinel-2 L2A scenes over Riyadh...")
    scenes = service.search_scenes(limit=3, max_cloud=10.0)
    if not scenes:
        scenes = service.search_scenes(limit=3, max_cloud=30.0)
    
    latest_scene = scenes[0] if scenes else {}
    props = latest_scene.get("properties", {})
    scene_id = latest_scene.get("id", "Unknown")
    datetime_str = props.get("datetime", datetime.utcnow().isoformat())
    cloud_cover = props.get("eo:cloud_cover", 0.0)

    print(f"Latest Scene: {scene_id}")
    print(f"Acquisition: {datetime_str} (Cloud cover: {cloud_cover}%)")

    # Destination directories
    public_sat_dir = os.path.join("riyadh-heatmap-ai", "public", "satellite")
    data_dir = os.path.join("riyadh-heatmap-ai", "src", "data")
    os.makedirs(public_sat_dir, exist_ok=True)
    os.makedirs(data_dir, exist_ok=True)

    # 1. Fetch Real RGB True Color Satellite Image for Riyadh
    print("Fetching high-resolution Sentinel-2 RGB True-Color satellite layer for Riyadh...")
    rgb_bytes = service.get_true_color_rgb(width=800, height=800)
    rgb_path = os.path.join(public_sat_dir, "riyadh_sentinel2_rgb.png")
    with open(rgb_path, "wb") as f:
        f.write(rgb_bytes)
    print(f"Saved real Sentinel-2 RGB image -> {rgb_path} ({len(rgb_bytes)} bytes)")

    # 2. Fetch Real NDVI / Built-up Heat Vulnerability Map
    print("Fetching Sentinel-2 NDVI & Built-Up Heat Risk Analysis layer...")
    ndvi_bytes = service.get_ndvi_heat_map(width=800, height=800)
    ndvi_path = os.path.join(public_sat_dir, "riyadh_sentinel2_ndvi_heat.png")
    with open(ndvi_path, "wb") as f:
        f.write(ndvi_bytes)
    print(f"Saved real Sentinel-2 Heat Risk layer -> {ndvi_path} ({len(ndvi_bytes)} bytes)")

    # 3. Save Satellite Metadata JSON for the Next.js Frontend
    metadata = {
        "status": "connected",
        "provider": "Copernicus Data Space Ecosystem (CDSE)",
        "mission": "Sentinel-2 MSI (MultiSpectral Instrument)",
        "instrument": "Level-2A Bottom of Atmosphere (BOA) Reflectance",
        "region": "Riyadh, Kingdom of Saudi Arabia",
        "bbox": RIYADH_BBOX,
        "latestSceneId": scene_id,
        "acquisitionDatetime": datetime_str,
        "cloudCoveragePercent": cloud_cover,
        "lastSyncedAt": datetime.utcnow().isoformat() + "Z",
        "rgbLayerUrl": "/satellite/riyadh_sentinel2_rgb.png",
        "heatRiskLayerUrl": "/satellite/riyadh_sentinel2_ndvi_heat.png"
    }

    meta_path = os.path.join(data_dir, "sentinel_metadata.json")
    with open(meta_path, "w", encoding="utf-8") as f:
        json.dump(metadata, f, indent=2)
    print(f"Saved Sentinel metadata -> {meta_path}")

    print("\nSUCCESS: Real Sentinel-2 data is synced and ready to be used!")
    return metadata

if __name__ == "__main__":
    sync_project_satellite_data()
