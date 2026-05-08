# Syllabus Planner — Operation Guide

## Prerequisites

- **PHP** 8.2+
- **Composer** (PHP dependency manager)
- **Node.js** 18+ and **npm**
- **MySQL** or **SQLite** (configured in Laravel `.env`)
- **XAMPP** (if running MySQL/Apache locally)

---

## 1. Backend Setup (Laravel)

### Install PHP dependencies

```bash
cd c:\xampp\htdocs\syllabus-planner
composer install
```

### Configure environment

```bash
cp .env.example .env
php artisan key:generate
```

Edit `.env` and set your database credentials:

```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=syllabus_planner
DB_USERNAME=root
DB_PASSWORD=
```

### Run migrations and seeders

Run migrations before seeding the database. `php artisan db:seed` alone will fail on a fresh SQLite database because the tables do not exist yet.

```bash
php artisan migrate:fresh --seed
```

This creates all tables and populates them with:
- 5 departments
- 8 main users (faculty, dean, admin, etc.)
- IPT2 course with full 17-week syllabus, CLOs, grading, rubrics, references
- 4 additional demo courses

If you only want to seed after the schema already exists, use:

```bash
php artisan db:seed
```

### Start Laravel server

```bash
php artisan serve
```

Backend runs at `http://localhost:8000`

---

## 2. Frontend Setup (React + Vite)

### Install Node dependencies

```bash
cd c:\xampp\htdocs\syllabus-planner\frontend
npm install
```

### Start dev server

```bash
npm run dev
```

Frontend runs at `http://localhost:3000`

### Build for production

```bash
npm run build
```

---

## 3. Main Login Credentials

| Email | Password | Role |
|-------|----------|------|
| `admin@gmail.com` | `password` | Admin |
| `teacher@gmail.com` | `password` | Teacher |
| `teacher2@gmail.com` | `password` | Teacher |
| `inactive.teacher@gmail.com` | `password` | Teacher (Inactive) |

---

## 4. Key API Endpoints

All endpoints are prefixed with `http://localhost:8000/api`

### Authentication

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/login` | Login, returns Bearer token |
| POST | `/logout` | Revoke token (auth required) |
| GET | `/me` | Get current user (auth required) |

### Resources (all require Bearer token)

| Resource | Endpoints |
|----------|-----------|
| Courses | `GET /courses`, `POST /courses`, `GET /courses/{id}`, `PUT /courses/{id}`, `DELETE /courses/{id}` |
| CLOs | `GET /clos`, `POST /clos`, `PUT /clos/{id}`, `DELETE /clos/{id}` |
| Weekly Plans | `GET /weekly-plans`, `POST /weekly-plans`, `PUT /weekly-plans/{id}`, `DELETE /weekly-plans/{id}` |
| Grading Systems | `GET /grading-systems`, `POST /grading-systems`, `PUT /grading-systems/{id}`, `DELETE /grading-systems/{id}` |
| Syllabi | `GET /syllabi`, `POST /syllabi`, `PUT /syllabi/{id}`, `DELETE /syllabi/{id}` |
| Users | `GET /users`, `POST /users`, `PUT /users/{id}`, `DELETE /users/{id}` |
| Departments | `GET /departments` |

---

## 5. Common Operations

### Reset database

```bash
php artisan migrate:fresh --seed
```

### Add a new course

1. Log in as a Teacher
2. Navigate to **Courses**
3. Click **New Course** and fill the form

### Role-Based Flow

#### Admin
1. Log in as Admin.
2. Manage users, departments, and system-wide records.
3. Maintain master data and support overall setup.

#### Teacher
1. Log in as Teacher.
2. Create or open a course.
3. Add CLOs, weekly plans, grading components, and supporting references.
4. Use the AI Companion for content suggestions.
5. Use **My Work Sessions** to continue only their own syllabus work.

### Edit weekly syllabus content

1. Go to **Syllabus Planner**
2. Select week from the sidebar
3. Edit topics, learning outcomes, activities, or assessment in each tab
4. Add/remove items dynamically

### Manage CLOs

1. Go to **Learning Outcomes**
2. View existing CLOs mapped to Program Outcomes
3. Add new CLOs or toggle PO mappings

### Configure Grading

1. Go to **Grading System**
2. Add/remove components for Midterm and Final
3. Percentages must sum to 100% for each term

### Continue syllabus work

1. Log in as Teacher
2. Go to **My Work Sessions**
3. Open or continue one of your own syllabi

### Export / Print syllabus

1. Go to **Courses**
2. Click **View** on any course
3. Click **Print** or **Export PDF** (PDF export placeholder)
4. Use browser print (`Ctrl+P`) for formatted output

---

## 6. Architecture Notes

- **Backend:** Laravel 12, PHP 8.2, Sanctum API tokens, Eloquent ORM
- **Frontend:** React 18, Vite, Tailwind CSS, React Router, Axios
- **Database:** MySQL (or SQLite) with JSON columns for array data (CLO POs, weekly plan topics, etc.)
- **Auth:** Laravel Sanctum Bearer tokens stored in `localStorage`
- **CORS:** Configured for `localhost:3000` and `localhost:5173`

---

## 7. Troubleshooting

| Issue | Solution |
|-------|----------|
| `npm install` fails | Ensure Node.js 18+ is installed |
| `php artisan migrate` fails | Check `.env` DB credentials; create database manually if needed |
| CORS errors on frontend | Ensure Laravel is running on `:8000` and CORS config allows `:3000` |
| Login fails with 401 | Run migrations + seeders; verify user exists in DB |
| Frontend shows blank page | Check browser console for build errors; run `npm run dev` again |

---

## 8. File Structure

```
syllabus-planner/
├── app/
│   ├── Http/Controllers/Api/   # API controllers (Auth, Course, CLO, etc.)
│   ├── Models/                 # Eloquent models with relationships
│   └── ...
├── database/
│   ├── migrations/             # All table schemas
│   └── seeders/              # Demo data seeders
├── routes/
│   └── api.php               # API route definitions
├── frontend/
│   ├── src/
│   │   ├── context/          # AuthContext (login/logout/session)
│   │   ├── lib/api.ts      # Axios API client + endpoint helpers
│   │   ├── pages/          # React pages (Dashboard, Courses, etc.)
│   │   └── ...
│   └── ...
└── OPERATION-GUIDE.md        # This file
```
