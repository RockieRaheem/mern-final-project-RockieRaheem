# 🎓 EduLink UG - Peer Learning Platform

**For God and My Country** 🇺🇬

A peer-learning platform for Ugandan secondary-school students, focusing on quality education (SDG 4).

## 🚀 Project Status

✅ **Backend Server is RUNNING on port 5001**

## 📋 What's Been Built

### ✅ Backend (Node.js + Express)

#### Core Features Implemented:

- **Authentication System** (JWT-based)

  - User registration & login
  - Password hashing with bcryptjs
  - Token-based authentication
  - Role-based access control (Student, Teacher, Admin)

- **Database Models** (MongoDB/Mongoose)

  - Users (with roles, schools, districts, subjects)
  - Questions (with attachments, subjects, answers)
  - Answers (with verification system, upvotes/downvotes)
  - Sessions (live discussions with participants)
  - Reports (harassment reporting system)
  - Chats (AI chatbot conversation history)

- **API Endpoints**

  - `/api/auth` - Registration, login, profile management
  - `/api/questions` - CRUD operations, upvoting, filtering
  - `/api/answers` - Submit, verify, vote on answers
  - `/api/sessions` - Create/join live study sessions
  - `/api/reports` - Report inappropriate content/users
  - `/api/chatbot` - Chat with EduBot AI assistant

- **Safety & Moderation**

  - Content filtering middleware
  - 3-strike rule system
  - Report/flag system
  - Chat logging for teacher-student interactions
  - Anonymous question posting

- **Real-time Features**

  - Socket.IO integration
  - Live video/chat sessions support
  - Real-time notifications ready

- **File Uploads**
  - Multer configuration for images
  - Question attachments support
  - Secure file handling

## 🛠️ Tech Stack

- **Backend**: Node.js, Express.js
- **Database**: MongoDB (v7.0.25)
- **Authentication**: JWT, bcryptjs
- **Real-time**: Socket.IO
- **File Upload**: Multer
- **Security**: Helmet, CORS, Rate Limiting

## 📦 Installation & Setup

### Prerequisites

- Node.js (v22+)
- MongoDB (v7+)
- npm

### Backend Setup

1. **Navigate to server directory:**

   ```bash
   cd server
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Configure environment:**

   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

4. **Start MongoDB:**

   ```bash
   # MongoDB should already be running
   # Check with: pgrep -x mongod
   ```

5. **Start the server:**
   ```bash
   npm run dev  # Development mode with nodemon
   # or
   npm start    # Production mode
   ```

Server will run on: **http://localhost:5001**

## 🧪 Testing the API

### Health Check

```bash
curl http://localhost:5001/api/health
```

### Register a User

```bash
curl -X POST http://localhost:5001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123",
    "school": "Kampala High School",
    "district": "Kampala",
    "subjects": ["Mathematics", "Physics"],
    "educationLevel": "O-Level"
  }'
```

### Login

```bash
curl -X POST http://localhost:5001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123"
  }'
```

### Create a Question (Authenticated)

```bash
curl -X POST http://localhost:5001/api/questions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "title": "How to solve quadratic equations?",
    "body": "I need help understanding the quadratic formula",
    "subject": "Mathematics",
    "educationLevel": "O-Level"
  }'
```

## 📁 Project Structure

```
EduLink-UG/
├── server/
│   ├── config/
│   │   └── db.js              # MongoDB connection
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── questionController.js
│   │   ├── answerController.js
│   │   ├── sessionController.js
│   │   ├── reportController.js
│   │   └── chatbotController.js
│   ├── middleware/
│   │   ├── auth.js            # JWT authentication
│   │   ├── error.js           # Error handling
│   │   └── moderation.js      # Content filtering
│   ├── models/
│   │   ├── User.js
│   │   ├── Question.js
│   │   ├── Answer.js
│   │   ├── Session.js
│   │   ├── Report.js
│   │   └── Chat.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── questions.js
│   │   ├── answers.js
│   │   ├── sessions.js
│   │   ├── reports.js
│   │   └── chatbot.js
│   ├── utils/
│   │   ├── tokenUtils.js      # JWT helpers
│   │   └── fileUpload.js      # Multer config
│   ├── .env                   # Environment variables
│   ├── .env.example
│   ├── package.json
│   └── server.js              # Main entry point
├── client/                    # Frontend (To be built)
├── uploads/                   # File uploads directory
└── README.md
```

## 🎯 API Endpoints Overview

### Authentication

- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (Protected)
- `PUT /api/auth/updatedetails` - Update profile (Protected)
- `PUT /api/auth/updatepassword` - Change password (Protected)
- `POST /api/auth/logout` - Logout (Protected)

### Questions

- `GET /api/questions` - Get all questions
- `GET /api/questions/:id` - Get single question
- `POST /api/questions` - Create question (Protected)
- `PUT /api/questions/:id` - Update question (Protected)
- `DELETE /api/questions/:id` - Delete question (Protected)
- `PUT /api/questions/:id/upvote` - Upvote question (Protected)

### Answers

- `GET /api/answers/question/:questionId` - Get answers for a question
- `POST /api/answers` - Submit answer (Protected)
- `PUT /api/answers/:id` - Update answer (Protected)
- `DELETE /api/answers/:id` - Delete answer (Protected)
- `PUT /api/answers/:id/verify` - Verify answer (Teacher/Admin)
- `PUT /api/answers/:id/vote` - Vote on answer (Protected)

### Sessions

- `GET /api/sessions` - Get all sessions
- `GET /api/sessions/:id` - Get single session
- `POST /api/sessions` - Create session (Protected)
- `PUT /api/sessions/:id` - Update session (Protected)
- `DELETE /api/sessions/:id` - Delete session (Protected)
- `PUT /api/sessions/:id/join` - Join session (Protected)

### Reports

- `POST /api/reports` - Create report (Protected)
- `GET /api/reports` - Get all reports (Teacher/Admin)
- `PUT /api/reports/:id` - Update report (Admin)

### Chatbot

- `POST /api/chatbot` - Chat with EduBot (Protected)
- `GET /api/chatbot/history` - Get chat history (Protected)
- `PUT /api/chatbot/:id/helpful` - Mark chat helpful (Protected)

## 🔐 User Roles

- **Student**: Can ask questions, answer, join sessions, chat with bot
- **Teacher**: All student features + verify answers, host sessions, review reports
- **Admin**: All features + manage users, handle reports, system moderation

## 🎨 Frontend Pages (HTML Designs Ready)

Located in project folders:

- `auth-login-signup/` - Login & Signup page
- `community-feed/` - Community questions feed
- `ask-question/` - Ask a question form
- `live-discussion-room/` - Live video/chat session
- `resource-library/` - Learning resources
- `user-profile/` - User profile page

## 🚧 Next Steps

1. **Initialize React Frontend with Vite**
2. **Convert HTML designs to React components**
3. **Implement API integration with Axios**
4. **Add OpenAI/LLM integration for EduBot**
5. **Setup WebRTC for live video sessions**
6. **Add testing (Jest, Supertest)**
7. **Deploy to cloud (Backend: Railway/Render, Frontend: Vercel)**

## 👥 User Types

- **Students**: O-Level & A-Level secondary school students
- **Teachers**: Verified educators from Ugandan schools
- **Subjects**: Biology, Chemistry, Physics, Mathematics, English, History, Geography, Economics

## 🌟 Key Features

- ✅ Peer-to-peer learning
- ✅ Teacher verification system
- ✅ Anonymous question posting
- ✅ AI-powered chatbot assistant
- ✅ Live study sessions
- ✅ Gamification (points & badges)
- ✅ Safety & moderation system
- ✅ Real-time notifications
- ✅ Mobile-responsive design

## 📄 License

MIT

## 👨‍💻 Developed By

**EduLink UG Team** - Power Learn Project MERN Stack Final Project

---

**For God and My Country** 🇺🇬
