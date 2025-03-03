import yt_dlp
import shutil
import os

class YouTubeDownloader:
    def __init__(self, url: str, output_path: str):
        """Initialize with YouTube video URL and output directory"""
        self.url = url
        self.output_path = output_path

        # Ensure output directory exists
        os.makedirs(self.output_path, exist_ok=True)

    def check_ffmpeg(self):
        """Check if FFmpeg is installed"""
        if shutil.which("ffmpeg") is None:
            print("❌ FFmpeg is not installed! Install it to merge video and audio.")
            return False
        return True

    def download(self) -> str:
        """Download the video and return the file path"""
        ydl_opts = {
            'format': 'best',  # Download best quality
            'outtmpl': os.path.join(self.output_path, '%(title)s.%(ext)s'),
            'quiet': False,
            'no_warnings': True,
            'extract_flat': False,
        }

        with yt_dlp.YoutubeDL(ydl_opts) as ydl:
            # Download the video
            info = ydl.extract_info(self.url, download=True)
            video_path = ydl.prepare_filename(info)
            return video_path

def youtube_downloader(url: str, output_path: str) -> str:
    """Download a YouTube video and return the file path"""
    downloader = YouTubeDownloader(url, output_path)
    return downloader.download()

# Take user input for YouTube link
def youtube_downloader_old(video_url, output_directory):
    downloader = YouTubeDownloader(video_url, output_directory)
    downloader.download_video()
    os.system(f"explorer {output_directory}")  