<div align="center">

# 🌌 CosmicBlog

### *Read Beyond The Universe*

![CosmicBlog Banner](https://img.shields.io/badge/CosmicBlog-v1.0.0-6366f1?style=for-the-badge&logo=react&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-rose?style=for-the-badge)
![Node](https://img.shields.io/badge/Node.js-18+-339933?style=for-the-badge&logo=node.js&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-8.0-47A248?style=for-the-badge&logo=mongodb&logoColor=white)
![React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react&logoColor=black)

<br/>

> A full-stack blogging platform with a cosmic aesthetic — featuring a stunning Three.js animated starfield, role-based authentication, and a seamless reading experience.

<br/>

[🚀 Live Demo](#) • [📖 Features](#-features) • [⚡ Quick Start](#-quick-start) • [📡 API Docs](#-api-reference)

</div>

---

## ✨ Features

| Feature | Description |
|---|---|
| 🌠 **3D Starfield Background** | Interactive Three.js animated cosmic background |
| 🔐 **JWT Authentication** | Secure login & registration with token-based auth |
| 👤 **Role-Based Access** | Separate experience for Admins and Users |
| 📝 **Rich Blog Editor** | Create, edit, preview blogs with category & tag support |
| 🔍 **Search & Filter** | Real-time search with category filtering |
| 📱 **Fully Responsive** | Works beautifully on all screen sizes |
| 🛡️ **Protected Routes** | Login required to view blogs or access dashboard |
| ⚡ **Fast & Modern** | Vite + React 18 for lightning fast performance |

---

## 🛠️ Tech Stack

### Frontend
| Technology | Version | Purpose |
|---|---|---|
| **React** | 18.2 | UI Components & Pages |
| **Vite** | 5.0 | Build Tool & Dev Server |
| **Tailwind CSS** | 3.3 | Utility-first Styling |
| **Three.js** | 0.159 | 3D Animated Background |
| **React Router** | v6 | Client-side Navigation |
| **Axios** | 1.6 | HTTP Client |
| **React Hot Toast** | 2.4 | Notification Popups |
| **React Icons** | 4.12 | Icon Components |

### Backend
| Technology | Version | Purpose |
|---|---|---|
| **Node.js** | 18+ | Server Runtime |
| **Express.js** | 4.18 | Web Framework |
| **MongoDB** | Latest | Database |
| **Mongoose** | 8.0 | MongoDB ODM |
| **JWT** | 9.0 | Authentication Tokens |
| **bcryptjs** | 2.4 | Password Hashing |
| **Nodemon** | 3.0 | Dev Auto-restart |

---

## 📁 Project Structure

```
blog-app/
│
├── 📂 frontend/                  ← React App (what users see)
│   ├── 📂 src/
│   │   ├── 📂 api/
│   │   │   └── axios.js          ← HTTP client (auto-adds JWT token)
│   │   ├── 📂 components/
│   │   │   ├── BlogCard.jsx      ← Blog preview card
│   │   │   ├── Navbar.jsx        ← Top navigation (role-aware)
│   │   │   └── ThreeBackground.jsx ← 🌌 Cosmic Three.js starfield
│   │   ├── 📂 context/
│   │   │   └── AuthContext.jsx   ← Global auth state (login/logout)
│   │   ├── 📂 pages/
│   │   │   ├── Home.jsx          ← Blog listing with search/filter
│   │   │   ├── Login.jsx         ← Login form
│   │   │   ├── Register.jsx      ← Registration with role selector
│   │   │   ├── BlogDetail.jsx    ← Full blog reading view
│   │   │   ├── UserDashboard.jsx ← User's blog management
│   │   │   ├── AdminDashboard.jsx ← Admin's full control panel
│   │   │   ├── CreateBlog.jsx    ← Write new blog
│   │   │   └── EditBlog.jsx      ← Edit existing blog
│   │   ├── App.jsx               ← Routes + ProtectedRoute guard
│   │   ├── main.jsx              ← React entry point
│   │   └── index.css             ← Global styles + custom classes
│   ├── index.html
│   ├── vite.config.js
│   └── tailwind.config.js
│
└── 📂 backend/                   ← Express API Server
    ├── 📂 middleware/
    │   └── authMiddleware.js     ← JWT token verification
    ├── 📂 models/
    │   ├── User.js               ← User schema (name, email, role)
    │   └── Blog.js               ← Blog schema (title, content, tags)
    ├── 📂 routes/
    │   ├── auth.js               ← /register & /login endpoints
    │   └── blogs.js              ← Blog CRUD endpoints
    ├── server.js                 ← Server entry point
    ├── .env                      ← 🔒 Secret config (never commit!)
    └── package.json
```

---

## ⚡ Quick Start

### Prerequisites

Make sure you have these installed:
- [Node.js](https://nodejs.org) v18 or higher
- [MongoDB](https://www.mongodb.com/try/download/community) (running locally)
- [Git](https://git-scm.com)

### Installation

**1. Clone the repository**
```bash
git clone https://github.com/kishan8105/blog-app.git
cd blog-app
```

**2. Setup Backend**
```bash
cd backend
npm install
```

Create a `.env` file in the `backend` folder:
```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/blogapp
JWT_SECRET=your_super_secret_key_change_this_in_production
```

Start the backend server:
```bash
npm run dev
```

You should see:
```
✅ MongoDB connected successfully
✅ Server running on http://localhost:5000
```

**3. Setup Frontend** *(open a new terminal)*
```bash
cd frontend
npm install
npm run dev
```

You should see:
```
VITE v5.x.x  ready in 300ms
➜  Local:   http://localhost:5173/
```

**4. Open in browser**

Visit → **http://localhost:5173**

> ⚠️ Both terminals must be running simultaneously for the app to work!

---

## 👥 User Roles

### 👑 Admin
- View **all blogs** from all users in a management table
- **Create, Edit, Delete** any blog post
- Access the Admin Dashboard with stats
- Write and publish new blog posts

### 📖 User
- **Read** all published blogs
- Manage **only their own** blog posts
- View their personal dashboard
- Write new blog posts

---

## 🔑 How to Create Accounts

### Create Admin Account
1. Go to `/register`
2. Fill in name, email, password
3. Select **"Admin"** under Account Type
4. Submit → you'll be redirected to Admin Dashboard

### Create User Account
1. Go to `/register`
2. Fill in name, email, password
3. Select **"User"** (default) under Account Type
4. Submit → you'll be redirected to User Dashboard

---

## 📡 API Reference

### Auth Routes

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `POST` | `/api/auth/register` | ❌ | Create new account |
| `POST` | `/api/auth/login` | ❌ | Login, returns JWT token |
| `GET` | `/api/auth/me` | ✅ | Get current user profile |

### Blog Routes

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `GET` | `/api/blogs` | ✅ | Get all published blogs |
| `GET` | `/api/blogs/my` | ✅ | Get my blogs only |
| `GET` | `/api/blogs/all` | 👑 Admin | Get ALL blogs |
| `GET` | `/api/blogs/:id` | ✅ | Get single blog by ID |
| `POST` | `/api/blogs` | ✅ | Create new blog |
| `PUT` | `/api/blogs/:id` | ✅ Owner/Admin | Update blog |
| `DELETE` | `/api/blogs/:id` | ✅ Owner/Admin | Delete blog |

---

## 🌐 Deployment

This project is deployed using:
- **Frontend** → [Render](https://render.com) (Static Site)
- **Backend** → [Render](https://render.com) (Web Service)
- **Database** → [MongoDB Atlas](https://www.mongodb.com/atlas) (Cloud Database)

### Deploy your own

1. Push code to GitHub
2. Connect repo to Render
3. Set environment variables in Render dashboard
4. Render auto-deploys on every push ✅

---

## 🐛 Common Issues & Fixes

| Error | Fix |
|---|---|
| `MongoDB connection failed` | Start MongoDB service on your machine |
| `Cannot find module 'express'` | Run `npm install` inside `/backend` |
| `CORS error` in browser | Ensure backend runs on port 5000 |
| `Port 5000 already in use` | Change PORT in `.env` to `5001` |
| Blank white screen | Check terminal for syntax errors |
| Three.js not showing | Check browser console for WebGL support |

---

## 🔒 Security Notes

- Never commit your `.env` file to GitHub
- Change `JWT_SECRET` to a long random string in production
- Passwords are hashed with `bcryptjs` before storing
- JWT tokens expire and must be refreshed via login

---

## 📜 License

This project is licensed under the **MIT License** — feel free to use, modify, and distribute.

---

<div align="center">

**Built with ❤️ and a little cosmic magic** 🌌

*If you found this project helpful, please give it a ⭐ on GitHub!*

</div>
