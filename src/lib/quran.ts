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

export interface ChapterDetail extends Chapter {
  verses: Verse[]
}

export async function getChapters(): Promise<Chapter[]> {
  const response = await fetch("https://api.quran.com/api/v4/chapters?language=bn", {
    headers: { Accept: "application/json" },
  })

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`)
  }

  const data = await response.json()
  return data.chapters
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
    chapterResponse.json(),
    versesResponse.json(),
    translationResponse.json(),
  ])

  return {
    ...chapterData.chapter,
    verses: versesData.verses.map((verse: any, index: number) => ({
      id: verse.verse_number,
      text: verse.text_uthmani,
      translation: translationData.translations[index]?.text || "",
    })),
  }
}

export function getAudioUrl(chapterId: string): string {
  return `https://cdn.islamic.network/quran/audio-surah/128/ar.alafasy/${chapterId}.mp3`
}

