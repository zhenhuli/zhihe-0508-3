import React from 'react'
import { skinColors, hairColors, eyeColors, lipColors, blushColors, backgroundColors } from '../data/avatarData'

function ColorSelector({ config, onChange }) {
  const handleChange = (key, value) => {
    onChange({ ...config, [key]: value })
  }

  const ColorSwatch = ({ color, isSelected, onClick, label }) => (
    <button
      onClick={onClick}
      className={`w-8 h-8 rounded-full border-2 transition-all hover:scale-110 relative ${
        isSelected ? 'border-gray-800 scale-110' : 'border-gray-300'
      } ${color === 'transparent' ? 'bg-gradient-to-br from-gray-200 to-white' : ''}`}
      style={{ backgroundColor: color === 'transparent' ? undefined : color }}
      title={label || color}
    >
      {color === 'transparent' && (
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-xs font-bold text-gray-500">无</span>
        </div>
      )}
    </button>
  )

  const ColorSection = ({ title, colors, selectedColor, configKey }) => (
    <div>
      <h3 className="text-lg font-semibold mb-3 text-gray-700">{title}</h3>
      <div className="flex flex-wrap gap-2">
        {colors.map((color, index) => (
          <ColorSwatch
            key={index}
            color={color}
            isSelected={selectedColor === color}
            onClick={() => handleChange(configKey, color)}
          />
        ))}
      </div>
    </div>
  )

  return (
    <div className="space-y-6">
      <ColorSection
        title="肤色"
        colors={skinColors}
        selectedColor={config.skinColor}
        configKey="skinColor"
      />
      <ColorSection
        title="发色"
        colors={hairColors}
        selectedColor={config.hairColor}
        configKey="hairColor"
      />
      <ColorSection
        title="眼睛颜色"
        colors={eyeColors}
        selectedColor={config.eyeColor}
        configKey="eyeColor"
      />
      <ColorSection
        title="嘴唇颜色"
        colors={lipColors}
        selectedColor={config.lipColor}
        configKey="lipColor"
      />
      <ColorSection
        title="腮红"
        colors={blushColors}
        selectedColor={config.blushColor}
        configKey="blushColor"
      />
      <ColorSection
        title="背景颜色"
        colors={backgroundColors}
        selectedColor={config.backgroundColor}
        configKey="backgroundColor"
      />
    </div>
  )
}

export default ColorSelector
