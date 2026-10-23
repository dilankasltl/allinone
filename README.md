# SLTL - KPI DASHBOARD

Standalone executive operational scorecard for **Sundaram Lanka Tyres Limited (SUN-TWS, TVS Group)** streaming live telemetry from Google Sheets across 7 core industrial manufacturing divisions:

- **Production Telemetry** (Mr. Ravimal)
- **Quality Assurance (QA)**
- **Engineering & Utilities** (Mr. Shemba)
- **Safety & Environmental Health**
- **Human Resources (HR)**
- **Mould Operations**
- **Compound Mixing**

## Features
- **Real-Time Streaming**: Live synchronization with Google Sheets without an intermediate database.
- **Dedicated KPI DASHBOARD One-Page Interface**: Clean executive overview with Top 6 Global Telemetry cards and 7 Operational Division scorecards.
- **Dynamic Date Selection**: Quick Yesterday/Today selection and calendar date picker.
- **Robust No Data Handling**: Zero-value distinction and missing record fallbacks.
- **Vercel-Ready**: Preconfigured with `vercel.json` and serverless API proxy (`api/sheet-proxy.js`) to prevent CORS errors in production.
- **Dark/Light Theme**: Fully responsive with high-contrast executive modes.

## Local Development
```bash
npm install
npm run dev
```

## Production Build
```bash
npm run build
npm run preview
```
