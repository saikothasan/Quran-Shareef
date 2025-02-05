import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { getChapters } from "@/lib/quran"
import { Skeleton } from "@/components/ui/skeleton"
import { Suspense } from "react"
import type { Metadata } from "next"
import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"

export const metadata: Metadata = {
  title: "Explore the Holy Quran",
  description: "Browse all 114 Surahs of the Holy Quran with translations and audio recitations",
  openGraph: {
    title: "Explore the Holy Quran | Quraan Shareef",
    description: "Browse all 114 Surahs of the Holy Quran with translations and audio recitations",
  },
}

function LoadingSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {[...Array(8)].map((_, i) => (
        <Card key={i}>
          <CardContent className="p-4">
            <Skeleton className="h-6 w-16 mb-2" />
            <Skeleton className="h-8 w-full mb-2" />
            <Skeleton className="h-4 w-3/4" />
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

async function SurahGrid() {
  try {
    const chapters = await getChapters()

    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {chapters.map((chapter) => (
          <Link href={`/surah/${chapter.id}`} key={chapter.id}>
            <Card className="hover:bg-muted/50 transition-colors">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-muted-foreground">#{chapter.id}</span>
                  <span className="text-sm text-muted-foreground">{chapter.verses_count} verses</span>
                </div>
                <div className="text-xl font-arabic mb-1">{chapter.name_arabic}</div>
                <div className="text-sm text-muted-foreground">
                  {chapter.name_simple} • {chapter.translated_name.name}
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    )
  } catch (error) {
    console.error("Error in SurahGrid:", error)
    return (
      <div className="text-center">
        <p className="text-red-500 mb-4">Failed to load Quran data. Please try again later.</p>
        <p className="text-sm text-gray-600 mb-4">
          Error details: {error instanceof Error ? error.message : "Unknown error"}
        </p>
        <button
          onClick={() => window.location.reload()}
          className="bg-primary text-primary-foreground hover:bg-primary/90 font-bold py-2 px-4 rounded"
        >
          Retry
        </button>
      </div>
    )
  }
}

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <header className="bg-primary text-primary-foreground py-6">
        <div className="container mx-auto px-4">
          <h1 className="text-2xl md:text-3xl font-bold mb-6">Quraan Shareef</h1>
          <div className="relative max-w-2xl mx-auto">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input type="search" placeholder="Search surah..." className="w-full pl-9 bg-background text-foreground" />
            <div className="absolute right-3 top-1/2 -translate-y-1/2">
              <kbd className="hidden sm:inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground">
                <span className="text-xs">⌘</span>K
              </kbd>
            </div>
          </div>
        </div>
      </header>

      <nav className="border-b bg-card">
        <div className="container mx-auto px-4 py-2">
          <div className="flex gap-4 overflow-x-auto text-sm">
            {["About The Quran", "Al Mulk", "Yaseen", "Al Kahf", "Al Waqi'ah"].map((item) => (
              <Link key={item} href="#" className="whitespace-nowrap text-muted-foreground hover:text-foreground">
                {item}
              </Link>
            ))}
          </div>
        </div>
      </nav>

      <main className="container mx-auto px-4 py-8">
        <Suspense fallback={<LoadingSkeleton />}>
          <SurahGrid />
        </Suspense>
      </main>

      <footer className="bg-primary text-primary-foreground py-3 text-center mt-8">
        <p className="text-sm">© {new Date().getFullYear()} Quraan Shareef</p>
      </footer>
    </div>
  )
}

