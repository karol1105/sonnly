import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import type { SongData } from '../../types/Song'
import  { useAppContext } from '../../context/AppContext'
import  { formatTime } from '../../utils/formatTime'
import styles from './SongCard.module.css'

interface SongCardProps {
  song: SongData
  index: number
  isActive: boolean
}

const SongCard = ({ song, index, isActive }: SongCardProps) => {
  const { selectSong, removeSong } = useAppContext()

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id: song.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
    zIndex: isDragging ? 999 : 'auto'
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`${styles.card} ${isActive ? styles.active : ''} ${isDragging ? styles.dragging : ''}`}
    >
      {/* Handle para arrastrar */}
      <button
        className={styles.dragHandle}
        {...attributes}
        {...listeners}
        aria-label="Drag to reorder"
        title="Drag to reorder"
      >
        ⠿
      </button>

      {/* Número de posición */}
      <span className={styles.index}>
        {isActive ? '▶' : index + 1}
      </span>

      {/* Info de la canción */}
      <div
        className={styles.info}
        onClick={() => selectSong(song.id)}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => e.key === 'Enter' && selectSong(song.id)}
      >
        <span className={styles.title}>{song.title}</span>
        <span className={styles.artist}>{song.artist}</span>
      </div>

      {/* Duración */}
      <span className={styles.duration}>
        {song.duration > 0 ? formatTime(song.duration) : '--:--'}
      </span>

      {/* Botón eliminar */}
      <button
        className={styles.removeBtn}
        onClick={(e) => {
          e.stopPropagation()
          removeSong(song.id)
        }}
        aria-label="Remove song"
        title="Remove song"
      >
        ✕
      </button>
    </div>
  )
}

export default SongCard