import Link from "next/link"
import { getChapters } from "@/lib/quran"
import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Suspense } from "react"

export const runtime = "edge"

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
        <Link href={`/surah/${chapter.id}`} key={chapter.id}>
          <Card className="hover:bg-muted/50 transition-colors">
            <CardContent className="p-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium">{chapter.id}</span>
                <span className="text-sm text-muted-foreground">{chapter.verses_count} verses</span>
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
      <h1 className="text-3xl font-bold mb-8 text-center">The Noble Quran</h1>
      <Suspense fallback={<LoadingSkeleton />}>
        <SurahGrid />
      </Suspense>
    </div>
  )
}

