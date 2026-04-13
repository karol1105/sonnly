import { AppProvider } from './context/AppContext'
import { useAppContext } from './context/AppContext'
import QueuePanel from './components/QueuePanel/QueuePanel'
import PlayerBar from './components/PlayerBar/PlayerBar'
import styles from './App.module.css'

const AppContent = () => {
  const { isLoadingPlaylist } = useAppContext()

  if (isLoadingPlaylist) {
    return (
      <div className={styles.loading}>
        <span className={styles.loadingIcon}>♪</span>
        <p className={styles.loadingText}>Sonnly</p>
      </div>
    )
  }

  return (
    <div className={styles.wrapper}>
      <div className={styles.container}>
        <div className={styles.queue}>
          <QueuePanel />
        </div>
        <div className={styles.player}>
          <PlayerBar />
        </div>
      </div>
    </div>
  )
}

function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  )
}

export default App