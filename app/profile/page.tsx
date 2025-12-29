"use client"

import type React from "react"

import { useAuth } from "@/lib/auth-context"
import { Header } from "@/components/header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import {
  User,
  Mail,
  Phone,
  Calendar,
  MapPin,
  Film,
  Trophy,
  Edit2,
  Save,
  X,
  Ticket,
  Clock,
  CheckCircle2,
  XCircle,
  Camera,
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import Image from "next/image"

export default function ProfilePage() {
  const { isAuthenticated, profile, updateProfile, isLoading } = useAuth()
  const router = useRouter()
  const { toast } = useToast()
  const [isEditing, setIsEditing] = useState(false)
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    dateOfBirth: "",
    preferredCity: "",
    preferredTheater: "",
    avatar: "",
  })

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/")
    }
  }, [isAuthenticated, isLoading, router])

  useEffect(() => {
    if (profile) {
      setFormData({
        name: profile.name,
        phone: profile.phone || "",
        dateOfBirth: profile.dateOfBirth || "",
        preferredCity: profile.preferredCity || "",
        preferredTheater: profile.preferredTheater || "",
        avatar: profile.avatar || "",
      })
      setAvatarPreview(profile.avatar || null)
    }
  }, [profile])

  if (isLoading || !profile) {
    return (
      <>
        <Header />
        <div className="flex min-h-screen items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
        </div>
      </>
    )
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: "File too large",
          description: "Please select an image smaller than 5MB",
          variant: "destructive",
        })
        return
      }

      const reader = new FileReader()
      reader.onloadend = () => {
        const result = reader.result as string
        setAvatarPreview(result)
        setFormData({ ...formData, avatar: result })
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSave = async () => {
    if (!formData.name.trim()) {
      toast({
        title: "Validation error",
        description: "Name is required",
        variant: "destructive",
      })
      return
    }

    if (formData.phone && !/^[+]?[\d\s-()]+$/.test(formData.phone)) {
      toast({
        title: "Validation error",
        description: "Please enter a valid phone number",
        variant: "destructive",
      })
      return
    }

    try {
      await updateProfile(formData)
      setIsEditing(false)
      toast({
        title: "Profile updated",
        description: "Your profile has been successfully updated.",
      })
    } catch (error) {
      toast({
        title: "Update failed",
        description: "Failed to update profile. Please try again.",
        variant: "destructive",
      })
    }
  }

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle2 className="h-4 w-4 text-green-500" />
      case "upcoming":
        return <Clock className="h-4 w-4 text-blue-500" />
      case "cancelled":
        return <XCircle className="h-4 w-4 text-red-500" />
      default:
        return null
    }
  }

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gradient-to-b from-background via-primary/5 to-background">
        <div className="cinematic-spotlight" style={{ top: "20%", left: "30%" }} />
        <div className="container relative z-10 mx-auto px-4 py-8">
          {/* Profile Header */}
          <Card className="mb-8 card-cinematic">
            <CardContent className="pt-6">
              <div className="flex flex-col items-start gap-6 md:flex-row md:items-center">
                <div className="relative">
                  <Avatar className="h-24 w-24 border-4 border-primary/20">
                    <AvatarImage src={avatarPreview || profile.avatar || "/placeholder.svg"} alt={profile.name} />
                    <AvatarFallback className="bg-primary/10 text-2xl font-bold text-primary">
                      {getInitials(profile.name)}
                    </AvatarFallback>
                  </Avatar>
                  {isEditing && (
                    <>
                      <Button
                        size="icon"
                        variant="secondary"
                        className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full shadow-lg"
                        onClick={() => fileInputRef.current?.click()}
                      >
                        <Camera className="h-4 w-4" />
                      </Button>
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleFileChange}
                      />
                    </>
                  )}
                </div>

                <div className="flex-1">
                  <h1 className="text-3xl font-bold">{profile.name}</h1>
                  <p className="text-muted-foreground">{profile.email}</p>

                  <div className="mt-4 flex flex-wrap gap-2">
                    {profile.favoriteGenres.map((genre) => (
                      <Badge key={genre} variant="secondary">
                        {genre}
                      </Badge>
                    ))}
                  </div>
                </div>

                <Card className="border-primary/20 bg-primary/5">
                  <CardContent className="p-4 text-center">
                    <Trophy className="mx-auto mb-2 h-8 w-8 text-primary" />
                    <div className="text-2xl font-bold text-primary">{profile.loyaltyPoints}</div>
                    <div className="text-xs text-muted-foreground">Loyalty Points</div>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>

          {/* Tabs */}
          <Tabs defaultValue="profile" className="space-y-6">
            <TabsList className="grid w-full grid-cols-3 lg:w-[400px]">
              <TabsTrigger value="profile">Profile</TabsTrigger>
              <TabsTrigger value="bookings">Bookings</TabsTrigger>
              <TabsTrigger value="watched">Watched</TabsTrigger>
            </TabsList>

            {/* Profile Tab */}
            <TabsContent value="profile">
              <Card className="card-cinematic">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Personal Information</CardTitle>
                      <CardDescription>Manage your account details and preferences</CardDescription>
                    </div>
                    {!isEditing ? (
                      <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>
                        <Edit2 className="mr-2 h-4 w-4" />
                        Edit Profile
                      </Button>
                    ) : (
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setIsEditing(false)
                            setAvatarPreview(profile.avatar || null)
                            setFormData({
                              name: profile.name,
                              phone: profile.phone || "",
                              dateOfBirth: profile.dateOfBirth || "",
                              preferredCity: profile.preferredCity || "",
                              preferredTheater: profile.preferredTheater || "",
                              avatar: profile.avatar || "",
                            })
                          }}
                        >
                          <X className="mr-2 h-4 w-4" />
                          Cancel
                        </Button>
                        <Button size="sm" onClick={handleSave}>
                          <Save className="mr-2 h-4 w-4" />
                          Save Changes
                        </Button>
                      </div>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid gap-6 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="name" className="flex items-center gap-2">
                        <User className="h-4 w-4" />
                        Full Name *
                      </Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        disabled={!isEditing}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email" className="flex items-center gap-2">
                        <Mail className="h-4 w-4" />
                        Email
                      </Label>
                      <Input id="email" value={profile.email} disabled />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="phone" className="flex items-center gap-2">
                        <Phone className="h-4 w-4" />
                        Phone Number
                      </Label>
                      <Input
                        id="phone"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        disabled={!isEditing}
                        placeholder="+91 98765 43210"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="dob" className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        Date of Birth
                      </Label>
                      <Input
                        id="dob"
                        type="date"
                        value={formData.dateOfBirth}
                        onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                        disabled={!isEditing}
                      />
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <h3 className="mb-4 font-semibold">Theater Preferences</h3>
                    <div className="grid gap-6 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="city" className="flex items-center gap-2">
                          <MapPin className="h-4 w-4" />
                          Preferred City
                        </Label>
                        <Input
                          id="city"
                          value={formData.preferredCity}
                          onChange={(e) => setFormData({ ...formData, preferredCity: e.target.value })}
                          disabled={!isEditing}
                          placeholder="Mumbai, Delhi, Bangalore..."
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="theater" className="flex items-center gap-2">
                          <Film className="h-4 w-4" />
                          Preferred Theater
                        </Label>
                        <Input
                          id="theater"
                          value={formData.preferredTheater}
                          onChange={(e) => setFormData({ ...formData, preferredTheater: e.target.value })}
                          disabled={!isEditing}
                          placeholder="PVR Icon, INOX..."
                        />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Bookings Tab */}
            <TabsContent value="bookings">
              <Card className="card-cinematic">
                <CardHeader>
                  <CardTitle>Booking History</CardTitle>
                  <CardDescription>View and manage your movie bookings</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {profile.bookingHistory.map((booking) => (
                      <Card key={booking.id} className="border-border/50">
                        <CardContent className="p-4">
                          <div className="flex flex-col gap-4 md:flex-row md:items-center">
                            <div className="relative h-24 w-16 flex-shrink-0 overflow-hidden rounded">
                              <Image
                                src={booking.movieImage || "/placeholder.svg"}
                                alt={booking.movieTitle}
                                fill
                                className="object-cover"
                              />
                            </div>

                            <div className="flex-1 space-y-2">
                              <div className="flex items-start justify-between">
                                <div>
                                  <h3 className="font-semibold">{booking.movieTitle}</h3>
                                  <p className="text-sm text-muted-foreground">{booking.theater}</p>
                                </div>
                                <Badge
                                  variant={
                                    booking.status === "completed"
                                      ? "secondary"
                                      : booking.status === "upcoming"
                                        ? "default"
                                        : "destructive"
                                  }
                                  className="flex items-center gap-1"
                                >
                                  {getStatusIcon(booking.status)}
                                  {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                                </Badge>
                              </div>

                              <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                                <div className="flex items-center gap-1">
                                  <Calendar className="h-4 w-4" />
                                  {new Date(booking.date).toLocaleDateString("en-IN")}
                                </div>
                                <div className="flex items-center gap-1">
                                  <Clock className="h-4 w-4" />
                                  {booking.showtime}
                                </div>
                                <div className="flex items-center gap-1">
                                  <Ticket className="h-4 w-4" />
                                  {booking.seats.join(", ")}
                                </div>
                              </div>

                              <div className="text-lg font-bold text-primary">
                                ₹{booking.totalAmount.toLocaleString("en-IN")}
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Watched Movies Tab */}
            <TabsContent value="watched">
              <Card className="card-cinematic">
                <CardHeader>
                  <CardTitle>Movies Watched</CardTitle>
                  <CardDescription>Your cinema journey - {profile.watchedMovies.length} movies</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8 text-muted-foreground">
                    <Film className="mx-auto h-12 w-12 mb-4 opacity-50" />
                    <p>You've watched {profile.watchedMovies.length} movies</p>
                    <p className="text-sm mt-2">Keep watching to unlock more rewards!</p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </>
  )
}
