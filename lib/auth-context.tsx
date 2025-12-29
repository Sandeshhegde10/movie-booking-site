"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import type { User, UserProfile } from "./types"

interface AuthContextType {
  user: User | null
  profile: UserProfile | null
  isLoading: boolean
  login: (email: string, password: string) => Promise<void>
  logout: () => void
  updateProfile: (profileData: Partial<UserProfile>) => Promise<void>
  isAuthenticated: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

const mockProfile: UserProfile = {
  id: "1",
  email: "user@example.com",
  name: "John Doe",
  phone: "+91 98765 43210",
  dateOfBirth: "1990-05-15",
  favoriteGenres: ["Action", "Thriller", "Drama"],
  preferredCity: "Mumbai",
  preferredTheater: "PVR Icon",
  loyaltyPoints: 2850,
  watchedMovies: ["1", "2", "3"],
  bookingHistory: [
    {
      id: "B001",
      movieTitle: "Pushpa 2: The Rule",
      movieImage: "/pushpa-2-the-rule-poster.jpg",
      date: "2024-12-15",
      showtime: "7:00 PM",
      theater: "PVR Icon, Mumbai",
      seats: ["H5", "H6"],
      totalAmount: 2988,
      status: "completed",
    },
    {
      id: "B002",
      movieTitle: "Animal",
      movieImage: "/animal-movie-poster.jpg",
      date: "2024-12-20",
      showtime: "9:30 PM",
      theater: "INOX Leisure Mall, Delhi",
      seats: ["F8", "F9"],
      totalAmount: 3320,
      status: "upcoming",
    },
  ],
  avatar: "/placeholder-user.jpg",
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const initAuth = async () => {
      try {
        // Simulate checking for existing session
        const storedUser = localStorage.getItem("user")
        if (storedUser) {
          const userData = JSON.parse(storedUser)
          setUser(userData)
          setProfile(mockProfile)
        }
      } catch (error) {
        console.error("Failed to initialize auth:", error)
      } finally {
        setIsLoading(false)
      }
    }

    initAuth()
  }, [])

  const login = async (email: string, password: string) => {
    setIsLoading(true)
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000))

      const userData: User = {
        id: "1",
        email,
        name: "John Doe",
        isAuthenticated: true,
      }

      setUser(userData)
      setProfile(mockProfile)
      localStorage.setItem("user", JSON.stringify(userData))
    } catch (error) {
      throw new Error("Login failed")
    } finally {
      setIsLoading(false)
    }
  }

  const logout = () => {
    setUser(null)
    setProfile(null)
    localStorage.removeItem("user")
  }

  const updateProfile = async (profileData: Partial<UserProfile>) => {
    setIsLoading(true)
    try {
      await new Promise((resolve) => setTimeout(resolve, 500))

      if (profile) {
        const updatedProfile = { ...profile, ...profileData }
        setProfile(updatedProfile)
        localStorage.setItem("profile", JSON.stringify(updatedProfile))
      }
    } catch (error) {
      throw new Error("Profile update failed")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        isLoading,
        login,
        logout,
        updateProfile,
        isAuthenticated: !!user?.isAuthenticated,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider")
  }
  return context
}
