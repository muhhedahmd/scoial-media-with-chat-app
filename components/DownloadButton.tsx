'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"

interface DownloadButtonProps {
  item: {
    mediaUrl: string
    name: string

  },
  className : string
  children : React.ReactNode | string
  
}

export default function DownloadButton({ item  , children , className}: DownloadButtonProps ) {
  const [isLoading, setIsLoading] = useState(false)

  const handleDownload = async () => {
    setIsLoading(true)
    try {
      const response = await fetch(item.mediaUrl)
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = item.name
      document.body.appendChild(link)
      link.click()
      link.parentNode?.removeChild(link)
      window.URL.revokeObjectURL(url)
    } catch (error) {
      console.error('Download failed:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Button 
      onClick={handleDownload} 
      disabled={isLoading}
      className={className}
    >

        {
            children
        }
   
    </Button>
  )
}