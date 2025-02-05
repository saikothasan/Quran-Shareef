export interface Verse {
  id: number
  verse_key: string
  text_uthmani: string
  text_indopak: string
  translation: {
    text: string
  }
  transliteration: {
    text: string
  }
  audio: {
    url: string
  }
}

export interface Chapter {
  id: number
  name_simple: string
  name_arabic: string
  name_complex: string
  verses_count: number
  revelation_place: string
  revelation_order: number
  bismillah_pre: boolean
  translated_name: {
    name: string
    language_name: string
  }
}

