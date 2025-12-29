"use client"

import { useState } from "react"
import type { ParkingSlot } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { Car, Shield, Sparkles } from "lucide-react"

interface ParkingSelectorProps {
  slots: ParkingSlot[]
  onSlotSelected: (slot: ParkingSlot | undefined) => void
  selectedSlot?: ParkingSlot
}

export function ParkingSelector({ slots, onSlotSelected, selectedSlot }: ParkingSelectorProps) {
  const [selected, setSelected] = useState<ParkingSlot | undefined>(selectedSlot)
  const [currentLevel, setCurrentLevel] = useState("L1")

  const levels = Array.from(new Set(slots.map((s) => s.level))).sort()
  const levelSlots = slots.filter((s) => s.level === currentLevel)

  const toggleSlot = (slot: ParkingSlot) => {
    if (slot.isBooked) return

    const newSelected = selected?.id === slot.id ? undefined : slot
    setSelected(newSelected)
    onSlotSelected(newSelected)
  }

  const getSlotIcon = (type: string) => {
    switch (type) {
      case "vip":
        return <Sparkles className="h-4 w-4" />
      case "covered":
        return <Shield className="h-4 w-4" />
      default:
        return <Car className="h-4 w-4" />
    }
  }

  return (
    <div className="space-y-6 theater-curtain py-4">
      {/* Level Selector */}
      <div className="flex justify-center gap-2">
        {levels.map((level) => (
          <Button
            key={level}
            variant={currentLevel === level ? "default" : "outline"}
            onClick={() => setCurrentLevel(level)}
            className="w-20"
          >
            {level}
          </Button>
        ))}
      </div>

      {/* Parking Grid */}
      <div className="grid grid-cols-4 gap-3 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-8">
        {levelSlots.map((slot) => {
          const isSelected = selected?.id === slot.id
          return (
            <button
              key={slot.id}
              onClick={() => toggleSlot(slot)}
              disabled={slot.isBooked}
              className={cn(
                "flex aspect-square flex-col items-center justify-center gap-1 rounded-lg border-2 p-2 transition-all",
                slot.isBooked && "cursor-not-allowed border-muted bg-muted text-muted-foreground",
                !slot.isBooked &&
                  !isSelected &&
                  slot.type === "standard" &&
                  "border-secondary bg-secondary/50 text-secondary-foreground hover:bg-secondary",
                !slot.isBooked &&
                  !isSelected &&
                  slot.type === "covered" &&
                  "border-accent bg-accent/50 text-accent-foreground hover:bg-accent",
                !slot.isBooked &&
                  !isSelected &&
                  slot.type === "vip" &&
                  "border-primary bg-primary/10 text-primary hover:bg-primary/20",
                isSelected && "border-primary bg-primary text-primary-foreground shadow-lg shadow-primary/20",
              )}
            >
              {getSlotIcon(slot.type)}
              <span className="text-xs font-semibold">{slot.slot}</span>
            </button>
          )
        })}
      </div>

      {/* Legend */}
      <div className="flex flex-wrap items-center justify-center gap-4 text-sm">
        <div className="flex items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg border-2 border-secondary bg-secondary/50">
            <Car className="h-4 w-4" />
          </div>
          <span className="text-muted-foreground">Standard (₹415)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg border-2 border-accent bg-accent/50">
            <Shield className="h-4 w-4" />
          </div>
          <span className="text-muted-foreground">Covered (₹830)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg border-2 border-primary bg-primary/10">
            <Sparkles className="h-4 w-4" />
          </div>
          <span className="text-muted-foreground">VIP (₹1,245)</span>
        </div>
      </div>

      <div className="text-center">
        <Button
          variant="ghost"
          onClick={() => {
            setSelected(undefined)
            onSlotSelected(undefined)
          }}
          disabled={!selected}
          className="text-sm"
        >
          Skip Parking
        </Button>
      </div>
    </div>
  )
}
