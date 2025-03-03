import os
import speech_recognition as sr
import tempfile
from pydub import AudioSegment
from typing import Dict, Any, List
import math

class Transcriber:
    def __init__(self):
        self.recognizer = sr.Recognizer()
        # Adjust recognition settings for better accuracy
        self.recognizer.energy_threshold = 300
        self.recognizer.dynamic_energy_threshold = True
        self.recognizer.pause_threshold = 0.8
        
    def extract_audio(self, video_path: str) -> str:
        """Extract audio from video file"""
        temp_dir = tempfile.mkdtemp()
        temp_path = os.path.join(temp_dir, "audio.wav")
        try:
            # Load video file and export audio
            audio = AudioSegment.from_file(video_path)
            # Normalize audio and convert to WAV for better recognition
            normalized_audio = audio.normalize()
            normalized_audio = normalized_audio.set_channels(1)  # Convert to mono
            normalized_audio = normalized_audio.set_frame_rate(16000)  # Set sample rate to 16kHz
            normalized_audio.export(temp_path, format="wav")
            return temp_path, temp_dir
        except Exception as e:
            if os.path.exists(temp_dir):
                try:
                    os.remove(temp_path)
                    os.rmdir(temp_dir)
                except:
                    pass
            raise Exception(f"Failed to extract audio: {str(e)}")

    def transcribe_audio_segment(self, audio_segment: AudioSegment, attempt: int = 0) -> str:
        """Transcribe a segment of audio with retry logic"""
        temp_dir = tempfile.mkdtemp()
        temp_path = os.path.join(temp_dir, "segment.wav")
        try:
            # Export the segment to the temporary file
            audio_segment.export(temp_path, format="wav")
            
            # Use the recognizer on this segment
            with sr.AudioFile(temp_path) as source:
                # Adjust the duration based on segment length
                audio = self.recognizer.record(source)
            
            # Try to recognize the speech
            text = self.recognizer.recognize_google(audio, language="en-US")
            return text.strip() if text else None
        except sr.UnknownValueError:
            # If no speech is detected and we haven't retried yet, try with adjusted settings
            if attempt < 1:
                # Adjust audio segment and retry
                adjusted_segment = audio_segment.apply_gain(10)  # Increase volume
                return self.transcribe_audio_segment(adjusted_segment, attempt + 1)
            return None
        except Exception as e:
            print(f"Error transcribing segment: {str(e)}")
            return None
        finally:
            try:
                if os.path.exists(temp_path):
                    os.remove(temp_path)
                if os.path.exists(temp_dir):
                    os.rmdir(temp_dir)
            except Exception as e:
                print(f"Warning: Could not clean up temporary files: {str(e)}")

    def transcribe(self, video_path: str) -> Dict[str, Any]:
        """Transcribe video and return text with timestamps"""
        audio_path = None
        temp_dir = None
        try:
            # Extract audio from video
            audio_path, temp_dir = self.extract_audio(video_path)
            
            # Load the audio file
            audio = AudioSegment.from_file(audio_path)
            
            # Calculate optimal segment duration based on audio length
            total_duration = len(audio)
            # Use smaller segments for shorter videos, larger for longer ones
            segment_duration = min(max(5000, total_duration // 20), 15000)  # Between 5 and 15 seconds
            overlap = min(segment_duration // 5, 2000)  # 20% overlap, max 2 seconds
            
            segments = []
            full_text = []
            
            # Process each segment
            current_position = 0
            while current_position < total_duration:
                # Calculate segment boundaries
                end_position = min(current_position + segment_duration, total_duration)
                
                # Extract segment with fade in/out to reduce noise at boundaries
                audio_segment = audio[current_position:end_position]
                if len(audio_segment) > 100:  # Only process if segment is long enough
                    audio_segment = audio_segment.fade_in(50).fade_out(50)
                    
                    # Try to transcribe the segment
                    text = self.transcribe_audio_segment(audio_segment)
                    if text:
                        segment = {
                            "start": current_position / 1000.0,  # Convert to seconds
                            "end": end_position / 1000.0,
                            "text": text
                        }
                        segments.append(segment)
                        full_text.append(text)
                
                # Move to next segment, accounting for overlap
                current_position += (segment_duration - overlap)
                
                # Ensure we don't get stuck
                if current_position >= end_position:
                    current_position = end_position
            
            if not segments:
                raise Exception("No speech detected in the video")
            
            # Merge very short segments that are close together
            merged_segments = []
            current_segment = None
            
            for segment in segments:
                if not current_segment:
                    current_segment = segment
                else:
                    # If segments are close together (less than 1 second gap) and short, merge them
                    time_gap = segment["start"] - current_segment["end"]
                    if time_gap < 1.0 and len(current_segment["text"]) < 50:
                        current_segment["end"] = segment["end"]
                        current_segment["text"] += " " + segment["text"]
                    else:
                        merged_segments.append(current_segment)
                        current_segment = segment
            
            if current_segment:
                merged_segments.append(current_segment)
            
            return {
                "text": " ".join(full_text),
                "segments": merged_segments,
                "language": "en"
            }
            
        except Exception as e:
            raise Exception(f"Transcription failed: {str(e)}")
        finally:
            # Clean up audio file and temporary directory
            try:
                if audio_path and os.path.exists(audio_path):
                    os.remove(audio_path)
                if temp_dir and os.path.exists(temp_dir):
                    os.rmdir(temp_dir)
            except Exception as e:
                print(f"Warning: Could not clean up temporary files: {str(e)}")

# Create a singleton instance
transcriber = Transcriber() 