from flask import Blueprint, request, jsonify
import os
import logging
import tempfile
import requests
from services.transcriber import transcriber
from services.store import store
from services.cleanup import cleanup_service
from urllib.parse import urlparse

# Configure logging
logger = logging.getLogger('transcriber_routes')

# Create a blueprint for the transcriber routes
transcriber_routes = Blueprint('transcriber_routes', __name__)

def is_valid_url(url: str) -> bool:
    """Check if the URL is valid and from supported platforms"""
    try:
        result = urlparse(url)
        valid = all([result.scheme, result.netloc])
        # Check if URL is from supported platforms
        supported_domains = ['tiktok.com', 'youtube.com', 'youtu.be']
        return valid and any(domain in result.netloc for domain in supported_domains)
    except:
        return False

def download_video(url: str) -> str:
    """Download video from URL and return the path"""
    try:
        # Create temporary directory if it doesn't exist
        temp_dir = os.path.join(os.getcwd(), 'temp')
        os.makedirs(temp_dir, exist_ok=True)
        
        # Create a temporary file for the video
        temp_file = tempfile.NamedTemporaryFile(suffix=".mp4", dir=temp_dir, delete=False)
        
        # Download the video
        response = requests.get(url, stream=True)
        response.raise_for_status()
        
        # Write the video to the temporary file
        for chunk in response.iter_content(chunk_size=8192):
            if chunk:
                temp_file.write(chunk)
        
        temp_file.close()
        return temp_file.name
    except Exception as e:
        if 'temp_file' in locals() and os.path.exists(temp_file.name):
            os.remove(temp_file.name)
        raise Exception(f"Failed to download video: {str(e)}")

@transcriber_routes.route('/transcribe', methods=['POST'])
def transcribe_video():
    if 'video' not in request.files:
        return jsonify({"error": "No video file provided"}), 400
        
    video = request.files['video']
    if video.filename == '':
        return jsonify({"error": "No video file selected"}), 400
        
    try:
        # Create temporary directory if it doesn't exist
        temp_dir = os.path.join(os.getcwd(), 'temp')
        os.makedirs(temp_dir, exist_ok=True)
        
        # Save video file temporarily
        video_path = os.path.join(temp_dir, video.filename)
        video.save(video_path)
        
        # Add notification
        store.add_notification("Starting video transcription...", "info")
        logger.info(f"Starting transcription for video: {video.filename}")
        
        # Transcribe video
        result = transcriber.transcribe(video_path)
        
        # Clean up video file
        cleanup_service.delete_file(video_path)
        
        # Add success notification
        store.add_notification("Video transcription completed successfully", "success")
        logger.info(f"Transcription completed for video: {video.filename}")
        
        return jsonify({
            "message": "Transcription successful",
            "transcription": result
        })
        
    except Exception as e:
        # Clean up video file if it exists
        if 'video_path' in locals() and os.path.exists(video_path):
            cleanup_service.delete_file(video_path)
            
        store.add_notification(f"Transcription failed: {str(e)}", "error")
        logger.error(f"Error transcribing video: {str(e)}")
        return jsonify({"error": str(e)}), 500

@transcriber_routes.route('/transcribe/url', methods=['POST'])
def transcribe_from_url():
    data = request.get_json()
    if not data or 'url' not in data:
        return jsonify({"error": "No URL provided"}), 400
        
    url = data['url']
    if not is_valid_url(url):
        return jsonify({"error": "Invalid or unsupported URL"}), 400
        
    try:
        # Add notification
        store.add_notification("Downloading video from URL...", "info")
        logger.info(f"Starting video download from URL: {url}")
        
        # Download video
        video_path = download_video(url)
        
        # Add notification
        store.add_notification("Starting video transcription...", "info")
        logger.info(f"Starting transcription for video from URL: {url}")
        
        # Transcribe video
        result = transcriber.transcribe(video_path)
        
        # Clean up video file
        cleanup_service.delete_file(video_path)
        
        # Add success notification
        store.add_notification("Video transcription completed successfully", "success")
        logger.info(f"Transcription completed for video from URL: {url}")
        
        return jsonify({
            "message": "Transcription successful",
            "transcription": result
        })
        
    except Exception as e:
        # Clean up video file if it exists
        if 'video_path' in locals() and os.path.exists(video_path):
            cleanup_service.delete_file(video_path)
            
        store.add_notification(f"Transcription failed: {str(e)}", "error")
        logger.error(f"Error transcribing video from URL: {str(e)}")
        return jsonify({"error": str(e)}), 500