import { Navigation } from "@/components/navigation"
import { PodDiscussion } from "@/components/pod-discussion"

interface PodPageProps {
  params: {
    id: string
  }
}

export default function PodPage({ params }: PodPageProps) {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <PodDiscussion podId={params.id} />
    </div>
  )
}
