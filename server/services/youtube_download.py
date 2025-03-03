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

    def download_video(self):
        """Download highest-quality video with audio"""
        if not self.check_ffmpeg():
            return

        ydl_opts = {
            'format': 'bv+ba/best',  # Best video + best audio
            'merge_output_format': 'mp4',  # Merge into MP4
            'outtmpl': os.path.join(self.output_path, '%(title)s.%(ext)s'),  # Save with video title
            'quiet': False,  # Show progress
        }

        try:
            with yt_dlp.YoutubeDL(ydl_opts) as ydl:
                print(f"⬇️ Downloading: {self.url}...")
                ydl.download([self.url])
                print(f"✅ Download complete! Saved to: {self.output_path}")
        except Exception as e:
            print(f"❌ Download failed: {e}")

# Take user input for YouTube link
def youtube_downloader(video_url, output_directory):
    downloader = YouTubeDownloader(video_url, output_directory)
    downloader.download_video()
    os.system(f"explorer {output_directory}")  