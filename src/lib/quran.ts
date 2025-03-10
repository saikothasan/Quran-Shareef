export interface Verse {
  id: number
  text: string
  translation: string
}

export interface Chapter {
  id: number
  name_arabic: string
  name_simple: string
  name_complex: string
  translated_name: {
    name: string
  }
  verses_count: number
  revelation_place: string
}

export interface ChapterDetail extends Chapter {
  verses: Verse[]
}

interface ChaptersResponse {
  chapters: Chapter[]
}

interface ChapterResponse {
  chapter: Chapter
}

interface VersesResponse {
  verses: {
    verse_number: number
    text_uthmani: string
  }[]
}

interface TranslationResponse {
  translations: {
    text: string
  }[]
}

export async function getChapters(): Promise<Chapter[]> {
  const response = await fetch("https://api.quran.com/api/v4/chapters?language=bn", {
    headers: { Accept: "application/json" },
  })

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`)
  }

  const data: ChaptersResponse = await response.json()
  return data.chapters
}

export async function getChapterBySlug(slug: string): Promise<ChapterDetail> {
  const chapters = await getChapters()
  const chapter = chapters.find((c) => slugify(c.name_simple) === slug)

  if (!chapter) {
    throw new Error(`Chapter not found: ${slug}`)
  }

  return getChapter(chapter.id.toString())
}

export async function getChapter(id: string): Promise<ChapterDetail> {
  const [chapterResponse, versesResponse, translationResponse] = await Promise.all([
    fetch(`https://api.quran.com/api/v4/chapters/${id}?language=bn`),
    fetch(`https://api.quran.com/api/v4/quran/verses/uthmani?chapter_number=${id}`),
    fetch(`https://api.quran.com/api/v4/quran/translations/161?chapter_number=${id}`),
  ])

  if (!chapterResponse.ok || !versesResponse.ok || !translationResponse.ok) {
    throw new Error(
      `Failed to fetch chapter data: ${chapterResponse.status}, ${versesResponse.status}, ${translationResponse.status}`,
    )
  }

  const [chapterData, versesData, translationData] = await Promise.all([
    chapterResponse.json().then((data): ChapterResponse => data as ChapterResponse),
    versesResponse.json().then((data): VersesResponse => data as VersesResponse),
    translationResponse.json().then((data): TranslationResponse => data as TranslationResponse),
  ])

  return {
    ...chapterData.chapter,
    verses: versesData.verses.map((verse, index) => ({
      id: verse.verse_number,
      text: verse.text_uthmani,
      translation: translationData.translations[index]?.text || "",
    })),
  }
}

export function getAudioUrl(chapterId: string): string {
  return `https://cdn.islamic.network/quran/audio-surah/128/ar.alafasy/${chapterId}.mp3`
}

export function slugify(name: string): string {
  return name.toLowerCase().replace(/\s+/g, "-")
}

