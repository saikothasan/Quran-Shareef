import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Home } from "lucide-react"

export default function NotFound() {
  return (
    <div className="container mx-auto px-4 py-16 text-center">
      <h2 className="text-3xl font-bold mb-4 text-primary">পৃষ্ঠাটি পাওয়া যায়নি</h2>
      <p className="text-muted-foreground mb-8">দুঃখিত, আপনি যে পৃষ্ঠাটি খুঁজছেন তা পাওয়া যায়নি।</p>
      <Link href="/">
        <Button>
          <Home className="mr-2 h-4 w-4" />
          হোম পেজে ফিরে যান
        </Button>
      </Link>
    </div>
  )
}

