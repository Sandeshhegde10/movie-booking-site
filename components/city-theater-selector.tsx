"use client"

import { useState } from "react"
import { Check, MapPin, Building2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cities } from "@/lib/mock-data"
import type { City, Theater } from "@/lib/types"
import { cn } from "@/lib/utils"

interface CityTheaterSelectorProps {
  onSelect?: (city: City, theater: Theater) => void
}

export function CityTheaterSelector({ onSelect }: CityTheaterSelectorProps) {
  const [openCity, setOpenCity] = useState(false)
  const [openTheater, setOpenTheater] = useState(false)
  const [selectedCity, setSelectedCity] = useState<City | null>(null)
  const [selectedTheater, setSelectedTheater] = useState<Theater | null>(null)

  const handleCitySelect = (city: City) => {
    setSelectedCity(city)
    setSelectedTheater(null)
    setOpenCity(false)
  }

  const handleTheaterSelect = (theater: Theater) => {
    setSelectedTheater(theater)
    setOpenTheater(false)
    if (selectedCity && onSelect) {
      onSelect(selectedCity, theater)
    }
  }

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
      {/* City Selector */}
      <Popover open={openCity} onOpenChange={setOpenCity}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={openCity}
            className="w-full justify-between border-primary/30 bg-card/60 backdrop-blur-md hover:bg-card/80 sm:w-[200px]"
          >
            <MapPin className="mr-2 h-4 w-4 text-primary" />
            {selectedCity ? selectedCity.name : "Select City"}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[200px] p-0">
          <Command>
            <CommandInput placeholder="Search city..." />
            <CommandList>
              <CommandEmpty>No city found.</CommandEmpty>
              <CommandGroup>
                {cities.map((city) => (
                  <CommandItem key={city.id} value={city.name} onSelect={() => handleCitySelect(city)}>
                    <Check className={cn("mr-2 h-4 w-4", selectedCity?.id === city.id ? "opacity-100" : "opacity-0")} />
                    {city.name}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>

      {/* Theater Selector */}
      <Popover open={openTheater} onOpenChange={setOpenTheater}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={openTheater}
            disabled={!selectedCity}
            className="w-full justify-between border-primary/30 bg-card/60 backdrop-blur-md hover:bg-card/80 disabled:opacity-50 sm:w-[280px]"
          >
            <Building2 className="mr-2 h-4 w-4 text-primary" />
            {selectedTheater ? <span className="truncate">{selectedTheater.name}</span> : "Select Theater"}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[280px] p-0">
          <Command>
            <CommandInput placeholder="Search theater..." />
            <CommandList>
              <CommandEmpty>No theater found.</CommandEmpty>
              <CommandGroup>
                {selectedCity?.theaters.map((theater) => (
                  <CommandItem key={theater.id} value={theater.name} onSelect={() => handleTheaterSelect(theater)}>
                    <Check
                      className={cn("mr-2 h-4 w-4", selectedTheater?.id === theater.id ? "opacity-100" : "opacity-0")}
                    />
                    <div className="flex flex-col">
                      <span className="font-medium">{theater.name}</span>
                      <span className="text-xs text-muted-foreground">{theater.location}</span>
                    </div>
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  )
}
