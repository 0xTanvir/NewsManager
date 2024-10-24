# Project Setup

## Prerequisites
- Python 3.x
- uv package manager

## Installation

1. Install uv:
   ```bash
   # Windows (PowerShell Admin):
   curl -LsSf https://astral.sh/uv/install.ps1 | powershell -ex bypass

   # Unix-like systems:
   curl -LsSf https://astral.sh/uv/install.sh | sh

2. Clone the repository:
    ```bash
    git clone <your-repo-url>
    cd <your-repo-directory>
    ```
3. Create and activate virtual environmen:
    ```bash
    uv venv

    # Windows:
    .venv/Scripts/activate

    # Unix:
    source .venv/bin/activate
    ```
4. Install dependencies:
    ```bash
    # Install project and its dependencies
    uv pip install -e .

    uv pip install "fastapi[standard]"
    uv pip install "psycopg[binary]"
    ```