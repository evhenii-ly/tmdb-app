type SpotifyEntity = 'album' | 'artist' | 'playlist' | 'track' | 'show' | 'episode' | 'audiobook'

export interface SpotifySearchResponse {
  tracks: {
    href: string
    items: SpotifyTrack[]
    limit: number
    next?: string
    offset: number
    previous?: string
    total: number
  }
}

export interface SpotifyTrack {
  album: SpotifyAlbum
  artists: SpotifyArtist[]
  available_markets: string[]
  disc_number: number
  duration_ms: number
  explicit: boolean
  external_ids: {
    isrc: string
  }
  external_urls: {
    spotify: string
  }
  href: string
  id: string
  name: string
  popularity: number
  preview_url: string
  track_number: number
  type: SpotifyEntity
  uri: string
}

export interface SpotifyAlbum {
  album_type: string
  artists: SpotifyArtist[]
  available_markets: string[]
  external_urls: {
    spotify: string
  }
  href: string
  id: string
  images: {
    height: number
    url: string
    width: number
  }[]
  name: string
  release_date: string
  release_date_precision: string
  total_tracks: number
  type: SpotifyEntity
  uri: string
}

export interface SpotifyArtist {
  external_urls: {
    spotify: string
  }
  href: string
  id: string
  name: string
  type: SpotifyEntity
  uri: string
}

export interface SpotifySearchRequest {
  params: {
    q: string,
    type: SpotifyEntity
    limit?: number
    marker?: string
    offset?: number
    include_external?: string

  }
  headers: {
    Authorization: string
  }
}
