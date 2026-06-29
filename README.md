# Voice Demo Studio - Multi-Segment Conversation Player

A production-quality single-page application for demo-mode conversational AI playback. Load any conversation configuration file and play customer and AI voice segments sequentially with a premium minimal voice-assistant UI optimized for screen recording.

## Features

- **Multi-Segment Playback**: Play multiple audio files sequentially without merging
- **Speaker Identification**: Customer, AI, and Agent roles with visual badges
- **Progressive Transcripts**: Display text in real-time during playback
- **Feature Markers**: Optional floating chips highlighting AI capabilities
- **Summary Cards**: End-of-call handoff information display
- **Universal Format**: Works with any conversation JSON configuration
- **Premium UI**: Minimal, elegant design optimized for screen recording
- **Enterprise Ready**: Clean layout, professional styling, responsive design

## Supported Features

### Feature Markers
- Multiturn Navigation
- Interruption Handling
- Context Switching (Languages & Queries)
- Indian Accents Support
- Response Time Display
- Predefined FAQs
- Context Window
- Human Handoff

## Quick Start

### Prerequisites

- Node.js 16+
- npm 7+

### Installation

```bash
# Install frontend dependencies
cd frontend
npm install

# Install backend dependencies (optional)
cd ../backend
npm install
```

### Configuration

1. **Frontend Setup**

```bash
cd frontend
npm start
```

App opens on `http://localhost:3000`

2. **Backend Setup (Optional for transcription)**

```bash
cd backend
cp .env.example .env
# Edit .env and add OpenAI API key if needed
npm start
```

Backend runs on `http://localhost:3001`

## Conversation JSON Format

### Basic Structure

```json
{
  "version": "1.0",
  "title": "Conversation Title",
  "subtitle": "Optional subtitle",
  "brand": {
    "name": "Brand Name",
    "color": "#0066FF"
  },
  "segments": [
    {
      "id": "seg-1",
      "speaker": "customer",
      "audioFile": "path/to/audio.mp3",
      "transcript": "Customer message",
      "duration": 4.5,
      "timestamps": [
        { "time": 0.0, "text": "word1" }
      ],
      "features": [
        {
          "marker": "response-time",
          "label": "Quick Response"
        }
      ],
      "delayAfter": 0.5
    },
    {
      "id": "seg-2",
      "speaker": "ai",
      "audioFile": "path/to/ai-response.mp3",
      "transcript": "AI response",
      "duration": 3.2,
      "delayAfter": 0.3
    }
  ],
  "summaryCard": {
    "customerName": "John Smith",
    "language": "English",
    "primaryQuery": "Account Balance",
    "secondaryQuery": "Fund Transfer",
    "escalationReason": "None",
    "contextCaptured": "Customer inquired about balance",
    "breadcrumb": ["Auth", "Check", "Complete"],
    "metrics": {
      "totalDuration": "12.5s",
      "turnCount": 2,
      "sentiment": "Positive"
    }
  },
  "settings": {
    "autoPlay": true,
    "showTranscript": true,
    "showFeatures": true,
    "recordingMode": true,
    "theme": "minimal-light"
  }
}
```

### Field Descriptions

#### Segment Object

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | string | Yes | Unique segment identifier |
| `speaker` | string | Yes | "customer", "ai", or "agent" |
| `audioFile` | string | Yes | Path or URL to audio file |
| `transcript` | string | Yes | Display text for segment |
| `duration` | number | No | Duration in seconds |
| `timestamps` | array | No | Word-level timing for progressive reveal |
| `features` | array | No | Feature markers for this segment |
| `delayAfter` | number | No | Delay before next segment (seconds) |
| `emotion` | string | No | Speaker emotion indicator |

#### Feature Markers

```json
{
  "marker": "multiturn-navigational|interruption|context-switching|indian-accents|response-time|faq-handling|context-window|human-handoff",
  "label": "Display label",
  "description": "Optional tooltip",
  "icon": "Optional emoji/icon"
}
```

## Sample Conversations

### Generic Banking Demo

Located in `/conversations/generic-demo.json`
- 6 segments (customer and AI turns)
- Balance check and fund transfer flow
- Feature markers and summary card included

### Godrej Finance Demo

Located in `/conversations/godrej-finance-demo.json`
- 9 segments with Hindi/English mix
- Loan eligibility inquiry workflow
- Enterprise banking terminology
- Indian accent support marker
- Complete handoff summary

## Usage

### Load Conversation

1. Click "Load Conversation" button in header
2. Select a JSON file from `/conversations/` folder
3. Or enter a URL to a hosted JSON file

### Playback Controls

- **Play/Pause**: Center button to control playback
- **Skip**: Rewind/forward 5 seconds
- **Seek**: Click progress bar to jump to any point
- **Segment Tabs**: Click numbered tabs to jump to specific segments
- **Restart**: Restart the entire conversation
- **Load New**: Load a different conversation

### Display Elements

- **Speaker Badge**: Shows current speaker role
- **Transcript Area**: Displays current segment text
- **Feature Chips**: Floating badges showing AI capabilities
- **Emotion Indicator**: Speaker emotion (neutral, happy, urgent, etc.)
- **Summary Card**: End-of-call information (appears at completion)

## Project Structure

```
voice-demo-studio/
├── frontend/
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── App.js                          # Main component
│   │   ├── components/
│   │   │   ├── ConversationLoader.js       # JSON loader
│   │   │   ├── ConversationPlayer.js       # Playback engine
│   │   │   ├── Orb.js                      # Animated visualization
│   │   │   ├── FeatureMarker.js            # Capability indicators
│   │   │   └── SummaryCard.js              # End summary
│   │   ├── styles/
│   │   │   ├── App.css                     # Main layout
│   │   │   ├── ConversationLoader.css
│   │   │   ├── ConversationPlayer.css
│   │   │   └── (component styles)
│   │   ├── utils/
│   │   │   └── conversationManager.js      # JSON utilities
│   │   ├── config.js
│   │   ├── index.js
│   │   └── index.css                       # Global styles
│   ├── package.json
│   └── README.md
├── backend/
│   ├── src/
│   │   ├── server.js
│   │   ├── routes/
│   │   │   └── transcribe.js               # Transcription endpoint
│   │   ├── middleware/
│   │   │   ├── upload.js
│   │   │   └── errorHandler.js
│   │   └── utils/
│   │       └── transcription.js
│   ├── .env.example
│   ├── package.json
│   └── README.md
├── conversations/
│   ├── generic-demo.json
│   ├── godrej-finance-demo.json
│   ├── audio/                              # Add your audio files here
│   └── godrej/                             # Godrej demo audio files
└── README.md
```

## Creating Custom Conversations

### Step 1: Prepare Audio Files

Create MP3/WAV files for each segment:
- Customer voice (record yourself or use text-to-speech)
- AI responses (generate using Sarvam AI, OpenAI TTS, or similar)

### Step 2: Get Transcripts

Write out exact transcripts for each audio segment.

### Step 3: Add Timestamps (Optional)

For progressive text reveal, add word-level timestamps:

```json
{
  "timestamps": [
    { "time": 0.0, "text": "Hello" },
    { "time": 0.5, "text": "How" },
    { "time": 0.8, "text": "can" },
    { "time": 1.0, "text": "I" },
    { "time": 1.2, "text": "help?" }
  ]
}
```

### Step 4: Add Feature Markers (Optional)

Highlight AI capabilities at specific segments:

```json
{
  "features": [
    {
      "marker": "response-time",
      "label": "Quick Response",
      "description": "Responded in under 1 second"
    },
    {
      "marker": "context-switching",
      "label": "Language Switch",
      "description": "Switched to Hindi context"
    }
  ]
}
```

### Step 5: Add Summary Card (Optional)

Display end-of-call information:

```json
{
  "summaryCard": {
    "customerName": "Your Customer",
    "language": "English",
    "primaryQuery": "Main question asked",
    "secondaryQuery": "Follow-up question",
    "escalationReason": "None",
    "contextCaptured": "Summary of what was discussed",
    "breadcrumb": ["Step 1", "Step 2", "Step 3", "Completed"],
    "metrics": {
      "totalDuration": "45.3s",
      "turnCount": 6,
      "sentiment": "Positive"
    }
  }
}
```

### Step 6: Save as JSON

Save your conversation as `/conversations/my-conversation.json`

### Step 7: Load and Test

1. Click "Load Conversation"
2. Select your new JSON file
3. Test playback and transitions

## Audio File Paths

### Local Development

Use relative paths:
```json
{
  "audioFile": "./audio/customer-1.mp3"
}
```

Files should exist at: `/conversations/audio/customer-1.mp3`

### Production Hosting

Use absolute URLs:
```json
{
  "audioFile": "https://your-cdn.com/audio/customer-1.mp3"
}
```

Host on:
- AWS S3 + CloudFront
- Cloudflare
- GitHub raw content
- Any CDN or static hosting

## Deployment

### Frontend

```bash
cd frontend
npm run build
```

Deploy `build/` folder to:
- **Vercel**: `vercel deploy`
- **Netlify**: Drag and drop `build/` folder
- **AWS S3**: `aws s3 sync build/ s3://bucket-name`
- Any static hosting service

### Backend (Optional)

For transcription service:

```bash
cd backend
# Set environment variables
PORT=3001
OPENAI_API_KEY=your-api-key
NODE_ENV=production

npm start
```

Deploy to:
- Heroku
- AWS Lambda
- Railway
- Render
- Any Node.js hosting

## Use Cases

### Banking & Finance
- Loan eligibility inquiries
- Account management
- Fund transfers
- Bill payments

### Insurance
- Claim status
- Policy details
- Renewal processes

### Telecom
- Billing inquiries
- Plan changes
- Technical support

### E-commerce
- Order tracking
- Returns and refunds
- Product recommendations

### Healthcare
- Appointment booking
- Prescription refills
- Consultation inquiries

### Travel
- Booking management
- Cancellations
- Customer support

## API Endpoints (Backend)

### POST /api/transcribe

Upload and transcribe an audio file (optional backend feature).

**Request:**
```bash
curl -X POST http://localhost:3001/api/transcribe \
  -F "audio=@audio.mp3"
```

**Response:**
```json
{
  "success": true,
  "transcript": "Transcribed text",
  "segments": [...],
  "duration": 45.2,
  "language": "en"
}
```

### GET /api/transcribe/languages

Get list of supported languages for transcription.

### GET /health

Health check endpoint.

## Environment Variables

### Backend (.env)

```
OPENAI_API_KEY=sk-your-api-key
PORT=3001
NODE_ENV=development
MAX_FILE_SIZE=25000000
UPLOAD_TEMP_DIR=./tmp
ALLOWED_AUDIO_TYPES=mp3,wav,m4a,ogg,webm
CORS_ORIGIN=http://localhost:3000
LOG_LEVEL=info
```

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Accessibility

- ARIA labels on all interactive elements
- Keyboard navigation support
- Color contrast compliance
- Reduced motion support
- Screen reader friendly

## Performance

- CSS animations at 60fps
- Lazy-loaded components
- Optimized re-renders
- Code splitting support
- Small bundle size

## Security

- API keys in environment variables
- File type and size validation
- CORS protection
- Input validation
- Temporary file cleanup

## Troubleshooting

### Audio doesn't play

1. Check audio file paths in JSON
2. Verify files are accessible (not 404)
3. Try using absolute URLs to test
4. Check browser console (F12) for errors

### Conversation doesn't load

1. Verify JSON structure matches schema
2. Check required fields are present
3. Validate JSON syntax (use online JSON validator)
4. Check browser console for error messages

### UI doesn't display correctly

1. Clear browser cache
2. Verify CSS variables are defined
3. Check browser version is supported
4. Try different browser

### Segments don't transition

1. Verify `delayAfter` values are correct
2. Check audio files exist and are valid
3. Review browser console for errors

## Development

### Available Scripts

```bash
# Frontend development
cd frontend
npm start              # Start dev server with hot reload
npm run build         # Build for production
npm test              # Run tests

# Backend development
cd backend
npm start             # Start server
npm run dev           # Start with auto-reload
npm test              # Run tests
npm run lint          # Lint code
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

MIT

## Support

For issues, questions, or suggestions:
1. Check existing documentation
2. Review sample conversations
3. Check browser console for errors
4. Verify file paths and JSON structure

## Resources

- **Sample Conversations**: `/conversations/` folder
- **Component Documentation**: Comments in component files
- **JSON Schema**: Complete field reference in this README
- **Example Audio Structure**: Use provided samples as template

## Technology Stack

- **Frontend**: React 18, CSS3, HTML5
- **Backend**: Express.js, Node.js, Multer
- **Transcription**: OpenAI Whisper API (optional)
- **Hosting**: Static hosting (frontend), Any Node.js host (backend)

## Roadmap

- [x] Multi-segment conversation playback
- [x] Speaker identification
- [x] Feature markers
- [x] Summary cards
- [x] Progressive transcript rendering
- [ ] Real-time microphone input
- [ ] Advanced analytics
- [ ] User library/storage
- [ ] Custom themes
- [ ] Batch processing

## Changelog

### v1.0.0
- Initial release
- Multi-segment conversation playback
- JSON configuration format
- Feature markers support
- Summary card display
- Responsive design
- Enterprise UI

---

**Built for enterprise AI voice demos. Universal. Minimal. Professional.**

For the latest updates and documentation, visit the GitHub repository.
