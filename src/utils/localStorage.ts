const THEME_KEY = 'sonnly-theme'
const PLAYLIST_KEY = 'sonnly-playlist'

// --- Tema ---

export const saveTheme = (isDark: boolean): void => {
  localStorage.setItem(THEME_KEY, isDark ? 'dark' : 'light')
}

export const loadTheme = (): boolean => {
  return localStorage.getItem(THEME_KEY) === 'dark'
}

// --- Playlist ---
// Solo guarda los metadatos (título, artista, posición)
// No puede guardar el archivo de audio porque sería demasiado pesado

export interface SavedSongMeta {
  id: string
  title: string
  artist: string
  fileName: string
  fileType: string
  duration: number
  addedAt: number
}

export const savePlaylistMeta = (songs: SavedSongMeta[]): void => {
  try {
    localStorage.setItem(PLAYLIST_KEY, JSON.stringify(songs))
  } catch {
    // localStorage puede fallar si está lleno
    console.warn('Could not save playlist to localStorage')
  }
}

export const loadPlaylistMeta = (): SavedSongMeta[] => {
  try {
    const raw = localStorage.getItem(PLAYLIST_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

export const clearPlaylistMeta = (): void => {
  localStorage.removeItem(PLAYLIST_KEY)
}