export default function Loading() {
    return (
        <div className="container mx-auto px-4 py-8">
            <div className="mb-6 h-10 w-32 animate-pulse rounded-lg bg-muted"></div>

            <div className="grid gap-8 lg:grid-cols-3">
                {/* Movie Info Skeleton */}
                <div className="lg:col-span-2">
                    <div className="grid gap-6 md:grid-cols-[300px_1fr]">
                        {/* Poster skeleton */}
                        <div className="aspect-[2/3] animate-pulse rounded-lg bg-muted"></div>

                        {/* Info skeleton */}
                        <div className="space-y-4">
                            <div className="h-10 w-3/4 animate-pulse rounded bg-muted"></div>
                            <div className="h-6 w-1/2 animate-pulse rounded bg-muted"></div>
                            <div className="h-20 w-full animate-pulse rounded bg-muted"></div>
                        </div>
                    </div>
                </div>

                {/* Booking Selection Skeleton */}
                <div className="space-y-4">
                    <div className="h-48 animate-pulse rounded-lg bg-muted"></div>
                    <div className="h-64 animate-pulse rounded-lg bg-muted"></div>
                </div>
            </div>
        </div>
    )
}
