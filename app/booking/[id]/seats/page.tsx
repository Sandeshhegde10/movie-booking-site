import SeatsPageClient from "./seats-page-client"

export default async function SeatsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

  return <SeatsPageClient id={id} />
}

