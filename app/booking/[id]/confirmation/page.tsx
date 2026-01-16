import ConfirmationPageClient from "./confirmation-page-client"

export default async function ConfirmationPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  return <ConfirmationPageClient id={id} />
}
