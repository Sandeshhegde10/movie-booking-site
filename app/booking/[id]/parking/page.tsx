import ParkingPageClient from "./parking-page-client"

export default async function ParkingPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

  return <ParkingPageClient id={id} />
}
