from flask import Blueprint, request, jsonify, send_from_directory, after_this_request
import os
import logging
from services.tiktok_download import download_tiktok_video, TikTokDownloader
from services.youtube_download import download_youtube_video, YouTubeDownloader, process_video
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
        store.add_notification(f"Starting download from {url}", "info")
        logger.info(f"Starting YouTube video download: {url}")
        
        # Start download activity
        activity = store.add_download(url, "", "in_progress")
        
        # Download the video with metadata
        result = download_youtube_video(url, DOWNLOAD_FOLDER)
        file_path = result['file_path']
        
        # Update activity with success
        activity['status'] = 'completed'
        activity['file_path'] = file_path
        store.add_notification(f"Successfully downloaded video from {url}", "success")
        logger.info(f"Successfully downloaded YouTube video: {url}")
        
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
        logger.error(f"Error downloading YouTube video: {str(e)}")
        return jsonify({"error": str(e)}), 500

@downloader_routes.route('/youtube/info', methods=['POST'])
def get_youtube_info():
    data = request.get_json()
    url = data.get('url')
    
    if not url:
        return jsonify({"error": "No URL provided"}), 400

    try:
        downloader = YouTubeDownloader(url, DOWNLOAD_FOLDER)
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
        logger.error(f"Error getting YouTube video info: {str(e)}")
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

@downloader_routes.route('/video/process', methods=['POST'])
def process_video_endpoint():
    try:
        logger.info("Video processing request received")
        logger.debug(f"Request form data: {dict(request.form)}")
        logger.debug(f"Request files: {request.files.keys()}")

        # Check if video file is in request
        if 'video' not in request.files:
            logger.error("No video file found in request")
            return jsonify({"error": "No video file provided"}), 400
            
        video_file = request.files['video']
        if video_file.filename == '':
            logger.error("Empty filename received")
            return jsonify({"error": "No selected file"}), 400
            
        logger.info(f"Processing video file: {video_file.filename}")
        
        # Get processing options
        start_time = request.form.get('start_time')
        end_time = request.form.get('end_time')
        caption = request.form.get('caption')
        
        logger.info(f"Processing options - Start time: {start_time}, End time: {end_time}, Caption: {caption}")
        
        # Convert times to float if provided
        try:
            start_time = float(start_time) if start_time else None
            end_time = float(end_time) if end_time else None
            logger.debug(f"Converted times - Start: {start_time}, End: {end_time}")
        except ValueError as e:
            logger.error(f"Error converting time values: {e}")
            return jsonify({"error": "Invalid time format"}), 400
        
        # Save uploaded file temporarily
        temp_filename = f"temp_{video_file.filename}"
        temp_filepath = os.path.join(DOWNLOAD_FOLDER, temp_filename)
        logger.info(f"Saving temporary file to: {temp_filepath}")
        
        try:
            video_file.save(temp_filepath)
            logger.info("Temporary file saved successfully")
            
            # Log file details
            file_size = os.path.getsize(temp_filepath)
            logger.info(f"File size: {file_size / (1024*1024):.2f} MB")
        except Exception as e:
            logger.error(f"Error saving temporary file: {e}")
            return jsonify({"error": "Failed to save uploaded file"}), 500
        
        # Process the video
        logger.info("Starting video processing")
        try:
            result = process_video(
                temp_filepath,
                DOWNLOAD_FOLDER,
                start_time=start_time,
                end_time=end_time,
                captions=[{"text": caption, "start": 0}] if caption else None
            )
            logger.info(f"Video processing completed successfully. Result: {result}")
        except Exception as e:
            logger.error(f"Error during video processing: {str(e)}", exc_info=True)
            raise
        
        # Clean up temporary file
        try:
            if os.path.exists(temp_filepath):
                os.remove(temp_filepath)
                logger.info("Temporary file cleaned up successfully")
            else:
                logger.warning("Temporary file not found during cleanup")
        except Exception as e:
            logger.error(f"Error cleaning up temporary file: {e}")
            # Continue even if cleanup fails
            
        return jsonify(result)
        
    except Exception as e:
        logger.error(f"Error processing video: {str(e)}", exc_info=True)
        return jsonify({"error": str(e)}), 500
