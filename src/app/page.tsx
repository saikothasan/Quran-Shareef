import Link from "next/link"
import { getChapters, slugify } from "@/lib/quran"
import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Suspense } from "react"
import type { Metadata } from "next"

export const runtime = "edge"

export const metadata: Metadata = {
  title: "বাংলা কুরআন শরীফ - সূরা তালিকা",
  description: "পবিত্র কুরআন শরীফের ১১৪টি সূরা দেখুন। বাংলা অনুবাদ এবং অডিও তিলাওয়াত সহ প্রতিটি সূরা পড়ুন ও শুনুন।",
  openGraph: {
    title: "বাংলা কুরআন শরীফ - সূরা তালিকা",
    description: "পবিত্র কুরআন শরীফের ১১৪টি সূরা দেখুন। বাংলা অনুবাদ এবং অডিও তিলাওয়াত সহ প্রতিটি সূরা পড়ুন ও শুনুন।",
  },
  twitter: {
    title: "বাংলা কুরআন শরীফ - সূরা তালিকা",
    description: "পবিত্র কুরআন শরীফের ১১৪টি সূরা দেখুন। বাংলা অনুবাদ এবং অডিও তিলাওয়াত সহ প্রতিটি সূরা পড়ুন ও শুনুন।",
  },
}

function LoadingSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {[...Array(114)].map((_, i) => (
        <Card key={i}>
          <CardContent className="p-4">
            <Skeleton className="h-6 w-16 mb-2" />
            <Skeleton className="h-4 w-full" />
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

async function SurahGrid() {
  const chapters = await getChapters()

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {chapters.map((chapter) => (
        <Link href={`/surah/${slugify(chapter.name_simple)}`} key={chapter.id}>
          <Card className="hover:bg-accent transition-colors">
            <CardContent className="p-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-primary">{chapter.id}</span>
                <span className="text-sm text-muted-foreground">{chapter.verses_count} আয়াত</span>
              </div>
              <h2 className="text-lg font-semibold mb-1">{chapter.name_simple}</h2>
              <p className="text-sm text-muted-foreground">{chapter.translated_name.name}</p>
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  )
}

export default function Home() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8 text-center text-primary">বাংলা কুরআন শরীফ</h1>
      <Suspense fallback={<LoadingSkeleton />}>
        <SurahGrid />
      </Suspense>
    </div>
  )
}

