const STORAGE_KEY = 'avatar-presets'

export function savePreset(preset) {
  const presets = getPresets()
  presets.push({
    id: Date.now(),
    name: preset.name || '未命名搭配',
    config: preset.config,
    createdAt: new Date().toISOString()
  })
  localStorage.setItem(STORAGE_KEY, JSON.stringify(presets))
  return presets
}

export function getPresets() {
  const data = localStorage.getItem(STORAGE_KEY)
  return data ? JSON.parse(data) : []
}

export function deletePreset(id) {
  const presets = getPresets().filter(p => p.id !== id)
  localStorage.setItem(STORAGE_KEY, JSON.stringify(presets))
  return presets
}
