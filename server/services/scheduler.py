import threading
import time
import logging
from typing import Callable

logger = logging.getLogger('scheduler_service')

class ScheduledTask:
    def __init__(self, interval_minutes: int, task: Callable, name: str = "Task"):
        self.interval = interval_minutes * 60  # Convert to seconds
        self.task = task
        self.name = name
        self.thread = threading.Thread(target=self._run, daemon=True)
        self.is_running = False

    def _run(self):
        logger.info(f"Starting scheduled task: {self.name}")
        while self.is_running:
            try:
                self.task()
            except Exception as e:
                logger.error(f"Error in scheduled task {self.name}: {str(e)}")
            time.sleep(self.interval)

    def start(self):
        self.is_running = True
        self.thread.start()
        logger.info(f"Scheduled task started: {self.name}")

    def stop(self):
        self.is_running = False
        self.thread.join()
        logger.info(f"Scheduled task stopped: {self.name}")

class Scheduler:
    def __init__(self):
        self.tasks = []

    def add_task(self, interval_minutes: int, task: Callable, name: str = "Task"):
        scheduled_task = ScheduledTask(interval_minutes, task, name)
        self.tasks.append(scheduled_task)
        return scheduled_task

    def start_all(self):
        for task in self.tasks:
            task.start()

    def stop_all(self):
        for task in self.tasks:
            task.stop()

# Create a singleton instance
scheduler = Scheduler() 