import { NextRequest, NextResponse } from 'next/server';
import { join } from 'path';
import { download_youtube_video } from '@/lib/video';

export async function POST(request: NextRequest) {
  try {
    const {
      url,
      startTime,
      endTime,
      blurRadius,
      autoDetectFaces,
      quality,
      captions
    } = await request.json();

    if (!url) {
      return NextResponse.json(
        { error: 'No YouTube URL provided' },
        { status: 400 }
      );
    }

    // Set download folder in public directory
    const downloadFolder = join(process.cwd(), 'public', 'uploads');

    // Download and process video
    const result = await download_youtube_video(
      url,
      downloadFolder,
      1000, // 1GB max size
      startTime,
      endTime,
      captions
    );

    // Convert file path to URL
    const fileUrl = `/uploads/${result.filename}`;

    return NextResponse.json({
      url: fileUrl,
      metadata: result.metadata
    });
  } catch (error) {
    console.error('Error processing YouTube video:', error);
    return NextResponse.json(
      { error: 'Failed to process YouTube video' },
      { status: 500 }
    );
  }
} 