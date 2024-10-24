# News Manager Backend - Project Requirements Document (PRD)

## Project Overview

We are developing a News Manager Backend, a RESTful API service that allows a client-side application to perform CRUD (Create, Read, Update, Delete) operations on news articles.

### Technologies:
- FastAPI for building the backend API
- SQLModel for ORM (Object-Relational Mapping) with the database
- Pydantic for data validation and settings management
- PostgreSQL as the SQL database
- Docker for containerization and deployment
- UV as the Python project dependency manager

## Core Functionalities

### CRUD Operations for News

#### Create
- Add One News Article: The API should allow adding a single news article
- Add Multiple News Articles: The API should support adding multiple news articles in a single request

#### Read
- Retrieve All News Articles: The API should retrieve all news articles with optional search filters such as limit, offset, query, sort, and order. If the query parameter is empty, it should return all news articles; otherwise, it should search for articles where the headline matches the query
- Retrieve One News Article by ID: The API should allow fetching a single news article by its unique ID

#### Update
- Update News Article by ID: The API should support updating an existing news article using its unique ID

#### Delete
- Delete News Article by ID: The API should allow deleting a news article using its unique ID

## Database Schema Design

### news Table

The news table will have the following schema:

| Column | Type | Description |
|--------|------|-------------|
| id | VARCHAR(255) | Primary Key: Unique identifier for each news article |
| source_name | VARCHAR(255) | Name of the news source |
| category | VARCHAR(255) | Category of the news article |
| headline | VARCHAR(255) | Headline of the news article |
| story | TEXT | Full content of the news article |
| published_at | TIMESTAMPTZ | Timestamp of when the article was published |
| image_link | TEXT | URL to the image associated with the article |
| source_link | TEXT | Original source URL of the article |
| meta_description | TEXT | Meta description for SEO purposes |
| meta_keywords | TEXT | Meta keywords for SEO purposes |

## Project File Structure

```
backend/
├── Dockerfile
├── app/
│   ├── __init__.py
│   ├── main.py              # Entry point for the FastAPI application
│   ├── api/                 # API route definitions
│   │   ├── __init__.py
│   │   └── v1/              # API versioning
│   │       ├── __init__.py
│   │       └── endpoints/   # Endpoint definitions
│   │           ├── __init__.py
│   │           └── news.py  # Endpoints for news-related operations
│   ├── core/                # Core application configurations and utilities
│   │   ├── __init__.py
│   │   ├── config.py        # Configuration settings using Pydantic
│   │   └── db.py           # Database connection and session management
│   ├── crud/                # CRUD operation implementations
│   │   ├── __init__.py
│   │   └── news.py         # CRUD operations for news articles
│   ├── models/              # Database models using SQLModel
│   │   ├── __init__.py
│   │   └── news.py         # Model definition for news articles
│   ├── schemas/             # Pydantic schemas for request and response validation
│   │   ├── __init__.py
│   │   └── news.py         # Schemas for news articles
│   ├── utils/               # Utility functions and helpers
│   │   ├── __init__.py
│   │   └── utils.py
│   └── tests/               # Test cases for the application
│       ├── __init__.py
│       └── test_news.py    # Test cases for news endpoints
├── scripts/                 # Shell scripts for various tasks
│   ├── format.sh
│   ├── lint.sh
│   └── prestart.sh
├── backend_pre_start.py     # Pre-start script for initializing the backend
└── requirements.txt         # List of project dependencies
```

### Explanation:
- **app/main.py**: The main application file where the FastAPI instance is created and routers are included
- **app/api/**: Contains API route definitions, organized by version to support API versioning
- **app/api/v1/endpoints/**: Houses endpoint definitions for version 1 of the API, specifically for news-related operations
- **app/core/**: Contains core configurations and utilities like database connection and application settings
- **app/crud/**: Implements CRUD operations for the models
- **app/models/**: Defines database models using SQLModel
- **app/schemas/**: Contains Pydantic schemas for request and response validation
- **app/utils/**: Utility functions used across the application
- **app/tests/**: Contains test cases to ensure code quality and correctness
- **scripts/**: Shell scripts for code formatting, linting, and prestart operations
- **backend_pre_start.py**: Script that runs before the backend starts, often used for setup tasks
- **requirements.txt**: Lists all the Python dependencies required for the project

## API Documentation

All API endpoints are prefixed with `/api/v1` to support versioning.

### Endpoints Overview

#### Create News Articles
- `POST /api/v1/news/`: Add one news article
- `POST /api/v1/news/bulk`: Add multiple news articles

#### Read News Articles
- `GET /api/v1/news/`: Retrieve all news articles with optional filters
- `GET /api/v1/news/{id}`: Retrieve a single news article by ID

#### Update News Articles
- `PUT /api/v1/news/{id}`: Update a news article by ID

#### Delete News Articles
- `DELETE /api/v1/news/{id}`: Delete a news article by ID

### Endpoint Details

#### 1. Add One News Article

**Endpoint**: `POST /api/v1/news/`

**Description**: Adds a single news article to the database.

**Request Body Fields**:
- source_name (string): Name of the news source. (Required)
- category (string): Category of the news article. (Required)
- headline (string): Headline of the news article. (Required)
- story (string): Full content of the news article. (Required)
- published_at (datetime): Publication timestamp in ISO 8601 format. (Required)
- image_link (string): URL to the associated image. (Optional)
- source_link (string): Original source URL. (Optional)
- meta_description (string): Meta description for SEO. (Optional)
- meta_keywords (string): Meta keywords for SEO. (Optional)

**Example Request**:
```json
{
  "source_name": "Global News",
  "category": "World",
  "headline": "Global Events Shaping the Future",
  "story": "Detailed article content goes here...",
  "published_at": "2024-10-23T15:30:00Z",
  "image_link": "https://globalnews.com/images/event.jpg",
  "source_link": "https://globalnews.com/articles/global-events",
  "meta_description": "An in-depth look at global events.",
  "meta_keywords": "global, events, future"
}
```

**Response**:
- Status Code: 201 Created
- Body: The created news article with a unique id

#### 2. Add Multiple News Articles

**Endpoint**: `POST /api/v1/news/bulk`

**Description**: Adds multiple news articles in a single request.

**Request Body**:
- Type: Array of news articles (as defined above)

**Example Request**:
```json
[
  {
    "source_name": "Tech Daily",
    "category": "Technology",
    "headline": "Advancements in AI Technology",
    "story": "Content about AI advancements...",
    "published_at": "2024-10-23T10:00:00Z"
  },
  {
    "source_name": "Health Weekly",
    "category": "Health",
    "headline": "New Developments in Medicine",
    "story": "Content about medical developments...",
    "published_at": "2024-10-23T12:00:00Z"
  }
]
```

**Response**:
- Status Code: 201 Created
- Body: An array of the created news articles with their unique ids

#### 3. Retrieve All News Articles

**Endpoint**: `GET /api/v1/news/`

**Description**: Retrieves all news articles, with optional filtering and pagination.

**Query Parameters**:
- limit (integer): Maximum number of articles to return. (Optional, default: 100)
- offset (integer): Number of articles to skip. (Optional, default: 0)
- query (string): Search query to filter articles by headline. (Optional)
- sort (string): Field to sort the results by (e.g., published_at). (Optional)
- order (string): Sort order, either asc or desc. (Optional, default: asc)

**Example Request**:
```bash
GET /api/v1/news/?limit=50&offset=0&query=Technology&sort=published_at&order=desc
```

**Response**:
- Status Code: 200 OK
- Body: An array of news articles matching the criteria

#### 4. Retrieve One News Article by ID

**Endpoint**: `GET /api/v1/news/{id}`

**Description**: Retrieves a single news article by its unique ID.

**Path Parameter**:
- id (string): The unique identifier of the news article

**Example Request**:
```bash
GET /api/v1/news/123e4567-e89b-12d3-a456-426614174000
```

**Response**:
- Status Code: 200 OK
- Body: The requested news article

#### 5. Update News Article by ID

**Endpoint**: `PUT /api/v1/news/{id}`

**Description**: Updates an existing news article.

**Path Parameter**:
- id (string): The unique identifier of the news article

**Request Body**:
- Fields: Any subset of the fields defined in the "Add One News Article" request body

**Example Request**:
```json
{
  "headline": "Updated Headline for the News Article",
  "story": "Updated content of the news article..."
}
```

**Response**:
- Status Code: 200 OK
- Body: The updated news article

#### 6. Delete News Article by ID

**Endpoint**: `DELETE /api/v1/news/{id}`

**Description**: Deletes a news article by its unique ID.

**Path Parameter**:
- id (string): The unique identifier of the news article

**Example Request**:
```bash
DELETE /api/v1/news/123e4567-e89b-12d3-a456-426614174000
```

**Response**:
- Status Code: 200 OK
- Body:
```json
{
  "message": "News article deleted successfully."
}
```

## Additional Details

### Error Handling
- 400 Bad Request: The request is invalid or cannot be processed
- 404 Not Found: The requested resource does not exist
- 500 Internal Server Error: An unexpected error occurred on the server

**Example Error Response**:
```json
{
  "detail": "News article with the specified ID does not exist."
}
```

### Data Validation
- All request bodies will be validated using Pydantic schemas to ensure data integrity
- Fields marked as required must be provided; otherwise, a 422 Unprocessable Entity error will be returned

### Environment Configuration
- Use environment variables for configuration settings (e.g., database connection strings) using Pydantic's BaseSettings
- Sensitive information should not be hardcoded but loaded from environment variables or a secure configuration service

### Dependency Management
- Use UV as the Python project dependency manager to handle project dependencies
- Ensure that requirements.txt is up-to-date with all the required packages

### Testing
- Implement unit tests and integration tests in the app/tests/ directory
- Use a testing framework like pytest to write and run tests
- Aim for high test coverage to ensure code reliability

### Logging and Monitoring
- Implement logging using Python's logging library or a third-party service
- Log important events, errors, and exceptions for debugging and monitoring purposes

### Documentation
- Leverage FastAPI's automatic API documentation generation using OpenAPI (Swagger UI)
- Ensure all endpoints, parameters, and models are well-documented with clear descriptions

### Continuous Integration and Deployment
- Set up a CI/CD pipeline to automate testing and deployment
- Use tools like GitHub Actions, Jenkins, or Travis CI for continuous integration

## Development Guidelines

### Coding Standards
- Follow PEP 8 coding standards for Python code
- Use meaningful variable and function names for better readability

### Version Control
- Use Git for version control
- Follow a branching strategy (e.g., GitFlow) to manage code changes
- Write clear and descriptive commit messages

### Code Reviews
- All code changes should go through a code review process
- Use pull requests to facilitate discussions and code improvements

### Collaboration
- Use collaboration tools like GitHub or GitLab for code hosting and issue tracking
- Document tasks and bugs using issue trackers

## Next Steps

1. Database Initialization: Set up the PostgreSQL database and create the news table according to the schema
2. Model Definitions: Define the SQLModel models in app/models/news.py
3. Schema Definitions: Create Pydantic schemas in app/schemas/news.py for request and response validation
4. CRUD Operations: Implement the CRUD functions in app/crud/news.py for interacting with the database
5. API Endpoint Implementation: Define the API endpoints in app/api/v1/endpoints/news.py
6. Testing: Write unit tests and integration tests in app/tests/test_news.py
7. Documentation Verification: Ensure that the API documentation generated by FastAPI is accurate and comprehensive
8. Dockerization: Write a Dockerfile to containerize the application for deployment
9. Deployment: Deploy the application to a staging environment for further testing
10. Monitoring Setup: Set up logging and monitoring tools for the application

## Example Use Cases

### Adding a New Article
A client wants to add a new article about technological advancements. They send a POST request to `/api/v1/news/` with the article details. The server validates the data, adds the article to the database, and returns the created article with a unique id.

### Searching for Articles
A client wants to find all articles related to "Artificial Intelligence". They send a GET request to `/api/v1/news/` with the query parameter `query=Artificial Intelligence`. The server searches the headlines for matches and returns the relevant articles.

### Updating an Article
A client needs to update the headline of an existing article. They send a PUT request to `/api/v1/news/{id}` with the updated headline. The server updates the article and returns the updated information.

### Deleting an Article
A client wants to remove an outdated article. They send a DELETE request to `/api/v1/news/{id}`. The server deletes the article from the database and confirms the deletion.

## Conclusion

This PRD outlines the necessary information for developers to implement the News Manager Backend. It includes detailed descriptions of the core functionalities, database schema, project structure, API endpoints, and development guidelines.

By following this document, developers should have a clear understanding of the project requirements and the steps needed to build a scalable and maintainable backend service.
