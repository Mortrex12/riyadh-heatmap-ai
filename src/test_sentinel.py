import json
import urllib.request
import urllib.parse
import os

token_url = "https://identity.dataspace.copernicus.eu/auth/realms/CDSE/protocol/openid-connect/token"
client_id = ""
client_secret = ""

data = urllib.parse.urlencode({
    "grant_type": "client_credentials",
    "client_id": client_id,
    "client_secret": client_secret
}).encode()

req = urllib.request.Request(token_url, data=data, method="POST")
with urllib.request.urlopen(req) as resp:
    token = json.loads(resp.read().decode())["access_token"]

print("Authenticated successfully with CDSE!")

process_url = "https://sh.dataspace.copernicus.eu/api/v1/process"
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

payload = {
    "input": {
        "bounds": {
            "bbox": [46.65, 24.68, 46.75, 24.75]
        },
        "data": [{
            "type": "sentinel-2-l2a",
            "dataFilter": {
                "timeRange": {
                    "from": "2024-06-01T00:00:00Z",
                    "to": "2024-06-30T23:59:59Z"
                },
                "maxCloudCoverage": 10
            }
        }]
    },
    "output": {
        "width": 256,
        "height": 256,
        "responses": [{
            "identifier": "default",
            "format": { "type": "image/png" }
        }]
    },
    "evalscript": evalscript
}

req_process = urllib.request.Request(
    process_url,
    data=json.dumps(payload).encode("utf-8"),
    headers={
        "Authorization": f"Bearer {token}",
        "Content-Type": "application/json",
        "Accept": "image/png"
    },
    method="POST"
)

try:
    with urllib.request.urlopen(req_process) as resp:
        content = resp.read()
        print(f"Process API returned {len(content)} bytes of PNG image data!")
        with open("riyadh_sentinel2_sample.png", "wb") as f:
            f.write(content)
        print("Saved riyadh_sentinel2_sample.png")
except urllib.error.HTTPError as e:
    print("HTTP Error:", e.code, e.read().decode("utf-8"))
except Exception as e:
    print("Error:", e)
