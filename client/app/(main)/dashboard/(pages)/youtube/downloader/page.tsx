"use client";

import { useState } from 'react';
import { DownloaderForm } from '@/components/youtube/DownloaderForm';

interface VideoMetadata {
  title: string;
  description: string;
  duration: number;
  thumbnail: string;
  view_count: number;
  like_count: number;
  creator: string;
}

export default function YouTubeDownloaderPage() {
  const [metadata, setMetadata] = useState<VideoMetadata | null>(null);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-center">YouTube Video Downloader</h1>
        <p className="text-muted-foreground mb-8 text-center">
          Download YouTube videos in the highest quality. Simply paste the video URL below.
        </p>

        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
          <DownloaderForm onMetadataReceived={setMetadata} />
        </div>

        {metadata && (
          <div className="mt-8 bg-white rounded-lg shadow-sm p-6 border border-gray-100">
            <h2 className="text-xl font-semibold mb-4">Video Information</h2>
            <div className="space-y-2">
              <p><span className="font-medium">Title:</span> {metadata.title}</p>
              <p><span className="font-medium">Creator:</span> {metadata.creator}</p>
              <p><span className="font-medium">Duration:</span> {Math.floor(metadata.duration / 60)}:{(metadata.duration % 60).toString().padStart(2, '0')}</p>
              <p><span className="font-medium">Views:</span> {metadata.view_count.toLocaleString()}</p>
              <p><span className="font-medium">Likes:</span> {metadata.like_count.toLocaleString()}</p>
              <p className="text-sm text-muted-foreground mt-4">{metadata.description}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}