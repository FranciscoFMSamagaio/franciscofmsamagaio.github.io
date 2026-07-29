# Backend

This backend provides a modular FastAPI API for the personal dashboard.

## Structure

- app/api: route layer
- app/core: configuration
- app/database: database session and bootstrapping
- app/models: SQLAlchemy models
- app/repositories: persistence access layer
- app/schemas: request/response validation
- app/services: business logic

## Local run

```bash
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
uvicorn main:app --reload
```
