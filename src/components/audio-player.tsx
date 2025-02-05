"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Play, Pause, Volume2, AlertCircle } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

interface AudioPlayerProps {
  audioUrl: string
  fallbackUrl?: string
}

export function AudioPlayer({ audioUrl, fallbackUrl }: AudioPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [error, setError] = useState<string | null>(null)
  const audioRef = useRef<HTMLAudioElement>(null)

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    const handleCanPlay = () => {
      setError(null)
      setDuration(audio.duration)
    }

    const handleError = () => {
      setError("Failed to load audio. Please try again later.")
      if (fallbackUrl && audioUrl !== fallbackUrl) {
        audio.src = fallbackUrl
      }
    }

    audio.addEventListener("canplay", handleCanPlay)
    audio.addEventListener("error", handleError)

    return () => {
      audio.removeEventListener("canplay", handleCanPlay)
      audio.removeEventListener("error", handleError)
    }
  }, [audioUrl, fallbackUrl])

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause()
      } else {
        audioRef.current.play().catch((e) => {
          console.error("Playback failed", e)
          setError("Playback failed. Please try again.")
        })
      }
      setIsPlaying(!isPlaying)
    }
  }

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime)
    }
  }

  const handleSliderChange = (value: number[]) => {
    if (audioRef.current) {
      audioRef.current.currentTime = value[0]
      setCurrentTime(value[0])
    }
  }

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
    return `${minutes}:${seconds.toString().padStart(2, "0")}`
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow p-4 flex items-center gap-4">
      <Button variant="ghost" size="icon" onClick={togglePlay} className="h-10 w-10">
        {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
      </Button>

      <div className="flex-1">
        <Slider
          value={[currentTime]}
          min={0}
          max={duration}
          step={0.1}
          onValueChange={handleSliderChange}
          className="w-full"
        />
        <div className="flex justify-between text-sm text-gray-500 mt-1">
          <span>{formatTime(currentTime)}</span>
          <span>{formatTime(duration)}</span>
        </div>
      </div>

      <Volume2 className="h-4 w-4 text-gray-500" />

      <audio ref={audioRef} src={audioUrl} onTimeUpdate={handleTimeUpdate} onEnded={() => setIsPlaying(false)} />
    </div>
  )
}

