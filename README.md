# ☁️ CloudBox – Self-Hosted Cloud Storage Platform

CloudBox is a full-stack, self-hosted cloud storage platform inspired by Google Drive and Dropbox. It enables users to securely upload, organize, and share files while demonstrating modern backend development, cloud storage concepts, containerization, and DevOps practices.

> **Project Status:** 🚧 In Development

---

## 📌 Features (Planned)

### 👤 User Management
- User Registration
- Secure Login
- JWT Authentication
- Password Hashing
- User Profile Management

### 📂 File Management
- Upload Files
- Download Files
- Delete Files
- Rename Files
- Folder Support
- Move Files
- File Versioning

### 🔗 File Sharing
- Share Files via Unique Links
- Password Protected Links
- Link Expiration
- Public & Private Sharing

### 🔍 Search
- Search by File Name
- Filter by File Type
- Sort by Date and Size

### 📊 Dashboard
- Storage Usage
- Recent Uploads
- File Statistics
- Activity History

### ⚙️ Admin Panel
- Manage Users
- Monitor Storage Usage
- Manage Storage Quotas

---

# 🛠️ Tech Stack

| Layer | Technology |
|--------|------------|
| Frontend | React + Tailwind CSS |
| Backend | Flask |
| Database | PostgreSQL |
| Object Storage | MinIO |
| ORM | SQLAlchemy |
| Authentication | JWT |
| Cache | Redis |
| Reverse Proxy | Nginx |
| Containers | Docker & Docker Compose |
| CI/CD | GitHub Actions |

---

# 📁 Project Structure

```
CloudBox/
│
├── backend/
│   ├── app/
│   │   ├── routes/
│   │   ├── services/
│   │   ├── utils/
│   │   ├── __init__.py
│   │   ├── config.py
│   │   └── models.py
│   │
│   ├── requirements.txt
│   ├── run.py
│   ├── Dockerfile
│   └── .env
│
├── frontend/
│
├── nginx/
│
├── docker-compose.yml
├── README.md
└── .gitignore
```

---

# 🚀 Getting Started

## Clone the Repository

```bash
git clone https://github.com/yourusername/CloudBox.git
cd CloudBox
```

---

## Create Virtual Environment

```bash
python -m venv venv
```

Activate it

### Windows

```bash
venv\Scripts\activate
```

### Linux / macOS

```bash
source venv/bin/activate
```

---

## Install Dependencies

```bash
cd backend
pip install -r requirements.txt
```

---

## Configure Environment Variables

Create a `.env` file inside the `backend` directory.

Example:

```env
SECRET_KEY=your-secret-key

DATABASE_URL=postgresql://postgres:password@localhost:5432/cloudbox
```

---

## Start PostgreSQL

From the project root:

```bash
docker compose up -d
```

Verify:

```bash
docker ps
```

---

## Run the Backend

```bash
cd backend

python run.py
```

Backend will be available at

```
http://127.0.0.1:5000
```

---

# 📅 Development Progress

## ✅ Completed

- Project structure
- Flask Application Factory
- Configuration Management
- Environment Variables
- SQLAlchemy Integration
- User Database Model
- Docker Compose (PostgreSQL)
- PostgreSQL Container Setup

## 🚧 In Progress

- Flask-Migrate
- Database Migrations
- JWT Authentication

## 📌 Upcoming

- User Registration
- Login System
- MinIO Integration
- File Upload API
- File Download API
- Sharing Links
- React Frontend
- Redis Caching
- Dockerized Backend
- Nginx Reverse Proxy
- GitHub Actions CI/CD

---

# 🎯 Learning Goals

This project is built to explore and demonstrate:

- Flask Backend Development
- REST API Design
- Authentication & Authorization
- SQLAlchemy ORM
- PostgreSQL
- Object Storage Concepts
- Docker & Docker Compose
- DevOps Best Practices
- Scalable Project Architecture

---

# 🤝 Contributing

Contributions, suggestions, and improvements are welcome.

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Open a Pull Request

---

# 📜 License

This project is licensed under the MIT License.

---

## 👨‍💻 Author

**Ronit Mishra**

B.Tech Computer Science (Cloud Computing)

Building CloudBox to learn backend engineering, cloud technologies, and DevOps while following production-grade software development practices.