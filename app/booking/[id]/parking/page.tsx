"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { generateParkingSlots } from "@/lib/mock-data"
import { useBooking } from "@/lib/booking-context"
import { ParkingSelector } from "@/components/parking-selector"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, ParkingSquare } from "lucide-react"
import type { ParkingSlot } from "@/lib/types"

export default async function ParkingPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

  return <ParkingPageClient id={id} />
}

function ParkingPageClient({ id }: { id: string }) {
  const router = useRouter()
  const { booking, setParkingSlot, calculateTotal } = useBooking()
  const [selectedSlot, setSelectedSlot] = useState<ParkingSlot | undefined>(booking.parkingSlot)
  const [slots] = useState(generateParkingSlots())

  const handleContinue = () => {
    setParkingSlot(selectedSlot)
    router.push(`/booking/${id}/confirmation`)
  }

  const seatsTotal = booking.seats?.reduce((sum, seat) => sum + seat.price, 0) || 0
  const parkingTotal = selectedSlot?.price || 0
  const total = seatsTotal + parkingTotal

  return (
    <div className="relative min-h-screen bg-gradient-to-b from-background via-background/98 to-background/95">
      <div className="cinematic-spotlight" style={{ top: "30%", left: "15%", animationDelay: "2s" }} />

      <div className="container relative z-10 mx-auto px-4 py-8">
        <Button variant="ghost" onClick={() => router.back()} className="mb-6">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>

        <div className="mb-6 text-center">
          <h1 className="mb-2 text-3xl font-bold">Reserve Parking Slot</h1>
          <p className="text-muted-foreground">Guarantee your spot near the theater entrance</p>
        </div>

        <div className="grid gap-8 lg:grid-cols-[1fr_350px]">
          <div>
            <Card>
              <CardContent className="p-6">
                <ParkingSelector slots={slots} onSlotSelected={setSelectedSlot} selectedSlot={selectedSlot} />
              </CardContent>
            </Card>
          </div>

          <div>
            <Card className="sticky top-8 card-cinematic">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ParkingSquare className="h-5 w-5" />
                  Booking Summary
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="mb-2 text-sm font-medium text-muted-foreground">Movie Tickets</p>
                  <div className="flex flex-wrap gap-2">
                    {booking.seats?.map((seat) => (
                      <span
                        key={seat.id}
                        className="rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary"
                      >
                        {seat.row}
                        {seat.number}
                      </span>
                    ))}
                  </div>
                </div>

                {selectedSlot && (
                  <div>
                    <p className="mb-2 text-sm font-medium text-muted-foreground">Parking Slot</p>
                    <span className="inline-block rounded-full bg-accent px-3 py-1 text-sm font-medium">
                      {selectedSlot.level}-{selectedSlot.slot} ({selectedSlot.type})
                    </span>
                  </div>
                )}

                <div className="space-y-2 border-t border-border pt-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Tickets</span>
                    <span className="font-medium">₹{seatsTotal.toLocaleString("en-IN")}</span>
                  </div>
                  {selectedSlot && (
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Parking</span>
                      <span className="font-medium">₹{parkingTotal.toLocaleString("en-IN")}</span>
                    </div>
                  )}
                  <div className="flex justify-between border-t border-border pt-2 font-semibold">
                    <span>Total</span>
                    <span className="text-primary">₹{total.toLocaleString("en-IN")}</span>
                  </div>
                </div>

                <Button onClick={handleContinue} className="w-full" size="lg">
                  Continue to Checkout
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
