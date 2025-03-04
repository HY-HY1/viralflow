// Use environment variable with fallback
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

interface ProcessVideoOptions {
  startTime?: number;
  endTime?: number;
  caption?: string;
}

interface ProcessVideoResponse {
  file_path: string;
  filename: string;
  processed: boolean;
}

export async function process_video(
  file: File | string,
  options: ProcessVideoOptions = {}
): Promise<ProcessVideoResponse> {
  const formData = new FormData();
  
  // Handle both File objects and file paths
  if (file instanceof File) {
    formData.append('video', file);
  } else {
    // If it's a file path, we need to fetch the file first
    const response = await fetch(file);
    const blob = await response.blob();
    formData.append('video', blob, file.split('/').pop());
  }

  if (options.startTime !== undefined) {
    formData.append('start_time', options.startTime.toString());
  }
  if (options.endTime !== undefined) {
    formData.append('end_time', options.endTime.toString());
  }
  if (options.caption) {
    formData.append('caption', options.caption);
  }

  const response = await fetch(`${API_BASE_URL}/api/download/video/process`, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Failed to process video: ${error}`);
  }

  return response.json();
}

interface DownloadYouTubeOptions extends ProcessVideoOptions {
  maxSizeMb?: number;
}

interface YouTubeResponse extends ProcessVideoResponse {
  metadata: {
    title: string;
    description: string;
    duration: number;
    thumbnail: string;
    view_count: number;
    like_count: number;
    creator: string;
  };
}

export async function download_youtube_video(
  url: string,
  options: DownloadYouTubeOptions = {}
): Promise<YouTubeResponse> {
  const params = new URLSearchParams({
    url,
    ...(options.startTime !== undefined && { start_time: options.startTime.toString() }),
    ...(options.endTime !== undefined && { end_time: options.endTime.toString() }),
    ...(options.caption && { caption: options.caption }),
    ...(options.maxSizeMb && { max_size_mb: options.maxSizeMb.toString() }),
  });

  const response = await fetch(`${API_BASE_URL}/api/video/youtube?${params}`, {
    method: 'GET',
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Failed to download YouTube video: ${error}`);
  }

  return response.json();
} 