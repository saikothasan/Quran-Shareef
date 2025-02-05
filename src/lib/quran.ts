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
      next: {
        revalidate: 3600, // Cache for 1 hour
      },
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data: QuranAPIResponse = await response.json()

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
  // Check cache first
  const cached = chapterDetailsCache.get(id)
  if (cached) {
    return cached
  }

  try {
    // First try to get the chapter info from Quran.com API
    const chapterResponse = await fetch(`https://api.quran.com/api/v4/chapters/${id}?language=bn`)
    if (!chapterResponse.ok) {
      throw new Error(`Failed to fetch chapter info: ${chapterResponse.status}`)
    }
    const chapterInfo: ChapterAPIResponse = await chapterResponse.json()

    // Then get the verses from the verses API
    const versesResponse = await fetch(
      `https://api.quran.com/api/v4/verses/by_chapter/${id}?language=bn&words=false&translations=161&fields=text_uthmani`,
    )
    if (!versesResponse.ok) {
      throw new Error(`Failed to fetch verses: ${versesResponse.status}`)
    }
    const versesData: VersesAPIResponse = await versesResponse.json()

    // Combine the data
    const chapterDetail: ChapterDetail = {
      id: chapterInfo.chapter.id,
      name: chapterInfo.chapter.name_arabic,
      transliteration: chapterInfo.chapter.name_simple,
      translation: chapterInfo.chapter.translated_name.name,
      type: chapterInfo.chapter.revelation_place,
      total_verses: chapterInfo.chapter.verses_count,
      verses: versesData.verses.map((verse) => ({
        id: verse.verse_number,
        text: verse.text_uthmani,
        translation: verse.translations[0]?.text || "",
      })),
    }

    // Cache the result
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
  return `https://verses.quran.com/abdul_basit_murattal/${chapterId.padStart(3, "0")}.mp3`
}

