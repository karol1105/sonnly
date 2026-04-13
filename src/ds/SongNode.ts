import type { SongData } from '../types/Song'

export class SongNode {
  data: SongData
  prev: SongNode | null
  next: SongNode | null

  constructor(data: SongData) {
    this.data = data
    this.prev = null
    this.next = null
  }
}