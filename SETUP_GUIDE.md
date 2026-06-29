# Voice Demo Studio - Setup & Configuration Guide

## Quick Start

### 1. Install Dependencies

```bash
# Frontend
cd frontend
npm install

# Backend (optional - for transcription)
cd ../backend
npm install
```

### 2. Run the Application

```bash
# From frontend directory
npm start
```

The app will open on `http://localhost:3000`

---

## Audio Upload & Transcription Setup

### Option A: Using OpenAI Whisper (Recommended - Easiest)

1. **Get API Key**: https://platform.openai.com/api-keys

2. **Configure Backend**:
   ```bash
   cd backend
   cp .env.example .env
   ```

3. **Edit `.env`**:
   ```
   OPENAI_API_KEY=sk-your-key-here
   PORT=3001
   ```

4. **Start Backend**:
   ```bash
   npm start
   ```

5. **Upload Audio**: 
   - Go to frontend (`http://localhost:3000`)
   - Click "Upload Audio"
   - Select MP3/WAV file
   - Transcription happens automatically

---

### Option B: Using Sarvam AI (For Hindi Support)

Perfect for Indian language support and better regional accents.

1. **Get API Key**: https://sarvam.ai/

2. **Install Python Dependencies**:
   ```bash
   pip install sarvam-ai
   # Or for Sarvam + OpenAI fallback
   pip install sarvam-ai openai
   ```

3. **Configure Backend `.env`**:
   ```
   SARVAM_API_KEY=your-sarvam-key
   OPENAI_API_KEY=sk-your-openai-key  # Optional fallback
   PORT=3001
   ```

4. **Start Backend**:
   ```bash
   npm start
   ```

---

### Option C: Local Transcription (No API Cost)

Using Whisper locally via Python.

1. **Install Dependencies**:
   ```bash
   # Install Python Whisper
   pip install openai-whisper
   
   # Optional: FFmpeg (for audio conversion)
   # On Windows: choco install ffmpeg
   # On Mac: brew install ffmpeg
   # On Linux: sudo apt-get install ffmpeg
   ```

2. **Download Model** (one-time, ~3GB):
   ```bash
   whisper --model large --task transcribe sample.mp3
   ```

3. **No API key needed** - it runs locally!

---

## Color Customization

Your brand colors:
- Primary: `#000000` (Black)
- Secondary: `#e7000b` (Red)
- Text: `#1a1a1a` (Dark)
- Loading: `#e7000b` (Red)

### How to Apply Colors

Edit `frontend/src/styles/App.css` - Change the `:root` variables:

```css
:root {
  /* Change these to your colors */
  --color-primary: #000000;           /* Black */
  --color-accent: #e7000b;            /* Red */
  --color-text: #1a1a1a;              /* Dark text */
  --color-primary-dark: #1a1a1a;      /* Darker shade */
  --color-primary-light: #330006;     /* Lighter shade */
  
  /* Gradients automatically update */
  --gradient-primary: linear-gradient(135deg, #000000, #1a1a1a);
  --gradient-accent: linear-gradient(135deg, #e7000b, #cc000a);
}
```

That's it! All colors throughout the app update automatically.

### What Gets Customized

- Buttons and CTAs
- Links and highlights
- Orb animation
- Loading state
- Feature marker chips
- Summary card accents
- All UI elements

---

## Audio File Handling

### Supported Formats

- MP3 (recommended)
- WAV
- M4A
- OGG
- WEBM
- MPEG

### File Size Limits

- **OpenAI**: 25MB per file
- **Sarvam**: Check documentation
- **Local Whisper**: No practical limit

### Audio File Paths in JSON

**For Development** (local files):
```json
{
  "audioFile": "./audio/customer-1.mp3"
}
```

Place files in: `conversations/audio/customer-1.mp3`

**For Production** (hosted files):
```json
{
  "audioFile": "https://your-cdn.com/audio/customer-1.mp3"
}
```

---

## Python Transcription Service

Located at: `backend/src/utils/transcriptionPython.py`

### What It Does

- Converts audio to text
- Supports Sarvam AI and OpenAI Whisper
- Automatic fallback between services
- Returns word-level timestamps (if available)

### Supported Services

**Sarvam AI** (Better for Indian languages):
```bash
python backend/src/utils/transcriptionPython.py audio.mp3 YOUR_API_KEY sarvam
```

**OpenAI Whisper**:
```bash
python backend/src/utils/transcriptionPython.py audio.mp3 YOUR_API_KEY openai
```

### Output Format

```json
{
  "success": true,
  "transcript": "Full transcribed text",
  "language": "en",
  "duration": 45.2,
  "confidence": 0.95
}
```

---

## File Structure

```
Voice Video Demo/
├── frontend/
│   ├── src/
│   │   ├── App.js                    ← Main app
│   │   ├── components/
│   │   │   ├── Orb.js                ← Animated orb
│   │   │   ├── ConversationPlayer.js ← Audio playback
│   │   │   └── ...
│   │   └── styles/
│   │       ├── App.css               ← COLOR CUSTOMIZATION HERE
│   │       └── ...
│   └── package.json
│
├── backend/
│   ├── src/
│   │   ├── utils/
│   │   │   ├── transcription.js      ← Main transcription logic
│   │   │   └── transcriptionPython.py ← Python service
│   │   ├── routes/
│   │   │   └── transcribe.js         ← API endpoint
│   │   └── server.js
│   ├── .env                          ← API keys here
│   └── package.json
│
├── conversations/
│   ├── generic-demo.json
│   ├── godrej-finance-demo.json
│   └── audio/                        ← Add your audio files here
│
└── README.md
```

---

## API Endpoints

### POST /api/transcribe

Upload an audio file and get transcription.

**Request**:
```bash
curl -X POST http://localhost:3001/api/transcribe \
  -F "audio=@your-audio.mp3" \
  -F "language=en"
```

**Response**:
```json
{
  "success": true,
  "transcript": "Transcribed text here",
  "segments": [
    {
      "text": "word or phrase",
      "start": 0.0,
      "end": 1.5,
      "confidence": 0.95
    }
  ],
  "duration": 45.2,
  "language": "en",
  "provider": "openai"
}
```

### GET /api/transcribe/languages

Get supported languages.

---

## Troubleshooting

### Port 3000 Already in Use

```bash
# Use different port
PORT=3001 npm start
```

### Python Transcription Not Working

```bash
# Make sure Python 3 is installed
python --version

# Install required packages
pip install openai-whisper
# Or
pip install sarvam-ai

# Test Python script
python backend/src/utils/transcriptionPython.py audio.mp3 your-api-key openai
```

### No Audio Playing

1. Check browser console (F12) for errors
2. Verify audio file path in JSON
3. Check CORS settings if using external URLs
4. Try with absolute URLs to test

### Transcription Fails

- Check API key in `.env`
- Verify audio file format (MP3 recommended)
- Check file size (should be < 25MB)
- Look at terminal logs for errors

### Colors Not Updating

1. Clear browser cache (Ctrl+Shift+Delete)
2. Restart npm server (`npm start`)
3. Check CSS variable syntax in App.css
4. Verify no duplicate variable declarations

---

## Environment Variables

### Backend (.env)

```
# Transcription Services
OPENAI_API_KEY=sk-your-openai-key
SARVAM_API_KEY=your-sarvam-key

# Server
PORT=3001
NODE_ENV=development

# File Upload
MAX_FILE_SIZE=25000000           # 25MB in bytes
UPLOAD_TEMP_DIR=./tmp
ALLOWED_AUDIO_TYPES=mp3,wav,m4a,ogg,webm

# CORS
CORS_ORIGIN=http://localhost:3000

# Logging
LOG_LEVEL=info
```

---

## Deployment

### Frontend (Static Hosting)

```bash
cd frontend
npm run build
```

Deploy the `build/` folder to:
- Vercel
- Netlify
- AWS S3 + CloudFront
- GitHub Pages
- Any static host

### Backend (Node.js Hosting)

Deploy to:
- Heroku
- Railway
- Render
- AWS EC2
- DigitalOcean

Set environment variables on hosting platform.

---

## Performance Tips

1. **Audio Files**: Use MP3 format (smaller than WAV)
2. **CDN**: Host audio on CDN for faster delivery
3. **Caching**: Backend caches transcriptions
4. **Lazy Load**: Components load on demand

---

## Support

For issues:
1. Check browser console (`F12`)
2. Check backend logs
3. Verify `.env` configuration
4. Check file paths and formats

---

**Last Updated**: June 29, 2026
**Version**: 1.0.0

