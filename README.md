# 🎫 SupportDesk — Support Ticket Management System

A production-ready full-stack Support Ticket Management web application built with **Django REST Framework (DRF)**, **React 18 (Vite)**, and **MySQL**, featuring JWT role-based authentication, ticket lifecycle management, search/filter/sort, and threaded conversation support.

---

## 📌 Table of Contents
1. [Project Overview](#-project-overview)
2. [Tech Stack](#-tech-stack)
3. [Key Features](#-key-features)
4. [Project Structure](#-project-structure)
5. [Prerequisites](#-prerequisites)
6. [Environment Variables](#-environment-variables)
7. [Backend Setup & Run](#-backend-setup--run)
8. [Database Schema & Seed Data](#-database-schema--seed-data)
9. [Frontend Setup & Run](#-frontend-setup--run)
10. [Running Automated Tests](#-running-automated-tests)
11. [Postman Collection](#-postman-collection)
12. [API Reference](#-api-reference)
13. [Security Architecture](#-security-architecture)
14. [Production Deployment Guide](#-production-deployment-guide)
15. [Default Demo Credentials](#-default-demo-credentials)

---

## 🚀 Project Overview

SupportDesk provides a seamless customer support experience with strict role separation:
- **Customers** can register, raise support tickets with varying priorities, track ticket status in real-time, search/filter tickets, and converse with support agents.
- **Support Agents** have a centralized operations dashboard with live analytics, ticket assignment capabilities, status/priority controls, and threaded customer communication.

---

## 🛠 Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | React 18, Vite, React Router v6, Axios, Lucide Icons, Vanilla CSS Design System |
| **Backend API** | Python 3.12+, Django 5.1+, Django REST Framework (DRF), SimpleJWT |
| **Database** | MySQL 8.0+ / SQLite3 (for local/testing fallback) |
| **Testing** | PyTest, pytest-django |
| **API Docs & QA** | Postman Collection v2.1 (`postman_collection.json`) |

---

## ✨ Key Features

### 👤 Customer Experience
- **Authentication**: Registration, Login, JWT Token Refresh, Logout.
- **Ticket Management**: Create tickets with subject, description, and priority (`low`, `medium`, `high`, `urgent`).
- **Data Isolation**: Customers can strictly only view and interact with their own tickets.
- **Search & Filtering**: Search ticket content and filter by status (`open`, `in_progress`, `resolved`, `closed`) and priority.
- **Threaded Conversations**: Real-time comment threads between customers and agents.

### 🛡 Support Agent Operations
- **Analytics Dashboard**: Aggregated metric cards for Total, Open, In Progress, Resolved, Closed, Urgent, and Unassigned tickets.
- **Ticket Directory**: Global view of all customer tickets with multi-field search and column-based sorting (`created_at`, `updated_at`, `priority`, `status`).
- **Ticket Workflow**: Change status, adjust priority, and reassign tickets to other active agents.
- **Agent Responses**: Reply directly in customer ticket threads.

---

## 📁 Project Structure

```plaintext
Assessment Project/
├── backend/
│   ├── accounts/              # User models, JWT serializers, views, and permissions
│   ├── core/                  # Django settings, WSGI, ASGI, and root URL routing
│   ├── tickets/               # Ticket & Comment models, serializers, views, and URLs
│   ├── manage.py              # Django CLI utility
│   ├── requirements.txt       # Python dependencies
│   └── venv/                  # Virtual environment
├── database/
│   ├── schema.sql             # Pure SQL relational schema definition
│   └── seed.sql               # Seed accounts and sample tickets
├── frontend/
│   ├── src/
│   │   ├── api/axios.js       # Axios client with JWT interceptors
│   │   ├── components/        # Navbar, TicketBadge, Modals, ProtectedRoute
│   │   ├── context/           # AuthContext (state & session management)
│   │   ├── pages/             # Login, Register, CustomerDashboard, AgentDashboard
│   │   ├── App.jsx            # React router definitions
│   │   └── index.css          # Glassmorphism Design System tokens & utilities
│   ├── index.html             # HTML root
│   ├── package.json           # Frontend dependencies & scripts
│   └── vite.config.js         # Vite configuration
├── tests/
│   ├── test_auth.py           # PyTest suite for authentication & security
│   └── test_tickets.py        # PyTest suite for ticket lifecycle & permissions
├── .env.example               # Template for environment variables
├── .gitignore                 # Excluded directories and sensitive files
├── postman_collection.json    # Postman v2.1 test collection
├── pytest.ini                 # PyTest test runner settings
└── README.md                  # Complete project documentation
```

---

## ⚙️ Environment Variables

Copy `.env.example` to `backend/.env` and update values:

```bash
cp .env.example backend/.env
```

| Variable | Description | Example |
|---|---|---|
| `SECRET_KEY` | Django cryptographic secret key | `django-insecure-your-secret-key` |
| `DEBUG` | Debug mode (`True` for local, `False` for production) | `True` |
| `ALLOWED_HOSTS` | Comma-separated allowed hostnames | `localhost,127.0.0.1` |
| `DB_NAME` | MySQL database name | `support_ticket_db` |
| `DB_USER` | MySQL database user | `root` |
| `DB_PASSWORD` | MySQL database password | `password123` |
| `DB_HOST` | MySQL host | `127.0.0.1` |
| `DB_PORT` | MySQL port | `3306` |
| `JWT_SECRET` | Secret key for JWT signing | `jwt-secret-key-123` |
| `JWT_ACCESS_MINUTES` | Access token lifetime in minutes | `60` |
| `JWT_REFRESH_DAYS` | Refresh token lifetime in days | `7` |
| `CORS_ALLOWED_ORIGINS` | Allowed frontend client origins | `http://localhost:5173,http://localhost:3000` |

---

## 🐍 Backend Setup & Run

### 1. Create and Activate Virtual Environment

**Windows (PowerShell):**
```powershell
cd backend
python -m venv venv
.\venv\Scripts\Activate.ps1
```

**macOS / Linux:**
```bash
cd backend
python3 -m venv venv
source venv/bin/activate
```

### 2. Install Dependencies
```bash
pip install -r requirements.txt
```

### 3. Run Migrations
```bash
python manage.py makemigrations
python manage.py migrate
```

### 4. Seed Database (Optional)
```bash
# Seed via Django shell or direct SQL
mysql -u root -p support_ticket_db < ../database/seed.sql
```

### 5. Start Backend Server
```bash
python manage.py runserver 127.0.0.1:8000
```
Backend API will be live at: `http://127.0.0.1:8000/api/`

---

## 💾 Database Schema & Seed Data

The database schema and starter data are available in the [`database/`](database/) folder:
- **[`database/schema.sql`](database/schema.sql)**: Contains table definitions with foreign keys, indexes, and cascades for `users`, `tickets`, and `ticket_comments`.
- **[`database/seed.sql`](database/seed.sql)**: Pre-populates the database with sample customer and agent users, along with realistic tickets and comments.

---

## ⚛️ Frontend Setup & Run

### 1. Install Node Dependencies
```bash
cd frontend
npm install
```

### 2. Start Development Server
```bash
npm run dev
```
The React frontend will be available at: `http://localhost:5173/`

### 3. Production Build
```bash
npm run build
```
Creates an optimized production bundle in `frontend/dist/`.

---

## 🧪 Running Automated Tests

The repository includes a comprehensive test suite of 20 unit and integration tests covering authentication, token generation, ticket CRUD, agent assignment, comment creation, and role-based permissions.

To run the tests with PyTest:

```bash
# From workspace root
pytest
```

**Test Coverage Summary:**
- `tests/test_auth.py`: Customer registration, customer login, agent login, invalid password rejection, duplicate email prevention, missing field validations, JWT refresh endpoint, `/api/auth/me` endpoint.
- `tests/test_tickets.py`: Ticket creation, customer isolation (cannot view or comment on others' tickets), agent global ticket viewing, status and priority updates, agent ticket assignment, comment thread responses, unauthenticated access blocking (401), invalid ticket ID (404).

---

## 📮 Postman Collection

A complete Postman Collection is included at [`postman_collection.json`](postman_collection.json).

### How to Import & Use:
1. Open **Postman**.
2. Click **Import** in the top-left corner.
3. Select `postman_collection.json` from the project root.
4. The collection contains pre-configured variables:
   - `{{base_url}}`: `http://127.0.0.1:8000/api`
   - Automated test scripts automatically extract `customer_token` and `agent_token` upon login and attach them to subsequent requests.
5. Execute requests across the **Authentication**, **Tickets**, **Comments**, and **Error & Authorization** folders.

---

## 🌐 API Reference

### Authentication Endpoints
| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `POST` | `/api/auth/register` | Register a new customer | No |
| `POST` | `/api/auth/login` | Login for customer or agent (returns JWT) | No |
| `POST` | `/api/auth/refresh` | Refresh JWT access token | No |
| `GET` | `/api/auth/me` | Retrieve profile of authenticated user | Yes |

### Ticket Endpoints
| Method | Endpoint | Description | Auth Required | Role |
|---|---|---|---|---|
| `GET` | `/api/tickets` | List tickets (filtered by user role, search, status, priority) | Yes | Any |
| `POST` | `/api/tickets` | Create a new ticket | Yes | Customer / Agent |
| `GET` | `/api/tickets/:id` | Get ticket details & comment thread | Yes | Permitted User / Agent |
| `PUT` | `/api/tickets/:id` | Update status, priority, or assigned agent | Yes | Permitted User / Agent |
| `DELETE` | `/api/tickets/:id` | Delete ticket | Yes | Owner / Agent |
| `GET` | `/api/tickets/stats` | Retrieve aggregate counts for dashboard metrics | Yes | Any |

### Comments & User Endpoints
| Method | Endpoint | Description | Auth Required | Role |
|---|---|---|---|---|
| `GET` | `/api/tickets/:id/comments` | Get all comments for a ticket | Yes | Permitted User / Agent |
| `POST` | `/api/tickets/:id/comments` | Add a comment / response to a ticket | Yes | Permitted User / Agent |
| `GET` | `/api/users?role=agent` | List all support agents for assignment | Yes | Agent Only |

---

## 🔒 Security Architecture

1. **Password Hashing**: Stored using PBKDF2 with SHA-256 via Django's authentication system.
2. **JWT Authorization**: Stateless JWT tokens signed with secret key; tokens include user role and identity claims.
3. **Role-Based Access Control (RBAC)**: Distinct permissions for `customer` and `agent`. Customers cannot reassign tickets or change agent fields.
4. **Data Isolation**: Querysets are partitioned on the backend — customers are strictly barred from reading or modifying another customer's data.
5. **CORS Configuration**: Explicit origin whitelisting via `django-cors-headers`.
6. **SQL Injection Prevention**: Built on Django ORM parameterized queries.
7. **Secrets Isolation**: All secrets loaded from environment variables via `python-dotenv`.

---

## 🚀 Production Deployment Guide

### Option 1: Frontend on Vercel / Netlify & Backend on Render / Railway

#### Frontend (Vercel / Netlify):
1. Connect the GitHub repository.
2. Set root directory to `frontend`.
3. Set Build Command: `npm run build`.
4. Set Output Directory: `dist`.
5. Add environment variable `VITE_API_BASE_URL=https://your-backend-api.onrender.com/api`.

#### Backend (Render / Railway):
1. Create a **Web Service** pointing to the `backend` directory.
2. Set Environment: Python 3.
3. Set Build Command: `pip install -r requirements.txt && python manage.py migrate`.
4. Set Start Command: `gunicorn core.wsgi:application --bind 0.0.0.0:$PORT`.
5. Attach a managed MySQL database (e.g. PlanetScale, Aiven, or Railway MySQL) and provide database credentials in Environment Variables.
6. Set `DEBUG=False` and `ALLOWED_HOSTS=your-app.onrender.com`.

---

## 👥 Default Demo Credentials

If seeded using `database/seed.sql` or test fixtures:

| Role | Email | Password | Access Level |
|---|---|---|---|
| **Support Agent** | `agent@example.com` | `Agent@123` | Full Agent Dashboard, All Tickets, Reassign & Update Status |
| **Customer 1** | `customer@example.com` | `Customer@123` | Customer Dashboard, Create & Track Own Tickets |
| **Customer 2** | `jane@example.com` | `Customer@123` | Customer Dashboard, Create & Track Own Tickets |
