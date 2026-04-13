import { useState, useRef } from 'react'
import { useAppContext } from '../../context/AppContext'
import styles from './AddSongModal.module.css'

interface AddSongModalProps {
  onClose: () => void
}

type AddPosition = 'tail' | 'head' | 'position'

const AddSongModal = ({ onClose }: AddSongModalProps) => {
  const { addSongToTail, addSongToHead, addSongAtPosition, songs } = useAppContext()
  const [position, setPosition] = useState<AddPosition>('tail')
  const [customIndex, setCustomIndex] = useState(0)
  const [selectedFiles, setSelectedFiles] = useState<File[]>([])
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setSelectedFiles(Array.from(e.target.files))
    }
  }

  const handleAdd = () => {
    if (selectedFiles.length === 0) return

    selectedFiles.forEach((file) => {
      if (position === 'tail') addSongToTail(file)
      else if (position === 'head') addSongToHead(file)
      else addSongAtPosition(file, customIndex)
    })

    onClose()
  }

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) onClose()
  }

  return (
    <div className={styles.backdrop} onClick={handleBackdropClick}>
      <div className={styles.modal}>
        <div className={styles.header}>
          <h2 className={styles.title} style={{ fontFamily: "'Muthiara', cursive", fontSize: '26px' }}>Añadir Canciones</h2>
          <button className={styles.closeBtn} onClick={onClose}>✕</button>
        </div>

        {/* Zona de archivos */}
        <div
          className={styles.dropZone}
          onClick={() => fileInputRef.current?.click()}
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => {
            e.preventDefault()
            if (e.dataTransfer.files) {
              setSelectedFiles(Array.from(e.dataTransfer.files))
            }
          }}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="audio/*"
            multiple
            onChange={handleFileChange}
            style={{ display: 'none' }}
          />
          {selectedFiles.length > 0 ? (
            <div className={styles.fileList}>
              {selectedFiles.map((f, i) => (
                <span key={i} className={styles.fileName}>🎵 {f.name}</span>
              ))}
            </div>
          ) : (
            <>
              <span className={styles.dropIcon}>♬♫♪</span>
              <p className={styles.dropText}>Haga clic o arrastre archivos de audio aqui</p>
              <p className={styles.dropSub}>mp3, wav, ogg, flac, aac y mas</p>
            </>
          )}
        </div>

        {/* Posición */}
        <div className={styles.section}>
          <label className={styles.label}>Añadir Posición</label>
          <div className={styles.positionGroup}>
            {(['tail', 'head', 'position'] as AddPosition[]).map((pos) => (
              <button
                key={pos}
                className={`${styles.posBtn} ${position === pos ? styles.posBtnActive : ''}`}
                onClick={() => setPosition(pos)}
              >
                {pos === 'tail' ? 'Al final' : pos === 'head' ? 'Al comienzo' : 'En una posición'}
              </button>
            ))}
          </div>

          {position === 'position' && (
            <div className={styles.indexRow}>
              <label className={styles.label}>Posición (0 – {songs.length})</label>
              <input
                type="number"
                min={0}
                max={songs.length}
                value={customIndex}
                onChange={(e) => setCustomIndex(Number(e.target.value))}
                className={styles.indexInput}
              />
            </div>
          )}
        </div>

        {/* Botones */}
        <div className={styles.footer}>
          <button className={styles.cancelBtn} onClick={onClose}>Cancelar</button>
          <button
            className={styles.addBtn}
            onClick={handleAdd}
            disabled={selectedFiles.length === 0}
          >
            Añadir {selectedFiles.length > 1 ? `${selectedFiles.length} songs` : 'canción'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default AddSongModal