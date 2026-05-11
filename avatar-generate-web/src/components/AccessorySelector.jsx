import React from 'react'
import { accessories } from '../data/avatarData'

function AccessorySelector({ config, onChange }) {
  const handleChange = (key, value) => {
    onChange({ ...config, [key]: value })
  }

  const glassesOptions = accessories.filter(a => a.category === 'glasses')
  const hatOptions = accessories.filter(a => a.category === 'hat')
  const earringOptions = accessories.filter(a => a.category === 'earring')
  const beardOptions = accessories.filter(a => a.category === 'beard')

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-3 text-gray-700">眼镜</h3>
        <div className="grid grid-cols-2 gap-2">
          {glassesOptions.map((item) => (
            <button
              key={item.id}
              onClick={() => handleChange('glasses', item.id)}
              className={`px-4 py-2 rounded-lg border-2 transition-all ${
                config.glasses === item.id
                  ? 'border-purple-500 bg-purple-50 text-purple-700'
                  : 'border-gray-200 hover:border-gray-300 bg-white'
              }`}
            >
              {item.name}
            </button>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-3 text-gray-700">帽子</h3>
        <div className="grid grid-cols-2 gap-2">
          {hatOptions.map((item) => (
            <button
              key={item.id}
              onClick={() => handleChange('hat', item.id)}
              className={`px-4 py-2 rounded-lg border-2 transition-all ${
                config.hat === item.id
                  ? 'border-purple-500 bg-purple-50 text-purple-700'
                  : 'border-gray-200 hover:border-gray-300 bg-white'
              }`}
            >
              {item.name}
            </button>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-3 text-gray-700">耳环</h3>
        <div className="grid grid-cols-3 gap-2">
          {earringOptions.map((item) => (
            <button
              key={item.id}
              onClick={() => handleChange('earring', item.id)}
              className={`px-4 py-2 rounded-lg border-2 transition-all ${
                config.earring === item.id
                  ? 'border-purple-500 bg-purple-50 text-purple-700'
                  : 'border-gray-200 hover:border-gray-300 bg-white'
              }`}
            >
              {item.name}
            </button>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-3 text-gray-700">胡须</h3>
        <div className="grid grid-cols-2 gap-2">
          {beardOptions.map((item) => (
            <button
              key={item.id}
              onClick={() => handleChange('beard', item.id)}
              className={`px-4 py-2 rounded-lg border-2 transition-all ${
                config.beard === item.id
                  ? 'border-orange-500 bg-orange-50 text-orange-700'
                  : 'border-gray-200 hover:border-gray-300 bg-white'
              }`}
            >
              {item.name}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

export default AccessorySelector
