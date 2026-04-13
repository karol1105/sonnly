import type { SongData } from '../types/Song'
import { generateId } from './generateId'

export const buildSongFromFile = (file: File, existingId?: string): SongData => {
  const fileUrl = URL.createObjectURL(file)
  const nameWithoutExtension = file.name.replace(/\.[^/.]+$/, '')
  const parts = nameWithoutExtension.split(' - ')
  const artist = parts.length > 1 ? parts[0].trim() : 'Unknown artist'
  const title = parts.length > 1 ? parts[1].trim() : parts[0].trim()

  return {
    id: existingId ?? generateId(),
    title,
    artist,
    fileName: file.name,
    fileUrl,
    fileType: file.type,
    duration: 0,
    addedAt: Date.now()
  }
}

export const revokeSongUrl = (fileUrl: string): void => {
  URL.revokeObjectURL(fileUrl)
}