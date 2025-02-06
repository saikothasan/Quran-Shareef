import { getChapterByName, getAudioUrl, slugify } from "@/lib/quran"
import { Skeleton } from "@/components/ui/skeleton"
import { Suspense } from "react"
import Link from "next/link"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { AudioPlayer } from "@/components/audio-player"

export const runtime = "edge"

interface PageProps {
  params: { name: string }
}

function LoadingSkeleton() {
  return (
    <div className="space-y-4">
      <Skeleton className="h-12 w-3/4 mx-auto" />
      <Skeleton className="h-8 w-1/2 mx-auto" />
      <Skeleton className="h-24 w-full" />
      {[...Array(920)].map((_, i) => (
        <div key={i} className="space-y-2">
          <Skeleton className="h-6 w-full" />
          <Skeleton className="h-4 w-3/4" />
        </div>
      ))}
    </div>
  )
}

async function SurahContent({ name }: { name: string }) {
  const chapter = await getChapterByName(name.replace(/-/g, " "))
  const audioUrl = getAudioUrl(chapter.id.toString())

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-center mb-2 text-primary">{chapter.name_simple}</h1>
      <p className="text-center text-muted-foreground mb-6">{chapter.translated_name.name}</p>

      <AudioPlayer audioUrl={audioUrl} />

      <div className="my-8">
        {chapter.verses.map((verse) => (
          <div key={verse.id} className="mb-6 p-4 bg-secondary rounded-lg">
            <p className="text-2xl font-arabic text-right mb-2">{verse.text}</p>
            <p className="text-sm">{verse.translation}</p>
            <span className="text-xs text-muted-foreground">{verse.id}</span>
          </div>
        ))}
      </div>

      <div className="flex justify-between mt-8">
        {chapter.id > 1 && (
          <Link href={`/surah/${slugify(chapter.name_simple)}`}>
            <Button variant="outline">
              <ChevronLeft className="mr-2 h-4 w-4" /> Previous Surah
            </Button>
          </Link>
        )}
        {chapter.id < 114 && (
          <Link href={`/surah/${slugify(chapter.name_simple)}`}>
            <Button variant="outline">
              Next Surah <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        )}
      </div>
    </div>
  )
}

export default function SurahPage({ params }: PageProps) {
  return (
    <div className="container mx-auto px-4 py-8">
      <Suspense fallback={<LoadingSkeleton />}>
        <SurahContent name={params.name} />
      </Suspense>
    </div>
  )
}

