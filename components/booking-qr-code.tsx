"use client"

import { useEffect, useRef } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Download, Share2, QrCode } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface BookingQRCodeProps {
  bookingNumber: string
  movieTitle: string
  showtime: string
  seats: string
  theater: string
}

export function BookingQRCode({ bookingNumber, movieTitle, showtime, seats, theater }: BookingQRCodeProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const { toast } = useToast()

  useEffect(() => {
    if (canvasRef.current) {
      generateQRCode()
    }
  }, [bookingNumber])

  const generateQRCode = () => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const size = 300
    canvas.width = size
    canvas.height = size

    // Create QR-like pattern (simplified version)
    const cellSize = size / 25
    const data = bookingNumber + movieTitle + showtime

    // Background
    ctx.fillStyle = "#ffffff"
    ctx.fillRect(0, 0, size, size)

    // Generate pseudo-QR pattern based on booking data
    ctx.fillStyle = "#000000"
    for (let i = 0; i < 25; i++) {
      for (let j = 0; j < 25; j++) {
        const hash = (i * 31 + j * 17 + data.charCodeAt((i + j) % data.length)) % 2
        if (hash === 0) {
          ctx.fillRect(i * cellSize, j * cellSize, cellSize, cellSize)
        }
      }
    }

    // Add corner markers (like real QR codes)
    const markerSize = cellSize * 7
    const drawMarker = (x: number, y: number) => {
      ctx.fillStyle = "#000000"
      ctx.fillRect(x, y, markerSize, markerSize)
      ctx.fillStyle = "#ffffff"
      ctx.fillRect(x + cellSize, y + cellSize, markerSize - 2 * cellSize, markerSize - 2 * cellSize)
      ctx.fillStyle = "#000000"
      ctx.fillRect(x + 2 * cellSize, y + 2 * cellSize, markerSize - 4 * cellSize, markerSize - 4 * cellSize)
    }

    drawMarker(0, 0)
    drawMarker(size - markerSize, 0)
    drawMarker(0, size - markerSize)
  }

  const handleDownload = () => {
    const canvas = canvasRef.current
    if (!canvas) return

    // Create a download canvas with booking info
    const downloadCanvas = document.createElement("canvas")
    const ctx = downloadCanvas.getContext("2d")
    if (!ctx) return

    downloadCanvas.width = 400
    downloadCanvas.height = 550

    // Background
    ctx.fillStyle = "#0a0a0a"
    ctx.fillRect(0, 0, downloadCanvas.width, downloadCanvas.height)

    // Draw QR code
    ctx.drawImage(canvas, 50, 50, 300, 300)

    // Add booking details
    ctx.fillStyle = "#ffffff"
    ctx.font = "bold 20px sans-serif"
    ctx.textAlign = "center"
    ctx.fillText("LUMIÈRE - Cinema Reborn", 200, 380)

    ctx.font = "14px sans-serif"
    ctx.fillText(`Booking: ${bookingNumber}`, 200, 410)
    ctx.fillText(movieTitle, 200, 435)
    ctx.fillText(`${showtime} | ${seats}`, 200, 460)
    ctx.fillText(theater, 200, 485)

    ctx.font = "12px sans-serif"
    ctx.fillStyle = "#888888"
    ctx.fillText("Show this QR code at the entrance", 200, 520)

    // Download
    const link = document.createElement("a")
    link.download = `booking-${bookingNumber}.png`
    link.href = downloadCanvas.toDataURL()
    link.click()

    toast({
      title: "QR code downloaded",
      description: "Your booking QR code has been saved",
    })
  }

  const handleShare = async () => {
    const canvas = canvasRef.current
    if (!canvas) return

    try {
      const blob = await new Promise<Blob>((resolve) => canvas.toBlob((b) => resolve(b!)))
      const file = new File([blob], `booking-${bookingNumber}.png`, { type: "image/png" })

      if (navigator.share && navigator.canShare({ files: [file] })) {
        await navigator.share({
          title: `Booking Confirmation - ${movieTitle}`,
          text: `Booking #${bookingNumber} for ${movieTitle}`,
          files: [file],
        })
        toast({
          title: "Shared successfully",
          description: "Your booking has been shared",
        })
      } else {
        // Fallback: copy booking details to clipboard
        const text = `Booking #${bookingNumber}\n${movieTitle}\n${showtime} | ${seats}\n${theater}`
        await navigator.clipboard.writeText(text)
        toast({
          title: "Copied to clipboard",
          description: "Booking details copied to clipboard",
        })
      }
    } catch (error) {
      toast({
        title: "Share failed",
        description: "Could not share the booking",
        variant: "destructive",
      })
    }
  }

  return (
    <Card className="card-cinematic">
      <CardHeader className="text-center">
        <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-primary/20">
          <QrCode className="h-6 w-6 text-primary" />
        </div>
        <CardTitle>Your Booking QR Code</CardTitle>
        <CardDescription>Show this at the theater entrance</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex justify-center">
          <div className="rounded-lg bg-white p-4 shadow-lg">
            <canvas ref={canvasRef} className="h-[300px] w-[300px]" />
          </div>
        </div>

        <div className="space-y-2 rounded-lg bg-accent/50 p-4 text-sm">
          <p className="font-semibold">Booking #{bookingNumber}</p>
          <p>{movieTitle}</p>
          <p className="text-muted-foreground">
            {showtime} | Seats: {seats}
          </p>
          <p className="text-muted-foreground">{theater}</p>
        </div>

        <div className="flex gap-2">
          <Button className="flex-1" onClick={handleDownload}>
            <Download className="mr-2 h-4 w-4" />
            Download
          </Button>
          <Button variant="outline" className="flex-1 bg-transparent" onClick={handleShare}>
            <Share2 className="mr-2 h-4 w-4" />
            Share
          </Button>
        </div>

        <p className="text-center text-xs text-muted-foreground">Save this QR code for easy entry at the theater</p>
      </CardContent>
    </Card>
  )
}
