import React, { useState, useRef } from 'react'
import AvatarCanvas from './components/AvatarCanvas'
import FacialFeaturesSelector from './components/FacialFeaturesSelector'
import AccessorySelector from './components/AccessorySelector'
import ColorSelector from './components/ColorSelector'
import AdjustmentPanel from './components/AdjustmentPanel'
import PresetManager from './components/PresetManager'
import ExportPanel from './components/ExportPanel'
import { getDefaultConfig, generateRandomConfig } from './utils/random'

const tabs = [
  { id: 'features', name: '五官', icon: '👤' },
  { id: 'accessories', name: '配饰', icon: '🎀' },
  { id: 'colors', name: '颜色', icon: '🎨' },
  { id: 'adjust', name: '微调', icon: '⚙️' },
  { id: 'presets', name: '搭配', icon: '💾' },
  { id: 'export', name: '导出', icon: '📥' }
]

function App() {
  const [config, setConfig] = useState(getDefaultConfig())
  const [activeTab, setActiveTab] = useState('features')
  const avatarRef = useRef(null)

  const handleRandomize = () => {
    setConfig(generateRandomConfig())
  }

  const handleReset = () => {
    setConfig(getDefaultConfig())
  }

  const renderTabContent = () => {
    switch (activeTab) {
      case 'features':
        return <FacialFeaturesSelector config={config} onChange={setConfig} />
      case 'accessories':
        return <AccessorySelector config={config} onChange={setConfig} />
      case 'colors':
        return <ColorSelector config={config} onChange={setConfig} />
      case 'adjust':
        return <AdjustmentPanel config={config} onChange={setConfig} />
      case 'presets':
        return <PresetManager config={config} onLoadPreset={setConfig} />
      case 'export':
        return <ExportPanel avatarRef={avatarRef} />
      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center text-2xl">
                🎭
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-800">卡通头像生成器</h1>
                <p className="text-sm text-gray-500">创建你的专属卡通形象</p>
              </div>
            </div>
            <div className="flex gap-3">
              <button
                onClick={handleRandomize}
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-lg hover:from-pink-600 hover:to-purple-700 transition-all shadow-md hover:shadow-lg"
              >
                <span className="text-lg">🎲</span>
                <span className="font-medium">随机生成</span>
              </button>
              <button
                onClick={handleReset}
                className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
              >
                <span className="text-lg">🔄</span>
                <span className="font-medium">重置</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex flex-col lg:flex-row gap-6">
          <div className="flex-shrink-0 w-full lg:w-96">
            <div className="bg-white rounded-2xl shadow-xl p-6 sticky top-6">
              <h2 className="text-lg font-semibold text-gray-700 mb-4 text-center">预览</h2>
              <div
                ref={avatarRef}
                className="bg-gray-50 rounded-xl overflow-hidden flex items-center justify-center p-4"
                style={{ aspectRatio: '1/1' }}
              >
                <AvatarCanvas config={config} size={400} />
              </div>
            </div>
          </div>

          <div className="flex-1">
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
              <div className="flex border-b overflow-x-auto">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-2 px-6 py-4 font-medium transition-colors whitespace-nowrap ${
                      activeTab === tab.id
                        ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50/50'
                        : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <span className="text-lg">{tab.icon}</span>
                    <span>{tab.name}</span>
                  </button>
                ))}
              </div>

              <div className="p-6 max-h-[calc(100vh-200px)] overflow-y-auto scrollbar-thin">
                {renderTabContent()}
              </div>
            </div>
          </div>
        </div>
      </main>

      <footer className="mt-12 pb-8">
        <p className="text-center text-gray-400 text-sm">
          使用 React + Vite + Tailwind CSS 构建 | 支持随机生成、自定义调整、多尺寸导出
        </p>
      </footer>
    </div>
  )
}

export default App
