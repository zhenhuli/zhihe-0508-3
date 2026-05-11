import React from 'react'
import { faceShapes, hairStyles, eyeStyles, noseStyles, mouthStyles } from '../data/avatarData'

function FacialFeaturesSelector({ config, onChange }) {
  const handleChange = (key, value) => {
    onChange({ ...config, [key]: value })
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-3 text-gray-700">脸型</h3>
        <div className="grid grid-cols-2 gap-2">
          {faceShapes.map((shape) => (
            <button
              key={shape.id}
              onClick={() => handleChange('faceShape', shape.id)}
              className={`px-4 py-2 rounded-lg border-2 transition-all ${
                config.faceShape === shape.id
                  ? 'border-blue-500 bg-blue-50 text-blue-700'
                  : 'border-gray-200 hover:border-gray-300 bg-white'
              }`}
            >
              {shape.name}
            </button>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-3 text-gray-700">发型</h3>
        <div className="grid grid-cols-2 gap-2">
          {hairStyles.map((style) => (
            <button
              key={style.id}
              onClick={() => handleChange('hairStyle', style.id)}
              className={`px-4 py-2 rounded-lg border-2 transition-all ${
                config.hairStyle === style.id
                  ? 'border-blue-500 bg-blue-50 text-blue-700'
                  : 'border-gray-200 hover:border-gray-300 bg-white'
              }`}
            >
              {style.name}
            </button>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-3 text-gray-700">眼睛样式</h3>
        <div className="grid grid-cols-2 gap-2">
          {eyeStyles.map((style) => (
            <button
              key={style.id}
              onClick={() => handleChange('eyeStyle', style.id)}
              className={`px-4 py-2 rounded-lg border-2 transition-all ${
                config.eyeStyle === style.id
                  ? 'border-blue-500 bg-blue-50 text-blue-700'
                  : 'border-gray-200 hover:border-gray-300 bg-white'
              }`}
            >
              {style.name}
            </button>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-3 text-gray-700">鼻子样式</h3>
        <div className="grid grid-cols-3 gap-2">
          {noseStyles.map((style) => (
            <button
              key={style.id}
              onClick={() => handleChange('noseStyle', style.id)}
              className={`px-4 py-2 rounded-lg border-2 transition-all ${
                config.noseStyle === style.id
                  ? 'border-blue-500 bg-blue-50 text-blue-700'
                  : 'border-gray-200 hover:border-gray-300 bg-white'
              }`}
            >
              {style.name}
            </button>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-3 text-gray-700">嘴巴样式</h3>
        <div className="grid grid-cols-2 gap-2">
          {mouthStyles.map((style) => (
            <button
              key={style.id}
              onClick={() => handleChange('mouthStyle', style.id)}
              className={`px-4 py-2 rounded-lg border-2 transition-all ${
                config.mouthStyle === style.id
                  ? 'border-blue-500 bg-blue-50 text-blue-700'
                  : 'border-gray-200 hover:border-gray-300 bg-white'
              }`}
            >
              {style.name}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

export default FacialFeaturesSelector
