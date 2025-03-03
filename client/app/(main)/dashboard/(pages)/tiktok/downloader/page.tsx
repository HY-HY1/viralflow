'use client'

import { useState } from 'react'
import { DownloaderForm } from '@/components/tiktok/DownloaderForm'
import { Clock, Eye, ThumbsUp, User } from 'lucide-react'

interface VideoMetadata {
  title: string
  description: string
  duration: number
  thumbnail: string
  view_count: number
  like_count: number
  creator: string
}

export default function TiktokDownloader() {
  const [metadata, setMetadata] = useState<VideoMetadata | null>(null)

  return (
    <main className='flex-1 w-full min-h-screen bg-[#FAFAFA] p-4'>
      <div className='max-w-6xl mx-auto'>
        <div className='bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden'>
          <div className='bg-gradient-to-r from-gray-100 to-gray-50 p-6'>
            <div className='text-center'>
              <h1 className='text-2xl font-bold mb-2'>TikTok Video Downloader</h1>
              <p className='text-gray-600'>Download TikTok videos without watermark</p>
            </div>
          </div>
          
          <div className='p-6'>
            <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
              <div className='space-y-6'>
                <div className='bg-blue-50 rounded-lg p-4'>
                  <h3 className='font-semibold text-blue-900 mb-3'>How to download TikTok videos:</h3>
                  <ol className='space-y-2 text-sm text-blue-800'>
                    <li className='flex items-center'>
                      <span className='flex-shrink-0 w-5 h-5 flex items-center justify-center rounded-full bg-blue-100 text-blue-600 mr-2 text-xs font-medium'>1</span>
                      <span>Copy the video link from TikTok app or website</span>
                    </li>
                    <li className='flex items-center'>
                      <span className='flex-shrink-0 w-5 h-5 flex items-center justify-center rounded-full bg-blue-100 text-blue-600 mr-2 text-xs font-medium'>2</span>
                      <span>Paste the URL in the input field below</span>
                    </li>
                    <li className='flex items-center'>
                      <span className='flex-shrink-0 w-5 h-5 flex items-center justify-center rounded-full bg-blue-100 text-blue-600 mr-2 text-xs font-medium'>3</span>
                      <span>Click the Download button and wait for the process to complete</span>
                    </li>
                    <li className='flex items-center'>
                      <span className='flex-shrink-0 w-5 h-5 flex items-center justify-center rounded-full bg-blue-100 text-blue-600 mr-2 text-xs font-medium'>4</span>
                      <span>Your video will automatically download once ready</span>
                    </li>
                  </ol>
                  <p className='mt-4 text-xs text-blue-700 bg-blue-100 p-2 rounded-lg inline-block'>
                    Note: Videos larger than 100MB cannot be downloaded.
                  </p>
                </div>

                <DownloaderForm onMetadataReceived={setMetadata} />
              </div>

              <div className='bg-gray-50 rounded-lg p-4'>
                <h3 className='font-semibold text-gray-900 mb-3'>Video Preview</h3>
                {metadata ? (
                  <div className="bg-white rounded-lg overflow-hidden border border-gray-100">
                    <div className="aspect-video relative">
                      <img 
                        src={metadata.thumbnail} 
                        alt={metadata.title}
                        className="object-cover w-full h-full"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    </div>
                    
                    <div className="p-4">
                      <h3 className="font-medium text-base mb-1.5 text-gray-900">{metadata.title}</h3>
                      <p className="text-gray-600 text-xs line-clamp-2 mb-3">{metadata.description}</p>
                      
                      <div className="grid grid-cols-2 gap-2">
                        <div className="flex items-center space-x-2 text-xs text-gray-700 bg-gray-50 p-2 rounded-lg border border-gray-100">
                          <Clock className="w-4 h-4 text-blue-500" />
                          <span>{metadata.duration}s</span>
                        </div>
                        <div className="flex items-center space-x-2 text-xs text-gray-700 bg-gray-50 p-2 rounded-lg border border-gray-100">
                          <Eye className="w-4 h-4 text-blue-500" />
                          <span>{metadata.view_count.toLocaleString()} views</span>
                        </div>
                        <div className="flex items-center space-x-2 text-xs text-gray-700 bg-gray-50 p-2 rounded-lg border border-gray-100">
                          <ThumbsUp className="w-4 h-4 text-blue-500" />
                          <span>{metadata.like_count.toLocaleString()} likes</span>
                        </div>
                        <div className="flex items-center space-x-2 text-xs text-gray-700 bg-gray-50 p-2 rounded-lg border border-gray-100">
                          <User className="w-4 h-4 text-blue-500" />
                          <span>{metadata.creator}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className='bg-white rounded-lg p-4 h-[calc(100%-2rem)] border border-gray-100'>
                    <div className='text-gray-500 text-sm text-center h-full flex items-center justify-center'>
                      Enter a TikTok URL to see video details
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
