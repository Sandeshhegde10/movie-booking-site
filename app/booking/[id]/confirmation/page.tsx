"use client"

import { useRouter } from "next/navigation"
import { useBooking } from "@/lib/booking-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle2, Calendar, Clock, MapPin, Ticket, ParkingSquare, ArrowLeft } from "lucide-react"
import { Header } from "@/components/header"
import { PaymentOptions } from "@/components/payment-options"
import { BookingQRCode } from "@/components/booking-qr-code"
import { useState } from "react"

export default async function ConfirmationPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  return <ConfirmationPageClient id={id} />
}

function ConfirmationPageClient({ id }: { id: string }) {
  const router = useRouter()
  const { booking, calculateTotal, clearBooking, selectedTheater } = useBooking()
  const [showPayment, setShowPayment] = useState(false)
  const [paymentComplete, setPaymentComplete] = useState(false)
  const [transactionId, setTransactionId] = useState("")
  const [paymentMethod, setPaymentMethod] = useState("")

  if (!booking.movie || !booking.seats) {
    router.push("/")
    return null
  }

  const handleNewBooking = () => {
    clearBooking()
    router.push("/")
  }

  const handlePaymentSuccess = (method: string, txnId: string) => {
    setPaymentMethod(method)
    setTransactionId(txnId)
    setPaymentComplete(true)
  }

  const bookingNumber = `BK${Date.now().toString().slice(-8)}`
  const totalAmount = calculateTotal()
  const theaterName = selectedTheater?.name || "Cinema Hall 1"

  return (
    <div className="relative min-h-screen bg-gradient-to-b from-background via-primary/5 to-background">
      <div className="cinematic-spotlight" style={{ top: "10%", left: "50%", transform: "translateX(-50%)" }} />
      <Header />
      <div className="container relative z-10 mx-auto px-4 py-12">
        <div className="mx-auto max-w-2xl">
          {!paymentComplete && !showPayment && (
            <>
              {/* Summary Header */}
              <div className="mb-8 text-center">
                <h1 className="mb-2 text-3xl font-bold">Review Your Booking</h1>
                <p className="text-muted-foreground">Confirm your details before payment</p>
              </div>

              {/* Booking Details */}
              <Card className="mb-6 card-cinematic">
                <CardHeader>
                  <CardTitle>Booking Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Movie Info */}
                  <div className="flex gap-4">
                    <img
                      src={booking.movie.image || "/placeholder.svg"}
                      alt={booking.movie.title}
                      className="h-32 w-24 rounded-lg object-cover"
                    />
                    <div className="flex-1 space-y-2">
                      <h3 className="text-xl font-semibold">{booking.movie.title}</h3>
                      <div className="space-y-1 text-sm text-muted-foreground">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4" />
                          <span>Today</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4" />
                          <span>{booking.showtime}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4" />
                          <span>{theaterName}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Seats */}
                  <div>
                    <div className="mb-2 flex items-center gap-2 text-sm font-medium">
                      <Ticket className="h-4 w-4" />
                      <span>Seats</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {booking.seats.map((seat) => (
                        <span
                          key={seat.id}
                          className="rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary"
                        >
                          {seat.row}
                          {seat.number} - ₹{seat.price.toLocaleString("en-IN")}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Parking */}
                  {booking.parkingSlot && (
                    <div>
                      <div className="mb-2 flex items-center gap-2 text-sm font-medium">
                        <ParkingSquare className="h-4 w-4" />
                        <span>Parking</span>
                      </div>
                      <div className="flex items-center gap-4 rounded-lg bg-accent/50 p-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-accent">
                          <ParkingSquare className="h-6 w-6" />
                        </div>
                        <div>
                          <p className="font-semibold">
                            Slot {booking.parkingSlot.level}-{booking.parkingSlot.slot}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {booking.parkingSlot.type.charAt(0).toUpperCase() + booking.parkingSlot.type.slice(1)} - ₹
                            {booking.parkingSlot.price.toLocaleString("en-IN")}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Total */}
                  <div className="border-t border-border pt-4">
                    <div className="flex justify-between text-lg font-semibold">
                      <span>Total Amount</span>
                      <span className="text-primary">₹{totalAmount.toLocaleString("en-IN")}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Button className="w-full h-14 text-base font-semibold" size="lg" onClick={() => setShowPayment(true)}>
                Proceed to Payment (₹{totalAmount.toLocaleString("en-IN")})
              </Button>
            </>
          )}

          {showPayment && !paymentComplete && (
            <div className="space-y-4">
              <Button variant="ghost" onClick={() => setShowPayment(false)} className="mb-4">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Summary
              </Button>
              <PaymentOptions amount={totalAmount} onPaymentSuccess={handlePaymentSuccess} />
            </div>
          )}

          {paymentComplete && (
            <div className="space-y-6">
              <div className="text-center">
                <div className="mb-4 flex justify-center">
                  <div className="rounded-full bg-primary/20 p-4 shadow-lg shadow-primary/30">
                    <CheckCircle2 className="h-12 w-12 text-primary" />
                  </div>
                </div>
                <h1 className="mb-2 text-3xl font-bold">Payment Successful!</h1>
                <p className="text-muted-foreground">Your booking is confirmed</p>
                <p className="mt-2 text-sm font-mono">
                  Booking #{bookingNumber} | {transactionId}
                </p>
                <p className="text-xs text-muted-foreground capitalize">Payment via {paymentMethod}</p>
              </div>

              <BookingQRCode
                bookingNumber={bookingNumber}
                movieTitle={booking.movie.title}
                showtime={booking.showtime || ""}
                seats={booking.seats.map((s) => `${s.row}${s.number}`).join(", ")}
                theater={theaterName}
              />

              <Button variant="outline" onClick={handleNewBooking} className="w-full bg-transparent" size="lg">
                Book Another Movie
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
