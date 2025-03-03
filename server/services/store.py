from datetime import datetime
import os
from typing import List, Dict

class Store:
    def __init__(self):
        self.downloads: List[Dict] = []
        self.transcriptions: List[Dict] = []
        self.notifications: List[Dict] = []
        self._notification_id = 1
        self._activity_id = 1
        
    def add_download(self, url: str, file_path: str, status: str = 'completed') -> Dict:
        activity = {
            'id': str(self._activity_id),
            'type': 'download',
            'status': status,
            'timestamp': datetime.now().isoformat(),
            'details': f'Downloaded video from {url}',
            'file_path': file_path
        }
        self._activity_id += 1
        self.downloads.append(activity)
        return activity

    def add_transcription(self, file_name: str, status: str = 'completed') -> Dict:
        activity = {
            'id': str(self._activity_id),
            'type': 'transcription',
            'status': status,
            'timestamp': datetime.now().isoformat(),
            'details': f'Transcribed {file_name}'
        }
        self._activity_id += 1
        self.transcriptions.append(activity)
        return activity

    def add_notification(self, message: str, type: str = 'info') -> Dict:
        notification = {
            'id': str(self._notification_id),
            'type': type,
            'message': message,
            'read': False,
            'timestamp': datetime.now().isoformat()
        }
        self._notification_id += 1
        self.notifications.append(notification)
        return notification

    def get_recent_activities(self, limit: int = 10) -> List[Dict]:
        # Combine and sort all activities by timestamp
        all_activities = self.downloads + self.transcriptions
        return sorted(
            all_activities,
            key=lambda x: x['timestamp'],
            reverse=True
        )[:limit]

    def get_notifications(self, limit: int = 10) -> List[Dict]:
        return sorted(
            self.notifications,
            key=lambda x: x['timestamp'],
            reverse=True
        )[:limit]

    def get_storage_used(self) -> str:
        total_size = 0
        download_dir = os.path.join(os.getcwd(), 'downloads')
        
        if os.path.exists(download_dir):
            for path, _, files in os.walk(download_dir):
                for file in files:
                    file_path = os.path.join(path, file)
                    total_size += os.path.getsize(file_path)
        
        # Convert to MB
        size_mb = total_size / (1024 * 1024)
        return f"{size_mb:.1f} MB"

# Global store instance
store = Store() 