declare global {
  export type ApiKeyString = string & { readonly _brand: unique symbol }

  export type NA = 'N/A'

  export interface Movie {
    id: number
    title: string
    release_date: string
    overview: string
    genre_ids: number[]
    vote_average: number
    vote_count: number
  }

  export interface Genre {
    id: number
    name: string
  }

  export interface MovieOST {
    name: string
    artist: string
    uri: string
  }
}

export {}
