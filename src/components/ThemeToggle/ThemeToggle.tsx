import { useAppContext } from '../../context/AppContext'
import styles from './ThemeToggle.module.css'

const ThemeToggle = () => {
  const { isDark, toggleTheme } = useAppContext()

  return (
    <button
      className={styles.toggle}
      onClick={toggleTheme}
      aria-label="Toggle theme"
      title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      {isDark ? '☼' : '☾'}
    </button>
  )
}

export default ThemeToggle