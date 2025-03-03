import React from 'react'
import { DownloaderForm } from '../_components/DownloaderForm'

const TiktokDownloader = () => {
  return (
    <div className='w-full flex justify-center items-center h-screen bg-gray-50'>
      <div className='min-w-[400px] w-[40%] p-6 bg-white shadow-lg rounded-lg'>
        <h1 className='text-2xl font-bold mb-4 text-center'>TikTok Downloader</h1>
        <DownloaderForm/>
      </div>
    </div>
  )
}

export default TiktokDownloader
