import { useAppContext } from '../context/AppContext'

export const useAudioPlayer = () => {
  const {
    isPlaying,
    currentTime,
    duration,
    volume,
    togglePlay,
    playNext,
    playPrevious,
    seekTo,
    changeVolume
  } = useAppContext()

  // Calcula el porcentaje de progreso para la barra (0 a 100)
  const progressPercent = duration > 0
    ? Math.round((currentTime / duration) * 100)
    : 0

  // Recibe un clic en la barra y calcula a qué segundo saltar
  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const ratio = (e.clientX - rect.left) / rect.width
    seekTo(ratio * duration)
  }

  return {
    isPlaying,
    currentTime,
    duration,
    volume,
    progressPercent,
    togglePlay,
    playNext,
    playPrevious,
    seekTo,
    changeVolume,
    handleProgressClick
  }
}