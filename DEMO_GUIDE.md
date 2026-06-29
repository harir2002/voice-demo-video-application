# Voice Demo Studio - Demo Recording Guide

A complete guide to recording professional demos using Voice Demo Studio.

---

## 🎬 Quick Start for Demo Recording

### Step 1: Prepare Your Conversation

Create a `conversation.json` file:

```json
{
  "version": "1.0",
  "title": "Your Product Demo",
  "subtitle": "Key Features Showcase",
  "brand": {
    "name": "Your Company",
    "color": "#0066FF"
  },
  "segments": [
    {
      "id": "seg-1",
      "speaker": "customer",
      "audioFile": "./audio/customer-intro.mp3",
      "transcript": "Hi, can I get help with my loan application?",
      "duration": 3.5,
      "emotion": "neutral",
      "delayAfter": 0.3
    },
    {
      "id": "seg-2",
      "speaker": "ai",
      "audioFile": "./audio/ai-greeting.mp3",
      "transcript": "Absolutely! I'm here to help you through the application process.",
      "duration": 4.2,
      "features": [
        {
          "label": "Natural Language",
          "type": "feature",
          "timing": "immediate"
        }
      ],
      "emotion": "helpful",
      "delayAfter": 0.4
    }
  ],
  "summaryCard": {
    "title": "Application Submitted",
    "fields": [
      { "label": "Applicant", "value": "Jane Doe" },
      { "label": "Amount", "value": "$50,000" }
    ],
    "journey": [
      "Greeting",
      "Information Gathering",
      "Eligibility Check",
      "Application",
      "Submission"
    ],
    "description": "Application successfully submitted for review. Expected response within 24 hours.",
    "actionLabel": "Continue"
  }
}
```

### Step 2: Load into Voice Demo Studio

1. Open Voice Demo Studio (http://localhost:3000)
2. Click "Upload Conversation"
3. Select your conversation.json file
4. Verify playback works correctly

### Step 3: Record Screen

1. Open OBS Studio or similar tool
2. Create new scene
3. Add browser window as source (Voice Demo Studio)
4. Set recording resolution to 16:9 (1920x1080 or 1280x720)
5. Start recording
6. Click Play in the app
7. Let demo play through to completion
8. Stop recording

### Step 4: Edit & Publish

- Trim silence
- Add intro/branding
- Add text overlays if needed
- Export to MP4 or WebM

---

## 📊 Demo Scenarios

### Scenario 1: Loan Eligibility Demo

**Goal**: Showcase quick eligibility check

**Conversation Flow**:
1. Customer asks about home loan eligibility
2. AI asks for basic information
3. AI verifies data (show "Real-time Processing")
4. AI provides eligibility result (show "Complex Decision Making")
5. AI offers next steps (show "Human Handoff Ready")

**Feature Markers**:
```json
{
  "segments": [
    {
      "speaker": "ai",
      "features": [
        { "label": "Language Support", "type": "language" },
        { "label": "Multi-turn Conversation", "type": "feature" }
      ]
    }
  ]
}
```

### Scenario 2: Customer Service Demo

**Goal**: Show interruption handling and context switching

**Conversation Flow**:
1. Customer starts with one query
2. Customer interrupts with follow-up
3. AI handles interruption smoothly
4. AI maintains context from both queries
5. AI resolves both issues

**Feature Markers**:
```json
{
  "segments": [
    {
      "speaker": "customer",
      "transcript": "...",
      "delayAfter": 0.3
    },
    {
      "speaker": "ai",
      "features": [
        { "label": "Interruption Handling", "type": "interrupt" },
        { "label": "Context Window", "type": "context-window" }
      ]
    }
  ]
}
```

### Scenario 3: Multilingual Demo

**Goal**: Show language understanding and mixing

**Conversation Flow**:
1. Customer speaks Hindi
2. AI responds in Hindi with English terms
3. Customer switches to English
4. AI seamlessly continues
5. AI maintains context across languages

**Feature Markers**:
```json
{
  "segments": [
    {
      "speaker": "customer",
      "transcript": "Namaste, mujhe ghar ke liye loan chahiye.",
      "features": [
        { "label": "Hindi Understanding", "type": "accent" }
      ]
    },
    {
      "speaker": "ai",
      "transcript": "Swagat hai! Home loan eligibility ke liye...",
      "features": [
        { "label": "Hindi Response", "type": "accent" },
        { "label": "Language Mixing", "type": "language" }
      ]
    }
  ]
}
```

---

## 🎯 Best Practices for Demo Recording

### Audio Quality
- ✅ Use high-quality microphone for customer voice
- ✅ Use generated/synthesized AI voice (Sarvam, etc.)
- ✅ Normalize audio levels before recording
- ✅ Minimize background noise
- ✅ Test audio file playback in browser first

### Conversation Design
- ✅ Keep demo short (2-3 minutes max)
- ✅ Focus on 1-2 key capabilities
- ✅ Make dialogue natural and conversational
- ✅ Include error/edge case handling if relevant
- ✅ End with clear call-to-action in summary

### Feature Markers
- ✅ Use max 3-4 feature markers per demo
- ✅ Place markers at key capability moments
- ✅ Use descriptive, simple labels
- ✅ Match feature type to actual capability
- ✅ Don't mark every segment (less is more)

### Visual Settings
- ✅ Use minimal-light theme (white background)
- ✅ Set recording mode to true
- ✅ Use desktop resolution (16:9)
- ✅ Test text readability before recording
- ✅ Use consistent brand colors

### Timing
- ✅ Leave 2-3 second gap between segments
- ✅ Use delayAfter for natural pacing
- ✅ Match delay to emotional beat
- ✅ End with 1-2 seconds of silence for summary

---

## 🎨 Feature Marker Strategy

### When to Use Each Type

**feature** (Blue) - General capabilities
- Use for: Natural language, intelligent routing, FAQ handling
- Example: "Understands Customer Intent"

**milestone** (Green) - Success moments
- Use for: Eligibility confirmed, application accepted
- Example: "Eligibility Confirmed"

**interrupt** (Red) - Handling complexity
- Use for: Customer interruption, topic change
- Example: "Handles Interruption"

**language** (Purple) - Language capabilities
- Use for: Language switching, mixing, translation
- Example: "Multilingual Support"

**response-time** (Blue) - Speed/efficiency
- Use for: Quick resolution, processing speed
- Example: "Real-time Processing"

**context** (Orange) - Context management
- Use for: Remembering info, multi-turn coherence
- Example: "Maintains Context"

**handoff** (Amber) - Human escalation
- Use for: Ready for agent, handoff point
- Example: "Human Handoff Ready"

---

## 📝 Example: Complete Godrej Demo

See `conversations/godrej-finance-demo.json` for a full working example with:
- 9 segments total
- Hindi + English mixing
- Multiple feature markers
- Enterprise summary card
- Proper timing and delays

**Key Features Showcased**:
1. Language Support (Hindi)
2. Multi-turn Navigation
3. Real-time Processing
4. Context Window Retention
5. Complex Decision Making
6. FAQ Handling
7. Human Handoff

---

## 🔧 Customization Examples

### Adding Custom Fields to Summary

```json
"summaryCard": {
  "title": "Demo Complete",
  "fields": [
    { "label": "Customer Name", "value": "Rajesh Kumar" },
    { "label": "Loan Amount", "value": "₹50,00,000" },
    { "label": "Status", "value": "Pre-Approved" },
    { "label": "Next Step", "value": "Document Submission" }
  ]
}
```

### Adding Breadcrumb Journey

```json
"summaryCard": {
  "journey": [
    "Welcome",
    "Greeting",
    "Information Capture",
    "Verification",
    "Eligibility Check",
    "Results",
    "Application",
    "Summary"
  ]
}
```

### Adding Escalation Reason

```json
"summaryCard": {
  "escalationReason": "Customer requested premium loan options"
}
```

### Timing Multiple Feature Markers

```json
"segments": [
  {
    "speaker": "ai",
    "features": [
      {
        "label": "Hindi Support",
        "type": "language",
        "timing": "immediate"
      },
      {
        "label": "Real-time Processing",
        "type": "response-time",
        "timing": "immediate"
      }
    ]
  }
]
```

---

## 📱 Recording at Different Resolutions

### 1080p (1920x1080) - Recommended
- Highest quality
- Large text readability
- Best for YouTube/presentations
- Larger file size

### 720p (1280x720) - Balanced
- Good quality
- Smaller file size
- Fast to upload
- Still readable

### 480p (854x480) - Mobile/Web
- Smallest file size
- Fast loading
- Good for mobile viewing
- Smallest text

**Recommendation**: Use 1280x720 (720p) as sweet spot for quality/size ratio

---

## 🎬 Recording Checklist

Before you hit record:

- [ ] Conversation JSON is valid and complete
- [ ] Audio files exist at specified paths
- [ ] Audio plays correctly in browser
- [ ] All text is readable in app
- [ ] Feature markers appear at right times
- [ ] Summary card displays correctly
- [ ] Recording resolution is set to 16:9
- [ ] Screen brightness is comfortable
- [ ] No system notifications enabled
- [ ] Backup audio files saved
- [ ] Test recording shows good audio sync

---

## 🐛 Troubleshooting Demo Recording

**Problem**: Audio not heard in recording

*Solutions*:
- Check audio file paths are correct
- Test audio plays in browser first
- Verify recording tool captured audio
- Use browser's system audio, not app audio

**Problem**: Text is too small/hard to read

*Solutions*:
- Record at 1920x1080 or higher
- Use larger browser zoom (120-150%)
- Test readability before recording full demo
- Consider using transcripts overlaid

**Problem**: Timing feels off

*Solutions*:
- Adjust `delayAfter` values in JSON
- Add pauses to audio files
- Edit segments in post-production
- Test full playback before recording

**Problem**: Feature markers not showing

*Solutions*:
- Verify features array is valid JSON
- Check timing is "immediate" or has valid timestamp
- Verify feature type matches supported types
- Check browser console for errors

---

## 💡 Pro Tips

1. **Record Multiple Takes**: Best demo often comes on 2nd or 3rd attempt
2. **Use White Theme**: Better contrast for screen recording
3. **Pre-warm Audio**: Play audio files before recording to ensure loading
4. **Close Other Apps**: Reduces chance of notifications
5. **Record in Quiet Room**: Better audio quality for any voiceover
6. **Use Descriptive Titles**: Makes editing and organization easier
7. **Save JSON Versions**: Keep backup of each demo config
8. **Test Before Full Record**: Do 10-second test first

---

## 🎯 Target Demo Length

- **Executive Brief**: 1-2 minutes
- **Product Feature**: 2-3 minutes
- **Case Study**: 3-5 minutes
- **Full Walkthrough**: 5-10 minutes

**Recommendation**: Keep demos under 3 minutes for best engagement

---

## 📊 Demo ROI

A well-produced demo can be used for:
- ✅ Sales presentations
- ✅ Website homepage video
- ✅ Product documentation
- ✅ Investor pitches
- ✅ Conference presentations
- ✅ Training material
- ✅ Social media content

---

## 🚀 Next Steps

1. Create your first conversation.json
2. Record a test demo (5 minutes max)
3. Review and refine based on feedback
4. Create variations for different audiences
5. Build library of demo videos

---

## 📞 Support

For issues or questions about recording:
1. Check the troubleshooting section above
2. Review example demos in `conversations/` folder
3. Check browser console for technical errors
4. Test with sample Godrej demo to understand flow

---

**Last Updated**: June 29, 2026  
**Version**: 2.0  
**Status**: Ready for Production Use ✅

Good luck with your demos! 🎬
