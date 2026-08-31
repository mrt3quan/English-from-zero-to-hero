import React, { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { Monitor, Moon, Sun } from 'lucide-react'
import { getSystemTheme, readPreference, writePreference } from '../lib/themePreference'

const ThemeContext = createContext(null)

export function ThemeProvider({ children }) {
  const [preference, setPreferenceState] = useState(readPreference)
  const [systemTheme, setSystemTheme] = useState(getSystemTheme)
  const resolvedTheme = preference === 'system' ? systemTheme : preference

  useEffect(() => {
    const media = window.matchMedia?.('(prefers-color-scheme: dark)')
    if (!media) return
    const sync = event => setSystemTheme(event.matches ? 'dark' : 'light')
    media.addEventListener?.('change', sync)
    return () => media.removeEventListener?.('change', sync)
  }, [])

  useEffect(() => {
    document.documentElement.dataset.theme = resolvedTheme
    document.documentElement.style.colorScheme = resolvedTheme
    document.documentElement.dataset.themePreference = preference
  }, [preference, resolvedTheme])

  const setPreference = next => {
    setPreferenceState(writePreference(next))
  }

  const value = useMemo(() => ({ preference, resolvedTheme, setPreference }), [preference, resolvedTheme])
  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}

export function useTheme() {
  const value = useContext(ThemeContext)
  if (!value) throw new Error('useTheme must be used inside ThemeProvider')
  return value
}

const options = [
  { id: 'system', label: 'System', labelVi: 'Theo thiết bị', Icon: Monitor },
  { id: 'light', label: 'Light', labelVi: 'Sáng', Icon: Sun },
  { id: 'dark', label: 'Dark', labelVi: 'Tối', Icon: Moon },
]

export function ThemeSegmentedControl({ compact = false }) {
  const { preference, setPreference } = useTheme()
  return (
    <div className={`theme-segmented ${compact ? 'theme-segmented--compact' : ''}`} role="radiogroup" aria-label="Giao diện sáng tối">
      {options.map(({ id, label, labelVi, Icon }) => (
        <button
          key={id}
          type="button"
          role="radio"
          aria-checked={preference === id}
          aria-label={`${label} — ${labelVi}`}
          onClick={() => setPreference(id)}
          className={`theme-choice pressable ${preference === id ? 'is-active' : ''}`}
        >
          <Icon className="h-4 w-4" aria-hidden="true" />
          {!compact && <span><strong>{label}</strong><small>{labelVi}</small></span>}
        </button>
      ))}
    </div>
  )
}

export function ThemeCycleButton() {
  const { preference, setPreference } = useTheme()
  const currentIndex = options.findIndex(option => option.id === preference)
  const current = options[Math.max(0, currentIndex)]
  const next = options[(Math.max(0, currentIndex) + 1) % options.length]
  const Icon = current.Icon
  return (
    <button
      type="button"
      onClick={() => setPreference(next.id)}
      className="icon-button pressable"
      aria-label={`Giao diện hiện tại: ${current.labelVi}. Chuyển sang ${next.labelVi}.`}
      title={`Giao diện: ${current.labelVi}`}
    >
      <Icon className="h-5 w-5" aria-hidden="true" />
    </button>
  )
}
