import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import axios from 'axios'
import { Loader2 } from 'lucide-react'

// Backend API URL
const API_URL = 'http://localhost:5000'

const schema = z.object({
  url: z.string().url().refine((url) => url.includes('tiktok.com'), {
    message: 'Please enter a valid TikTok URL',
  }),
})

type FormData = z.infer<typeof schema>

interface VideoMetadata {
  title: string
  description: string
  duration: number
  thumbnail: string
  view_count: number
  like_count: number
  creator: string
}

interface DownloaderFormProps {
  onMetadataReceived: (metadata: VideoMetadata | null) => void
}

export function DownloaderForm({ onMetadataReceived }: DownloaderFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  })

  const getVideoInfo = async (url: string) => {
    try {
      const response = await axios.post(`${API_URL}/api/download/tiktok/info`, { url })
      const metadata = response.data.info
      onMetadataReceived(metadata)
      return metadata
    } catch (error) {
      console.error('Error fetching video info:', error)
      setError('Failed to fetch video information')
      onMetadataReceived(null)
      throw error
    }
  }

  const downloadVideo = async (url: string) => {
    try {
      const response = await axios.post(`${API_URL}/api/download/tiktok`, { url }, {
        responseType: 'json'
      })

      const { filename } = response.data

      // Trigger file download
      window.location.href = `${API_URL}/api/download/file/${filename}`
    } catch (error) {
      console.error('Error downloading video:', error)
      setError('Failed to download video')
      throw error
    }
  }

  const onSubmit = async (data: FormData) => {
    setIsLoading(true)
    setError(null)

    try {
      await getVideoInfo(data.url)
      await downloadVideo(data.url)
    } catch {
      // Error is already handled in the individual functions
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <input
          {...register('url')}
          type="text"
          placeholder="Paste TikTok video URL here"
          className="w-full px-4 py-2 rounded-lg border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        {errors.url && (
          <p className="mt-1 text-sm text-red-600">{errors.url.message}</p>
        )}
      </div>

      {error && (
        <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm">
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={isLoading}
        className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white py-2 px-4 rounded-lg font-medium hover:from-blue-600 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isLoading ? (
          <span className="flex items-center justify-center">
            <Loader2 className="w-5 h-5 animate-spin mr-2" />
            Processing...
          </span>
        ) : (
          'Download Video'
        )}
      </button>
    </form>
  )
} 