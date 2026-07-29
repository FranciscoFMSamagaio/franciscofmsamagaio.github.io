# Francisco Samagaio Portfolio and Personal Dashboard

This repository now contains a portfolio site and a modular personal dashboard foundation for long-term growth.

## Project structure

- frontend: the public portfolio and dashboard pages published through GitHub Pages
- backend: FastAPI-based API for the dashboard modules
- documentation: architecture notes and usage guidance

## Current status

### Frontend
- Portfolio homepage remains intact.
- New dashboard area available at /dashboard.
- Water module with quick add, manual entry, goal setting, and history view.

### Backend
- Modular FastAPI structure prepared for future expansion.
- Current endpoints:
  - GET /water/today
  - GET /water/history
  - POST /water
  - PUT /water/{id}
  - DELETE /water/{id}
  - GET /settings
  - PUT /settings

## Run locally

### Backend
```bash
cd backend
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
uvicorn main:app --reload
```

### Frontend
Open the site directly in a browser. The dashboard can be accessed from /dashboard.

## Architecture notes

The project is intentionally designed to support future modules such as workouts, weight, habits, finance, notes, projects, and more through a layered structure:

- interface: HTML, CSS, JavaScript
- API: FastAPI routes
- business logic: services
- persistence: repositories and SQLAlchemy models
- configuration: central settings

