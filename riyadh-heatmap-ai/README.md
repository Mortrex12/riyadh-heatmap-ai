# Riyadh Heatmap AI

**Satellite-Powered Urban Heat Risk & Smart Expansion Planning**

This is a proof-of-concept (POC) decision-support platform designed to answer where, when, and why urban heat hotspots occur in Riyadh, and to simulate how future development plans might create new heat risks.

## Features

- **Interactive Dashboard:** High-level KPIs and map displaying persistent heat hotspots.
- **Urban Expansion Analysis:** Visualize how built-up areas have expanded over time and lock in heat risk.
- **Future Heat Risk Prediction:** Machine learning simulation that predicts the future heat risk of new development zones based on building density, vegetation, and historical temperatures.
- **Impact Monitoring:** Track how cooling interventions (e.g., green infrastructure, cool roofs) have historically improved temperature levels in different districts.
- **Geospatial Analytics:** Deep dive into land cover classification and surface temperature distributions.

## Tech Stack

- **Frontend:** Next.js (React 19), TailwindCSS
- **Mapping:** React-Leaflet, Leaflet (Carto and OSM basemaps)
- **Data Visualization:** Recharts
- **Icons:** Lucide-React

## How to Run

1. Make sure you have Node.js installed.
2. Clone or open the repository.
3. Install dependencies:
   \\\ash
   npm install --legacy-peer-deps
   \\\
4. Run the development server:
   \\\ash
   npm run dev
   \\\
5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Demo Data

This application currently operates in **DEMO MODE**. All geospatial features (hotspots, urban expansion zones, and future plans) are pre-generated using realistic simulated bounds within Riyadh's geographical area to illustrate how the system will work with live satellite feeds and ML pipelines in a production environment.

