# 🚀 CosmicBlog — Complete Setup Guide
## Step-by-Step Instructions From Zero to Running

---

## 📋 WHAT YOU'LL NEED BEFORE STARTING

Install these tools first (in order):

### Step 1 — Install Node.js
1. Go to: https://nodejs.org
2. Click the **"LTS" (recommended)** version button
3. Download and run the installer
4. Follow the on-screen steps (just keep clicking Next)
5. Verify it worked: open a terminal and type:
   ```
   node --version
   ```
   You should see something like `v20.10.0`

### Step 2 — Install MongoDB (Local Database)
1. Go to: https://www.mongodb.com/try/download/community
2. Select: Version = latest, OS = Windows/Mac/Linux, Package = MSI (Windows) or DMG (Mac)
3. Download and install
4. During installation, check ✅ "Install MongoDB as a Service" (Windows)
5. Also install **MongoDB Compass** (it's offered during installation) — this is a visual database viewer
6. Verify MongoDB is running (Windows): open Task Manager → Services → look for `MongoDB`
7. Mac/Linux: run `brew services start mongodb-community` (if using Homebrew)

### Step 3 — Install VS Code (Code Editor)
1. Go to: https://code.visualstudio.com
2. Download and install
3. Recommended extensions to install inside VS Code:
   - **ES7+ React/Redux/React-Native snippets**
   - **Tailwind CSS IntelliSense**
   - **Prettier - Code formatter**
   - **Live Server** (optional)

---

## 📁 FOLDER STRUCTURE EXPLAINED

```
blog-app/
├── frontend/          ← Everything the USER SEES (React + Three.js)
│   ├── src/
│   │   ├── components/    ← Reusable UI pieces (Navbar, BlogCard, etc.)
│   │   ├── pages/         ← Full page components (Home, Login, etc.)
│   │   ├── context/       ← Global state (who is logged in)
│   │   ├── api/           ← HTTP client setup (axios)
│   │   ├── App.jsx        ← Root component + all routes
│   │   ├── main.jsx       ← React entry point
│   │   └── index.css      ← Global styles + Tailwind
│   ├── index.html         ← HTML shell with <div id="root">
│   ├── vite.config.js     ← Vite build tool config
│   ├── tailwind.config.js ← Tailwind customization
│   └── package.json       ← Frontend dependencies list
│
└── backend/           ← The SERVER (Node.js + Express)
    ├── models/            ← MongoDB data shapes (User, Blog)
    ├── routes/            ← API endpoints (auth, blogs)
    ├── middleware/        ← JWT auth guard
    ├── server.js          ← Server entry point
    ├── .env               ← Secret config (NEVER share this!)
    └── package.json       ← Backend dependencies list
```

---

## 🔧 FILE-BY-FILE EXPLANATION

### BACKEND FILES:

| File | What it does |
|------|-------------|
| `server.js` | Starts Express server, connects MongoDB, registers routes |
| `.env` | Stores secrets: MongoDB URL, JWT secret, port number |
| `models/User.js` | Defines user structure in database (name, email, password, role) |
| `models/Blog.js` | Defines blog structure (title, content, author, tags, etc.) |
| `middleware/authMiddleware.js` | Checks JWT token on protected routes |
| `routes/auth.js` | Handles /register and /login endpoints |
| `routes/blogs.js` | Handles all blog CRUD endpoints |

### FRONTEND FILES:

| File | What it does |
|------|-------------|
| `main.jsx` | Mounts React app into HTML, wraps with Router + Toast |
| `App.jsx` | All page routes + ProtectedRoute guard |
| `index.css` | Global CSS: Tailwind + custom glass/btn/input classes |
| `api/axios.js` | Pre-configured HTTP client that auto-adds JWT token |
| `context/AuthContext.jsx` | Global login state shared across all components |
| `components/ThreeBackground.jsx` | Animated cosmic Three.js starfield |
| `components/Navbar.jsx` | Top navigation bar (changes based on role) |
| `components/BlogCard.jsx` | Blog preview card used in grids |
| `pages/Home.jsx` | Public homepage with all blogs |
| `pages/Login.jsx` | Login form |
| `pages/Register.jsx` | Registration form with role selector |
| `pages/UserDashboard.jsx` | User's own blog management |
| `pages/AdminDashboard.jsx` | Admin's view of ALL blogs in table |
| `pages/CreateBlog.jsx` | Write + publish a new blog |
| `pages/EditBlog.jsx` | Edit an existing blog |
| `pages/BlogDetail.jsx` | Full blog post reading view |

---

## 🚀 SETUP INSTRUCTIONS (Step by Step)

### STEP 1 — Open the project in VS Code
1. Open VS Code
2. Click **File → Open Folder**
3. Navigate to and select the `blog-app` folder
4. You'll see the folder structure in the left sidebar

---

### STEP 2 — Set up the Backend

1. Open the **integrated terminal** in VS Code:
   - Press `Ctrl + ~` (Windows/Linux) or `Cmd + ~` (Mac)
   - OR go to: Terminal menu → New Terminal

2. Navigate to the backend folder:
   ```bash
   cd backend
   ```

3. Install all backend packages:
   ```bash
   npm install
   ```
   ⏳ Wait for it to finish. This downloads: express, mongoose, bcryptjs, jsonwebtoken, cors, dotenv, nodemon

4. Your `.env` file is already created. It contains:
   ```
   PORT=5000
   MONGO_URI=mongodb://localhost:27017/blogapp
   JWT_SECRET=your_super_secret_jwt_key_change_this_in_production_2024
   ```
   ⚠️ Change `JWT_SECRET` to any long random string before going live!

5. Start the backend server:
   ```bash
   npm run dev
   ```

6. You should see:
   ```
   ✅ MongoDB connected successfully
   ✅ Server running on http://localhost:5000
   ```

   If you see a MongoDB error, make sure MongoDB is running on your computer!

---

### STEP 3 — Set up the Frontend

1. Open a **NEW terminal** tab (click the + button in terminal)

2. Navigate to the frontend folder:
   ```bash
   cd frontend
   ```

3. Install all frontend packages:
   ```bash
   npm install
   ```
   ⏳ Wait (this downloads React, Vite, Tailwind, Three.js, etc.)

4. Start the frontend dev server:
   ```bash
   npm run dev
   ```

5. You should see:
   ```
   VITE v5.x.x  ready in 300ms
   ➜  Local:   http://localhost:5173/
   ```

6. Open your browser and go to: **http://localhost:5173**

🎉 Your blog app is now running!

---

## 👤 HOW TO USE THE APP

### Creating an Admin Account:
1. Go to http://localhost:5173/register
2. Fill in your name, email, password
3. Under "Account Type", click **Admin**
4. Click "Create Account"
5. You'll be redirected to the **Admin Panel**

### Creating a User Account:
1. Go to http://localhost:5173/register
2. Fill in your name, email, password
3. Under "Account Type", click **User** (default)
4. Click "Create Account"
5. You'll be redirected to your **Dashboard**

### Writing a Blog Post:
1. Log in to your account
2. Click **"Write"** in the navbar (or "New Blog Post" in dashboard)
3. Fill in: Title, Category, Cover Image URL (optional), Tags, Content
4. Click the **"Preview"** tab to see how it looks
5. Click **"Publish Post"** to make it live

### Admin Features:
- See ALL posts from ALL users in a table
- Edit or delete any post
- View stats: total posts, authors, views

### User Features:
- See only YOUR own posts in your dashboard
- Edit or delete your own posts
- Write new posts

---

## 🔌 API REFERENCE (for understanding what's happening)

| Method | URL | Auth? | Description |
|--------|-----|-------|-------------|
| POST | /api/auth/register | No | Create account |
| POST | /api/auth/login | No | Login, get token |
| GET | /api/auth/me | Yes | Get my profile |
| GET | /api/blogs | No | All published blogs |
| GET | /api/blogs/my | Yes | My blogs only |
| GET | /api/blogs/all | Admin | ALL blogs |
| GET | /api/blogs/:id | No | Single blog |
| POST | /api/blogs | Yes | Create blog |
| PUT | /api/blogs/:id | Owner/Admin | Update blog |
| DELETE | /api/blogs/:id | Owner/Admin | Delete blog |

---

## ⚠️ COMMON ERRORS & FIXES

### Error: "MongoDB connection failed"
- **Fix**: MongoDB is not running. Start it:
  - Windows: Open Services app → find MongoDB → Start
  - Mac: `brew services start mongodb-community`

### Error: "Cannot find module 'express'"
- **Fix**: You didn't install dependencies. Run `npm install` inside the backend folder.

### Error: "CORS error" in browser console
- **Fix**: Make sure backend is running on port 5000 and frontend on 5173.

### Error: "Port 5000 already in use"
- **Fix**: Change PORT in `.env` to 5001, and update `src/api/axios.js` baseURL to match.

### White/blank screen on frontend
- **Fix**: Check the terminal for errors. Usually a missing import or syntax error.

### Three.js background not showing
- **Fix**: Normal on some browsers. Check browser console for WebGL errors.

---

## 🔄 RUNNING THE APP EVERY TIME

You need TWO terminals open and running simultaneously:

**Terminal 1 (Backend):**
```bash
cd backend
npm run dev
```

**Terminal 2 (Frontend):**
```bash
cd frontend
npm run dev
```

Both must be running for the app to work!

---

## 🌐 TECH STACK SUMMARY

| Technology | Role |
|-----------|------|
| React 18 | UI components and pages |
| Tailwind CSS | Styling utility classes |
| Three.js | 3D animated background |
| React Router v6 | Page navigation |
| Axios | HTTP requests to backend |
| Node.js | Server runtime |
| Express.js | Web framework (routes, middleware) |
| MongoDB | Database (stores users and blogs) |
| Mongoose | MongoDB object modeling |
| JWT | Authentication tokens |
| bcryptjs | Password hashing |
| react-hot-toast | Notification popups |
| react-icons | Icon components |

---

## ✅ CHECKLIST — Before running, make sure:

- [ ] Node.js installed (`node --version` works)
- [ ] MongoDB installed and running
- [ ] `npm install` run inside `/backend`
- [ ] `npm install` run inside `/frontend`
- [ ] Backend running on port 5000
- [ ] Frontend running on port 5173
- [ ] Browser open at http://localhost:5173

Happy blogging! 🌌✨
