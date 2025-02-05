export interface Verse {
  id: number
  text: string
  translation: string
}

export interface Chapter {
  id: number
  name_arabic: string
  name_simple: string
  translated_name: {
    name: string
  }
  verses_count: number
  revelation_place: string
}

export interface ChapterDetail {
  id: number
  name: string
  transliteration: string
  translation: string
  type: string
  total_verses: number
  verses: Verse[]
}

interface QuranAPIResponse {
  chapters: Chapter[]
}

interface ChapterAPIResponse {
  chapter: {
    id: number
    name_arabic: string
    name_simple: string
    translated_name: {
      name: string
    }
    verses_count: number
    revelation_place: string
  }
}

interface VersesAPIResponse {
  verses: Array<{
    id: number
    verse_number: number
    verse_key: string
    text_uthmani: string
    translations: Array<{
      text: string
    }>
  }>
}

// Cache the chapters data
let chaptersCache: Chapter[] | null = null

export async function getChapters(): Promise<Chapter[]> {
  if (chaptersCache) {
    return chaptersCache
  }

  try {
    const response = await fetch("https://api.quran.com/api/v4/chapters?language=bn", {
      headers: {
        Accept: "application/json",
      },
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = (await response.json()) as QuranAPIResponse

    if (!data.chapters || !Array.isArray(data.chapters)) {
      throw new Error("Invalid API response format")
    }

    chaptersCache = data.chapters
    return data.chapters
  } catch (error) {
    console.error("Error fetching chapters:", error)
    throw new Error("Failed to load chapters. Please try again later.")
  }
}

// Cache the chapter details
const chapterDetailsCache = new Map<string, ChapterDetail>()

export async function getChapter(id: string): Promise<ChapterDetail> {
  const cached = chapterDetailsCache.get(id)
  if (cached) {
    return cached
  }

  try {
    const [chapterResponse, versesResponse] = await Promise.all([
      fetch(`https://api.quran.com/api/v4/chapters/${id}?language=bn`),
      fetch(
        `https://api.quran.com/api/v4/verses/by_chapter/${id}?language=bn&words=false&translations=161&fields=text_uthmani`,
      ),
    ])

    if (!chapterResponse.ok || !versesResponse.ok) {
      throw new Error(`Failed to fetch chapter data: ${chapterResponse.status}, ${versesResponse.status}`)
    }

    const chapterData = (await chapterResponse.json()) as { chapter: ChapterAPIResponse["chapter"] }
    const versesData = (await versesResponse.json()) as VersesAPIResponse

    const chapterDetail: ChapterDetail = {
      id: chapterData.chapter.id,
      name: chapterData.chapter.name_arabic,
      transliteration: chapterData.chapter.name_simple,
      translation: chapterData.chapter.translated_name.name,
      type: chapterData.chapter.revelation_place,
      total_verses: chapterData.chapter.verses_count,
      verses: versesData.verses.map((verse) => ({
        id: verse.verse_number,
        text: verse.text_uthmani,
        translation: verse.translations[0]?.text || "",
      })),
    }

    chapterDetailsCache.set(id, chapterDetail)
    return chapterDetail
  } catch (error) {
    console.error(`Error fetching chapter ${id}:`, error)
    throw new Error("Failed to load chapter details. Please try again later.")
  }
}

export async function getVerses(chapterId: string): Promise<Verse[]> {
  const chapter = await getChapter(chapterId)
  return chapter.verses
}

export async function getAudioUrl(chapterId: string) {
  const paddedId = chapterId.padStart(3, "0")
  return `https://verses.quran.com/abdul_basit_murattal/${paddedId}.mp3`
}

export function getFallbackAudioUrl(chapterId: string) {
  return `https://cdn.islamic.network/quran/audio/128/ar.alafasy/${chapterId}.mp3`
}

