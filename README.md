# RAC Report – Automated RAC Report Generation System

A full-stack college project for automating **Research Advisory Committee (RAC)** report generation. It provides a role-based web portal for students, supervisors, and admins to manage meetings, track progress, and generate PDF reports.

---

## Tech Stack

| Layer     | Technology                                              |
|-----------|---------------------------------------------------------|
| Frontend  | React 18, Vite, Tailwind CSS, Framer Motion, Recharts  |
| Backend   | Node.js, Express.js                                     |
| Database  | MongoDB (Mongoose ODM)                                  |
| Auth      | JWT (JSON Web Tokens) + bcryptjs                        |
| PDF       | PDFKit                                                  |
| Email     | Nodemailer                                              |

---

## Project Structure

```
rac-reoort/
├── backend/          # Express REST API
│   ├── server.js
│   ├── seed.js
│   └── src/
│       ├── app.js
│       ├── controllers/
│       ├── middleware/
│       ├── models/
│       ├── routes/
│       └── utils/
└── frontend/         # React + Vite SPA
    ├── index.html
    └── src/
        ├── components/
        ├── context/
        ├── hooks/
        ├── pages/
        │   ├── admin/
        │   ├── auth/
        │   ├── public/
        │   └── student/
        └── services/
```

---

## Getting Started

### Prerequisites

- Node.js >= 18
- MongoDB (local or Atlas)

### 1. Clone the repository

```bash
git clone https://github.com/erabdurrahman/rac-reoort.git
cd rac-reoort
```

### 2. Backend setup

```bash
cd backend
cp .env.example .env   # fill in your values
npm install
npm run dev            # starts on http://localhost:5000
```

**Required environment variables** (see `backend/.env.example`):

| Variable        | Description                        |
|-----------------|------------------------------------|
| `PORT`          | Server port (default `5000`)       |
| `MONGODB_URI`   | MongoDB connection string          |
| `JWT_SECRET`    | Secret key for JWT signing         |
| `JWT_EXPIRES_IN`| Token expiry (e.g. `7d`)           |
| `EMAIL_HOST`    | SMTP host (e.g. `smtp.gmail.com`)  |
| `EMAIL_PORT`    | SMTP port (e.g. `587`)             |
| `EMAIL_USER`    | Sender email address               |
| `EMAIL_PASS`    | Email app password                 |
| `FRONTEND_URL`  | Frontend origin for CORS           |
| `NODE_ENV`      | `development` or `production`      |

*(Optional)* Seed the database with sample data:

```bash
npm run seed
```

### 3. Frontend setup

```bash
cd frontend
cp .env.example .env   # set VITE_API_URL if needed
npm install
npm run dev            # starts on http://localhost:5173
```

---

## API Overview

The backend exposes the following REST endpoints under `/api`:

| Route                | Description              |
|----------------------|--------------------------|
| `/api/auth`          | Login / register         |
| `/api/users`         | User management          |
| `/api/students`      | Student profiles         |
| `/api/supervisors`   | Supervisor profiles      |
| `/api/departments`   | Department management    |
| `/api/meetings`      | RAC meeting records      |
| `/api/reports`       | Report generation (PDF)  |
| `/api/notifications` | In-app notifications     |

---

## Scripts

### Backend

| Command         | Description                     |
|-----------------|---------------------------------|
| `npm start`     | Start in production mode        |
| `npm run dev`   | Start with nodemon (watch mode) |
| `npm run seed`  | Seed database with sample data  |

### Frontend

| Command          | Description                   |
|------------------|-------------------------------|
| `npm run dev`    | Start Vite dev server         |
| `npm run build`  | Build for production          |
| `npm run preview`| Preview production build      |

---

## License

This project is for educational purposes only.
