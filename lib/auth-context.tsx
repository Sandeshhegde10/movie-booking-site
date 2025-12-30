"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import type { User, UserProfile } from "./types"
import { loginUser as dbLoginUser, registerUser as dbRegisterUser, getUserProfile } from "@/app/actions/auth"

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

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const initAuth = async () => {
      try {
        // Check for existing session
        const storedUser = localStorage.getItem("user")
        if (storedUser) {
          const userData = JSON.parse(storedUser)
          setUser(userData)

          // Load profile from database
          const userProfile = await getUserProfile(userData.id)
          if (userProfile) {
            setProfile(userProfile as any)
          }
        }
      } catch (error) {
        console.error("Failed to initialize auth:", error)
        localStorage.removeItem("user")
      } finally {
        setIsLoading(false)
      }
    }

    initAuth()
  }, [])

  const register = async (email: string, password: string, name: string) => {
    setIsLoading(true)
    try {
      const result = await dbRegisterUser(email, password, name)

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
      setProfile({
        id: userData.id,
        email: userData.email,
        name: userData.name,
        bookingHistory: [],
      } as any)

      localStorage.setItem("user", JSON.stringify(userData))
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : "Registration failed")
    } finally {
      setIsLoading(false)
    }
  }

  const login = async (email: string, password: string) => {
    setIsLoading(true)
    try {
      const result = await dbLoginUser(email, password)

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

      // Load user profile from database
      const userProfile = await getUserProfile(result.user.id)
      if (userProfile) {
        setProfile(userProfile as any)
      }

      localStorage.setItem("user", JSON.stringify(userData))
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : "Login failed")
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
