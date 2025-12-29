"use client"

import { createContext, useContext, useState, type ReactNode } from "react"
import type { Movie, Seat, ParkingSlot, Booking } from "./types"

interface BookingContextType {
  booking: Partial<Booking>
  selectedCity: string | null
  selectedTheater: string | null
  setCity: (city: string) => void
  setTheater: (theater: string) => void
  setMovie: (movie: Movie) => void
  setShowtime: (showtime: string) => void
  setSeats: (seats: Seat[]) => void
  setParkingSlot: (slot: ParkingSlot | undefined) => void
  clearBooking: () => void
  calculateTotal: () => number
  convertToINR: (usd: number) => number
}

const BookingContext = createContext<BookingContextType | undefined>(undefined)

const USD_TO_INR = 83

export function BookingProvider({ children }: { children: ReactNode }) {
  const [booking, setBooking] = useState<Partial<Booking>>({})
  const [selectedCity, setSelectedCity] = useState<string | null>(null)
  const [selectedTheater, setSelectedTheater] = useState<string | null>(null)

  const setCity = (city: string) => {
    setSelectedCity(city)
    // Clear theater when city changes
    setSelectedTheater(null)
  }

  const setTheater = (theater: string) => {
    setSelectedTheater(theater)
  }

  const setMovie = (movie: Movie) => {
    setBooking((prev) => ({ ...prev, movie }))
  }

  const setShowtime = (showtime: string) => {
    setBooking((prev) => ({ ...prev, showtime }))
  }

  const setSeats = (seats: Seat[]) => {
    setBooking((prev) => ({ ...prev, seats }))
  }

  const setParkingSlot = (slot: ParkingSlot | undefined) => {
    setBooking((prev) => ({ ...prev, parkingSlot: slot }))
  }

  const calculateTotal = () => {
    const seatsTotal = booking.seats?.reduce((sum, seat) => sum + seat.price, 0) || 0
    const parkingTotal = booking.parkingSlot?.price || 0
    return seatsTotal + parkingTotal
  }

  const convertToINR = (usd: number) => {
    return Math.round(usd * USD_TO_INR)
  }

  const clearBooking = () => {
    setBooking({})
  }

  return (
    <BookingContext.Provider
      value={{
        booking,
        selectedCity,
        selectedTheater,
        setCity,
        setTheater,
        setMovie,
        setShowtime,
        setSeats,
        setParkingSlot,
        clearBooking,
        calculateTotal,
        convertToINR,
      }}
    >
      {children}
    </BookingContext.Provider>
  )
}

export function useBooking() {
  const context = useContext(BookingContext)
  if (!context) {
    throw new Error("useBooking must be used within BookingProvider")
  }
  return context
}
