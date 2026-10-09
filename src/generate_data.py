import json
import random
import math

def generate_polygon(center_lat, center_lon, radius_km, num_points=6):
    points = []
    for i in range(num_points):
        angle = 2 * math.pi * i / num_points
        r = radius_km + random.uniform(-radius_km/3, radius_km/3)
        lat_offset = (r / 111.0) * math.sin(angle)
        lon_offset = (r / (111.0 * 0.9)) * math.cos(angle)
        points.append([center_lon + lon_offset, center_lat + lat_offset])
    points.append(points[0])
    return [points]

def create_feature(geom, properties):
    return {
        "type": "Feature",
        "geometry": {
            "type": "Polygon",
            "coordinates": geom
        },
        "properties": properties
    }

center_lat = 24.7136
center_lon = 46.6753
random.seed(42)

hotspots = []
for i in range(15):
    clat = center_lat + random.uniform(-0.15, 0.15)
    clon = center_lon + random.uniform(-0.15, 0.15)
    geom = generate_polygon(clat, clon, random.uniform(0.5, 2.0))
    severity = random.choice(["LOW", "MEDIUM", "HIGH", "CRITICAL"])
    temp = round(random.uniform(42.0, 52.0), 1)
    persistence = round(random.uniform(20, 100), 1)
    built_up = round(random.uniform(60, 95), 1)
    veg = round(random.uniform(0, 15), 1)
    props = {
        "id": f"HS-{i+100}",
        "severity": severity,
        "temperature": temp,
        "persistenceScore": persistence,
        "builtUpPercent": built_up,
        "vegPercent": veg,
        "areaSqKm": round(random.uniform(1.0, 5.0), 2),
        "reason": "High built-up surface, low vegetation"
    }
    hotspots.append(create_feature(geom, props))

expansion = []
for i in range(10):
    clat = center_lat + random.uniform(-0.25, 0.25)
    clon = center_lon + random.uniform(-0.25, 0.25)
    geom = generate_polygon(clat, clon, random.uniform(1.0, 3.0), 8)
    year = random.choice([2000, 2010, 2020, 2024])
    props = {
        "id": f"UE-{i+100}",
        "year": year,
        "areaSqKm": round(random.uniform(2.0, 10.0), 2)
    }
    expansion.append(create_feature(geom, props))

future = []
for i in range(5):
    clat = center_lat + random.uniform(-0.2, 0.2)
    clon = center_lon + random.uniform(-0.2, 0.2)
    geom = generate_polygon(clat, clon, random.uniform(1.0, 4.0), 5)
    props = {
        "id": f"FD-{i+100}",
        "name": f"Planned District {chr(65+i)}",
        "predictedRisk": random.choice(["LOW", "MEDIUM", "HIGH"]),
        "riskScore": random.randint(40, 95),
        "confidence": random.randint(75, 98),
        "buildingDensity": round(random.uniform(40, 80), 1),
        "plannedVeg": round(random.uniform(5, 25), 1)
    }
    future.append(create_feature(geom, props))

import os
os.makedirs("riyadh-heatmap-ai/src/data", exist_ok=True)
with open("riyadh-heatmap-ai/src/data/demo_hotspots.json", "w") as f:
    json.dump({"type": "FeatureCollection", "features": hotspots}, f, indent=2)
with open("riyadh-heatmap-ai/src/data/demo_expansion.json", "w") as f:
    json.dump({"type": "FeatureCollection", "features": expansion}, f, indent=2)
with open("riyadh-heatmap-ai/src/data/demo_future.json", "w") as f:
    json.dump({"type": "FeatureCollection", "features": future}, f, indent=2)
