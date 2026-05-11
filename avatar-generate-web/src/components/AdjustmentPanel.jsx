import React from 'react'

function AdjustmentPanel({ config, onChange }) {
  const handleChange = (key, value) => {
    onChange({ ...config, [key]: parseFloat(value) })
  }

  const SliderControl = ({ label, configKey, min, max, step = 1, value }) => (
    <div className="mb-4">
      <div className="flex justify-between mb-1">
        <label className="text-sm font-medium text-gray-600">{label}</label>
        <span className="text-sm text-gray-500">{value.toFixed(1)}</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => handleChange(configKey, e.target.value)}
        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-500"
      />
    </div>
  )

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-4 text-gray-700">眼睛位置</h3>
        <SliderControl
          label="水平位置"
          configKey="eyeOffsetX"
          min={-20}
          max={20}
          step={1}
          value={config.eyeOffsetX}
        />
        <SliderControl
          label="垂直位置"
          configKey="eyeOffsetY"
          min={-20}
          max={20}
          step={1}
          value={config.eyeOffsetY}
        />
        <SliderControl
          label="眼睛大小"
          configKey="eyeSize"
          min={0.5}
          max={1.5}
          step={0.1}
          value={config.eyeSize}
        />
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-4 text-gray-700">鼻子位置</h3>
        <SliderControl
          label="水平位置"
          configKey="noseOffsetX"
          min={-20}
          max={20}
          step={1}
          value={config.noseOffsetX}
        />
        <SliderControl
          label="垂直位置"
          configKey="noseOffsetY"
          min={-20}
          max={20}
          step={1}
          value={config.noseOffsetY}
        />
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-4 text-gray-700">嘴巴位置</h3>
        <SliderControl
          label="水平位置"
          configKey="mouthOffsetX"
          min={-20}
          max={20}
          step={1}
          value={config.mouthOffsetX}
        />
        <SliderControl
          label="垂直位置"
          configKey="mouthOffsetY"
          min={-20}
          max={20}
          step={1}
          value={config.mouthOffsetY}
        />
      </div>

      <button
        onClick={() =>
          onChange({
            ...config,
            eyeOffsetX: 0,
            eyeOffsetY: 0,
            eyeSize: 1,
            noseOffsetX: 0,
            noseOffsetY: 0,
            mouthOffsetX: 0,
            mouthOffsetY: 0
          })
        }
        className="w-full px-4 py-2 text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors"
      >
        重置所有位置
      </button>
    </div>
  )
}

export default AdjustmentPanel
