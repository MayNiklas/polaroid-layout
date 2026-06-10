import { useEffect, useState } from 'react'
import { DEFAULT_CONFIG, type PolaroidConfig } from './defaults'

const STORAGE_KEY = 'polaroid-config'

/** Shallow-merge a stored value over defaults so new fields stay populated. */
function load(): PolaroidConfig {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return DEFAULT_CONFIG
    const saved = JSON.parse(raw)
    return {
      ...DEFAULT_CONFIG,
      ...saved,
      photo: { ...DEFAULT_CONFIG.photo, ...saved.photo },
      border: { ...DEFAULT_CONFIG.border, ...saved.border },
      cropMarks: { ...DEFAULT_CONFIG.cropMarks, ...saved.cropMarks },
    }
  } catch {
    return DEFAULT_CONFIG
  }
}

export function useConfig() {
  const [config, setConfig] = useState<PolaroidConfig>(load)

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(config))
    } catch {
      // ignore quota / private-mode errors
    }
  }, [config])

  return { config, setConfig }
}
