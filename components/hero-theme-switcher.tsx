"use client"
import { Palette } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

export type HeroTheme = "dark-cinema" | "modern-theater" | "premium-lounge" | "cinematic-abstract"

interface HeroThemeSwitcherProps {
  currentTheme: HeroTheme
  onThemeChange: (theme: HeroTheme) => void
}

const themes = [
  { value: "dark-cinema" as HeroTheme, label: "Dark Cinema", description: "Luxurious dark theater" },
  { value: "modern-theater" as HeroTheme, label: "Modern Theater", description: "Light & sophisticated" },
  { value: "premium-lounge" as HeroTheme, label: "Premium Lounge", description: "Dark white elegance" },
  { value: "cinematic-abstract" as HeroTheme, label: "Cinematic Abstract", description: "Artistic gradient" },
]

export function HeroThemeSwitcher({ currentTheme, onThemeChange }: HeroThemeSwitcherProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="fixed right-4 top-20 z-50 gap-2 border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60"
        >
          <Palette className="h-4 w-4" />
          <span className="hidden sm:inline">Hero Theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        {themes.map((theme) => (
          <DropdownMenuItem
            key={theme.value}
            onClick={() => onThemeChange(theme.value)}
            className="flex cursor-pointer flex-col items-start gap-1"
          >
            <div className="flex items-center gap-2">
              <div className={`h-3 w-3 rounded-full ${currentTheme === theme.value ? "bg-primary" : "bg-muted"}`} />
              <span className="font-medium">{theme.label}</span>
            </div>
            <span className="text-xs text-muted-foreground">{theme.description}</span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
