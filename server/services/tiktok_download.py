import yt_dlp
import os
from urllib.parse import urlparse, parse_qs

def download_tiktok_video(url, download_folder):
    print("Started downloading...")
    
    # Parse the URL to extract the video ID or a clean filename
    parsed_url = urlparse(url)
    video_id = parsed_url.path.split('/')[-1]  # Assuming video ID is at the end of the URL path
    
    # Handle cases where the URL might contain query parameters
    query_params = parse_qs(parsed_url.query)
    if 'kref' in query_params:
        video_id = f"{video_id}_{query_params['kref'][0]}"

    # Ensure the directory exists
    os.makedirs(download_folder, exist_ok=True)

    # Define yt-dlp options to download the video to the specified directory
    ydl_opts = {
        'format': 'best',
        'outtmpl': os.path.join(download_folder, f'{video_id}.%(ext)s'),  # Full path with dynamic filename
        'quiet': True,
        'noplaylist': True,
    }

    try:
        # Download the video
        with yt_dlp.YoutubeDL(ydl_opts) as ydl:
            ydl.download([url])

        # After download, return the full path or just the filename
        file_path = f"{video_id}.mp4"
        return file_path

    except Exception as e:
        raise Exception(f"Error downloading video: {e}")
