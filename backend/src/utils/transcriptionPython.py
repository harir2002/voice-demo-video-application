#!/usr/bin/env python3
"""
Audio Transcription Service
Converts MP3/WAV audio files to text using Sarvam AI or OpenAI Whisper API
"""

import sys
import json
import os
from pathlib import Path

# Try to use Sarvam AI first, fall back to OpenAI Whisper
try:
    import sarvam
    SARVAM_AVAILABLE = True
except ImportError:
    SARVAM_AVAILABLE = False

try:
    import openai
    OPENAI_AVAILABLE = True
except ImportError:
    OPENAI_AVAILABLE = False

try:
    from pydub import AudioSegment
    PYDUB_AVAILABLE = True
except ImportError:
    PYDUB_AVAILABLE = False


def transcribe_with_sarvam(audio_path: str, api_key: str) -> dict:
    """
    Transcribe audio using Sarvam AI API
    Supports: MP3, WAV, M4A, OGG, WEBM
    """
    if not SARVAM_AVAILABLE:
        raise Exception("Sarvam SDK not installed. Install with: pip install sarvam-ai")
    
    if not api_key:
        raise Exception("SARVAM_API_KEY not set in environment")
    
    try:
        # Initialize Sarvam client
        client = sarvam.Client(api_key=api_key)
        
        # Open audio file
        with open(audio_path, 'rb') as audio_file:
            # Call Sarvam transcription API
            response = client.transcribe(
                audio=audio_file,
                language="en"  # Supports: en, hi, ta, te, ml, kn
            )
        
        return {
            "success": True,
            "transcript": response.get("transcript", ""),
            "language": response.get("language", "en"),
            "confidence": response.get("confidence"),
            "duration": response.get("duration")
        }
    
    except Exception as e:
        return {
            "success": False,
            "error": f"Sarvam transcription failed: {str(e)}"
        }


def transcribe_with_openai(audio_path: str, api_key: str) -> dict:
    """
    Transcribe audio using OpenAI Whisper API
    Supports: MP3, MP4, MPEG, MPGA, M4A, WAV, WEBM
    Max file size: 25MB
    """
    if not OPENAI_AVAILABLE:
        raise Exception("OpenAI SDK not installed. Install with: pip install openai")
    
    if not api_key:
        raise Exception("OPENAI_API_KEY not set in environment")
    
    try:
        # Initialize OpenAI client
        openai.api_key = api_key
        
        # Open audio file
        with open(audio_path, 'rb') as audio_file:
            # Call OpenAI Whisper API
            transcript = openai.Audio.transcribe(
                model="whisper-1",
                file=audio_file,
                language="en"
            )
        
        return {
            "success": True,
            "transcript": transcript.get("text", ""),
            "language": "en",
            "duration": None
        }
    
    except Exception as e:
        return {
            "success": False,
            "error": f"OpenAI transcription failed: {str(e)}"
        }


def convert_audio_format(input_path: str, output_path: str, output_format: str = "mp3") -> bool:
    """
    Convert audio between formats using pydub
    Supported: mp3, wav, m4a, ogg, webm
    """
    if not PYDUB_AVAILABLE:
        print("Warning: pydub not available. Install with: pip install pydub")
        return False
    
    try:
        audio = AudioSegment.from_file(input_path)
        audio.export(output_path, format=output_format)
        return True
    except Exception as e:
        print(f"Audio conversion failed: {str(e)}")
        return False


def main():
    """
    Main function - called from Node.js backend
    Arguments: audio_path api_key [service]
    service: 'sarvam' or 'openai' (default: sarvam, fallback: openai)
    """
    if len(sys.argv) < 3:
        print(json.dumps({
            "success": False,
            "error": "Missing arguments: audio_path api_key [service]"
        }))
        sys.exit(1)
    
    audio_path = sys.argv[1]
    api_key = sys.argv[2]
    service = sys.argv[3] if len(sys.argv) > 3 else "sarvam"
    
    # Validate audio file exists
    if not Path(audio_path).exists():
        print(json.dumps({
            "success": False,
            "error": f"Audio file not found: {audio_path}"
        }))
        sys.exit(1)
    
    # Try requested service, fall back if not available
    result = None
    
    if service == "sarvam":
        if SARVAM_AVAILABLE:
            result = transcribe_with_sarvam(audio_path, api_key)
        elif OPENAI_AVAILABLE:
            print(f"Warning: Sarvam not available, falling back to OpenAI", file=sys.stderr)
            result = transcribe_with_openai(audio_path, api_key)
        else:
            result = {
                "success": False,
                "error": "No transcription service available. Install: pip install sarvam-ai openai"
            }
    
    elif service == "openai":
        if OPENAI_AVAILABLE:
            result = transcribe_with_openai(audio_path, api_key)
        elif SARVAM_AVAILABLE:
            print(f"Warning: OpenAI not available, falling back to Sarvam", file=sys.stderr)
            result = transcribe_with_sarvam(audio_path, api_key)
        else:
            result = {
                "success": False,
                "error": "No transcription service available. Install: pip install openai sarvam-ai"
            }
    
    else:
        result = {
            "success": False,
            "error": f"Unknown service: {service}. Use 'sarvam' or 'openai'"
        }
    
    # Output result as JSON
    print(json.dumps(result))


if __name__ == "__main__":
    main()
