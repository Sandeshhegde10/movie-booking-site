"use client"

import Link from "next/link"
import { Film, Sparkles, User, LogOut, LogIn } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/lib/auth-context"
import { useState } from "react"
import { LoginDialog } from "./login-dialog"

export function Header() {
  const { isAuthenticated, logout, profile } = useAuth()
  const [showLogin, setShowLogin] = useState(false)

  return (
    <>
      <header className="sticky top-0 z-50 border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-secondary">
              <Film className="h-6 w-6 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold tracking-tight">LUMIÈRE</span>
          </Link>

          {/* Navigation */}
          <nav className="hidden items-center gap-6 md:flex">
            <Link
              href="/movies"
              className="flex items-center gap-2 text-sm font-medium transition-colors hover:text-primary"
            >
              <Film className="h-4 w-4" />
              <span>Movies</span>
            </Link>
            <Link
              href="/quiz"
              className="flex items-center gap-2 text-sm font-medium transition-colors hover:text-primary"
            >
              <Sparkles className="h-4 w-4" />
              <span>AI Quiz</span>
            </Link>
            {isAuthenticated && (
              <Link
                href="/profile"
                className="flex items-center gap-2 text-sm font-medium transition-colors hover:text-primary"
              >
                <User className="h-4 w-4" />
                <span>My Profile</span>
              </Link>
            )}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-2">
            {isAuthenticated ? (
              <div className="flex items-center gap-3">
                <span className="hidden text-sm text-muted-foreground sm:inline">{profile?.name}</span>
                <Button variant="ghost" size="sm" onClick={logout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  Sign Out
                </Button>
              </div>
            ) : (
              <Button variant="ghost" size="sm" onClick={() => setShowLogin(true)}>
                <LogIn className="mr-2 h-4 w-4" />
                Sign In
              </Button>
            )}
          </div>
        </div>
      </header>

      <LoginDialog open={showLogin} onOpenChange={setShowLogin} />
    </>
  )
}
