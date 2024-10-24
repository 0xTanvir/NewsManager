# Project overview
You are building news manager backend, where client side app will communicate with this backend
via REST api to do some CRUD operation.

You will be using
- `fastapi/fastapi` for the Python backend API.
- `fastapi/sqlmodel` for the Python SQL database interactions (ORM).
- `pydantic/pydantic` for the data validation and settings management.
- `PostgreSQL` as the SQL database.
- `Dockerfile` for deployment
- `uv` python project dependency manager


# Core Functionalities

## CRUD operation for news
### CREATE
1. api should be able to add one news
2. api should also be able to add multiple news in one request
### READ
1. api retrieves all news stories, it will also have search filter like limit, offset, query, sort, order
if query is empty then it will gives all news, else it has query then it will match it with news headline.
2. api should be able to get one news by id
### UPDATE
1. api should be able to update news by id
### DELETE
1. api should be able to delete news by id

# Docs

## Database Schema Design
### news Table
CREATE TABLE news (
  id VARCHAR(255) PRIMARY KEY,
  source_name VARCHAR(255),
  category VARCHAR(255),
  headline VARCHAR(255),
  story TEXT,
  published_at TIMESTAMPTZ,
  image_link TEXT,
  source_link TEXT,
  meta_description TEXT,
  meta_keywords TEXT
);


# Current File structure
backend
├── Dockerfile
├── app
│   ├── __init__.py
│   ├── api
│   │   ├── __init__.py
│   │   ├── main.py
│   │   └── routes
│   │       ├── __init__.py
│   │       └── news.py
│   ├── backend_pre_start.py
│   ├── core
│   │   ├── __init__.py
│   │   ├── config.py
│   │   └── db.py
│   ├── crud.py
│   ├── main.py
│   └── models.py
└── scripts
    ├── format.sh
    ├── lint.sh
    └── prestart.sh