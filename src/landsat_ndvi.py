import numpy as np
import rasterio
import planetary_computer as pc
from pystac_client import Client
from rasterio.windows import from_bounds
from rasterio.warp import transform_bounds

bbox = [50.00, 26.35, 50.20, 26.50]  # [min_lon, min_lat, max_lon, max_lat]

catalog = Client.open(
    "https://planetarycomputer.microsoft.com/api/stac/v1",
    modifier=pc.sign_inplace,
)

items = catalog.search(
    collections=["landsat-c2-l2"],
    bbox=bbox,
    datetime="2026-08-01/2026-10-01",
    query={
        "eo:cloud_cover": {"lt": 20},
        "platform": {"in": ["landsat-8", "landsat-9"]},
    },
).item_collection()

# أقل مشهد غيوم
if not items:
    print("No items found.")
else:
    item = sorted(items, key=lambda i: i.properties["eo:cloud_cover"])[0]
    print(item.id, item.properties["eo:cloud_cover"])

    def read_band(name):
        with rasterio.open(item.assets[name].href) as src:
            b = transform_bounds("EPSG:4326", src.crs, *bbox)
            win = from_bounds(*b, transform=src.transform)
            arr = src.read(1, window=win).astype("float32")
            arr[arr == 0] = np.nan                      # fill value
            out_transform = src.window_transform(win)
            return arr * 0.0000275 - 0.2, out_transform, src.crs # scale factor للـ surface reflectance

    red, transform, crs = read_band("red")
    nir, _, _ = read_band("nir08")
    ndvi = (nir - red) / (nir + red)
    print(ndvi.shape, np.nanmean(ndvi))
    
    # Save the NDVI as a GeoTIFF file
    profile = {
        'driver': 'GTiff',
        'height': ndvi.shape[0],
        'width': ndvi.shape[1],
        'count': 1,
        'dtype': str(ndvi.dtype),
        'crs': crs,
        'transform': transform,
        'nodata': np.nan
    }
    
    output_file = "ndvi_output.tif"
    with rasterio.open(output_file, 'w', **profile) as dst:
        dst.write(ndvi, 1)
        
    print(f"تم حفظ بيانات NDVI بنجاح في ملف: {output_file}")
