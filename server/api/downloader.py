from flask import Blueprint, request, jsonify, send_from_directory
import os
import services.tiktok_download  # Assuming your download logic is here
from services.youtube_download import youtube_downloader

# Create a blueprint for the downloader routes
downloader_routes = Blueprint('downloader_routes', __name__)

# Define the directory where the files will be saved in the root directory
DOWNLOAD_FOLDER = os.path.join(os.getcwd(), 'downloads')  # Save in the 'downloads' folder in the root directory

# Ensure the directory exists
os.makedirs(DOWNLOAD_FOLDER, exist_ok=True)

# Endpoint for downloading a video from a given URL
@downloader_routes.route('/tiktok', methods=['POST'])
def download_video():
    data = request.get_json()  # Parse incoming JSON data
    url = data.get('url')  # Extract URL from the request body
    
    if not url:
        return jsonify({"error": "URL is required"}), 400

    try:
        # Call the tiktok_download service to handle the video download
        download_result = services.tiktok_download.download_tiktok_video(url, DOWNLOAD_FOLDER)
        
        # Assuming download_tiktok_video returns the filename or file path of the downloaded video
        return jsonify({"message": "Download successful", "file_path": download_result}), 200
    except Exception as e:  # Handle any errors during the download process
        return jsonify({"error": str(e)}), 500

@downloader_routes.route('/youtube', methods=['POST'])
def download_youtube_video():
    data = request.get_json() 
    url = data.get('url') 
    
    if not url:
        return jsonify({"error": "URL is required"}), 400

    try:
        # Call the tiktok_download service to handle the video download
        download_result = youtube_downloader(url, DOWNLOAD_FOLDER)
        
        return jsonify({"message": "Download successful", "file_path": download_result}), 200
    except Exception as e:  # Handle any errors during the download process
        return jsonify({"error": str(e)}), 500

@downloader_routes.route('/file/<filename>', methods=['GET'])
def serve_file(filename):
    # This function will allow clients to download the video
    try:
        return send_from_directory(DOWNLOAD_FOLDER, filename, as_attachment=True)
    except FileNotFoundError:   
        return jsonify({"error": "File not found"}), 404
