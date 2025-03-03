from flask import Blueprint, request, jsonify, send_from_directory, after_this_request
import os
import logging
from services.tiktok_download import download_tiktok_video, TikTokDownloader
from services.youtube_download import youtube_downloader
from services.store import store
from services.cleanup import cleanup_service
from services.scheduler import scheduler

# Configure logging
logger = logging.getLogger('downloader_routes')

# Create a blueprint for the downloader routes
downloader_routes = Blueprint('downloader_routes', __name__)

# Define the directory where the files will be saved in the root directory
DOWNLOAD_FOLDER = os.path.join(os.getcwd(), 'downloads')  # Save in the 'downloads' folder in the root directory

# Ensure the directory exists
os.makedirs(DOWNLOAD_FOLDER, exist_ok=True)

# Start the cleanup scheduler
scheduler.add_task(5, cleanup_service.cleanup_expired_files, "Cleanup expired files")
scheduler.start_all()

@downloader_routes.route('/tiktok/info', methods=['POST'])
def get_tiktok_info():
    data = request.get_json()
    url = data.get('url')
    
    if not url:
        return jsonify({"error": "No URL provided"}), 400

    try:
        downloader = TikTokDownloader(url, DOWNLOAD_FOLDER)
        info = downloader.get_video_info()
        # Extract only the metadata fields that the frontend expects
        metadata = {
            'title': info['title'],
            'description': info['description'],
            'duration': info['duration'],
            'thumbnail': info['thumbnail'],
            'view_count': info['view_count'],
            'like_count': info['like_count'],
            'creator': info['creator']
        }
        return jsonify({"info": metadata})
    except Exception as e:
        logger.error(f"Error getting TikTok video info: {str(e)}")
        return jsonify({"error": str(e)}), 500

@downloader_routes.route('/tiktok', methods=['POST'])
def download_video():
    data = request.get_json()
    url = data.get('url')
    
    if not url:
        store.add_notification("Download failed: No URL provided", "error")
        return jsonify({"error": "No URL provided"}), 400

    try:
        # Add initial notification
        store.add_notification(f"Starting download from {url}", "info")
        logger.info(f"Starting TikTok video download: {url}")
        
        # Start download activity
        activity = store.add_download(url, "", "in_progress")
        
        # Download the video with metadata
        result = download_tiktok_video(url, DOWNLOAD_FOLDER)
        file_path = result['file_path']
        
        # Update activity with success
        activity['status'] = 'completed'
        activity['file_path'] = file_path
        store.add_notification(f"Successfully downloaded video from {url}", "success")
        logger.info(f"Successfully downloaded TikTok video: {url}")
        
        return jsonify({
            "message": "Video downloaded successfully",
            "file_path": file_path,
            "filename": result['filename'],
            "metadata": result['metadata']
        })
        
    except Exception as e:
        # Update activity with failure
        if 'activity' in locals():
            activity['status'] = 'failed'
        store.add_notification(f"Failed to download video: {str(e)}", "error")
        logger.error(f"Error downloading TikTok video: {str(e)}")
        return jsonify({"error": str(e)}), 500

@downloader_routes.route('/youtube', methods=['POST'])
def download_youtube():
    data = request.get_json()
    url = data.get('url')
    
    if not url:
        store.add_notification("Download failed: No URL provided", "error")
        return jsonify({"error": "No URL provided"}), 400

    try:
        # Add initial notification
        store.add_notification(f"Starting download from YouTube: {url}", "info")
        logger.info(f"Starting YouTube video download: {url}")
        
        # Start download activity
        activity = store.add_download(url, "", "in_progress")
        
        # Download the video using the actual implementation
        file_path = youtube_downloader(url, DOWNLOAD_FOLDER)
        
        # Update activity with success
        activity['status'] = 'completed'
        activity['file_path'] = file_path
        store.add_notification(f"Successfully downloaded YouTube video", "success")
        logger.info(f"Successfully downloaded YouTube video: {url}")
        
        return jsonify({
            "message": "Video downloaded successfully",
            "file_path": file_path,
            "filename": os.path.basename(file_path)
        })
        
    except Exception as e:
        # Update activity with failure
        if 'activity' in locals():
            activity['status'] = 'failed'
        store.add_notification(f"Failed to download video: {str(e)}", "error")
        logger.error(f"Error downloading YouTube video: {str(e)}")
        return jsonify({"error": str(e)}), 500

@downloader_routes.route('/file/<filename>', methods=['GET'])
def serve_file(filename):
    try:
        file_path = os.path.join(DOWNLOAD_FOLDER, filename)
        if not os.path.exists(file_path):
            logger.warning(f"File not found: {file_path}")
            return jsonify({"error": "File not found"}), 404

        @after_this_request
        def cleanup(response):
            try:
                if os.path.exists(file_path):
                    cleanup_service.delete_file(file_path)
            except Exception as e:
                logger.error(f"Error cleaning up file {file_path}: {str(e)}")
            return response

        logger.info(f"Serving file: {filename}")
        return send_from_directory(DOWNLOAD_FOLDER, filename, as_attachment=True)
    except Exception as e:
        logger.error(f"Error serving file {filename}: {str(e)}")
        return jsonify({"error": str(e)}), 500
