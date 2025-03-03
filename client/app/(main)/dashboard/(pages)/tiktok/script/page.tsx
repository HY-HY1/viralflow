'use client'

import React, { useState, useCallback } from 'react'
import { Upload, FileVideo, Loader2, Copy, CheckCircle2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useToast } from '@/components/ui/use-toast'
import { Input } from '@/components/ui/input'
import axios, { AxiosError } from 'axios'

interface Segment {
  start: number
  end: number
  text: string
}

interface TranscriptionResult {
  text: string
  segments: Segment[]
  language: string
}

export default function ScriptPage() {
  const [file, setFile] = useState<File | null>(null)
  const [url, setUrl] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [transcription, setTranscription] = useState<TranscriptionResult | null>(null)
  const [copied, setCopied] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const { toast } = useToast()

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0])
      setUrl('') // Clear URL when file is selected
    }
  }

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFile = e.dataTransfer.files[0]
      if (droppedFile.type.startsWith('video/')) {
        setFile(droppedFile)
        setUrl('') // Clear URL when file is dropped
      } else {
        toast({
          title: "Invalid file type",
          description: "Please drop a video file.",
          variant: "destructive"
        })
      }
    }
  }, [toast])

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }, [])

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = Math.floor(seconds % 60)
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
  }

  const handleUpload = async () => {
    if (!file && !url) {
      toast({
        title: "No input provided",
        description: "Please select a video file or enter a URL.",
        variant: "destructive"
      })
      return
    }

    setIsLoading(true)
    setProgress(0)
    
    try {
      let response;
      
      if (file) {
        const formData = new FormData()
        formData.append('video', file)
        response = await axios.post('http://localhost:5000/api/transcribe', formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          },
          onUploadProgress: (progressEvent) => {
            const percentCompleted = Math.round((progressEvent.loaded * 100) / (progressEvent.total || file.size))
            setProgress(percentCompleted)
          }
        })
      } else if (url) {
        response = await axios.post('http://localhost:5000/api/transcribe/url', {
          url: url
        })
      }

      if (!response?.data.transcription.segments.length) {
        throw new Error("No speech detected in the video")
      }

      setTranscription(response.data.transcription)
      toast({
        title: "Transcription complete",
        description: "Your video has been successfully transcribed.",
      })
    } catch (error) {
      const errorMessage = error instanceof AxiosError 
        ? error.response?.data?.error || "Network error"
        : error instanceof Error ? error.message : "An unexpected error occurred"
      
      toast({
        title: "Transcription failed",
        description: errorMessage,
        variant: "destructive"
      })
    } finally {
      setIsLoading(false)
      setProgress(0)
    }
  }

  const copyToClipboard = () => {
    if (transcription) {
      const formattedText = transcription.segments
        .map(segment => `[${formatTime(segment.start)}] ${segment.text}`)
        .join('\n')
      navigator.clipboard.writeText(formattedText)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
      toast({
        title: "Copied to clipboard",
        description: "The transcription has been copied to your clipboard.",
      })
    }
  }

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Video Transcription</h1>
          <p className="text-gray-600">Upload a video or enter a URL to get its transcription with timestamps.</p>
        </div>

        <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
          <div 
            className={`border-2 border-dashed rounded-lg p-8 mb-6 transition-colors ${
              isDragging 
                ? 'border-blue-500 bg-blue-50' 
                : 'border-gray-200 hover:border-gray-300'
            }`}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
          >
            <div className="text-center">
              <FileVideo className="w-12 h-12 mx-auto mb-4 text-gray-400" />
              <p className="text-gray-600 mb-2">
                Drag and drop your video here, or
              </p>
              <input
                type="file"
                accept="video/*"
                onChange={handleFileChange}
                className="hidden"
                id="video-upload"
              />
              <label
                htmlFor="video-upload"
                className="inline-flex items-center gap-2 px-4 py-2 border rounded-lg cursor-pointer hover:bg-gray-50"
              >
                <Upload className="w-4 h-4" />
                Browse files
              </label>
              {file && (
                <p className="mt-2 text-sm text-gray-500">
                  Selected: {file.name}
                </p>
              )}
            </div>
          </div>

          <div className="mb-6">
            <p className="text-center text-gray-500 mb-2">OR</p>
            <div className="flex gap-4">
              <Input
                type="url"
                placeholder="Enter video URL"
                value={url}
                onChange={(e) => {
                  setUrl(e.target.value)
                  setFile(null) // Clear file when URL is entered
                }}
                className="flex-1"
              />
              <Button
                onClick={handleUpload}
                disabled={(!file && !url) || isLoading}
                className="flex items-center gap-2 min-w-[120px]"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>{progress > 0 ? `${progress}%` : 'Processing...'}</span>
                  </>
                ) : (
                  <>
                    <Upload className="w-4 h-4" />
                    <span>Transcribe</span>
                  </>
                )}
              </Button>
            </div>
          </div>

          {isLoading && progress > 0 && (
            <div className="w-full bg-gray-200 rounded-full h-2.5 mb-6">
              <div 
                className="bg-blue-600 h-2.5 rounded-full transition-all duration-300" 
                style={{ width: `${progress}%` }}
              />
            </div>
          )}

          {transcription && transcription.segments.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold">Transcription</h2>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={copyToClipboard}
                  className="flex items-center gap-2"
                >
                  {copied ? (
                    <CheckCircle2 className="w-4 h-4 text-green-500" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                  {copied ? "Copied!" : "Copy"}
                </Button>
              </div>
              <div className="bg-gray-50 rounded-lg p-4 max-h-[500px] overflow-y-auto">
                {transcription.segments.map((segment, index) => (
                  <div key={index} className="mb-2 hover:bg-gray-100 p-2 rounded">
                    <span className="text-sm text-blue-600 font-mono">
                      [{formatTime(segment.start)}]
                    </span>
                    <span className="ml-2">{segment.text}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="bg-blue-50 rounded-lg p-4">
          <h3 className="font-semibold mb-2">Note:</h3>
          <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
            <li>Supported video formats: MP4, MOV, AVI, etc.</li>
            <li>Maximum file size: 100MB</li>
            <li>Supported URLs: YouTube, TikTok, and direct video links</li>
            <li>Transcription may take a few minutes depending on video length</li>
            <li>The transcription includes timestamps for easy reference</li>
            <li>For best results, ensure the video has clear audio</li>
          </ul>
        </div>
      </div>
    </div>
  )
} 