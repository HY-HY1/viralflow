import yt_dlp
import os
from typing import Dict, Any, Optional, Tuple, List
import cv2
import numpy as np
import logging
from moviepy.editor import VideoFileClip, TextClip, CompositeVideoClip

# Configure logging
logger = logging.getLogger(__name__)

def apply_gaussian_blur(frame, radius: int) -> np.ndarray:
    """Apply Gaussian blur to a frame"""
    # Ensure radius is odd
    radius = radius * 2 + 1 if radius % 2 == 0 else radius
    return cv2.GaussianBlur(frame, (radius, radius), 0)

class VideoProcessor:
    def __init__(self):
        self.output_path = None

    def apply_gaussian_blur(self, frame, blur_radius=99):
        # Ensure blur radius is odd
        if blur_radius % 2 == 0:
            blur_radius += 1
        return cv2.GaussianBlur(frame, (blur_radius, blur_radius), 0)

    def create_layered_effect(self, frame, scale_factor=1.5):
        # Create background by scaling up and blurring
        h, w = frame.shape[:2]
        bg_size = (int(w * scale_factor), int(h * scale_factor))
        background = cv2.resize(frame.copy(), bg_size)
        background = self.apply_gaussian_blur(background)
        
        # Calculate position to overlay original frame
        y_offset = (bg_size[1] - h) // 2
        x_offset = (bg_size[0] - w) // 2
        
        # Overlay original frame on blurred background
        background[y_offset:y_offset + h, x_offset:x_offset + w] = frame
        return background

    def process_video(self, input_path, start_time=None, end_time=None, caption_text=None):
        try:
            logger.info(f"Processing video: {input_path}")
            
            # Generate output path
            filename = os.path.basename(input_path)
            base_name, ext = os.path.splitext(filename)
            self.output_path = os.path.join(os.path.dirname(input_path), f"{base_name}_processed{ext}")
            
            # Load video
            video = VideoFileClip(input_path)
            
            # Apply time clipping if specified
            if start_time is not None and end_time is not None:
                video = video.subclip(start_time, end_time)
            
            # Process frames with layered effect
            processed_frames = []
            for frame in video.iter_frames():
                processed_frame = self.create_layered_effect(frame)
                processed_frames.append(processed_frame)
            
            # Create video from processed frames
            processed_video = VideoFileClip(input_path).set_frames(processed_frames)
            
            # Add caption if specified
            if caption_text:
                txt_clip = TextClip(caption_text, fontsize=70, color='white', stroke_color='black', stroke_width=2)
                txt_clip = txt_clip.set_position('center').set_duration(video.duration)
                final_video = CompositeVideoClip([processed_video, txt_clip])
            else:
                final_video = processed_video
            
            # Write final video
            final_video.write_videofile(self.output_path, codec='libx264')
            logger.info(f"Video processing completed. Output saved to: {self.output_path}")
            
            return self.output_path
            
        except Exception as e:
            logger.error(f"Error processing video: {str(e)}")
            raise
        finally:
            if 'video' in locals():
                video.close()
            if 'final_video' in locals():
                final_video.close()

class YouTubeDownloader:
    def __init__(self, url: str, download_folder: str, max_size_mb: int = 1000):
        self.url = url
        self.download_folder = download_folder
        self.max_size_mb = max_size_mb
        self.video_info = None
        
        # Create video processor
        self.processor = VideoProcessor()
        
        # Ensure the directory exists
        os.makedirs(download_folder, exist_ok=True)

    def get_video_info(self) -> Dict[str, Any]:
        """Extract video information without downloading"""
        ydl_opts = {
            'format': 'bv+ba/best',  # Best video + best audio
            'quiet': False,
            'no_warnings': False,
            'extract_flat': False,
            'outtmpl': os.path.join(self.download_folder, '%(title)s.%(ext)s'),
        }
        
        with yt_dlp.YoutubeDL(ydl_opts) as ydl:
            try:
                logger.info(f"Attempting to extract info from URL: {self.url}")
                info = ydl.extract_info(self.url, download=False)
                
                if info is None:
                    logger.error("Extract info returned None")
                    raise Exception("Failed to extract video information")

                logger.info(f"Successfully extracted info for video: {info.get('title', 'Unknown Title')}")

                # Ensure all required fields have default values
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
                logger.error(f"Error extracting video info: {str(e)}")
                raise Exception(f"Failed to get video info: {str(e)}")

    def check_size(self) -> bool:
        """Check if video size is within limit"""
        if not self.video_info:
            self.get_video_info()
        
        filesize_mb = self.video_info['filesize_approx'] / (1024 * 1024)
        return filesize_mb <= self.max_size_mb

    def download_and_process(self, 
                           start_time: Optional[float] = None,
                           end_time: Optional[float] = None,
                           captions: Optional[List[Dict[str, Any]]] = None) -> Dict[str, Any]:
        """Download and process the video"""
        if not self.video_info:
            self.get_video_info()
            
        if not self.check_size():
            raise Exception(f"Video size exceeds {self.max_size_mb}MB limit")

        # Download options
        ydl_opts = {
            'format': 'bv+ba/best',  # Best video + best audio
            'merge_output_format': 'mp4',
            'outtmpl': os.path.join(self.download_folder, '%(title)s.%(ext)s'),
            'quiet': False,
            'no_warnings': False
        }

        try:
            logger.info(f"Starting download for video: {self.video_info['title']}")
            with yt_dlp.YoutubeDL(ydl_opts) as ydl:
                info = ydl.extract_info(self.url, download=True)
                if info is None:
                    raise Exception("Failed to extract video information")

                video_path = ydl.prepare_filename(info)
                if not os.path.exists(video_path):
                    raise Exception("Downloaded file not found")
                
                # Process the video
                processed_path = self.processor.process_video(
                    video_path,
                    start_time,
                    end_time,
                    captions
                )
                
                # Clean up original download
                if os.path.exists(video_path):
                    os.remove(video_path)
                
                return {
                    'file_path': processed_path,
                    'filename': os.path.basename(processed_path),
                    'metadata': self.video_info,
                    'processed': True
                }
        except Exception as e:
            logger.error(f"Error during download and processing: {str(e)}")
            raise Exception(f"Download and processing failed: {str(e)}")

def process_video(input_path: str, 
                 download_folder: str,
                 start_time: Optional[float] = None,
                 end_time: Optional[float] = None,
                 captions: Optional[List[Dict[str, Any]]] = None) -> Dict[str, Any]:
    """Process an existing video file"""
    processor = VideoProcessor()
    processed_path = processor.process_video(input_path, start_time, end_time, captions)
    
    return {
        'file_path': processed_path,
        'filename': os.path.basename(processed_path),
        'processed': True
    }

def download_youtube_video(url: str,
                         download_folder: str,
                         max_size_mb: int = 1000,
                         start_time: Optional[float] = None,
                         end_time: Optional[float] = None,
                         captions: Optional[List[Dict[str, Any]]] = None) -> Dict[str, Any]:
    """Download and process a YouTube video"""
    downloader = YouTubeDownloader(url, download_folder, max_size_mb)
    return downloader.download_and_process(start_time, end_time, captions)

# Take user input for YouTube link
def youtube_downloader_old(video_url, output_directory):
    downloader = YouTubeDownloader(video_url, output_directory)
    downloader.download_video()
    os.system(f"explorer {output_directory}")  