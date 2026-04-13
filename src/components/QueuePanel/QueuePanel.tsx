import { useState } from 'react'
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent
} from '@dnd-kit/core'
import {
  SortableContext,
  verticalListSortingStrategy
} from '@dnd-kit/sortable'
import { useAppContext } from '../../context/AppContext'
import SongCard from '../SongCard/SongCard'
import AddSongModal from '../AddSongModal/AddSongModal'
import ThemeToggle from '../ThemeToggle/ThemeToggle'
import styles from './QueuePanel.module.css'

const QueuePanel = () => {
  const { songs, currentSong, moveSong } = useAppContext()
  const [showModal, setShowModal] = useState(false)

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 6 }
    })
  )

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    if (!over || active.id === over.id) return
    const fromIndex = songs.findIndex((s) => s.id === active.id)
    const toIndex = songs.findIndex((s) => s.id === over.id)
    if (fromIndex !== -1 && toIndex !== -1) {
      moveSong(fromIndex, toIndex)
    }
  }

  return (
    <div className={styles.panel}>
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.brand}>
          {/* <span className={styles.logo}>♬♫♪</span> */}
          <span className={styles.brandName} style={{ fontFamily: "'Muthiara', cursive" }}>Sonly ♬♫♪</span>
        </div>
        <div className={styles.headerActions}>
          <span className={styles.count}>
            {songs.length} {songs.length === 1 ? 'canció' : 'canciones'}
          </span>
          <ThemeToggle />
        </div>
      </div>

      {/* Lista de canciones con drag & drop */}
      <div className={styles.list}>
        {songs.length === 0 ? (
          <div className={styles.empty}>
            <span className={styles.emptyIcon}>♬♫♪</span>
            <p className={styles.emptyText}>Tu lista esta vacia</p>
            <p className={styles.emptySub}>Agrega algunas canciones para empezar</p>
          </div>
        ) : (
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={songs.map((s) => s.id)}
              strategy={verticalListSortingStrategy}
            >
              {songs.map((song, index) => (
                <SongCard
                  key={song.id}
                  song={song}
                  index={index}
                  isActive={currentSong?.id === song.id}
                />
              ))}
            </SortableContext>
          </DndContext>
        )}
      </div>

      {/* Botón agregar */}
      <div className={styles.footer}>
        <button
          className={styles.addBtn}
          onClick={() => setShowModal(true)}
        >
          + Añadir Canciones
        </button>
      </div>

      {showModal && <AddSongModal onClose={() => setShowModal(false)} />}
    </div>
  )
}

export default QueuePanel