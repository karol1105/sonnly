import type{ SongData } from '../types/Song'
import { SongNode } from './SongNode'

export class PlaylistManager {
  head: SongNode | null
  tail: SongNode | null
  currentNode: SongNode | null
  size: number

  constructor() {
    this.head = null
    this.tail = null
    this.currentNode = null
    this.size = 0
  }

  // Agregar al final de la cola
  addToTail(data: SongData): void {
    const newNode = new SongNode(data)
    if (this.head === null) {
      this.head = newNode
      this.tail = newNode
      this.currentNode = newNode
    } else {
      newNode.prev = this.tail
      this.tail!.next = newNode
      this.tail = newNode
    }
    this.size++
  }

  // Agregar al inicio de la cola
  addToHead(data: SongData): void {
    const newNode = new SongNode(data)
    if (this.head === null) {
      this.head = newNode
      this.tail = newNode
      this.currentNode = newNode
    } else {
      newNode.next = this.head
      this.head.prev = newNode
      this.head = newNode
    }
    this.size++
  }

  // Insertar en cualquier posición
  insertAtPosition(index: number, data: SongData): void {
    if (index <= 0) {
      this.addToHead(data)
      return
    }
    if (index >= this.size) {
      this.addToTail(data)
      return
    }
    const newNode = new SongNode(data)
    const leader = this.traverseToIndex(index - 1)
    if (!leader) return
    const follower = leader.next
    leader.next = newNode
    newNode.prev = leader
    newNode.next = follower
    if (follower) follower.prev = newNode
    this.size++
  }

  // Eliminar por id
  removeNode(id: string): void {
    if (!this.head) return
    let current: SongNode | null = this.head
    while (current !== null) {
      if (current.data.id === id) {
        if (current.prev) current.prev.next = current.next
        else this.head = current.next
        if (current.next) current.next.prev = current.prev
        else this.tail = current.prev
        if (this.currentNode?.data.id === id) {
          this.currentNode = current.next ?? current.prev
        }
        this.size--
        return
      }
      current = current.next
    }
  }

  // Avanzar canción
  goToNext(): SongNode | null {
    if (this.currentNode?.next) {
      this.currentNode = this.currentNode.next
    }
    return this.currentNode
  }

  // Retroceder canción
  goToPrevious(): SongNode | null {
    if (this.currentNode?.prev) {
      this.currentNode = this.currentNode.prev
    }
    return this.currentNode
  }

  // Mover nodo (para drag & drop)
  moveNode(fromIndex: number, toIndex: number): void {
    if (fromIndex === toIndex) return
    const nodeData = this.traverseToIndex(fromIndex)?.data
    if (!nodeData) return
    this.removeNode(nodeData.id)
    this.insertAtPosition(toIndex, nodeData)
    // Restaurar currentNode si era el que se movió
    const restored = this.traverseToIndex(toIndex)
    if (restored) this.currentNode = restored
  }

  // Ir a una canción específica por id
  goToNode(id: string): SongNode | null {
    let current = this.head
    while (current !== null) {
      if (current.data.id === id) {
        this.currentNode = current
        return current
      }
      current = current.next
    }
    return null
  }

  // Recorrer hasta un índice
  traverseToIndex(index: number): SongNode | null {
    let current = this.head
    let i = 0
    while (i !== index && current !== null) {
      current = current.next
      i++
    }
    return current
  }

  // Convertir a array para React
  toArray(): SongData[] {
    const result: SongData[] = []
    let current = this.head
    while (current !== null) {
      result.push(current.data)
      current = current.next
    }
    return result
  }

  // Limpiar la lista
  clear(): void {
    this.head = null
    this.tail = null
    this.currentNode = null
    this.size = 0
  }
}