import type { Movie } from "@/lib/types"
import { Card, CardContent } from "@/components/ui/card"
import { Clock, Star, Globe } from "lucide-react"
import Link from "next/link"

interface MovieCardProps {
  movie: Movie
}

export function MovieCard({ movie }: MovieCardProps) {
  return (
    <Link href={`/movie/${movie.id}`}>
      <Card className="group overflow-hidden border-border/50 bg-card/80 backdrop-blur transition-all hover:scale-[1.02] hover:border-primary/50 hover:shadow-2xl hover:shadow-primary/30">
        <div className="relative aspect-[2/3] overflow-hidden">
          <img
            src={movie.image || "/placeholder.svg"}
            alt={movie.title}
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent opacity-80" />

          {/* Rating Badge */}
          <div className="absolute right-3 top-3">
            <div className="flex items-center gap-1 rounded-full bg-background/95 px-3 py-1.5 shadow-lg backdrop-blur">
              <Star className="h-3.5 w-3.5 fill-secondary text-secondary" />
              <span className="text-sm font-bold text-foreground">{movie.rating}</span>
            </div>
          </div>

          {movie.language && (
            <div className="absolute left-3 top-3">
              <div className="flex items-center gap-1.5 rounded-full bg-primary/90 px-3 py-1.5 shadow-lg backdrop-blur">
                <Globe className="h-3 w-3 text-primary-foreground" />
                <span className="text-xs font-semibold text-primary-foreground">{movie.language}</span>
              </div>
            </div>
          )}

          <div className="absolute bottom-0 left-0 right-0 p-4">
            <div className="flex items-center gap-1 rounded-full bg-background/95 px-3 py-1.5 backdrop-blur w-fit shadow-md">
              <Clock className="h-3.5 w-3.5 text-muted-foreground" />
              <span className="text-sm font-medium">{movie.duration}</span>
            </div>
          </div>
        </div>
        <CardContent className="p-4">
          <h3 className="text-balance text-lg font-bold text-foreground line-clamp-1 mb-1">{movie.title}</h3>
          <p className="text-sm font-semibold text-primary">{movie.genre}</p>
        </CardContent>
      </Card>
    </Link>
  )
}
