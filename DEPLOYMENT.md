# Apni Vidya Deployment Guide

This guide explains how to deploy the entire Apni Vidya application (Frontend, Backend, Database, Redis, Qdrant, and Ollama) using Docker.

## Prerequisites

- [Docker Desktop](https://www.docker.com/products/docker-desktop/) installed and running.
- [Git](https://git-scm.com/downloads) (optional, if you haven't cloned the repo yet).

## Deployment Steps

1.  **Clone the Repository** (if you haven't already):
    ```bash
    git clone <your-repo-url>
    cd <your-repo-folder>
    ```

2.  **Start the Services**:
    Open your terminal in the project root directory and run:
    ```bash
    docker-compose up --build -d
    ```
    - The `--build` flag ensures that the latest code changes are built into the images.
    - The `-d` flag runs the containers in the background (detached mode).

3.  **Wait for Initialization**:
    - The database and other services might take a minute to initialize.
    - The **Ollama model (`llama3.2:1b`)** will be automatically downloaded by a helper container (`ollama-model-puller`). This might take several minutes depending on your internet speed.
    - You can check the logs to see the progress:
      ```bash
      docker-compose logs -f ollama-model-puller
      ```

4.  **Access the Application**:
    - **Frontend (Student/Admin Portal)**: [http://localhost:3000](http://localhost:3000)
    - **Backend API**: [http://localhost:3001/api](http://localhost:3001/api)
    - **Admin Panel**: [http://localhost:3000/admin](http://localhost:3000/admin)

5.  **Stopping the Application**:
    To stop all services, run:
    ```bash
    docker-compose down
    ```

## Troubleshooting

- **Database Connection Issues**: Ensure no other local Postgres instance is running on port 5432, or modify the ports in `docker-compose.yml`.
- **Ollama Model Not Found**: If the AI features aren't working, the model might not have downloaded correctly. You can manually trigger the pull:
  ```bash
  docker exec -it apni-vidya-ollama ollama pull llama3.2:1b
  ```

## Environment Variables

The `docker-compose.yml` file contains the environment variables for the containers.
**Important**: For production deployment, change the `JWT_SECRET` and database passwords!
