# EduLink UG API Testing Guide

Base URL: `http://localhost:5001`

## Test the Server

### 1. Health Check

```bash
curl http://localhost:5001/api/health
```

### 2. Welcome Message

```bash
curl http://localhost:5001/
```

## Authentication Tests

### 3. Register a Student

```bash
curl -X POST http://localhost:5001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Grace Nakato",
    "email": "grace@example.com",
    "password": "password123",
    "school": "St. Mary's Secondary School",
    "district": "Kampala",
    "subjects": ["Biology", "Chemistry"],
    "educationLevel": "O-Level"
  }'
```

### 4. Register a Teacher

```bash
curl -X POST http://localhost:5001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Mr. Atwine Samuel",
    "email": "atwine@example.com",
    "password": "password123",
    "role": "teacher",
    "school": "Kampala High School",
    "district": "Kampala",
    "subjects": ["Physics", "Mathematics"],
    "educationLevel": "A-Level"
  }'
```

### 5. Login

```bash
curl -X POST http://localhost:5001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "grace@example.com",
    "password": "password123"
  }'
```

**Save the token from the response for authenticated requests!**

### 6. Get Current User Profile

```bash
curl -X GET http://localhost:5001/api/auth/me \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

## Question Tests

### 7. Get All Questions

```bash
curl http://localhost:5001/api/questions
```

### 8. Create a Question

```bash
curl -X POST http://localhost:5001/api/questions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "title": "How to solve quadratic equations?",
    "body": "I am struggling with understanding the quadratic formula. Can someone explain step by step?",
    "subject": "Mathematics",
    "educationLevel": "O-Level",
    "topic": "Algebra"
  }'
```

### 9. Get Questions by Subject

```bash
curl "http://localhost:5001/api/questions?subject=Mathematics"
```

### 10. Get Single Question

```bash
curl http://localhost:5001/api/questions/QUESTION_ID_HERE
```

### 11. Upvote a Question

```bash
curl -X PUT http://localhost:5001/api/questions/QUESTION_ID_HERE/upvote \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

## Answer Tests

### 12. Submit an Answer

```bash
curl -X POST http://localhost:5001/api/answers \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "question": "QUESTION_ID_HERE",
    "body": "The quadratic formula is x = [-b ± √(b²-4ac)] / 2a. Here is how to use it: Step 1: Identify a, b, and c from your equation ax²+bx+c=0..."
  }'
```

### 13. Get Answers for a Question

```bash
curl http://localhost:5001/api/answers/question/QUESTION_ID_HERE
```

### 14. Vote on Answer (Teacher/Student)

```bash
curl -X PUT http://localhost:5001/api/answers/ANSWER_ID_HERE/vote \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "vote": "upvote"
  }'
```

### 15. Verify Answer (Teacher Only)

```bash
curl -X PUT http://localhost:5001/api/answers/ANSWER_ID_HERE/verify \
  -H "Authorization: Bearer TEACHER_TOKEN_HERE"
```

## Session Tests

### 16. Create a Live Study Session

```bash
curl -X POST http://localhost:5001/api/sessions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "title": "Physics A-Level: Projectile Motion",
    "description": "Live discussion on solving projectile motion problems",
    "subject": "Physics",
    "educationLevel": "A-Level",
    "type": "teacher-led",
    "startTime": "2025-10-28T10:00:00.000Z",
    "duration": 60
  }'
```

### 17. Get All Sessions

```bash
curl http://localhost:5001/api/sessions
```

### 18. Join a Session

```bash
curl -X PUT http://localhost:5001/api/sessions/SESSION_ID_HERE/join \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

## Chatbot Tests

### 19. Chat with EduBot

```bash
curl -X POST http://localhost:5001/api/chatbot \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "message": "How do I solve quadratic equations?",
    "context": {
      "subject": "Mathematics",
      "topic": "Algebra"
    }
  }'
```

### 20. Get Chat History

```bash
curl http://localhost:5001/api/chatbot/history \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

## Report Tests

### 21. Submit a Report

```bash
curl -X POST http://localhost:5001/api/reports \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "reportedContent": {
      "contentType": "answer",
      "contentId": "ANSWER_ID_HERE"
    },
    "type": "inappropriate-content",
    "description": "This answer contains inappropriate language",
    "priority": "medium"
  }'
```

### 22. Get All Reports (Admin/Teacher)

```bash
curl http://localhost:5001/api/reports \
  -H "Authorization: Bearer TEACHER_OR_ADMIN_TOKEN"
```

## Filter & Search Tests

### 23. Search Questions

```bash
curl "http://localhost:5001/api/questions?search=quadratic&subject=Mathematics"
```

### 24. Get Questions by Education Level

```bash
curl "http://localhost:5001/api/questions?educationLevel=O-Level"
```

### 25. Get Sessions by Subject

```bash
curl "http://localhost:5001/api/sessions?subject=Physics&type=teacher-led"
```

## Tips

1. **Save your token**: After login/register, save the token and use it in the `Authorization: Bearer TOKEN` header
2. **Replace IDs**: Replace `QUESTION_ID_HERE`, `ANSWER_ID_HERE`, etc. with actual IDs from responses
3. **Pretty print JSON**: Pipe responses through `| python3 -m json.tool` for formatted output
4. **Use Postman**: Import these as Postman requests for easier testing

## Quick Complete Test Flow

```bash
# 1. Register
TOKEN=$(curl -s -X POST http://localhost:5001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com","password":"pass123","school":"Test School","district":"Kampala","subjects":["Mathematics"],"educationLevel":"O-Level"}' | grep -o '"token":"[^"]*' | cut -d'"' -f4)

# 2. Create Question
QUESTION_ID=$(curl -s -X POST http://localhost:5001/api/questions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"title":"Test Question","body":"Test body","subject":"Mathematics","educationLevel":"O-Level"}' | grep -o '"_id":"[^"]*' | cut -d'"' -f4)

# 3. Answer Question
curl -X POST http://localhost:5001/api/answers \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d "{\"question\":\"$QUESTION_ID\",\"body\":\"This is my answer\"}"

# 4. Chat with Bot
curl -X POST http://localhost:5001/api/chatbot \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"message":"Hello EduBot!","context":{"subject":"Mathematics"}}'

echo "Tests completed! Token: $TOKEN, Question ID: $QUESTION_ID"
```
