import { useCallback } from 'react'
import {
  useSensor,
  useSensors,
  PointerSensor,
  type DragEndEvent
} from '@dnd-kit/core'
import { useAppContext } from '../context/AppContext'

export const useDragDrop = () => {
  const { songs, moveSong } = useAppContext()

  // El sensor de puntero requiere mover 6px antes de activar el drag
  // Esto evita que un simple clic active el arrastre por accidente
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 6 }
    })
  )

  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      const { active, over } = event

      // Si no hay destino o es el mismo lugar, no hacer nada
      if (!over || active.id === over.id) return

      const fromIndex = songs.findIndex((s) => s.id === active.id)
      const toIndex = songs.findIndex((s) => s.id === over.id)

      // Solo mover si ambos índices son válidos
      if (fromIndex !== -1 && toIndex !== -1) {
        moveSong(fromIndex, toIndex)
      }
    },
    [songs, moveSong]
  )

  return {
    sensors,
    handleDragEnd
  }
}