from flask import Blueprint, request, jsonify
import requests

# Create a blueprint for the downloader routes
transcriber_routes = Blueprint('transcriber_routes', __name__)

# Basic endpoint for downloading a video from a given URL
@transcriber_routes.route('/transcribe', methods=['GET'])
def download_video():
    return jsonify({"Message": "Hello"})