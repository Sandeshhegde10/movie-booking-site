# 🎬 Movie Quiz Setup Guide

## Quick Start

The quiz feature **works out of the box** with generic questions! 🎉

However, for **AI-powered personalized questions**, you'll need to configure an OpenAI API key.

---

## Option 1: Use Without API Key (Generic Quiz) ✅

**No setup required!** Just run the application:

```bash
npm run dev
```

Navigate to http://localhost:3000/quiz and start playing. The quiz will use generic questions about the movie's genre and characteristics.

---

## Option 2: Enable AI-Generated Questions (Recommended) 🤖

For personalized, movie-specific trivia questions, follow these steps:

### Step 1: Get Your OpenAI API Key

1. Go to [OpenAI API Keys](https://platform.openai.com/api-keys)
2. Sign up or log in
3. Click **"Create new secret key"**
4. Copy the key (starts with `sk-proj-...`)

### Step 2: Add API Key to .env File

1. Open the `.env` file in the project root
2. Update the `OPENAI_API_KEY` line:

```env
DATABASE_URL="file:./dev.db"
OPENAI_API_KEY=sk-proj-your-actual-key-here
```

⚠️ **Important**: Replace `sk-proj-your-actual-key-here` with your **actual** OpenAI API key.

### Step 3: Restart the Development Server

```bash
# Stop the server (Ctrl+C if running)
# Then start again
npm run dev
```

### Step 4: Test AI Quiz Generation

1. Open http://localhost:3000/quiz
2. Click on any movie
3. AI will generate 5 unique, movie-specific trivia questions! 🎯

---

## Cost Information 💰

- **Model used**: `gpt-4o-mini` (very cost-effective)
- **Approximate cost**: $0.001-0.002 per quiz
- **~500-1000 quizzes for $1**
- Perfect for development and moderate usage

---

## How It Works 🔧

The quiz system has **intelligent fallback**:

1. **First**, it tries to generate questions using OpenAI's AI
2. **If API is unavailable** (no key or API error), it automatically falls back to generic questions
3. **Users are notified** with a yellow banner when using fallback mode
4. **No crashes** - the quiz always works!

---

## Troubleshooting 🛠️

### "Using generic quiz questions" message appears

✅ **This is normal!** It means:
- Your OpenAI API key is not configured, OR
- There was a temporary issue with the OpenAI API

**To fix**: Add your API key to `.env` and restart the server.

### "Failed to generate quiz" error

**Possible causes:**
1. **Invalid API key** - Check that your key is correct in `.env`
2. **No API credits** - Verify you have credits in your OpenAI account
3. **Network issues** - Check your internet connection
4. **Rate limiting** - You may have hit OpenAI's rate limits

**Solution**: Check the browser console (F12) for detailed error messages.

### No movies showing

**Solution**: Run the database seed command:

```bash
npx prisma db seed
```

This will populate the database with 30+ movies from Bollywood & Hollywood.

---

## Features ✨

✅ **Intelligent fallback system** - Quiz always works, with or without API key  
✅ **AI-powered questions** - Personalized trivia when API is configured  
✅ **30+ seeded movies** - Bollywood & Hollywood classics  
✅ **Real-time feedback** - Instant answer validation  
✅ **Beautiful UI** - Glassmorphic design with smooth animations  
✅ **Responsive** - Works on all devices  

---

## Development Tips 💡

### View Console Logs

Open browser console (F12 → Console) to see detailed logs:
- `[Quiz] Requesting quiz for: ...` - Quiz request started
- `[Quiz] Response status: 200` - API responded successfully
- `[Quiz API] OpenAI API key not configured...` - Fallback mode active
- `[Quiz API] Successfully generated X questions` - AI generation succeeded

### Test Both Modes

1. **Test with API key**: Add key to `.env`, restart server
2. **Test without API key**: Remove key from `.env`, restart server
3. Both should work seamlessly!

### Customize Fallback Questions

Edit `app/api/quiz/route.ts` → `generateFallbackQuiz()` function to customize generic questions.

---

## Need Help? 🆘

1. **Check the console** - Most issues show detailed error messages in browser console
2. **Verify .env file** - Make sure the API key is on the correct line
3. **Restart server** - Always restart after changing `.env`
4. **Check OpenAI dashboard** - Verify your API key is active and has credits

---

## Summary

🟢 **No API Key**: Quiz works with generic questions  
🔵 **With API Key**: AI generates personalized, movie-specific questions  
🟡 **API Fails**: Automatically falls back to generic questions  

**The quiz feature is fully functional in all scenarios!** 🎉
