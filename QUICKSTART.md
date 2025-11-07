# 🚀 Quick Start Guide - EduLink UG

Get EduLink UG running on your local machine in 5 minutes!

## ⚡ Prerequisites

Make sure you have:
- ✅ Node.js (v22+) installed - [Download](https://nodejs.org/)
- ✅ MongoDB (v7+) running - [Download](https://www.mongodb.com/try/download/community)
- ✅ Git installed - [Download](https://git-scm.com/)

---

## 📦 Installation (5 Steps)

### Step 1: Clone the Repository

```bash
git clone https://github.com/PLP-MERN-Stack-Development/mern-final-project-RockieRaheem.git
cd mern-final-project-RockieRaheem
```

### Step 2: Setup Backend

```bash
# Navigate to backend
cd backend

# Install dependencies
npm install

# Create environment file
cp .env.example .env

# Edit .env and update these values:
# MONGODB_URI=mongodb://localhost:27017/edulink-ug
# JWT_SECRET=your_secret_key_here
# OPENAI_API_KEY=your_openai_key (optional, for chatbot)
```

**Quick .env setup** (edit with nano or any editor):
```bash
nano .env
```

**Minimal required configuration**:
```env
NODE_ENV=development
PORT=5001
MONGODB_URI=mongodb://localhost:27017/edulink-ug
JWT_SECRET=mysecretkey123changethisinproduction
CLIENT_URL=http://localhost:5173
```

**Start backend**:
```bash
npm run dev
```

✅ Backend running at: **http://localhost:5001**

### Step 3: Setup Frontend

Open a **new terminal window**:

```bash
cd frontend

# Install dependencies
npm install

# Create environment file
cp .env.example .env

# Edit .env (or use defaults)
```

**Quick .env setup**:
```env
VITE_API_URL=http://localhost:5001
VITE_SOCKET_URL=http://localhost:5001
```

**Start frontend**:
```bash
npm run dev
```

✅ Frontend running at: **http://localhost:5173**

### Step 4: Verify MongoDB

In another terminal:

```bash
# Check if MongoDB is running
pgrep -x mongod

# If not running, start it:
# On Linux:
sudo systemctl start mongod

# On macOS:
brew services start mongodb-community

# On Windows:
net start MongoDB
```

### Step 5: Access the Application

Open your browser and go to:
- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:5001
- **Health Check**: http://localhost:5001/api/health

---

## 🎯 First Steps After Installation

### 1. Create Test Accounts

**Register a Student**:
- Go to http://localhost:5173
- Click "Sign Up"
- Fill in the form (use any school name)
- Click "Create Account"

**Register a Teacher**:
- Click "Sign Up" again
- Fill in the form
- **Important**: Set role to "teacher"
- Click "Create Account"

### 2. Test the Features

**As a Student**:
1. ✅ Post a question
2. ✅ Browse questions
3. ✅ Answer a question
4. ✅ Chat with EduBot (if API key configured)
5. ✅ Join a study session

**As a Teacher**:
1. ✅ Create a study session
2. ✅ Verify student answers
3. ✅ Moderate content

### 3. Test the API

```bash
# Health check
curl http://localhost:5001/api/health

# Get all questions
curl http://localhost:5001/api/questions

# Login (save the token)
curl -X POST http://localhost:5001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"your@email.com","password":"your_password"}'
```

---

## 🐛 Common Issues & Solutions

### Issue 1: "Cannot connect to MongoDB"

**Solution**:
```bash
# Check if MongoDB is running
pgrep -x mongod

# Start MongoDB if not running
sudo systemctl start mongod  # Linux
brew services start mongodb-community  # macOS
```

### Issue 2: "Port 5001 already in use"

**Solution**:
```bash
# Find and kill the process
lsof -ti:5001 | xargs kill -9

# Or change port in backend/.env
PORT=5002
```

### Issue 3: "npm install fails"

**Solution**:
```bash
# Clear npm cache
npm cache clean --force

# Delete node_modules and try again
rm -rf node_modules package-lock.json
npm install
```

### Issue 4: "Module not found" errors

**Solution**:
```bash
# Make sure you're in the correct directory
pwd

# Re-install dependencies
npm install
```

### Issue 5: Frontend won't connect to backend

**Solution**:
```bash
# Check frontend/.env
cat frontend/.env

# Should show:
VITE_API_URL=http://localhost:5001

# Restart frontend
npm run dev
```

---

## 📚 Next Steps

After getting it running:

1. **Read the Documentation**:
   - `README.md` - Complete guide
   - `docs/USER_GUIDE.md` - How to use features
   - `docs/API_TESTING.md` - API endpoints

2. **Explore the Code**:
   - `backend/` - API implementation
   - `frontend/src/` - React components
   - `docs/ARCHITECTURE.md` - System design

3. **Run Tests** (when implemented):
   ```bash
   cd backend && npm test
   cd frontend && npm test
   ```

4. **Deploy** (when ready):
   - See `docs/DEPLOYMENT.md` for instructions

---

## 🆘 Need Help?

- 📖 **Full Documentation**: See `README.md`
- 🔧 **API Testing**: See `docs/API_TESTING.md`
- 🏗️ **Architecture**: See `docs/ARCHITECTURE.md`
- 💬 **Issues**: [GitHub Issues](https://github.com/PLP-MERN-Stack-Development/mern-final-project-RockieRaheem/issues)

---

## ✅ Checklist

Before starting development, make sure:

- [ ] MongoDB is running
- [ ] Backend server started (port 5001)
- [ ] Frontend dev server started (port 5173)
- [ ] Can access frontend in browser
- [ ] API health check returns success
- [ ] Can register a user
- [ ] Can login successfully
- [ ] Can post a question

---

**You're all set! Happy coding!** 🎉

*For God and My Country* 🇺🇬
