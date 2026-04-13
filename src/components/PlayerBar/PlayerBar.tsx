import { useAppContext } from '../../context/AppContext'
import { formatTime } from '../../utils/formatTime'
import styles from './PlayerBar.module.css'

const PlayerBar = () => {
  const {
    currentSong,
    isPlaying,
    currentTime,
    duration,
    volume,
    togglePlay,
    playNext,
    playPrevious,
    seekTo,
    changeVolume,
    songs
  } = useAppContext()

  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0
  const currentIndex = songs.findIndex((s) => s.id === currentSong?.id)
  const hasPrev = currentIndex > 0
  const hasNext = currentIndex < songs.length - 1

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const ratio = (e.clientX - rect.left) / rect.width
    seekTo(ratio * duration)
  }

  return (
    <div className={styles.bar}>
      {/* Info canción actual */}
      <div className={styles.songInfo}>
        <div className={styles.albumArt}>♪</div>
        <div className={styles.meta}>
          <span className={styles.songTitle}>
            {currentSong ? currentSong.title : 'Ninguna canción seleccionada'}
          </span>
          <span className={styles.songArtist}>
            {currentSong ? currentSong.artist : '—'}
          </span>
        </div>
      </div>

      {/* Controles centrales */}
      <div className={styles.center}>
        <div className={styles.controls}>
          <button
            className={styles.controlBtn}
            onClick={playPrevious}
            disabled={!hasPrev && !currentSong}
            title="Previous"
          >
            ⏮
          </button>
          <button
            className={styles.playBtn}
            onClick={togglePlay}
            disabled={!currentSong}
            title={isPlaying ? 'Pause' : 'Play'}
          >
            {isPlaying ? '⏸' : '▶'}
          </button>
          <button
            className={styles.controlBtn}
            onClick={playNext}
            disabled={!hasNext}
            title="Next"
          >
            ⏭
          </button>
        </div>

        {/* Barra de progreso */}
        <div className={styles.progressRow}>
          <span className={styles.time}>{formatTime(currentTime)}</span>
          <div
            className={styles.progressBar}
            onClick={handleProgressClick}
            role="slider"
            aria-label="Progreso de la canción"
            aria-valuenow={Math.round(progressPercent)}
          >
            <div
              className={styles.progressFill}
              style={{ width: `${progressPercent}%` }}
            />
            <div
              className={styles.progressThumb}
              style={{ left: `${progressPercent}%` }}
            />
          </div>
          <span className={styles.time}>{formatTime(duration)}</span>
        </div>
      </div>

      {/* Volumen */}
      <div className={styles.volumeSection}>
        <span className={styles.volumeIcon}>
          {volume === 0 ? '🔇' : volume < 0.5 ? '🔉' : '🔊'}
        </span>
        <input
          type="range"
          min={0}
          max={1}
          step={0.01}
          value={volume}
          onChange={(e) => changeVolume(Number(e.target.value))}
          className={styles.volumeSlider}
          aria-label="Volume"
        />
      </div>
    </div>
  )
}

export default PlayerBar