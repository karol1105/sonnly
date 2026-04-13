import { useAppContext } from '../context/AppContext'

export const useTheme = () => {
  const { isDark, toggleTheme } = useAppContext()

  // Etiqueta legible para el botón
  const themeLabel = isDark ? 'Switch to light mode' : 'Switch to dark mode'

  // Ícono según el modo actual
  const themeIcon = isDark ? '☼' : '☾'
  
  return {
    isDark,
    toggleTheme,
    themeLabel,
    themeIcon
  }
}