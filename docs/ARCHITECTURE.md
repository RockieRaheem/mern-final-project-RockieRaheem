# 🏗️ EduLink UG - Technical Architecture

## System Overview

EduLink UG is a MERN (MongoDB, Express.js, React, Node.js) full-stack web application designed to facilitate peer learning among Ugandan secondary school students.

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                         CLIENT LAYER                            │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │          React 19 + Vite + Tailwind CSS                  │  │
│  │  ┌────────────┐  ┌────────────┐  ┌──────────────────┐   │  │
│  │  │  Pages     │  │ Components │  │  Context/Hooks   │   │  │
│  │  └────────────┘  └────────────┘  └──────────────────┘   │  │
│  │         │              │                   │              │  │
│  │         └──────────────┴───────────────────┘              │  │
│  │                        │                                   │  │
│  │                  ┌──────────┐                              │  │
│  │                  │   Axios  │                              │  │
│  │                  └──────────┘                              │  │
│  └─────────────────────┬────────────────────────────────────┘  │
└────────────────────────┼───────────────────────────────────────┘
                         │ HTTPS/WSS
┌────────────────────────┼───────────────────────────────────────┐
│                        ▼         SERVER LAYER                   │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │            Node.js + Express.js API Server               │  │
│  │  ┌────────────┐  ┌────────────┐  ┌──────────────────┐   │  │
│  │  │  Routes    │─>│ Controllers│─>│   Services       │   │  │
│  │  └────────────┘  └────────────┘  └──────────────────┘   │  │
│  │         │                                  │              │  │
│  │  ┌──────▼──────┐                    ┌─────▼──────┐      │  │
│  │  │ Middleware  │                    │   Models   │      │  │
│  │  │ - Auth      │                    │ (Mongoose) │      │  │
│  │  │ - Validate  │                    └────────────┘      │  │
│  │  │ - Security  │                                         │  │
│  │  └─────────────┘                                         │  │
│  │                                                           │  │
│  │  ┌──────────────┐        ┌──────────────────────┐       │  │
│  │  │  Socket.IO   │        │   OpenAI API         │       │  │
│  │  │  (Real-time) │        │   (AI Chatbot)       │       │  │
│  │  └──────────────┘        └──────────────────────┘       │  │
│  └──────────────────────────────────────────────────────────┘  │
└────────────────────────┬───────────────────────────────────────┘
                         │
┌────────────────────────┼───────────────────────────────────────┐
│                        ▼      DATABASE LAYER                    │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │                   MongoDB Database                       │  │
│  │  ┌──────┐  ┌──────┐  ┌──────┐  ┌──────┐  ┌──────┐     │  │
│  │  │Users │  │Quest.│  │Answ. │  │Sess. │  │Rept. │     │  │
│  │  └──────┘  └──────┘  └──────┘  └──────┘  └──────┘     │  │
│  └──────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
```

## Technology Stack

### Frontend

- **Framework**: React 19.1.1
- **Build Tool**: Vite 7.1.7
- **Styling**: Tailwind CSS 3.4.1
- **Routing**: React Router DOM 7.9.4
- **HTTP Client**: Axios 1.13.0
- **Real-time**: Socket.io-client 4.8.1
- **Language**: JavaScript (ES6+)

### Backend

- **Runtime**: Node.js (v22+)
- **Framework**: Express.js 4.18.2
- **Database ODM**: Mongoose 8.0.3
- **Authentication**: JWT (jsonwebtoken 9.0.2) + bcryptjs 2.4.3
- **Real-time**: Socket.IO 4.6.1
- **File Upload**: Multer 1.4.5
- **Security**: Helmet 7.1.0, CORS 2.8.5
- **Rate Limiting**: express-rate-limit 7.1.5
- **Validation**: express-validator 7.0.1
- **AI Integration**: OpenAI API 4.24.1
- **Logging**: Morgan 1.10.0

### Database

- **Primary DB**: MongoDB 7.0.25
- **Hosting**: Local/MongoDB Atlas

### DevOps & Tools

- **Version Control**: Git & GitHub
- **Package Manager**: npm
- **Development**: nodemon 3.0.2
- **Environment Variables**: dotenv 16.3.1

## System Components

### 1. Frontend Architecture

#### Component Structure

```
src/
├── components/          # Reusable UI components
│   ├── common/         # Buttons, Cards, Modals
│   ├── layout/         # Header, Footer, Sidebar
│   └── features/       # Feature-specific components
├── pages/              # Route-based page components
│   ├── Home.jsx
│   ├── Questions.jsx
│   ├── Sessions.jsx
│   └── Profile.jsx
├── contexts/           # React Context API
│   ├── AuthContext.jsx
│   └── ThemeContext.jsx
├── hooks/              # Custom React hooks
│   ├── useAuth.js
│   └── useAPI.js
├── services/           # API communication
│   └── api.js
└── utils/              # Helper functions
    └── validators.js
```

#### State Management

- **Local State**: React useState for component-level state
- **Global State**: Context API for authentication and theme
- **Server State**: Direct API calls with Axios (no Redux needed)

#### Routing Strategy

- Client-side routing with React Router
- Protected routes with authentication guard
- Lazy loading for code splitting

### 2. Backend Architecture

#### Layered Architecture Pattern

**Routes Layer** → **Controllers Layer** → **Services Layer** → **Models Layer**

```
server/
├── config/             # Configuration files
│   └── db.js          # Database connection
├── models/            # Mongoose schemas
│   ├── User.js
│   ├── Question.js
│   ├── Answer.js
│   ├── Session.js
│   ├── Report.js
│   └── Chat.js
├── controllers/       # Request handlers
│   ├── authController.js
│   ├── questionController.js
│   ├── answerController.js
│   └── sessionController.js
├── routes/           # API routes
│   ├── auth.js
│   ├── questions.js
│   ├── answers.js
│   └── sessions.js
├── middleware/       # Custom middleware
│   ├── auth.js       # JWT verification
│   ├── validate.js   # Input validation
│   └── errorHandler.js
├── utils/            # Helper functions
│   ├── logger.js
│   └── email.js
└── server.js         # Application entry point
```

#### API Design Principles

- RESTful API architecture
- Consistent error handling
- Input validation on all endpoints
- JWT-based authentication
- Role-based authorization

### 3. Database Architecture

#### MongoDB Collections

- **users** - User accounts and profiles
- **questions** - Posted questions
- **answers** - Answers to questions
- **sessions** - Live study sessions
- **reports** - Content/user reports
- **chats** - AI chatbot conversations

#### Data Relationships

- One-to-Many: User → Questions, User → Answers
- Many-to-One: Answers → Question
- Many-to-Many: Users ↔ Sessions (participants)

See [DATABASE_SCHEMA.md](./DATABASE_SCHEMA.md) for detailed schema information.

## Security Architecture

### Authentication Flow

```
1. User logs in → Credentials sent to /api/auth/login
2. Server validates → Checks email/password
3. JWT issued → Token with user ID, role, expiration
4. Client stores token → localStorage/sessionStorage
5. Subsequent requests → Token in Authorization header
6. Server verifies → Middleware checks JWT validity
```

### Security Measures

1. **Password Security**: bcrypt hashing (10 rounds)
2. **JWT Tokens**: 7-day expiration, signed with secret
3. **HTTPS**: All production traffic encrypted
4. **CORS**: Configured for specific origins
5. **Helmet**: Security headers (XSS, CSP, etc.)
6. **Rate Limiting**: Prevent brute force attacks
7. **Input Sanitization**: Mongoose validation + express-validator
8. **Content Filtering**: Inappropriate content detection
9. **File Upload Security**: Type/size validation with Multer

## Real-time Features

### Socket.IO Implementation

- **Connection**: Authenticated users only
- **Events**:
  - `join-session`: Join live study session
  - `leave-session`: Leave session
  - `new-message`: Chat messages
  - `new-answer`: Real-time answer notifications
  - `question-update`: Question status changes

### Use Cases

1. Live study sessions with video/chat
2. Real-time Q&A notifications
3. Instant messaging between students
4. Live session participant updates

## AI Integration

### OpenAI Chatbot (EduBot)

- **Purpose**: 24/7 educational assistant
- **Model**: GPT-3.5/4-turbo
- **Capabilities**:
  - Answer educational questions
  - Explain concepts in simple terms
  - Provide study tips
  - Subject-specific help (Math, Science, etc.)
- **Safety**: Content filtering, age-appropriate responses
- **Logging**: All conversations logged for monitoring

## API Structure

### Base URL

```
Development: http://localhost:5001
Production: https://api.edulink-ug.com
```

### Endpoints Summary

| Endpoint                  | Method | Description          | Auth Required |
| ------------------------- | ------ | -------------------- | ------------- |
| `/api/auth/register`      | POST   | Register new user    | No            |
| `/api/auth/login`         | POST   | User login           | No            |
| `/api/auth/me`            | GET    | Get current user     | Yes           |
| `/api/questions`          | GET    | List questions       | No            |
| `/api/questions`          | POST   | Create question      | Yes           |
| `/api/questions/:id`      | GET    | Get question details | No            |
| `/api/answers`            | POST   | Submit answer        | Yes           |
| `/api/answers/:id/verify` | PUT    | Verify answer        | Yes (Teacher) |
| `/api/sessions`           | GET    | List sessions        | Yes           |
| `/api/sessions`           | POST   | Create session       | Yes (Teacher) |
| `/api/reports`            | POST   | Report content/user  | Yes           |
| `/api/chatbot`            | POST   | Chat with AI         | Yes           |

See [API_TESTING.md](./API_TESTING.md) for detailed API documentation.

## Deployment Architecture

### Development Environment

```
Frontend: http://localhost:5173 (Vite dev server)
Backend: http://localhost:5001 (Express server)
Database: localhost:27017 (Local MongoDB)
```

### Production Environment (Planned)

```
Frontend: Vercel/Netlify (Static hosting)
Backend: Render/Railway (Node.js hosting)
Database: MongoDB Atlas (Cloud)
File Storage: AWS S3/Cloudinary (Images)
```

## Performance Optimization

### Frontend Optimizations

- Code splitting with React.lazy()
- Image optimization and lazy loading
- CSS purging with Tailwind
- Vite build optimizations
- Service Workers (PWA)

### Backend Optimizations

- Database indexing on frequently queried fields
- Response compression with gzip
- Caching strategies (Redis planned)
- Connection pooling for MongoDB
- Rate limiting to prevent abuse

### Database Optimizations

- Compound indexes for complex queries
- Pagination for large datasets
- Aggregation pipelines for reports
- TTL indexes for temporary data

## Scalability Considerations

### Horizontal Scaling

- Stateless API design
- Load balancer for multiple backend instances
- MongoDB sharding for data distribution

### Vertical Scaling

- Resource monitoring and optimization
- Database query optimization
- Caching layer (Redis)

## Monitoring & Logging

### Application Monitoring

- **Logging**: Morgan for HTTP requests, Winston for errors
- **Error Tracking**: Sentry (planned)
- **Performance**: New Relic/DataDog (planned)
- **Uptime**: UptimeRobot/Pingdom

### Database Monitoring

- MongoDB Atlas monitoring dashboard
- Query performance insights
- Storage usage tracking

## Development Workflow

### Git Workflow

```
main (production)
  ├── develop (staging)
      ├── feature/question-system
      ├── feature/live-sessions
      └── bugfix/auth-issues
```

### CI/CD Pipeline (Planned)

1. Push to GitHub
2. GitHub Actions trigger
3. Run tests (unit, integration)
4. Build frontend & backend
5. Deploy to staging
6. Manual approval
7. Deploy to production

## Future Enhancements

### Planned Features

1. Mobile application (React Native)
2. Progressive Web App (PWA)
3. Video call integration (WebRTC)
4. Advanced analytics dashboard
5. Gamification system
6. Parent/guardian portal
7. SMS notifications (Africa's Talking)
8. Offline mode support

### Technical Improvements

1. Microservices architecture
2. GraphQL API
3. Redis caching layer
4. Elasticsearch for search
5. CDN for static assets
6. Automated testing (Jest, Cypress)
7. Docker containerization
8. Kubernetes orchestration

## Compliance & Standards

### Educational Standards

- Aligned with Ugandan curriculum
- UNEB examination standards
- Safe learning environment

### Data Protection

- GDPR compliance considerations
- User data encryption
- Privacy policy implementation
- Parental consent for minors

### Accessibility

- WCAG 2.1 AA standards
- Screen reader compatibility
- Keyboard navigation
- Color contrast compliance

## Support & Maintenance

### Documentation

- API documentation (Swagger/Postman)
- User guides
- Developer documentation
- Deployment guides

### Support Channels

- In-app help center
- Email support
- Community forums
- Teacher helpdesk

## Contributing

See [CONTRIBUTING.md](../CONTRIBUTING.md) for development guidelines and coding standards.

## License

This project is licensed under the MIT License - see [LICENSE](../LICENSE) file for details.

---

**Last Updated**: November 2025  
**Version**: 1.0.0  
**Maintained by**: EduLink UG Development Team
