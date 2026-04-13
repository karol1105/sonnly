import {
  createContext,
  useContext,
  useState,
  useRef,
  useCallback,
  useEffect,
  type ReactNode
} from 'react'
import { PlaylistManager } from '../ds/PlaylistManager'
import type { SongData } from '../types/Song'
import { buildSongFromFile, revokeSongUrl } from '../utils/fileReader'
import { saveTheme, loadTheme, savePlaylistMeta, loadPlaylistMeta } from '../utils/localStorage'
import type { SavedSongMeta } from '../utils/localStorage' 
import { saveAudioFile, loadAudioFile, deleteAudioFile } from '../utils/indexedDB'
import { generateId } from '../utils/generateId'

interface AppContextType {
  playlist: PlaylistManager
  songs: SongData[]
  currentSong: SongData | null
  isPlaying: boolean
  currentTime: number
  duration: number
  volume: number
  audioRef: React.RefObject<HTMLAudioElement>
  isDark: boolean
  isLoadingPlaylist: boolean
  addSongToTail: (file: File) => void
  addSongToHead: (file: File) => void
  addSongAtPosition: (file: File, index: number) => void
  removeSong: (id: string) => void
  moveSong: (fromIndex: number, toIndex: number) => void
  selectSong: (id: string) => void
  togglePlay: () => void
  playNext: () => void
  playPrevious: () => void
  seekTo: (time: number) => void
  changeVolume: (vol: number) => void
  toggleTheme: () => void
}

const AppContext = createContext<AppContextType | null>(null)

export const useAppContext = (): AppContextType => {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useAppContext must be used inside AppProvider')
  return ctx
}

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const playlistRef = useRef<PlaylistManager>(new PlaylistManager())
  const playlist = playlistRef.current
  const audioRef = useRef<HTMLAudioElement>(new Audio())

  const [songs, setSongs] = useState<SongData[]>([])
  const [currentSong, setCurrentSong] = useState<SongData | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [volume, setVolume] = useState(1)
  const [isDark, setIsDark] = useState(() => loadTheme())
  const [isLoadingPlaylist, setIsLoadingPlaylist] = useState(true)

  const syncSongs = useCallback(() => {
    const currentArray = playlist.toArray()
    setSongs(currentArray)
    setCurrentSong(playlist.currentNode?.data ?? null)
    // Guarda metadatos en localStorage cada vez que cambia la lista
    const meta: SavedSongMeta[] = currentArray.map((s) => ({
      id: s.id,
      title: s.title,
      artist: s.artist,
      fileName: s.fileName,
      fileType: s.fileType,
      duration: s.duration,
      addedAt: s.addedAt
    }))
    savePlaylistMeta(meta)
  }, [playlist])

  // Restaura la playlist desde IndexedDB y localStorage al cargar
  useEffect(() => {
    const restorePlaylist = async () => {
  setIsLoadingPlaylist(true)
  playlist.clear()
  const savedMeta = loadPlaylistMeta()

  for (const meta of savedMeta) {
    const fileUrl = await loadAudioFile(meta.id)
    if (fileUrl) {
      const songData: SongData = {
        ...meta,
        fileUrl
      }
      playlist.addToTail(songData)
    }
  }

  setSongs(playlist.toArray())
  setCurrentSong(playlist.currentNode?.data ?? null)
  setIsLoadingPlaylist(false)
}

    restorePlaylist()
  }, [playlist])

  // Guarda el archivo en IndexedDB cuando se agrega una canción
  const addSongToTail = useCallback(async (file: File) => {
    const id = generateId()
    await saveAudioFile(id, file)
    playlist.addToTail(buildSongFromFile(file, id))
    syncSongs()
  }, [playlist, syncSongs])

  const addSongToHead = useCallback(async (file: File) => {
    const id = generateId()
    await saveAudioFile(id, file)
    playlist.addToHead(buildSongFromFile(file, id))
    syncSongs()
  }, [playlist, syncSongs])

  const addSongAtPosition = useCallback(async (file: File, index: number) => {
    const id = generateId()
    await saveAudioFile(id, file)
    playlist.insertAtPosition(index, buildSongFromFile(file, id))
    syncSongs()
  }, [playlist, syncSongs])

  const removeSong = useCallback(async (id: string) => {
    const wasCurrentSong = playlist.currentNode?.data.id === id
    const songToRemove = playlist.toArray().find((s) => s.id === id)
    playlist.removeNode(id)
    if (songToRemove) {
      revokeSongUrl(songToRemove.fileUrl)
      await deleteAudioFile(id)
    }
    syncSongs()
    if (wasCurrentSong) {
      const audio = audioRef.current
      audio.pause()
      audio.src = ''
      setIsPlaying(false)
      setCurrentTime(0)
      setDuration(0)
    }
  }, [playlist, syncSongs])

  const moveSong = useCallback((fromIndex: number, toIndex: number) => {
    playlist.moveNode(fromIndex, toIndex)
    syncSongs()
  }, [playlist, syncSongs])

  const selectSong = useCallback((id: string) => {
    const node = playlist.goToNode(id)
    if (!node) return
    setCurrentSong(node.data)
    const audio = audioRef.current
    audio.src = node.data.fileUrl
    audio.play()
    setIsPlaying(true)
  }, [playlist])

  const togglePlay = useCallback(() => {
    const audio = audioRef.current
    if (!currentSong) return
    if (isPlaying) {
      audio.pause()
      setIsPlaying(false)
    } else {
      audio.play()
      setIsPlaying(true)
    }
  }, [isPlaying, currentSong])

  const playNext = useCallback(() => {
    const node = playlist.goToNext()
    if (!node) return
    setCurrentSong(node.data)
    const audio = audioRef.current
    audio.src = node.data.fileUrl
    audio.play()
    setIsPlaying(true)
  }, [playlist])

  const playPrevious = useCallback(() => {
    const audio = audioRef.current
    if (audio.currentTime > 3) {
      audio.currentTime = 0
      return
    }
    const node = playlist.goToPrevious()
    if (!node) return
    setCurrentSong(node.data)
    audio.src = node.data.fileUrl
    audio.play()
    setIsPlaying(true)
  }, [playlist])

  const seekTo = useCallback((time: number) => {
    audioRef.current.currentTime = time
    setCurrentTime(time)
  }, [])

  const changeVolume = useCallback((vol: number) => {
    audioRef.current.volume = vol
    setVolume(vol)
  }, [])

  const toggleTheme = useCallback(() => {
    setIsDark(prev => {
      const next = !prev
      document.documentElement.classList.toggle('dark', next)
      saveTheme(next)
      return next
    })
  }, [])

  useEffect(() => {
    const audio = audioRef.current
    const onTimeUpdate = () => setCurrentTime(audio.currentTime)
    const onDurationChange = () => setDuration(audio.duration)
    const onEnded = () => playNext()
    const onVolumeChange = () => setVolume(audio.volume)

    audio.addEventListener('timeupdate', onTimeUpdate)
    audio.addEventListener('durationchange', onDurationChange)
    audio.addEventListener('ended', onEnded)
    audio.addEventListener('volumechange', onVolumeChange)

    return () => {
      audio.removeEventListener('timeupdate', onTimeUpdate)
      audio.removeEventListener('durationchange', onDurationChange)
      audio.removeEventListener('ended', onEnded)
      audio.removeEventListener('volumechange', onVolumeChange)
    }
  }, [playNext])

  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDark)
  }, [isDark])

  return (
    <AppContext.Provider value={{
      playlist,
      songs,
      currentSong,
      isPlaying,
      currentTime,
      duration,
      volume,
      audioRef,
      isDark,
      isLoadingPlaylist,
      addSongToTail,
      addSongToHead,
      addSongAtPosition,
      removeSong,
      moveSong,
      selectSong,
      togglePlay,
      playNext,
      playPrevious,
      seekTo,
      changeVolume,
      toggleTheme
    }}>
      {children}
    </AppContext.Provider>
  )
}