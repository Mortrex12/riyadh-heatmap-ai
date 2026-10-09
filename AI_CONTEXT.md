# Riyadh Heatmap AI - Project Context & Status

This file serves as a context document for AI assistants to understand the current state, architecture, and accomplishments of the "Riyadh Heatmap AI" MVP (built for a hackathon).

## 1. Project Overview
**Goal:** A proof-of-concept (POC) decision-support platform that detects urban heat hotspots, analyzes urban expansion, predicts future heat risks, and monitors cooling interventions in Riyadh using satellite data (Sentinel-2 / Landsat) and Machine Learning.

## 2. What Has Been Completed (MVP State)

### Frontend (Next.js 15, React 19, TailwindCSS)
- **Directory:** `riyadh-heatmap-ai/`
- **Status:** Fully functional UI in **Demo Mode** (using simulated data for safe hackathon pitching).
- **Features Implemented:**
  - `app/page.tsx` (Dashboard): Main interactive map with high-level KPIs and hotspot analysis.
  - `app/urban-expansion`: Visualizes how built-up areas evolved and locked in heat risk.
  - `app/future-risk`: Displays ML-predicted future heat risk for new development zones.
  - `app/impact`: Monitors the historical impact of cooling interventions (e.g., green infrastructure).
  - `app/analytics`: Geospatial analytics for land cover and surface temp distributions.
- **Components:** Uses React-Leaflet for mapping and Recharts for data visualization.
- **API Integration:** The route `app/api/sentinel/route.ts` is fully implemented to authenticate with the Copernicus CDSE (Sentinel-2) API using real credentials.

### Data Science & Backend (Python)
- **Directory:** Root directory (`/`)
- **Status:** Scripts and Notebooks are written and tested. They successfully fetch real satellite data and perform analysis.
- **Capabilities Implemented:**
  - `sentinel_service.py` & `test_sentinel.py`: Handle OAuth and data fetching from Sentinel Hub / Copernicus.
  - `landsat_ndvi.py`: Processes satellite imagery to calculate the Normalized Difference Vegetation Index (NDVI).
  - `02_land_use_land_cover_change.ipynb`: Jupyter notebook demonstrating Land Use and Land Cover (LULC) changes over time.
  - Python generation scripts (`write_*.py`): Automations used to generate Next.js pages rapidly.
- **Proof of Execution:** Real geospatial outputs have been generated, such as `ndvi_output.tif` and `riyadh_sentinel2_sample.png`.

## 3. Next Steps / How to Contribute
- The AI should assist in bridging the Python data science outputs with the Next.js frontend (e.g., creating API endpoints in Python or Next.js to serve the `.tif` or `.png` dynamically instead of using static JSON files).
- Keep in mind that for the hackathon pitch, stability is key. Any new features should not break the existing static demo pages.
