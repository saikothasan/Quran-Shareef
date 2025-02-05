export interface Verse {
  number: number
  text: string
  translation: string
}

export interface Chapter {
  number: number
  name: string
  englishName: string
  englishNameTranslation: string
  numberOfAyahs: number
  revelationType: string
}

export interface ChapterDetail extends Chapter {
  verses: Verse[]
}

interface QuranAPIResponse {
  code: number
  status: string
  data: Chapter[]
}

interface ChapterAPIResponse {
  code: number
  status: string
  data: Chapter
}

interface VersesAPIResponse {
  code: number
  status: string
  data: {
    number: number
    ayahs: Array<{
      number: number
      text: string
      numberInSurah: number
      translation: string
    }>
  }
}

// Cache the chapters data
let chaptersCache: Chapter[] | null = null

export async function getChapters(): Promise<Chapter[]> {
  if (chaptersCache) {
    return chaptersCache
  }

  try {
    const response = await fetch("https://api.alquran.cloud/v1/surah")
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = (await response.json()) as QuranAPIResponse

    if (!data.data || !Array.isArray(data.data)) {
      throw new Error("Invalid API response format")
    }

    chaptersCache = data.data.map((chapter: Chapter) => ({
      number: chapter.number,
      name: chapter.name,
      englishName: chapter.englishName,
      englishNameTranslation: chapter.englishNameTranslation,
      numberOfAyahs: chapter.numberOfAyahs,
      revelationType: chapter.revelationType,
    }))

    return chaptersCache
  } catch (error) {
    console.error("Error fetching chapters:", error)
    throw new Error("Failed to load chapters. Please try again later.")
  }
}

// Cache the chapter details
const chapterDetailsCache = new Map<number, ChapterDetail>()

export async function getChapter(id: string): Promise<ChapterDetail> {
  const chapterId = Number.parseInt(id, 10)
  if (isNaN(chapterId) || chapterId < 1 || chapterId > 114) {
    throw new Error("Invalid chapter ID")
  }

  const cached = chapterDetailsCache.get(chapterId)
  if (cached) {
    return cached
  }

  try {
    const [chapterResponse, versesResponse] = await Promise.all([
      fetch(`https://api.alquran.cloud/v1/surah/${chapterId}`),
      fetch(`https://api.alquran.cloud/v1/surah/${chapterId}/bn.bengali`),
    ])

    if (!chapterResponse.ok || !versesResponse.ok) {
      throw new Error(`Failed to fetch chapter data: ${chapterResponse.status}, ${versesResponse.status}`)
    }

    const chapterData = (await chapterResponse.json()) as ChapterAPIResponse
    const versesData = (await versesResponse.json()) as VersesAPIResponse

    if (!chapterData.data || !versesData.data || !versesData.data.ayahs) {
      throw new Error("Invalid API response format")
    }

    const chapterDetail: ChapterDetail = {
      ...chapterData.data,
      verses: versesData.data.ayahs.map((ayah) => ({
        number: ayah.numberInSurah,
        text: ayah.text,
        translation: ayah.translation,
      })),
    }

    chapterDetailsCache.set(chapterId, chapterDetail)
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

export function getAudioUrl(chapterId: string): string {
  const id = Number.parseInt(chapterId, 10)
  if (isNaN(id) || id < 1 || id > 114) {
    throw new Error("Invalid chapter ID")
  }
  return `https://cdn.islamic.network/quran/audio-surah/128/ar.alafasy/${id}.mp3`
}

export function getFallbackAudioUrl(chapterId: string): string {
  const id = Number.parseInt(chapterId, 10)
  if (isNaN(id) || id < 1 || id > 114) {
    throw new Error("Invalid chapter ID")
  }
  return `https://cdn.islamic.network/quran/audio-surah/128/ar.ahmedajamy/${id}.mp3`
}

