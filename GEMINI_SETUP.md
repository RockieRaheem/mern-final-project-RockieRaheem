# Google Gemini AI Chatbot Setup

The EduLink chatbot now uses **Google Gemini 1.5 Flash** (FREE) instead of OpenAI.

## Quick Setup (2 minutes)

### 1. Get Your FREE Gemini API Key

1. Visit: https://aistudio.google.com/app/apikey
2. Click "Get API Key"
3. Click "Create API Key"
4. Copy your API key

### 2. Add to Your .env File

Open `/backend/.env` and add:

```bash
GEMINI_API_KEY=your_actual_api_key_here
```

### 3. Restart Backend Server

```bash
cd backend
npm start
```

## Features

✅ **FREE** - No credit card required
✅ **Fast** - Gemini 1.5 Flash is optimized for speed
✅ **Smart** - Trained for Ugandan O-Level and A-Level curriculum
✅ **Helpful** - Explains Biology, Chemistry, Physics, Math, and more
✅ **Fallback** - Works with simple responses if API key not configured

## Test the Chatbot

1. Log in to EduLink
2. Click the chatbot button (bottom right)
3. Ask: "How do I solve quadratic equations?"
4. Ask: "Explain photosynthesis"
5. Ask: "What are Newton's laws?"

## Chatbot Capabilities

- **Subject Help**: Biology, Chemistry, Physics, Mathematics, English, History, Geography, Economics
- **Step-by-Step Solutions**: Math problems explained clearly
- **Ugandan Curriculum**: Aligned with O-Level and A-Level syllabus
- **Platform Guidance**: Help with using EduLink features
- **Conversational**: Natural, friendly AI tutor

## Troubleshooting

**Chatbot gives simple responses?**

- Check if `GEMINI_API_KEY` is set in `.env`
- Restart the backend server
- API key must be valid and active

**Rate limiting?**

- Gemini Flash has generous free tier
- 15 requests per minute, 1500 per day
- More than enough for student use

**Need more quota?**

- Free tier is usually sufficient
- Can upgrade if needed at https://ai.google.dev/pricing

## API Key Security

⚠️ **NEVER commit your API key to GitHub!**

The `.env` file is in `.gitignore` to protect your key.

---

**For God and My Country 🇺🇬**
