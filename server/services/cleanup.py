import os
import time
import logging
from datetime import datetime, timedelta
from typing import List

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler('cleanup.log'),
        logging.StreamHandler()
    ]
)
logger = logging.getLogger('cleanup_service')

class CleanupService:
    def __init__(self, download_folder: str, max_age_minutes: int = 30):
        self.download_folder = download_folder
        self.max_age_minutes = max_age_minutes
        
    def get_file_age_minutes(self, file_path: str) -> float:
        """Get the age of a file in minutes"""
        try:
            stat = os.stat(file_path)
            age_seconds = time.time() - stat.st_mtime
            return age_seconds / 60
        except Exception as e:
            logger.error(f"Error getting age for file {file_path}: {str(e)}")
            return 0

    def is_file_expired(self, file_path: str) -> bool:
        """Check if a file has exceeded the maximum age"""
        return self.get_file_age_minutes(file_path) > self.max_age_minutes

    def get_expired_files(self) -> List[str]:
        """Get list of expired files in the download folder"""
        expired_files = []
        try:
            for filename in os.listdir(self.download_folder):
                file_path = os.path.join(self.download_folder, filename)
                if os.path.isfile(file_path) and self.is_file_expired(file_path):
                    expired_files.append(file_path)
        except Exception as e:
            logger.error(f"Error scanning for expired files: {str(e)}")
        return expired_files

    def delete_file(self, file_path: str) -> bool:
        """Delete a single file with logging"""
        try:
            if os.path.exists(file_path):
                os.remove(file_path)
                logger.info(f"Successfully deleted file: {file_path}")
                return True
            return False
        except Exception as e:
            logger.error(f"Error deleting file {file_path}: {str(e)}")
            return False

    def cleanup_expired_files(self) -> int:
        """Clean up all expired files and return count of deleted files"""
        expired_files = self.get_expired_files()
        deleted_count = 0
        
        for file_path in expired_files:
            if self.delete_file(file_path):
                deleted_count += 1
        
        if deleted_count > 0:
            logger.info(f"Cleanup completed. Deleted {deleted_count} expired files")
        
        return deleted_count

# Create a singleton instance
cleanup_service = CleanupService(os.path.join(os.getcwd(), 'downloads')) 