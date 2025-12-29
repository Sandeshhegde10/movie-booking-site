export interface Product {
  id: string
  name: string
  description: string
  priceInPaise: number // INR in paise (1 INR = 100 paise)
}

// Booking products for Stripe checkout
export const PRODUCTS: Product[] = [
  {
    id: "movie-booking",
    name: "Movie Ticket & Parking",
    description: "Complete movie booking with parking reservation",
    priceInPaise: 100, // Will be calculated dynamically based on selections
  },
]
