"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import type { User, UserProfile } from "./types"

interface AuthContextType {
  user: User | null
  profile: UserProfile | null
  isLoading: boolean
  login: (email: string, password: string) => Promise<void>
  register: (email: string, password: string, name: string) => Promise<void>
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
        // Check for existing session in localStorage
        const storedUser = localStorage.getItem("user")
        if (storedUser) {
          const userData = JSON.parse(storedUser)
          setUser(userData)
          // TODO: Optionally fetch fresh profile from database
          // const profileData = await getUserProfile(userData.id)
          // if (profileData) setProfile(profileData)
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
      const { loginUser } = await import("@/app/actions/auth")
      const result = await loginUser(email, password)

      if (!result.success || !result.user) {
        throw new Error(result.error || "Login failed")
      }

      const userData: User = {
        id: result.user.id,
        email: result.user.email,
        name: result.user.name || "User",
        isAuthenticated: true,
      }

      setUser(userData)
      localStorage.setItem("user", JSON.stringify(userData))

      // Set a basic profile (can be enhanced with getUserProfile later)
      setProfile({
        id: result.user.id,
        email: result.user.email,
        name: result.user.name || "User",
        phone: "",
        dateOfBirth: "",
        favoriteGenres: [],
        preferredCity: "",
        preferredTheater: "",
        loyaltyPoints: 0,
        watchedMovies: [],
        bookingHistory: [],
        avatar: "/placeholder-user.jpg",
      })
    } catch (error) {
      throw error instanceof Error ? error : new Error("Login failed")
    } finally {
      setIsLoading(false)
    }
  }

  const register = async (email: string, password: string, name: string) => {
    setIsLoading(true)
    try {
      const { registerUser } = await import("@/app/actions/auth")
      const result = await registerUser(email, password, name)

      if (!result.success || !result.user) {
        throw new Error(result.error || "Registration failed")
      }

      const userData: User = {
        id: result.user.id,
        email: result.user.email,
        name: result.user.name || name,
        isAuthenticated: true,
      }

      setUser(userData)
      localStorage.setItem("user", JSON.stringify(userData))

      // Set a basic profile
      setProfile({
        id: result.user.id,
        email: result.user.email,
        name: result.user.name || name,
        phone: "",
        dateOfBirth: "",
        favoriteGenres: [],
        preferredCity: "",
        preferredTheater: "",
        loyaltyPoints: 0,
        watchedMovies: [],
        bookingHistory: [],
        avatar: "/placeholder-user.jpg",
      })
    } catch (error) {
      throw error instanceof Error ? error : new Error("Registration failed")
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
      if (profile) {
        const updatedProfile = { ...profile, ...profileData }
        setProfile(updatedProfile)
        // TODO: Add server action to save profile updates to database
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
        register,
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
