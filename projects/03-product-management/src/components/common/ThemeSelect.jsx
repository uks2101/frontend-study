import { THEME_OPTIONS, setTheme, useTheme } from '../../store/theme/themeStore';

export default function ThemeSelect() {
  const theme = useTheme();

  return (
    <select className="theme-select" aria-label="화면 테마" value={theme} onChange={(e) => setTheme(e.target.value)}>
      {THEME_OPTIONS.map((option) => (
        <option key={option.value} value={option.value}>{option.label}</option>
      ))}
    </select>
  )
}