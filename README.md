# 🎓 EduLink UG - Peer Learning Platform

**For God and My Country** 🇺🇬

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js](https://img.shields.io/badge/Node.js-22.x-green.svg)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-19.1-blue.svg)](https://reactjs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-7.0-green.svg)](https://www.mongodb.com/)

> A comprehensive MERN stack peer-learning platform empowering Ugandan secondary school students with quality education through collaborative learning, real-time study sessions, and AI-powered tutoring.

**Aligned with UN Sustainable Development Goal 4: Quality Education**

---

## 📚 Table of Contents

- [About the Project](#about-the-project)
- [Features](#features)
- [Demo](#demo)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [API Documentation](#api-documentation)
- [Testing](#testing)
- [Deployment](#deployment)
- [Contributing](#contributing)
- [License](#license)
- [Contact](#contact)

---

## 🎯 About the Project

**EduLink UG** addresses the educational challenges faced by Ugandan secondary school students by providing a safe, moderated platform for peer-to-peer learning. The platform enables students to:

- **Ask and Answer Questions**: Get help from peers and teachers across all subjects
- **Join Live Study Sessions**: Participate in real-time collaborative learning
- **Access AI Tutoring**: Get 24/7 help from EduBot, our AI assistant
- **Build Community**: Connect with students from different schools and districts
- **Track Progress**: Earn reputation through quality contributions

### 🌟 Why EduLink UG?

- **Localized Content**: Aligned with Uganda's O-Level and A-Level curriculum
- **Safe Environment**: Teacher moderation and 3-strike reporting system
- **Inclusive**: Free access for all students regardless of location
- **Mobile-Friendly**: Responsive design works on any device
- **Offline Support**: Core features work with intermittent connectivity

### 📊 Current Status

**✅ Fully Deployed and Live**

- **Deployment**: Backend on Render (free tier), Frontend on Vercel (free tier), Database on MongoDB Atlas (free tier)
- **Live URLs**:
  - Frontend: https://mern-final-project-rockie-raheem.vercel.app
  - Backend: https://edulink-backend-q1xv.onrender.com
- **Core Features Working**: Authentication, Q&A system, user profiles, basic real-time features
- **Known Limitations**:
  - Free tier constraints (Render sleep after inactivity, Atlas storage limits)
  - AI chatbot uses Google Gemini (may have usage limits)
  - File uploads limited to images/documents
  - Live sessions require active participants
- **Security**: JWT authentication, CORS configured for production, input validation
- **Performance**: Optimized with compression, but no caching implemented yet
- **Testing**: Basic unit tests present, integration tests needed
- **Scalability**: Suitable for small user base; may need upgrades for growth

**Critical Analysis**:

- **Strengths**: Well-architected MERN stack, comprehensive documentation, responsive design, security-conscious
- **Areas for Improvement**: Complete test coverage, add monitoring/logging, implement caching, expand AI features
- **Production Readiness**: Good for MVP/demo; needs monitoring and backup strategy for long-term use

---

## ✨ Features

### 🔐 Authentication & User Management

- [x] JWT-based secure authentication
- [x] Role-based access control (Student, Teacher, Admin)
- [x] User profiles with school and district information
- [x] Reputation and strike tracking system

### ❓ Question & Answer System

- [x] Post questions with attachments
- [x] Anonymous question option for sensitive topics
- [x] Subject and education level categorization
- [x] Upvote/downvote functionality
- [x] Teacher answer verification
- [x] Accepted answer marking

### 📖 Live Study Sessions

- [x] Schedule and host study sessions
- [x] Real-time participant management
- [x] Subject-specific sessions
- [x] Session recording capability
- [x] Teacher-led and peer-led sessions

### 🤖 AI Chatbot (EduBot)

- [x] 24/7 educational assistance
- [x] Subject-specific help
- [x] Step-by-step explanations
- [x] Conversation history tracking
- [x] Safe, age-appropriate responses

### 🛡️ Safety & Moderation

- [x] Content filtering for inappropriate material
- [x] Report/flag system for users and content
- [x] 3-strike rule with automatic banning
- [x] Teacher and admin moderation tools
- [x] Chat logging for accountability

### 🔔 Real-time Features (Socket.IO)

- [x] Live notifications for new answers
- [x] Real-time session updates
- [x] Instant messaging in study sessions
- [x] Online status indicators

---

## 🎬 Demo

**Quick Demo**: Visit the live app at https://mern-final-project-rockie-raheem.vercel.app to explore features interactively.

### 🌐 Live Application

**Frontend**: [https://mern-final-project-rockie-raheem.vercel.app](https://mern-final-project-rockie-raheem.vercel.app)  
**Backend API**: [https://edulink-backend-q1xv.onrender.com](https://edulink-backend-q1xv.onrender.com)

**📝 Instructions**:

1. Deploy backend to Render (see `docs/DEPLOYMENT.md`)
2. Deploy frontend to Vercel (see `docs/DEPLOYMENT.md`)
3. Replace URLs above with your actual deployed URLs
4. Test the live application thoroughly
5. Create test accounts or use credentials below

**Test Credentials** (create these after deployment):

```
Student Account:
Email: student@test.com
Password: test123

Teacher Account:
Email: teacher@test.com
Password: test123
```

**Deployment Status**:

- [x] Backend deployed to Render
- [x] Frontend deployed to Vercel
- [x] Database deployed to MongoDB Atlas
- [x] URLs updated in README
- [x] Application tested and working
- [ ] Video demonstration recorded and linked

---

## 🛠️ Tech Stack

### Frontend

![React](https://img.shields.io/badge/React-19.1-blue?logo=react)
![Vite](https://img.shields.io/badge/Vite-7.1-purple?logo=vite)
![Tailwind](https://img.shields.io/badge/Tailwind-3.4-cyan?logo=tailwindcss)
![Axios](https://img.shields.io/badge/Axios-1.13-blue)
![Socket.io](https://img.shields.io/badge/Socket.io-4.8-black?logo=socket.io)

- **React 19.1.1** - UI library
- **Vite 7.1.7** - Build tool and dev server
- **Tailwind CSS 3.4.1** - Utility-first CSS framework
- **React Router DOM 7.9.4** - Client-side routing
- **Axios 1.13.0** - HTTP client
- **Socket.io-client 4.8.1** - Real-time communication

### Backend

![Node.js](https://img.shields.io/badge/Node.js-22.x-green?logo=node.js)
![Express](https://img.shields.io/badge/Express-4.18-lightgrey?logo=express)
![MongoDB](https://img.shields.io/badge/MongoDB-7.0-green?logo=mongodb)
![JWT](https://img.shields.io/badge/JWT-9.0-red)

- **Node.js 22.x** - JavaScript runtime
- **Express.js 4.18.2** - Web framework
- **MongoDB 7.0.25** - NoSQL database
- **Mongoose 8.0.3** - ODM for MongoDB
- **JWT** - Authentication
- **Socket.IO 4.6.1** - WebSocket library
- **OpenAI API 4.24.1** - AI chatbot integration
- **Multer 1.4.5** - File upload handling

### Security & Utilities

- **bcryptjs** - Password hashing
- **Helmet** - Security headers
- **CORS** - Cross-origin resource sharing
- **express-rate-limit** - Rate limiting
- **express-validator** - Input validation
- **Morgan** - HTTP request logging

---

## 📁 Project Structure

```
mern-final-project-RockieRaheem/
├── 📂 backend/                      # Node.js + Express API
│   ├── 📂 config/                   # Configuration files
│   │   └── db.js                    # MongoDB connection
│   ├── 📂 controllers/              # Request handlers
│   │   ├── authController.js
│   │   ├── questionController.js
│   │   ├── answerController.js
│   │   ├── sessionController.js
│   │   ├── reportController.js
│   │   └── chatbotController.js
│   ├── 📂 middleware/               # Custom middleware
│   │   ├── auth.js                  # JWT authentication
│   │   ├── validate.js              # Input validation
│   │   └── errorHandler.js
│   ├── 📂 models/                   # Mongoose schemas
│   │   ├── User.js
│   │   ├── Question.js
│   │   ├── Answer.js
│   │   ├── Session.js
│   │   ├── Report.js
│   │   └── Chat.js
│   ├── 📂 routes/                   # API routes
│   │   ├── auth.js
│   │   ├── questions.js
│   │   ├── answers.js
│   │   ├── sessions.js
│   │   ├── reports.js
│   │   └── chatbot.js
│   ├── 📂 utils/                    # Helper functions
│   ├── 📄 .env.example              # Environment template
│   ├── 📄 package.json
│   └── 📄 server.js                 # Entry point
│
├── 📂 frontend/                     # React application
│   ├── 📂 public/                   # Static assets
│   ├── 📂 src/
│   │   ├── 📂 api/                  # API integration
│   │   ├── 📂 assets/               # Images, icons
│   │   ├── 📂 components/           # Reusable components
│   │   │   ├── common/              # Buttons, Cards, Modals
│   │   │   ├── layout/              # Header, Footer, Sidebar
│   │   │   └── features/            # Feature components
│   │   ├── 📂 contexts/             # React Context API
│   │   ├── 📂 hooks/                # Custom hooks
│   │   ├── 📂 pages/                # Route pages
│   │   │   ├── Home.jsx
│   │   │   ├── Questions.jsx
│   │   │   ├── Sessions.jsx
│   │   │   └── Profile.jsx
│   │   ├── 📂 utils/                # Helper functions
│   │   ├── 📄 App.jsx               # Root component
│   │   └── 📄 main.jsx              # Entry point
│   ├── 📄 .env.example
│   ├── 📄 package.json
│   ├── 📄 vite.config.js
│   └── 📄 tailwind.config.js
│
├── 📂 docs/                         # Documentation
│   ├── 📄 ARCHITECTURE.md           # Technical architecture
│   ├── 📄 DATABASE_SCHEMA.md        # Database design
│   ├── 📄 API_TESTING.md            # API endpoints guide
│   ├── 📄 PROJECT_OVERVIEW.md       # Project details
│   └── 📂 wireframes/               # UI mockups
│
├── 📄 .gitignore                    # Git ignore rules
├── 📄 README.md                     # This file
├── 📄 Week8-Assignment.md           # Assignment requirements
└── 📄 LICENSE                       # MIT License
```

---

## 🚀 Getting Started

### Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v22 or higher) - [Download](https://nodejs.org/)
- **MongoDB** (v7 or higher) - [Download](https://www.mongodb.com/try/download/community) or use [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
- **npm** (comes with Node.js)
- **Git** - [Download](https://git-scm.com/)

### Installation

#### 1. Clone the Repository

```bash
git clone https://github.com/PLP-MERN-Stack-Development/mern-final-project-RockieRaheem.git
cd mern-final-project-RockieRaheem
```

#### 2. Set Up Backend

```bash
cd backend

# Install dependencies
npm install

# Create environment file
cp .env.example .env

# Edit .env with your configuration
nano .env  # or use your preferred editor
```

**Configure `.env` file:**

```env
# Server Configuration
PORT=5001
NODE_ENV=development

# Database
MONGODB_URI=mongodb://localhost:27017/edulink-ug
# Or use MongoDB Atlas:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/edulink-ug

# JWT Secret (use a strong random string)
JWT_SECRET=your_super_secret_jwt_key_here_change_in_production
JWT_EXPIRE=7d

# OpenAI API (for chatbot)
OPENAI_API_KEY=your_openai_api_key_here

# Frontend URL (for CORS)
FRONTEND_URL=http://localhost:5173
```

**Start MongoDB** (if running locally):

```bash
# On macOS/Linux
sudo systemctl start mongod

# Or check if already running
pgrep -x mongod
```

**Start the backend server:**

```bash
# Development mode (with nodemon)
npm run dev

# Production mode
npm start
```

Backend will run on: **http://localhost:5001**

#### 3. Set Up Frontend

Open a new terminal window:

```bash
cd frontend

# Install dependencies
npm install

# Create environment file
cp .env.example .env

# Edit .env with your configuration
nano .env
```

**Configure frontend `.env` file:**

```env
VITE_API_URL=http://localhost:5001
VITE_SOCKET_URL=http://localhost:5001
```

**Start the frontend development server:**

```bash
npm run dev
```

Frontend will run on: **http://localhost:5173**

#### 4. Access the Application

Open your browser and navigate to:

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:5001
- **API Health Check**: http://localhost:5001/api/health

### 🎉 You're Ready!

You can now:

1. Register a new student account
2. Register a teacher account (set role to "teacher")
3. Start asking questions
4. Answer questions from peers
5. Create study sessions (teachers)
6. Chat with EduBot AI assistant

---

## 📖 API Documentation

### Base URL

```
Development: http://localhost:5001
Production: https://api.edulink-ug.com
```

### Authentication

Most endpoints require a JWT token. Include it in the request header:

```
Authorization: Bearer <your_jwt_token>
```

### Endpoints Overview

| Endpoint                    | Method | Description          | Auth          |
| --------------------------- | ------ | -------------------- | ------------- |
| `/api/auth/register`        | POST   | Register new user    | No            |
| `/api/auth/login`           | POST   | User login           | No            |
| `/api/auth/me`              | GET    | Get current user     | Yes           |
| `/api/questions`            | GET    | List all questions   | No            |
| `/api/questions`            | POST   | Create question      | Yes           |
| `/api/questions/:id`        | GET    | Get question details | No            |
| `/api/questions/:id/upvote` | PUT    | Upvote question      | Yes           |
| `/api/answers`              | POST   | Submit answer        | Yes           |
| `/api/answers/:id/verify`   | PUT    | Verify answer        | Yes (Teacher) |
| `/api/sessions`             | GET    | List sessions        | Yes           |
| `/api/sessions`             | POST   | Create session       | Yes (Teacher) |
| `/api/reports`              | POST   | Report content/user  | Yes           |
| `/api/chatbot`              | POST   | Chat with AI         | Yes           |

For detailed API documentation with examples, see [docs/API_TESTING.md](docs/API_TESTING.md)

---

## 🧪 Testing

### Manual Testing

Use the provided test scripts:

```bash
# Test backend health
curl http://localhost:5001/api/health

# Register a user
curl -X POST http://localhost:5001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com","password":"test123","school":"Test School","district":"Kampala","subjects":["Mathematics"],"educationLevel":"O-Level"}'
```

See [docs/API_TESTING.md](docs/API_TESTING.md) for comprehensive testing guide.

### Unit Testing (To Be Implemented)

```bash
# Backend tests
cd backend
npm test

# Frontend tests
cd frontend
npm test
```

### Test Coverage Goals

- [ ] Unit tests for all controllers (80%+ coverage)
- [ ] Integration tests for API endpoints
- [ ] Component tests for React components
- [ ] End-to-end tests with Cypress

---

## 🚀 Deployment

### Deployment Checklist

- [x] Set up production MongoDB (MongoDB Atlas)
- [x] Configure environment variables for production
- [x] Build frontend for production
- [x] Deploy backend to Render/Railway
- [x] Deploy frontend to Vercel/Netlify
- [x] Configure CORS for production URLs
- [x] Set up SSL certificates (HTTPS)
- [ ] Configure CI/CD pipeline
- [ ] Set up monitoring and logging
- [ ] Create backup strategy

### Backend Deployment (Render)

1. Create account on [Render](https://render.com)
2. Create new Web Service
3. Connect GitHub repository
4. Configure:
   - **Build Command**: `cd backend && npm install`
   - **Start Command**: `cd backend && npm start`
   - **Environment Variables**: Add all variables from `.env`

### Frontend Deployment (Vercel)

1. Create account on [Vercel](https://vercel.com)
2. Import GitHub repository
3. Configure:
   - **Framework**: Vite
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Environment Variables**: Add `VITE_API_URL` with production backend URL

### Database Setup (MongoDB Atlas)

1. Create account on [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create new cluster (free tier available)
3. Create database user
4. Whitelist IP addresses (0.0.0.0/0 for all)
5. Get connection string and update `MONGODB_URI` in backend

---

## 🤝 Contributing

Contributions are welcome! Please follow these guidelines:

### Development Workflow

1. **Fork the repository**
2. **Create a feature branch**
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. **Make your changes**
4. **Commit with descriptive messages**
   ```bash
   git commit -m "Add: Amazing new feature"
   ```
5. **Push to your branch**
   ```bash
   git push origin feature/amazing-feature
   ```
6. **Open a Pull Request**

### Commit Message Convention

- `Add:` New feature
- `Fix:` Bug fix
- `Update:` Update existing feature
- `Refactor:` Code refactoring
- `Docs:` Documentation changes
- `Test:` Adding tests

### Code Style

- Follow ESLint configuration
- Use meaningful variable names
- Add comments for complex logic
- Keep functions small and focused

---

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

---

## 📞 Contact

**Developer**: Rockie Raheem  
**Institution**: PLP MERN Stack Development Program  
**GitHub**: [@RockieRaheem](https://github.com/RockieRaheem)  
**Email**: your.email@example.com

**Project Link**: [https://github.com/PLP-MERN-Stack-Development/mern-final-project-RockieRaheem](https://github.com/PLP-MERN-Stack-Development/mern-final-project-RockieRaheem)

---

## Author / Project Lead

- Author: Kamwanga Raheem
- Contact: +256 704 057370 — kamwangaraheem2050@gmail.com
- Built using knowledge gained from the Power Learn Project.
- I am the developer of this project and welcome feedback or questions.

## 🙏 Acknowledgments

- **PLP Academy** - For the MERN Stack Development course
- **Uganda National Examinations Board (UNEB)** - For curriculum alignment
- **OpenAI** - For AI chatbot capabilities
- **MongoDB, Express, React, Node.js Communities** - For excellent documentation
- **All Contributors** - For making this project better

---

## 🌟 Star this Project

If you find EduLink UG helpful, please give it a ⭐ on GitHub!

---

**Built with ❤️ for Quality Education in Uganda (SDG 4)**

_For God and My Country_ 🇺🇬
