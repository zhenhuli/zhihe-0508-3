import React, { useState, useEffect } from 'react'
import { getPresets, savePreset, deletePreset } from '../utils/storage'

function PresetManager({ config, onLoadPreset }) {
  const [presets, setPresets] = useState([])
  const [presetName, setPresetName] = useState('')
  const [showNameInput, setShowNameInput] = useState(false)

  useEffect(() => {
    setPresets(getPresets())
  }, [])

  const handleSave = () => {
    if (!presetName.trim()) return
    const updatedPresets = savePreset({ name: presetName.trim(), config })
    setPresets(updatedPresets)
    setPresetName('')
    setShowNameInput(false)
  }

  const handleDelete = (id) => {
    const updatedPresets = deletePreset(id)
    setPresets(updatedPresets)
  }

  const handleLoad = (preset) => {
    onLoadPreset(preset.config)
  }

  const formatDate = (dateStr) => {
    const date = new Date(dateStr)
    return date.toLocaleDateString('zh-CN', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        {!showNameInput ? (
          <button
            onClick={() => setShowNameInput(true)}
            className="flex-1 px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors font-medium"
          >
            保存当前搭配
          </button>
        ) : (
          <>
            <input
              type="text"
              value={presetName}
              onChange={(e) => setPresetName(e.target.value)}
              placeholder="输入搭配名称"
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              autoFocus
            />
            <button
              onClick={handleSave}
              className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors"
            >
              保存
            </button>
            <button
              onClick={() => {
                setShowNameInput(false)
                setPresetName('')
              }}
              className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg transition-colors"
            >
              取消
            </button>
          </>
        )}
      </div>

      <div className="border-t pt-4">
        <h3 className="text-lg font-semibold mb-3 text-gray-700">我的搭配</h3>
        {presets.length === 0 ? (
          <p className="text-gray-400 text-center py-8">暂无保存的搭配</p>
        ) : (
          <div className="space-y-2 max-h-80 overflow-y-auto scrollbar-thin">
            {presets.map((preset) => (
              <div
                key={preset.id}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-700 truncate">{preset.name}</p>
                  <p className="text-xs text-gray-400">{formatDate(preset.createdAt)}</p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleLoad(preset)}
                    className="px-3 py-1 text-sm bg-blue-100 hover:bg-blue-200 text-blue-700 rounded transition-colors"
                  >
                    应用
                  </button>
                  <button
                    onClick={() => handleDelete(preset.id)}
                    className="px-3 py-1 text-sm bg-red-100 hover:bg-red-200 text-red-700 rounded transition-colors"
                  >
                    删除
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default PresetManager
