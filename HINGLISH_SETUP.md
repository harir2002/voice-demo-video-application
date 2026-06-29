# Hinglish (Hindi + English) Audio Support Setup

## 🎯 Best Option for Hinglish: **Sarvam AI**

Sarvam AI is specifically designed for Indian languages and code-mixing scenarios like Hinglish.

---

## ⚡ Quick Setup (5 minutes)

### Step 1: Get Sarvam API Key

1. Visit: https://sarvam.ai/
2. Sign up for free account
3. Get your API key from dashboard
4. Copy the key

### Step 2: Update `.env` File

Edit `backend/.env`:

```env
# === SARVAM AI (For Hinglish) ===
SARVAM_API_KEY=your-sarvam-api-key-here
TRANSCRIPTION_SERVICE=sarvam

# === Fallback (OpenAI for English only) ===
OPENAI_API_KEY=sk-your-openai-key-here

PORT=3001
```

### Step 3: Install Python Dependencies

```bash
# Install Sarvam SDK
pip install sarvam-ai

# Optional: Also install OpenAI as fallback
pip install openai
```

### Step 4: Start Backend

```bash
cd backend
npm start
```

You should see:
```
🔥 Server running on port 3001
✅ Sarvam AI service configured
```

---

## 🎤 Why Sarvam AI for Hinglish?

| Feature | Sarvam AI | OpenAI Whisper |
|---------|-----------|----------------|
| **Hinglish Support** | ✅ Excellent | ⚠️ Limited |
| **Hindi Detection** | ✅ Native | ❌ Basic |
| **Code-Mixing** | ✅ Optimized | ⚠️ Works but not ideal |
| **Indian Accents** | ✅ Great | ⚠️ Okay |
| **Languages** | ✅ 12+ Indian languages | ❌ Limited |
| **Speed** | ✅ Fast | ✅ Fast |
| **Cost** | ✅ Affordable | ⚠️ Higher |

---

## 📝 Supported Languages in Sarvam

Sarvam AI supports:
- **Hindi (hi)** - Native support
- **English (en)** - Native support
- **Tamil (ta)**
- **Telugu (te)**
- **Marathi (mr)**
- **Kannada (kn)**
- **Malayalam (ml)**
- **Gujarati (gu)**
- **Bengali (bn)**
- **Punjabi (pa)**
- **Urdu (ur)**
- **Odia (or)**

---

## 🔄 How Hinglish Transcription Works

When you upload a Hinglish audio file:

```
┌─────────────────┐
│ Your Hinglish   │
│ Audio File      │
│ (MP3/WAV)       │
└────────┬────────┘
         │
         ▼
┌─────────────────────────────┐
│ Sarvam AI Transcription     │
│                             │
│ Detects:                    │
│ • Hindi words               │
│ • English words             │
│ • Code-switching points     │
│ • Accents & tone            │
└────────┬────────────────────┘
         │
         ▼
┌─────────────────────────────┐
│ Output Transcript:          │
│                             │
│ "Namaste, main aapke       │
│  account ka balance check   │
│  kar dunga. One moment      │
│  please."                   │
└────────┬────────────────────┘
         │
         ▼
┌─────────────────┐
│ Display in App  │
│ With Segments   │
└─────────────────┘
```

---

## 🚀 Testing Hinglish Transcription

### Test File Structure

Create `conversations/test-hinglish.json`:

```json
{
  "title": "Hinglish Demo - Loan Eligibility",
  "subtitle": "Customer inquiry in Hindi + English",
  "brand": {
    "name": "Your Bank",
    "color": "#e7000b"
  },
  "segments": [
    {
      "id": "seg-1",
      "speaker": "customer",
      "audioFile": "./audio/hinglish-customer.mp3",
      "transcript": "Namaste, main apne home loan ka eligibility check karna chahta hoon",
      "duration": 5.2,
      "emotion": "neutral",
      "language": "hi-en"
    },
    {
      "id": "seg-2",
      "speaker": "ai",
      "audioFile": "./audio/hinglish-ai.mp3",
      "transcript": "Bilkul! I will help you check your eligibility. Kripaya apna aadhar number batayein",
      "duration": 4.8,
      "emotion": "helpful",
      "language": "hi-en",
      "delayAfter": 0.5
    }
  ]
}
```

### Upload & Test

1. Start the app: `npm start` (frontend)
2. Backend running: `npm start` (in backend folder)
3. Click "Load Conversation" → Select test JSON
4. Click on audio upload button
5. Upload `hinglish-customer.mp3`
6. Sarvam AI transcribes automatically!

---

## 🎯 Example Hinglish Conversations

### Banking Scenario

**Customer**: "Mera account number kya hai aur balance kitna hai?"
- *English: What is my account number and balance?*

**AI**: "Your account number is 1234567890 aur balance ₹50,000 hai."
- *English: And your balance is ₹50,000.*

### E-commerce Scenario

**Customer**: "Mere order ka delivery kab hoga? Tracking number hai kya?"
- *English: When will my order be delivered? Do you have a tracking number?*

**AI**: "Aapka order deliver ho jayega 2 din mein. Tracking number hai: ABC123XYZ."
- *English: Your order will be delivered in 2 days.*

### Insurance Scenario

**Customer**: "Mera policy renew karna hai. Premium ka rate kya hai?"
- *English: I need to renew my policy. What is the premium rate?*

**AI**: "Premium is ₹5,000 per month. Aap online payment kar sakte ho ya branch visit kar sakte ho."
- *English: You can pay online or visit our branch.*

---

## 🔧 Configuration Options

### In backend/.env

```env
# Which service to use
TRANSCRIPTION_SERVICE=sarvam    # Options: sarvam, openai, auto

# Auto = Try Sarvam first, fallback to OpenAI if needed
TRANSCRIPTION_SERVICE=auto

# Language preference (for Hinglish, use 'hi-en' or 'hi')
LANGUAGE=hi
```

### In transcription.js

```javascript
// Sarvam automatically detects code-mixing
// But you can specify preference:
const options = {
  service: 'sarvam',
  language: 'hi',        // Hindi
  detectLanguage: true   // Auto-detect Hindi/English
};
```

---

## 📊 Transcription Response Example

When you upload Hinglish audio, you get:

```json
{
  "success": true,
  "transcript": "Namaste, main aapke account balance check karna chahta hoon. Please wait one second.",
  "segments": [
    {
      "text": "Namaste, main aapke account balance check",
      "start": 0.0,
      "end": 3.2,
      "confidence": 0.97,
      "languages": ["hi", "en"]
    },
    {
      "text": "karna chahta hoon",
      "start": 3.2,
      "end": 4.5,
      "confidence": 0.95,
      "languages": ["hi"]
    },
    {
      "text": "Please wait one second",
      "start": 4.6,
      "end": 6.0,
      "confidence": 0.98,
      "languages": ["en"]
    }
  ],
  "language": "hi-en",
  "detectedLanguages": ["Hindi", "English"],
  "provider": "sarvam",
  "duration": 6.0
}
```

---

## 🐛 Troubleshooting Hinglish

### Issue: Wrong Language Detected

**Solution**: Explicitly set language to Hindi
```env
LANGUAGE=hi
DETECT_LANGUAGE=true
```

### Issue: Code-mixing Not Preserved

**Solution**: Sarvam preserves code-mixing by default. If not working:
- Check audio quality (background noise can confuse detection)
- Try shorter segments
- Ensure speakers switch languages clearly

### Issue: Accent Recognition Failing

**Solution**: 
- Sarvam is trained on Indian accents - should work well
- If failing, check audio volume and clarity
- Try with cleaner recording

### Issue: Falling Back to OpenAI

This happens when:
- Sarvam API rate limit exceeded → Try again in few minutes
- Sarvam API key invalid → Check `.env`
- Network issue → Check internet connection

---

## 🌐 Multi-Language Support

Sarvam supports switching between languages in same conversation:

```json
{
  "segments": [
    {
      "speaker": "ai",
      "transcript": "English greeting",
      "language": "en"
    },
    {
      "speaker": "customer",
      "transcript": "Hindi response",
      "language": "hi"
    },
    {
      "speaker": "ai",
      "transcript": "Hinglish - mix of both",
      "language": "hi-en"
    }
  ]
}
```

---

## 💡 Best Practices for Hinglish

1. **Keep segments short** (3-6 seconds) for better accuracy
2. **Clear audio** - Good microphone reduces errors
3. **Natural speech** - Sarvam handles code-mixing well
4. **Speaker identification** - Mark customer vs AI clearly
5. **Test first** - Upload a sample Hinglish file to test

---

## 📈 Performance Tips

| Tip | Benefit |
|-----|---------|
| **Use MP3 format** | Smaller file size, faster processing |
| **Keep audio clean** | Reduces processing time, better accuracy |
| **Shorter segments** | Faster individual transcription |
| **Batch mode** | Process multiple files at once (future feature) |

---

## 🔗 Resources

- **Sarvam AI Docs**: https://docs.sarvam.ai/
- **Supported Languages**: https://sarvam.ai/languages
- **API Reference**: https://sarvam.ai/api-docs
- **Code Samples**: https://github.com/sarvam-ai/sdk-examples

---

## ✅ Final Checklist

- [ ] Sarvam API key obtained from https://sarvam.ai/
- [ ] SARVAM_API_KEY added to backend/.env
- [ ] Python packages installed: `pip install sarvam-ai`
- [ ] Backend running: `npm start` (in backend folder)
- [ ] Frontend running: `npm start` (in frontend folder)
- [ ] Test file created with Hinglish content
- [ ] Audio uploaded and transcribed successfully

---

## 🎉 You're Ready!

Your Voice Demo Studio now supports Hinglish (Hindi + English) audio transcription!

Upload any Hinglish audio file, and Sarvam AI will:
- Detect code-mixing
- Recognize both Hindi and English words
- Preserve natural speech patterns
- Generate accurate transcripts

**Next Steps**:
1. Record your Hinglish demo audio
2. Upload and test transcription
3. Create your conversation JSON
4. Load and record your demo!

---

**Happy demoing! 🚀**

