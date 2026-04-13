import { useCallback } from 'react'
import { useAppContext } from '../context/AppContext'

export const usePlaylist = () => {
  const {
    songs,
    currentSong,
    addSongToTail,
    addSongToHead,
    addSongAtPosition,
    removeSong,
    moveSong,
    selectSong
  } = useAppContext()

  // Verifica si una canción es la activa
  const isCurrentSong = useCallback(
    (id: string) => currentSong?.id === id,
    [currentSong]
  )

  // Devuelve el índice de la canción activa
  const currentIndex = songs.findIndex((s) => s.id === currentSong?.id)

  // Verifica si hay canción anterior disponible
  const hasPrevious = currentIndex > 0

  // Verifica si hay canción siguiente disponible
  const hasNext = currentIndex < songs.length - 1

  return {
    songs,
    currentSong,
    currentIndex,
    hasPrevious,
    hasNext,
    isCurrentSong,
    addSongToTail,
    addSongToHead,
    addSongAtPosition,
    removeSong,
    moveSong,
    selectSong
  }
}