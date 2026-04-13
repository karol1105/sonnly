const DB_NAME = 'sonnly-db'
const DB_VERSION = 1
const STORE_NAME = 'audio-files'

const openDatabase = (): Promise<IDBDatabase> => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION)

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'id' })
      }
    }

    request.onsuccess = (event) => {
      resolve((event.target as IDBOpenDBRequest).result)
    }

    request.onerror = () => reject(request.error)
  })
}

// Guarda el archivo binario con el id de la canción como clave
export const saveAudioFile = async (id: string, file: File): Promise<void> => {
  const db = await openDatabase()
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readwrite')
    const store = tx.objectStore(STORE_NAME)
    const request = store.put({ id, file })
    request.onsuccess = () => resolve()
    request.onerror = () => reject(request.error)
  })
}

// Recupera el archivo y genera un nuevo blob URL
export const loadAudioFile = async (id: string): Promise<string | null> => {
  const db = await openDatabase()
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readonly')
    const store = tx.objectStore(STORE_NAME)
    const request = store.get(id)
    request.onsuccess = () => {
      const result = request.result
      if (result?.file) {
        const url = URL.createObjectURL(result.file)
        resolve(url)
      } else {
        resolve(null)
      }
    }
    request.onerror = () => reject(request.error)
  })
}

// Elimina el archivo de IndexedDB cuando se elimina la canción
export const deleteAudioFile = async (id: string): Promise<void> => {
  const db = await openDatabase()
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readwrite')
    const store = tx.objectStore(STORE_NAME)
    const request = store.delete(id)
    request.onsuccess = () => resolve()
    request.onerror = () => reject(request.error)
  })
}

// Elimina todos los archivos (para limpiar la playlist completa)
export const clearAllAudioFiles = async (): Promise<void> => {
  const db = await openDatabase()
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readwrite')
    const store = tx.objectStore(STORE_NAME)
    const request = store.clear()
    request.onsuccess = () => resolve()
    request.onerror = () => reject(request.error)
  })
}