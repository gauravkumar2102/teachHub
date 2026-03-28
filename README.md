# 🎓 TeacherHub — Full Stack Project

> CodeIgniter 4 REST API + ReactJS Frontend  
> Interview Task: Full Stack Developer Intern

---

## 📁 Project Structure

```
teacher-portal/
├── backend/          ← CodeIgniter 4 REST API (PHP)
├── frontend/         ← ReactJS + Vite SPA
└── database/
    └── schema.sql    ← MySQL schema + sample data
```

---

## ✅ Prerequisites

Make sure you have installed:

| Tool | Version | Download |
|------|---------|----------|
| PHP  | 8.1+    | https://php.net |
| Composer | Latest | https://getcomposer.org |
| MySQL | 5.7+ or 8.0+ | https://mysql.com |
| Node.js | 18+ | https://nodejs.org |
| npm  | 9+      | (comes with Node) |

---

## 🗄️ Step 1 — Database Setup

1. Open MySQL (via terminal or phpMyAdmin/TablePlus)
2. Run the schema file:

```sql
-- In MySQL terminal:
source /path/to/teacher-portal/database/schema.sql

-- OR using mysql CLI:
mysql -u root -p < database/schema.sql
```

This creates:
- Database `teacher_portal`
- Table `auth_user` (id, email, first_name, last_name, password, is_active, timestamps)
- Table `teachers` (id, user_id FK, university_name, gender, year_joined, department, phone, bio, timestamps)
- 2 sample rows (optional — passwords are placeholder hashes)

---

## 🖥️ Step 2 — Backend (CodeIgniter 4)

### 2.1 Install dependencies
```bash
cd backend
composer install
```

### 2.2 Configure environment
```bash
cp env.example .env
```

Open `.env` and fill in:
```env
CI_ENVIRONMENT = development
app.baseURL = 'http://localhost:8080/'

database.default.hostname = localhost
database.default.database = teacher_portal
database.default.username = root
database.default.password = YOUR_MYSQL_PASSWORD
database.default.DBDriver = MySQLi
database.default.port     = 3306

JWT_SECRET_KEY    = change_this_to_a_long_random_string_min_32_chars
JWT_EXPIRE_MINUTES = 1440
```

### 2.3 Start the development server
```bash
php spark serve
# Runs on http://localhost:8080
```

### 2.4 Verify the API is running
Open: http://localhost:8080/api/auth/login  
You should see a JSON response (method not allowed, but it means the server is live).

---

## ⚛️ Step 3 — Frontend (React + Vite)

### 3.1 Install dependencies
```bash
cd frontend
npm install
```

### 3.2 Configure environment
```bash
cp .env.example .env
```

If your backend runs on port 8080 and you use Vite's proxy, leave as default.  
Otherwise edit `.env`:
```env
VITE_API_URL=http://localhost:8080/api
```

### 3.3 Start the development server
```bash
npm run dev
# Runs on http://localhost:3000
```

Open http://localhost:3000 in your browser.

---

## 🔗 API Endpoints

### Auth (Public)
| Method | URL | Body |
|--------|-----|------|
| POST | `/api/auth/register` | email, first_name, last_name, password |
| POST | `/api/auth/login` | email, password |

### Auth (Protected — requires `Authorization: Bearer <token>`)
| Method | URL | Description |
|--------|-----|-------------|
| GET | `/api/auth/me` | Get logged-in user |
| GET | `/api/teachers` | List all teachers (joined with auth_user) |
| POST | `/api/teachers` | Create auth_user + teacher in one request |
| GET | `/api/teachers/:id` | Get single teacher |
| PUT | `/api/teachers/:id` | Update teacher |
| DELETE | `/api/teachers/:id` | Delete teacher (cascades) |

### Example: Register + Create Teacher (single POST)
```json
POST /api/teachers
Authorization: Bearer <your_token>

{
  "email": "jane@mit.edu",
  "first_name": "Jane",
  "last_name": "Doe",
  "password": "secret123",
  "university_name": "MIT",
  "gender": "female",
  "year_joined": 2021,
  "department": "AI & Robotics",
  "phone": "+1-555-9999"
}
```

---

## 🚀 Production Deployment

### Backend on Shared Hosting / VPS (Apache/Nginx)

1. **Upload** the `backend/` folder to your server (e.g., `/var/www/html/api`)

2. **Point your web server document root** to `backend/public/`

3. **Apache** — ensure `.htaccess` is in `public/`:
```apache
RewriteEngine On
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule ^(.*)$ index.php/$1 [L]
```

4. **Nginx** config:
```nginx
location / {
    try_files $uri $uri/ /index.php?$query_string;
}
```

5. Set `CI_ENVIRONMENT = production` in `.env`

6. Run `composer install --no-dev` on the server

### Frontend on Vercel / Netlify / any static host

1. Build the frontend:
```bash
cd frontend
npm run build
# Output goes to frontend/dist/
```

2. **Vercel**: `vercel deploy` (auto-detects Vite)  
   **Netlify**: drag & drop the `dist/` folder  
   **Any host**: upload `dist/` contents to your static file server

3. Set the `VITE_API_URL` environment variable in your hosting dashboard to point to your live backend URL before building:
```
VITE_API_URL=https://your-api-domain.com/api
```

4. For SPA routing on Netlify, add a `_redirects` file in `frontend/public/`:
```
/* /index.html 200
```

---

## ⚙️ What You Need to Configure (Checklist)

- [ ] PHP 8.1+ installed
- [ ] MySQL running with a database named `teacher_portal`
- [ ] Ran `database/schema.sql`
- [ ] Set `database.default.password` in `backend/.env`
- [ ] Set a strong `JWT_SECRET_KEY` in `backend/.env`
- [ ] Ran `composer install` in `backend/`
- [ ] Ran `npm install` in `frontend/`
- [ ] Set correct `VITE_API_URL` in `frontend/.env`

---

## 🧑‍💻 Git Repository Setup

```bash
cd teacher-portal
git init
git add .
git commit -m "Initial commit: Teacher Portal full stack app"
git remote add origin https://github.com/YOUR_USERNAME/teacher-portal.git
git push -u origin main
```

Add a `.gitignore`:
```
backend/vendor/
backend/.env
frontend/node_modules/
frontend/dist/
frontend/.env
```

---


