# 📚 Student Records Manager

A full-stack school records system built for real classroom use — originally born out of the frustration of tracking student grades manually through Excel files and a rough Django interface. This is the proper rebuild: clean architecture, role-based access, and a modern frontend. Now live and deployed.

---

## 🌐 Live Demo

*Try live demo*: **https://student-records-manager-sand.vercel.app/login**

The database is a demo — feel free to create, edit, or delete anything.

| Role | Username | Email | Password |
|---|---|---|---|
| 👩‍🏫 Teacher | Teacher Demo | `teacher.demo@gmail.com` | `teacher123` |
| 🎓 Student | Student Demo | `student.demo@gmail.com` | `student123` |
| 🛡️ Admin | Admin Demo | `admin.demo@gmail.com` | `admin123` |

> The three demo accounts above cannot be deleted. Everything else is fair game.

---

## 🧭 Overview

Three roles. One system. No more Excel files.

- **Teachers** encode and manage student grade records
- **Students** log in and view their own grades in real time
- **Admins** oversee accounts, roles, and system activity

Access is strictly controlled — every role sees only what they're authorized to see, on both the frontend and the backend.

---

## ✨ Features

### 👩‍🏫 Teacher
- Encode, update, and delete grade records
- View all students under their class
- Manage entries per subject or term

### 🎓 Student
- Personal dashboard with real-time grade visibility
- Read-only access — no record tampering possible

### 🛡️ Admin
- Full system oversight
- Manage user accounts
- Monitor overall activity

### 🔐 Authentication & Security
- Token-based auth using **HTTP-only cookies** — tokens never touch the browser's JavaScript, protecting against XSS
- Role-based access control (RBAC) enforced at both the API route level and frontend navigation
- Each role is scoped to its own data and actions only

---

## 🛠️ Tech Stack

### Backend

| Tool | Purpose |
|---|---|
| **FastAPI** | REST API framework |
| **SQLAlchemy** | ORM for database interaction |
| **Alembic** | Schema migration and version history |
| **MySQL** | Database |
| **uv** | Fast Python package manager and task runner |

### Frontend

| Tool | Purpose |
|---|---|
| **React** | UI framework |
| **React Router DOM** | Client-side routing and RBAC route guards |
| **TanStack Query** | Server state management and fetch caching |
| **Axios** | HTTP client with structured error handling |
| **React Hook Form** | Form state management |
| **Zod** | Schema-based input validation |

### Dev & Tooling

| Tool | Purpose |
|---|---|
| **Git** | Version control — also used for debugging crashes by tracing what changed between commits |
| **Alembic** | Database schema versioning and rollback |

---

## 🚀 Deployment

| Layer | Platform |
|---|---|
| Frontend | Vercel |
| Backend | [your backend platform, e.g. Railway] |
| Database | [your database host, e.g. Railway / PlanetScale] |

---

## 📁 Project Structure

```
student-grades-manager/
├── backend/
│   ├── app/
│   │   ├── auth/           # Authentication dependencies
│   │   ├── core/           # Config and environment variables
│   │   ├── demo/           # Demo account data
│   │   ├── models/         # SQLAlchemy table definitions
│   │   ├── routes/         # Route handlers, separated per feature/role
│   │   ├── schemas/        # Pydantic request/response models
│   │   ├── db.py           # SQLAlchemy config
│   │   └── main.py         # FastAPI app entry point
│   ├── alembic/            # Migration version history
│   ├── requirements.txt    # pip-managed dependencies
│   └── pyproject.toml      # uv-managed dependencies
│
└── frontend/
    ├── src/
    │   ├── api/            # API fetch functions
    │   ├── auth/           # Routing guards and protection
    │   ├── components/     # Reusable UI components
    │   ├── constants/      # Constant variables
    │   ├── hooks/          # Custom hooks
    │   ├── layouts/        # Page layouts
    │   ├── lib/            # Third-party library configs
    │   ├── pages/          # Web pages
    │   ├── schema/         # Zod schemas
    │   └── utils/          # Stateless helper functions
    └── package.json
```

---

## 💻 Running Locally

For contributors or anyone who wants to run the project themselves.

### Prerequisites
- Python 3.11+
- Node.js 18+
- MySQL instance (local or remote)
- `uv` → [https://docs.astral.sh/uv](https://docs.astral.sh/uv)

### Backend

```bash
cd backend

uv sync

uv run -m alembic upgrade head

uv run python seed.py

uv run -m fastapi dev app/main.py
```

Runs at `http://localhost:8000` — API docs at `http://localhost:8000/docs` (FastAPI swagger)

### Frontend

```bash
cd frontend

npm install

npm run dev
```

Runs at `http://localhost:<port>`

### Environment Variables

Create a `.env` file inside `/backend`:

```env
SECRET_KEY=any_random_string
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
ENVIRONMENT=local
LOCAL_DATABASE_URL=mysql+pymysql://root:yourpassword@localhost:3306/yourdbname
```

Create a `.env` file inside `/frontend`:

```env
VITE_API_BASE_URL=http://localhost:8000
```

> ⚠️ Never commit your `.env` files. They are already in `.gitignore`.
>
> `PRODUCTION_DATABASE_URL` is not needed here — contributors should connect to their own local MySQL database, not the deployed one.

---

## 🗺️ Roadmap

- [x] Core CRUD for grade records
- [x] Role-based access (student, teacher, admin)
- [x] HTTP-only cookie auth
- [x] Migrated database from SQLite to MySQL
- [x] Deployed and publicly accessible
- [ ] Add grade summary and GPA computation
- [ ] Export grades to PDF or CSV

---

## 💡 Background

This project started as a real problem — tracking student grades through Excel and a barebones Django app was fragile, hard to share, and easy to corrupt. This is the full rebuild from scratch: proper authentication, clean role separation, and a maintainable codebase. Intentionally scoped to prioritize architectural clarity over feature volume.

Git ended up being more useful than expected during development — not just for version control, but as a debugging tool. When the app crashed unexpectedly, tracing through commit history made it possible to pinpoint exactly when and where things broke.

---

## 👤 Author

**Ivan Alexis Tan**
- GitHub: [@Ivan-Alexis-Tan](https://github.com/Ivan-Alexis-Tan)
- LinkedIn: [linkedin.com/in/ivan-alexis-tan-a64366287](https://www.linkedin.com/in/ivan-alexis-tan-a64366287/)

---

## 📄 License

MIT License — open source and free to use.
