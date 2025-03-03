import yt_dlp
import os
from urllib.parse import urlparse, parse_qs
from typing import Dict, Any

class TikTokDownloader:
    def __init__(self, url: str, download_folder: str, max_size_mb: int = 100):
        self.url = url
        self.download_folder = download_folder
        self.max_size_mb = max_size_mb
        self.video_info = None
        
        # Ensure the directory exists
        os.makedirs(download_folder, exist_ok=True)

    def get_video_info(self) -> Dict[str, Any]:
        """Extract video information without downloading"""
        ydl_opts = {
            'quiet': True,
            'no_warnings': True,
            'extract_flat': True
        }
        
        with yt_dlp.YoutubeDL(ydl_opts) as ydl:
            try:
                info = ydl.extract_info(self.url, download=False)
                self.video_info = {
                    'title': info.get('title', 'Untitled'),
                    'description': info.get('description', ''),
                    'duration': info.get('duration', 0),
                    'thumbnail': info.get('thumbnail', ''),
                    'view_count': info.get('view_count', 0),
                    'like_count': info.get('like_count', 0),
                    'creator': info.get('uploader', 'Unknown'),
                    'filesize_approx': info.get('filesize_approx', 0),
                    'formats': info.get('formats', [])
                }
                return self.video_info
            except Exception as e:
                raise Exception(f"Failed to get video info: {str(e)}")

    def check_size(self) -> bool:
        """Check if video size is within limit"""
        if not self.video_info:
            self.get_video_info()
        
        filesize_mb = self.video_info['filesize_approx'] / (1024 * 1024)
        return filesize_mb <= self.max_size_mb

    def download(self) -> Dict[str, Any]:
        """Download the video and return metadata"""
        if not self.video_info:
            self.get_video_info()
            
        if not self.check_size():
            raise Exception(f"Video size exceeds {self.max_size_mb}MB limit")

        # Parse video ID for filename
        parsed_url = urlparse(self.url)
        video_id = parsed_url.path.split('/')[-1]
        
        # Handle query parameters
        query_params = parse_qs(parsed_url.query)
        if 'kref' in query_params:
            video_id = f"{video_id}_{query_params['kref'][0]}"

        # Download options
        ydl_opts = {
            'format': 'best',
            'outtmpl': os.path.join(self.download_folder, f'tiktok_{video_id}.%(ext)s'),
            'quiet': False,
            'no_warnings': True,
        }

        try:
            with yt_dlp.YoutubeDL(ydl_opts) as ydl:
                info = ydl.extract_info(self.url, download=True)
                video_path = ydl.prepare_filename(info)
                
                return {
                    'file_path': video_path,
                    'filename': os.path.basename(video_path),
                    'metadata': self.video_info
                }
        except Exception as e:
            raise Exception(f"Download failed: {str(e)}")

def download_tiktok_video(url: str, download_folder: str, max_size_mb: int = 100) -> Dict[str, Any]:
    """Download a TikTok video and return the file path and metadata"""
    downloader = TikTokDownloader(url, download_folder, max_size_mb)
    return downloader.download()
