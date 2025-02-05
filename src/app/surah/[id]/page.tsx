import { AudioPlayer } from "@/components/audio-player"
import { Button } from "@/components/ui/button"
import { getChapter, getAudioUrl, getFallbackAudioUrl } from "@/lib/quran"
import Link from "next/link"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"
import { Suspense } from "react"
import type { Metadata } from "next"
import React from "react" // Import React

export const runtime = "edge"

interface PageProps {
  params: {
    id: string
  }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const chapter = await getChapter(params.id)

  return {
    title: `Surah ${chapter.name} (${chapter.transliteration})`,
    description: `Read Surah ${chapter.name} (${chapter.transliteration}) with translation. ${chapter.total_verses} verses. ${chapter.type} surah.`,
    openGraph: {
      title: `Surah ${chapter.name} (${chapter.transliteration}) | Quraan Shareef`,
      description: `Read Surah ${chapter.name} (${chapter.transliteration}) with translation. ${chapter.total_verses} verses. ${chapter.type} surah.`,
    },
  }
}

function LoadingSkeleton() {
  return (
    <div className="space-y-6">
      {[...Array(10)].map((_, i) => (
        <div key={i} className="p-4 rounded-lg bg-gray-50">
          <Skeleton className="h-8 w-full mb-4" />
          <Skeleton className="h-4 w-3/4 mb-2" />
          <Skeleton className="h-4 w-1/2" />
        </div>
      ))}
    </div>
  )
}

function VersesList({ verses, initialCount }: { verses: any[]; initialCount: number }) {
  const [visibleVerses, setVisibleVerses] = React.useState(initialCount)

  const loadMore = () => {
    setVisibleVerses((prevCount) => Math.min(prevCount + 10, verses.length))
  }

  return (
    <>
      {verses.slice(0, visibleVerses).map((verse, index) => (
        <div key={verse.id} className={`p-4 rounded-lg ${index % 2 === 0 ? "bg-muted" : "bg-background"}`}>
          <div className="text-right mb-4">
            <span className="font-arabic text-2xl leading-loose">{verse.text}</span>
            <span className="text-muted-foreground text-sm ml-2">({verse.id})</span>
          </div>

          <div className="space-y-2 text-sm">
            <p className="text-foreground">{verse.translation}</p>
          </div>
        </div>
      ))}
      {visibleVerses < verses.length && (
        <div className="text-center mt-6">
          <Button onClick={loadMore} variant="outline">
            Load More Verses
          </Button>
        </div>
      )}
    </>
  )
}

async function SurahContent({ id }: { id: string }) {
  const [chapter, audioUrl] = await Promise.all([getChapter(id), getAudioUrl(id)])
  const fallbackAudioUrl = getFallbackAudioUrl(id)

  const prevId = chapter.id > 1 ? chapter.id - 1 : null
  const nextId = chapter.id < 114 ? chapter.id + 1 : null

  return (
    <>
      <header className="bg-primary text-primary-foreground py-4 text-center">
        <div className="container mx-auto px-4">
          <h1 className="text-2xl md:text-3xl font-bold mb-2">
            {chapter.name} - {chapter.transliteration}
          </h1>
          <p className="text-sm md:text-base mb-2">
            {chapter.translation} • {chapter.total_verses} Verses • {chapter.type}
          </p>

          <div className="mt-4 text-xl md:text-2xl font-arabic">﴿ بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ ﴾</div>
          <p className="text-sm md:text-base">শুরু করছি আল্লাহর নামে যিনি পরম করুণাময়, অতি দয়ালু।</p>
        </div>
      </header>

      <div className="max-w-2xl mx-auto my-6 px-4">
        <AudioPlayer audioUrl={audioUrl} fallbackUrl={fallbackAudioUrl} />
      </div>

      <div className="bg-muted py-2">
        <div className="container mx-auto px-4 flex justify-between items-center">
          {prevId ? (
            <Link href={`/surah/${prevId}`}>
              <Button variant="ghost" className="text-primary">
                <ChevronLeft className="h-4 w-4 mr-2" />
                Previous Surah
              </Button>
            </Link>
          ) : (
            <div />
          )}

          {nextId ? (
            <Link href={`/surah/${nextId}`}>
              <Button variant="ghost" className="text-primary">
                Next Surah
                <ChevronRight className="h-4 w-4 ml-2" />
              </Button>
            </Link>
          ) : (
            <div />
          )}
        </div>
      </div>

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-6">
          <VersesList verses={chapter.verses} initialCount={10} />
        </div>
      </main>

      <div className="bg-muted py-2 mt-8">
        <div className="container mx-auto px-4 flex justify-between items-center">
          {prevId ? (
            <Link href={`/surah/${prevId}`}>
              <Button variant="ghost" className="text-primary">
                <ChevronLeft className="h-4 w-4 mr-2" />
                Previous Surah
              </Button>
            </Link>
          ) : (
            <div />
          )}

          {nextId ? (
            <Link href={`/surah/${nextId}`}>
              <Button variant="ghost" className="text-primary">
                Next Surah
                <ChevronRight className="h-4 w-4 ml-2" />
              </Button>
            </Link>
          ) : (
            <div />
          )}
        </div>
      </div>
    </>
  )
}

export default function SurahPage({ params }: PageProps) {
  return (
    <div className="min-h-screen bg-background">
      <Suspense fallback={<LoadingSkeleton />}>
        <SurahContent id={params.id} />
      </Suspense>
    </div>
  )
}

