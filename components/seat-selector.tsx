"use client"

import { useState } from "react"
import type { Seat } from "@/lib/types"
import { cn } from "@/lib/utils"

interface SeatSelectorProps {
  seats: Seat[]
  onSeatsSelected: (seats: Seat[]) => void
  selectedSeats: Seat[]
}

export function SeatSelector({ seats, onSeatsSelected, selectedSeats }: SeatSelectorProps) {
  const [selected, setSelected] = useState<Seat[]>(selectedSeats)

  const rows = Array.from(new Set(seats.map((s) => s.row))).sort()

  const toggleSeat = (seat: Seat) => {
    if (seat.isBooked) return

    const isSelected = selected.some((s) => s.id === seat.id)
    let newSelected: Seat[]

    if (isSelected) {
      newSelected = selected.filter((s) => s.id !== seat.id)
    } else {
      newSelected = [...selected, seat]
    }

    setSelected(newSelected)
    onSeatsSelected(newSelected)
  }

  return (
    <div className="space-y-6">
      {/* Screen */}
      <div className="flex flex-col items-center gap-2">
        <div className="relative h-2 w-full max-w-2xl overflow-hidden rounded-full">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary to-transparent opacity-50 blur-xl" />
        </div>
        <p className="text-sm font-medium tracking-wider text-muted-foreground">SCREEN</p>
      </div>

      {/* Seats Grid */}
      <div className="space-y-2 theater-curtain py-8">
        {rows.map((row) => {
          const rowSeats = seats.filter((s) => s.row === row)
          return (
            <div key={row} className="flex items-center justify-center gap-2">
              <span className="w-8 text-center text-sm font-medium text-muted-foreground">{row}</span>
              <div className="flex gap-1">
                {rowSeats.map((seat) => {
                  const isSelected = selected.some((s) => s.id === seat.id)
                  return (
                    <button
                      key={seat.id}
                      onClick={() => toggleSeat(seat)}
                      disabled={seat.isBooked}
                      className={cn(
                        "h-8 w-8 rounded-t-lg text-xs font-medium transition-all",
                        seat.isBooked && "cursor-not-allowed bg-muted text-muted-foreground",
                        !seat.isBooked &&
                          !isSelected &&
                          seat.type === "standard" &&
                          "bg-secondary text-secondary-foreground hover:bg-secondary/80",
                        !seat.isBooked &&
                          !isSelected &&
                          seat.type === "premium" &&
                          "bg-accent text-accent-foreground hover:bg-accent/80",
                        !seat.isBooked &&
                          !isSelected &&
                          seat.type === "vip" &&
                          "bg-primary/20 text-primary hover:bg-primary/30",
                        isSelected &&
                          "bg-primary text-primary-foreground ring-2 ring-primary ring-offset-2 ring-offset-background",
                      )}
                    >
                      {seat.isBooked ? "✕" : seat.number}
                    </button>
                  )
                })}
              </div>
            </div>
          )
        })}
      </div>

      {/* Legend */}
      <div className="flex flex-wrap items-center justify-center gap-4 text-sm">
        <div className="flex items-center gap-2">
          <div className="h-6 w-6 rounded-t-lg bg-secondary" />
          <span className="text-muted-foreground">Standard (₹996)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-6 w-6 rounded-t-lg bg-accent" />
          <span className="text-muted-foreground">Premium (₹1,494)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-6 w-6 rounded-t-lg bg-primary/20" />
          <span className="text-muted-foreground">VIP (₹2,075)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-6 w-6 rounded-t-lg bg-muted" />
          <span className="text-muted-foreground">Booked</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-6 w-6 rounded-t-lg bg-primary ring-2 ring-primary ring-offset-2 ring-offset-background" />
          <span className="text-muted-foreground">Selected</span>
        </div>
      </div>
    </div>
  )
}
