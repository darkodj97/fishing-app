# 🎣 Fishing Log App

A full-stack fishing log application where users can track their catches, compete on leaderboards, and manage their fishing history.

## 🌐 Live Demo

- **Frontend**: https://fishing-app-virid.vercel.app
- **Backend API**: https://fishing-app-backend-d77r.onrender.com

> **Note**: The backend is hosted on Render's free tier. The first request may take up to 60 seconds as the server wakes up from sleep. Subsequent requests will be fast.

## ✨ Features

- User authentication with JWT tokens
- Add fishing catches with photos, weight, bait, and date
- Edit and delete catches
- Monthly leaderboard by fish type
- Profile page with personal statistics
- Image upload via Cloudinary

## 🛠️ Tech Stack

**Backend:**
- Python
- FastAPI
- PostgreSQL
- SQLAlchemy
- JWT Authentication
- Cloudinary (image storage)

**Frontend:**
- React
- Tailwind CSS
- Axios
- React Router

## 🚀 Running Locally

### Backend
```bash
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
uvicorn main:app --reload
```

### Frontend
```bash
cd frontend
npm install
npm start
```