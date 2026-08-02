# ☁️ CloudBox – Self-Hosted Cloud Storage Platform

A production-inspired cloud storage platform built with **Flask**, **PostgreSQL**, **MinIO**, and **Docker**. CloudBox provides secure authentication, object storage, file management, and shareable links through a RESTful API.

> 🚧 Currently under active development. Backend is feature-complete and React frontend is the next milestone.

---

## ✨ Features

### 🔐 Authentication
- User Registration
- User Login
- JWT Authentication
- Protected API Routes
- Password Hashing

### 📁 File Management
- Upload Files
- Download Files using MinIO Pre-Signed URLs
- Delete Files
- Rename Files
- List User Files
- Search Files

### ☁️ Object Storage
- MinIO Integration
- Automatic Bucket Creation
- UUID-based Object Naming
- Metadata Storage in PostgreSQL

### 🔗 File Sharing
- Generate Shareable Links
- Public File Access
- Secure Download Redirection

### 📊 Dashboard
- Total Files
- Storage Used
- PDF Count
- Image Count
- Text File Count

### 🐳 DevOps
- Docker Compose
- PostgreSQL Container
- MinIO Container
- Environment Variables (.env)
- Flask Migrations

---

# 🛠 Tech Stack

| Category | Technology |
|----------|------------|
| Backend | Flask |
| Database | PostgreSQL |
| ORM | SQLAlchemy |
| Authentication | Flask-JWT-Extended |
| Object Storage | MinIO |
| Containerization | Docker & Docker Compose |
| Database Migration | Flask-Migrate |
| Password Hashing | Werkzeug |
| API Testing | Postman |

---

# 📂 Project Structure

```text
backend/
│
├── app/
│   ├── routes/
│   │   ├── auth.py
│   │   ├── files.py
│   │   └── share.py
│   │
│   ├── services/
│   │   ├── auth_service.py
│   │   ├── file_service.py
│   │   ├── share_service.py
│   │   └── minio_service.py
│   │
│   ├── utils/
│   │   ├── security.py
│   │   └── file_utils.py
│   │
│   ├── config.py
│   ├── models.py
│   └── __init__.py
│
├── migrations/
├── tests/
├── run.py
├── requirements.txt
└── docker-compose.yml
```

> 🔄 Planned architecture refactor: split models, extensions, and environment-based configuration.

---

# 📌 API Endpoints

## Authentication

| Method | Endpoint |
|---------|----------|
| POST | `/api/auth/register` |
| POST | `/api/auth/login` |

---

## Files

| Method | Endpoint |
|---------|----------|
| POST | `/api/files/upload` |
| GET | `/api/files/` |
| GET | `/api/files/download/<id>` |
| PATCH | `/api/files/<id>` |
| DELETE | `/api/files/<id>` |
| GET | `/api/files/?search=<query>` |
| GET | `/api/files/stats` |

---

## Share

| Method | Endpoint |
|---------|----------|
| POST | `/api/share/<file_id>` |
| GET | `/api/share/<token>` |

---

# 🚀 Getting Started

## Clone Repository

```bash
git clone https://github.com/ronitmishra2/CloudBox.git
cd CloudBox
```

---

## Create Virtual Environment

```bash
python -m venv venv
```

Windows

```bash
venv\Scripts\activate
```

Linux/macOS

```bash
source venv/bin/activate
```

---

## Install Dependencies

```bash
pip install -r requirements.txt
```

---

## Configure Environment

Create a `.env` file:

```env
SECRET_KEY=your-secret-key
JWT_SECRET_KEY=your-jwt-secret

DATABASE_URL=postgresql://postgres:password@localhost:5432/cloudbox

MINIO_ENDPOINT=localhost:9000
MINIO_ACCESS_KEY=admin
MINIO_SECRET_KEY=password123
MINIO_BUCKET=cloudbox
```

---

## Start Docker Services

```bash
docker compose up -d
```

---

## Run Database Migration

```bash
flask db upgrade
```

---

## Start Backend

```bash
python run.py
```

Backend runs at:

```
http://127.0.0.1:5000
```

---

# 📈 Current Progress

- ✅ Authentication
- ✅ PostgreSQL Integration
- ✅ MinIO Integration
- ✅ File Upload
- ✅ File Download
- ✅ File Delete
- ✅ File Rename
- ✅ File Search
- ✅ Dashboard Statistics
- ✅ Shareable Links

### 🚧 In Progress

- Clean Architecture Refactor
- React Frontend

### 📅 Planned

- Folder Management
- Password Protected Share Links
- Expiring Links
- Drag & Drop Upload
- Nginx Reverse Proxy
- GitHub Actions CI/CD
- AWS EC2 Deployment

---

# 📷 Screenshots

> Screenshots will be added after the React frontend is completed.

---

# 🤝 Contributing

Contributions, issues, and feature requests are welcome.

---

# 📄 License

MIT License

---

# 👨‍💻 Author

**Ronit Mishra**

B.Tech Computer Science (Cloud Computing)

GitHub: https://github.com/ronitmishra2