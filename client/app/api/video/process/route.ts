import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { process_video } from '@/lib/video';
import { existsSync } from 'fs';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const video = formData.get('video') as File;
    const startTime = formData.get('start_time') ? parseFloat(formData.get('start_time') as string) : undefined;
    const endTime = formData.get('end_time') ? parseFloat(formData.get('end_time') as string) : undefined;
    const caption = formData.get('caption') as string;

    if (!video) {
      return NextResponse.json(
        { error: 'No video file provided' },
        { status: 400 }
      );
    }

    // Ensure uploads directory exists
    const uploadsDir = join(process.cwd(), 'public', 'uploads');
    if (!existsSync(uploadsDir)) {
      await mkdir(uploadsDir, { recursive: true });
    }

    // Create unique filename
    const bytes = await video.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const filename = `${Date.now()}_${video.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
    const filepath = join(uploadsDir, filename);

    // Save file
    await writeFile(filepath, buffer);

    // Process video with correct options
    const result = await process_video(video, {
      startTime,
      endTime,
      caption
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error processing video:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to process video' },
      { status: 500 }
    );
  }
} 