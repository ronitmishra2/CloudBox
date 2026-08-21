# CloudBox — Cloud Storage & File Management Platform

CloudBox is a full-stack cloud storage platform that allows users to securely upload, manage, and organize files through a modern web interface.

The application uses **React** for the frontend, **Flask** for the backend REST API, **PostgreSQL** for metadata and user management, and **MinIO** for object storage. The entire application can be containerized and run using Docker.

## Features

* User registration and authentication
* JWT-based authentication
* Secure file upload and download
* File and folder management
* Object storage using MinIO
* PostgreSQL database for metadata
* RESTful backend APIs
* Responsive React interface
* Dockerized application setup
* Protected API endpoints
* File metadata management

## Tech Stack

| Category         | Technologies        |
| ---------------- | ------------------- |
| Frontend         | React, Tailwind CSS |
| Backend          | Flask, Python       |
| Database         | PostgreSQL          |
| Object Storage   | MinIO               |
| Authentication   | JWT                 |
| API              | REST API            |
| Containerization | Docker              |
| Version Control  | Git, GitHub         |

## Architecture

```text
                    ┌─────────────────────┐
                    │      React UI       │
                    │  Tailwind CSS       │
                    └──────────┬──────────┘
                               │
                               │ REST API
                               ▼
                    ┌─────────────────────┐
                    │    Flask Backend    │
                    │      JWT Auth       │
                    └───────┬─────┬───────┘
                            │       │
                 ┌──────────┘       └──────────┐
                 ▼                             ▼
        ┌─────────────────┐           ┌─────────────────┐
        │   PostgreSQL    │           │      MinIO      │
        │                 │           │                 │
        │ Users           │           │ File Objects    │
        │ File Metadata   │           │ Storage         │
        └─────────────────┘           └─────────────────┘
```

### Data Flow

1. User interacts with the React frontend.
2. Frontend sends authenticated requests to the Flask REST API.
3. Flask validates the JWT token.
4. User and file metadata are stored in PostgreSQL.
5. Actual files are stored in MinIO object storage.
6. The backend handles communication between the frontend, database, and object storage.

## Project Structure

```text
CloudBox/
│
├── frontend/
│   ├── src/
│   ├── public/
│   ├── package.json
│   └── Dockerfile
│
├── backend/
│   ├── app/
│   ├── routes/
│   ├── models/
│   ├── services/
│   ├── requirements.txt
│   └── Dockerfile
│
├── docker-compose.yml
├── .env.example
└── README.md
```

> The exact directory structure may vary depending on the current project version.

## Getting Started

### Prerequisites

Make sure you have the following installed:

* Git
* Docker
* Docker Compose

### Clone the Repository

```bash
git clone https://github.com/ronitmishra2/CloudBox.git
cd CloudBox
```

### Configure Environment Variables

Create a `.env` file based on `.env.example`.

Example configuration:

```env
POSTGRES_DB=cloudbox
POSTGRES_USER=postgres
POSTGRES_PASSWORD=your_password

MINIO_ROOT_USER=minioadmin
MINIO_ROOT_PASSWORD=minioadmin

JWT_SECRET_KEY=your_secret_key
```

Do not commit your `.env` file to GitHub.

### Run with Docker

Build and start the application:

```bash
docker compose up --build
```

To run the containers in the background:

```bash
docker compose up -d --build
```

To stop the application:

```bash
docker compose down
```

## Database

CloudBox uses **PostgreSQL** to store application data such as:

* User accounts
* Authentication-related information
* File metadata
* Folder information
* File relationships

The actual file contents are stored separately in **MinIO**, keeping object storage independent from relational application data.

## Object Storage

CloudBox uses **MinIO** as an S3-compatible object storage service.

This separation provides a clear distinction between:

```text
PostgreSQL → Application data & metadata
MinIO      → Actual uploaded files
```

MinIO can also make it easier to transition the storage layer to an S3-compatible cloud storage service in the future.

## Authentication

CloudBox uses **JWT (JSON Web Tokens)** for authentication.

The general authentication flow is:

```text
User
  │
  ▼
Login / Register
  │
  ▼
Flask Backend
  │
  ▼
JWT Token
  │
  ▼
Authenticated API Requests
```

Protected endpoints require a valid authentication token before performing user-specific operations.

## REST API

The Flask backend exposes RESTful endpoints for application functionality.

Typical API operations include:

```text
Authentication
├── Register
├── Login
└── User authentication

Files
├── Upload
├── Download
├── Delete
└── List files

Folders
├── Create
├── List
└── Manage
```

## Docker Architecture

The application is designed to run as multiple containerized services:

```text
┌───────────────────────────────────────┐
│             Docker Compose            │
│                                       │
│  ┌───────────┐    ┌───────────────┐  │
│  │ Frontend  │───▶│    Backend    │  │
│  └───────────┘    └───────┬───────┘  │
│                           │           │
│              ┌────────────┴─────────┐ │
│              ▼                      ▼ │
│       ┌─────────────┐       ┌────────┐
│       │ PostgreSQL  │       │ MinIO  │
│       └─────────────┘       └────────┘
└───────────────────────────────────────┘
```

Containerization provides consistent development and deployment environments and makes the application easier to run locally.

## Why PostgreSQL + MinIO?

CloudBox separates **metadata storage** from **object storage**.

**PostgreSQL** is well suited for structured relational data such as users, folders, and file metadata.

**MinIO** is designed for storing large binary objects such as documents, images, videos, and other uploaded files.

This architecture avoids storing large files directly inside PostgreSQL and provides a more scalable storage design.

## Future Improvements

* File sharing through public links
* File preview support
* File versioning
* Search and filtering
* Storage usage dashboard
* Role-based access control
* AWS S3 deployment
* CI/CD pipeline
* Cloud deployment
* Monitoring and logging
* Automated backups

## Project Links

**GitHub:**
https://github.com/ronitmishra2/CloudBox



## Author

**Ronit Mishra**

B.Tech Computer Science — Cloud Computing

GitHub: https://github.com/ronitmishra2
