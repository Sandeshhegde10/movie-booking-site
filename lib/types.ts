export interface Movie {
  id: string
  title: string
  genre: string
  duration: string
  rating: string
  image: string
  description: string
  showtimes: string[]
  cities?: string[]
  language?: string
}

export interface Seat {
  id: string
  row: string
  number: number
  type: "standard" | "premium" | "vip"
  price: number
  isBooked: boolean
}

export interface ParkingSlot {
  id: string
  level: string
  slot: string
  type: "standard" | "covered" | "vip"
  price: number
  isBooked: boolean
}

export interface Booking {
  movie: Movie
  showtime: string
  seats: Seat[]
  parkingSlot?: ParkingSlot
  total: number
}

export interface City {
  id: string
  name: string
  theaters: Theater[]
}

export interface Theater {
  id: string
  name: string
  location: string
}

export interface User {
  id: string
  email: string
  name: string
  isAuthenticated: boolean
}

export interface UserProfile {
  id: string
  email: string
  name: string
  phone?: string
  dateOfBirth?: string
  favoriteGenres: string[]
  preferredCity?: string
  preferredTheater?: string
  loyaltyPoints: number
  bookingHistory: BookingHistory[]
  watchedMovies: string[]
  avatar?: string
}

export interface BookingHistory {
  id: string
  movieTitle: string
  movieImage: string
  date: string
  showtime: string
  theater: string
  seats: string[]
  totalAmount: number
  status: "completed" | "upcoming" | "cancelled"
}
