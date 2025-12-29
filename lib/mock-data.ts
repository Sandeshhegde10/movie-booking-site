import type { Movie, Seat, ParkingSlot, City } from "./types"
import { allMovies } from "./all-movies-data"

export const movies: Movie[] = allMovies.slice(0, 12)

export const cities: City[] = [
  {
    id: "mumbai",
    name: "Mumbai",
    theaters: [
      { id: "pvr-phoenix", name: "PVR Phoenix Palladium", location: "Lower Parel" },
      { id: "inox-nariman", name: "INOX Nariman Point", location: "Nariman Point" },
      { id: "cinepolis-andheri", name: "Cinépolis Andheri", location: "Andheri West" },
      { id: "pvr-juhu", name: "PVR ICON Juhu", location: "Juhu" },
    ],
  },
  {
    id: "delhi",
    name: "Delhi",
    theaters: [
      { id: "pvr-saket", name: "PVR Select CITYWALK", location: "Saket" },
      { id: "pvr-priya", name: "PVR Priya", location: "Vasant Vihar" },
      { id: "inox-nehru", name: "INOX Nehru Place", location: "Nehru Place" },
      { id: "cinepolis-dlf", name: "Cinépolis DLF Place", location: "Saket" },
    ],
  },
  {
    id: "bangalore",
    name: "Bangalore",
    theaters: [
      { id: "pvr-vega", name: "PVR Vega City", location: "Bannerghatta Road" },
      { id: "inox-garuda", name: "INOX Garuda Mall", location: "Magrath Road" },
      { id: "cinepolis-rcity", name: "Cinépolis Royal Meenakshi", location: "Bannerghatta Road" },
      { id: "pvr-forum", name: "PVR Forum Mall", location: "Koramangala" },
    ],
  },
  {
    id: "hyderabad",
    name: "Hyderabad",
    theaters: [
      { id: "pvr-nexus", name: "PVR Nexus Mall", location: "Kukatpally" },
      { id: "inox-gvk", name: "INOX GVK One", location: "Banjara Hills" },
      { id: "asian-ameerpet", name: "Asian Cinemas", location: "Ameerpet" },
      { id: "pvr-irrum", name: "PVR Irrum Manzil", location: "Somajiguda" },
    ],
  },
  {
    id: "chennai",
    name: "Chennai",
    theaters: [
      { id: "pvr-ampa", name: "PVR Ampa Skywalk", location: "Amjikarai" },
      { id: "inox-marina", name: "INOX The Marina Mall", location: "OMR" },
      { id: "sathyam-royapettah", name: "Sathyam Cinemas", location: "Royapettah" },
      { id: "pvr-grand", name: "PVR Grand Galada", location: "Pallavaram" },
    ],
  },
]

export const generateSeats = (): Seat[] => {
  const seats: Seat[] = []
  const rows = ["A", "B", "C", "D", "E", "F", "G", "H"]

  rows.forEach((row, rowIndex) => {
    for (let i = 1; i <= 12; i++) {
      let type: "standard" | "premium" | "vip" = "standard"
      let price = 996

      if (rowIndex >= 5) {
        type = "vip"
        price = 2075
      } else if (rowIndex >= 3) {
        type = "premium"
        price = 1494
      }

      seats.push({
        id: `${row}${i}`,
        row,
        number: i,
        type,
        price,
        isBooked: Math.random() > 0.7, // Random booking status
      })
    }
  })

  return seats
}

export const generateParkingSlots = (): ParkingSlot[] => {
  const slots: ParkingSlot[] = []
  const levels = ["L1", "L2", "L3"]

  levels.forEach((level) => {
    for (let i = 1; i <= 20; i++) {
      let type: "standard" | "covered" | "vip" = "standard"
      let price = 415

      if (i <= 5) {
        type = "vip"
        price = 1245
      } else if (i <= 10) {
        type = "covered"
        price = 830
      }

      slots.push({
        id: `${level}-${i}`,
        level,
        slot: `${i.toString().padStart(2, "0")}`,
        type,
        price,
        isBooked: Math.random() > 0.6,
      })
    }
  })

  return slots
}
