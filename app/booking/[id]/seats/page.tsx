"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { generateSeats } from "@/lib/mock-data"
import { useBooking } from "@/lib/booking-context"
import { SeatSelector } from "@/components/seat-selector"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Ticket } from "lucide-react"
import type { Seat } from "@/lib/types"

export default async function SeatsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

  return <SeatsPageClient id={id} />
}

function SeatsPageClient({ id }: { id: string }) {
  const router = useRouter()
  const { booking, setSeats } = useBooking()
  const [selectedSeats, setSelectedSeats] = useState<Seat[]>(booking.seats || [])
  const [seats] = useState(generateSeats())

  const handleContinue = () => {
    if (selectedSeats.length === 0) return
    setSeats(selectedSeats)
    router.push(`/booking/${id}/parking`)
  }

  const total = selectedSeats.reduce((sum, seat) => sum + seat.price, 0)

  return (
    <div className="relative min-h-screen bg-gradient-to-b from-background via-background/98 to-background/95">
      {/* Theater curtain effect */}
      <div className="cinematic-spotlight" style={{ top: "20%", right: "10%" }} />

      <div className="container relative z-10 mx-auto px-4 py-8">
        <Button variant="ghost" onClick={() => router.back()} className="mb-6">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>

        <div className="mb-6 text-center">
          <h1 className="mb-2 text-3xl font-bold">Select Your Seats</h1>
          <p className="text-muted-foreground">
            {booking.movie?.title} • {booking.showtime}
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-[1fr_350px]">
          <div>
            <Card>
              <CardContent className="p-6">
                <SeatSelector seats={seats} onSeatsSelected={setSelectedSeats} selectedSeats={selectedSeats} />
              </CardContent>
            </Card>
          </div>

          <div>
            <Card className="sticky top-8 card-cinematic">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Ticket className="h-5 w-5" />
                  Booking Summary
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="mb-2 text-sm font-medium text-muted-foreground">Selected Seats</p>
                  {selectedSeats.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {selectedSeats.map((seat) => (
                        <span
                          key={seat.id}
                          className="rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary"
                        >
                          {seat.row}
                          {seat.number}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">No seats selected</p>
                  )}
                </div>

                <div className="border-t border-border pt-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span className="font-medium">₹{total.toLocaleString("en-IN")}</span>
                  </div>
                </div>

                <Button onClick={handleContinue} disabled={selectedSeats.length === 0} className="w-full" size="lg">
                  Continue to Parking
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
