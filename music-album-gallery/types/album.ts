export interface Track {
  id: number
  title: string
  duration: string
}

export interface Album {
  id: number
  title: string
  artist: string
  cover: string
  year: number
  genre: string
  tracks: Track[]
}
