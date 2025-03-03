'use client'

import { useState, useRef } from 'react'
import { Loader2, Copy, Upload } from 'lucide-react'
import axios from 'axios'

interface TranscriptionSegment {
  start: number
  end: number
  text: string
}

interface TranscriptionResult {
  text: string
  segments: TranscriptionSegment[]
  language: string
}

const API_URL = 'http://localhost:5000'

export default function TranscriberPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [transcription, setTranscription] = useState<TranscriptionResult | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    setIsLoading(true)
    setError(null)

    const formData = new FormData()
    formData.append('video', file)

    try {
      const response = await axios.post(`${API_URL}/api/transcribe`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      setTranscription(response.data.transcription)
    } catch (error) {
      console.error('Error transcribing video:', error)
      setError('Failed to transcribe video')
    } finally {
      setIsLoading(false)
    }
  }

  const copyToClipboard = async () => {
    if (!transcription) return
    try {
      await navigator.clipboard.writeText(transcription.text)
    } catch (error) {
      console.error('Failed to copy text:', error)
    }
  }

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = Math.round(seconds % 60)
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
  }

  return (
    <main className='flex-1 w-full min-h-screen bg-[#FAFAFA] p-4'>
      <div className='max-w-6xl mx-auto'>
        <div className='bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden'>
          <div className='bg-gradient-to-r from-gray-100 to-gray-50 p-6'>
            <div className='text-center'>
              <h1 className='text-2xl font-bold mb-2'>Video Transcriber</h1>
              <p className='text-gray-600'>Upload a video to get its transcription with timestamps</p>
            </div>
          </div>
          
          <div className='p-6'>
            <div className='space-y-6'>
              {/* Upload Section */}
              <div className='bg-blue-50 rounded-lg p-8 text-center'>
                <input
                  type="file"
                  accept="video/*"
                  onChange={handleFileUpload}
                  className="hidden"
                  ref={fileInputRef}
                />
                <button
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isLoading}
                  className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin mr-2" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <Upload className="w-5 h-5 mr-2" />
                      Upload Video
                    </>
                  )}
                </button>
                <p className="mt-2 text-sm text-blue-700">
                  Supported formats: MP4, AVI, MOV, etc.
                </p>
              </div>

              {/* Error Message */}
              {error && (
                <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm">
                  {error}
                </div>
              )}

              {/* Transcription Result */}
              {transcription && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h2 className="text-lg font-semibold">Transcription</h2>
                    <button
                      onClick={copyToClipboard}
                      className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900"
                    >
                      <Copy className="w-4 h-4 mr-1" />
                      Copy Text
                    </button>
                  </div>
                  
                  <div className="bg-gray-50 rounded-lg border border-gray-200 p-4">
                    <div className="space-y-4">
                      {transcription.segments.map((segment, index) => (
                        <div key={index} className="flex">
                          <span className="text-sm text-gray-500 w-16 flex-shrink-0">
                            {formatTime(segment.start)}
                          </span>
                          <p className="text-gray-700">{segment.text}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  )
} 