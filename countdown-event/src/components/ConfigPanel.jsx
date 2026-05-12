import { useState } from 'react'
import { motion } from 'framer-motion'

const ConfigPanel = ({ config, onConfigChange, onClose }) => {
  const [localConfig, setLocalConfig] = useState(config)

  const handleSubmit = (e) => {
    e.preventDefault()
    onConfigChange(localConfig)
    onClose()
  }

  const handleImageUpload = (e) => {
    const file = e.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (event) => {
        setLocalConfig({ ...localConfig, backgroundImage: event.target.result })
      }
      reader.readAsDataURL(file)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: -50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -50 }}
      className="config-panel"
      onClick={(e) => e.stopPropagation()}
    >
      <div className="panel-header">
        <h2>设置</h2>
        <button className="close-btn" onClick={onClose}>×</button>
      </div>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>活动名称</label>
          <input
            type="text"
            value={localConfig.eventName}
            onChange={(e) => setLocalConfig({ ...localConfig, eventName: e.target.value })}
            placeholder="请输入活动名称"
          />
        </div>
        <div className="form-group">
          <label>截止时间</label>
          <input
            type="datetime-local"
            value={localConfig.deadline}
            onChange={(e) => setLocalConfig({ ...localConfig, deadline: e.target.value })}
          />
        </div>
        <div className="form-group">
          <label>倒计时样式</label>
          <div className="style-options">
            <label>
              <input
                type="radio"
                name="style"
                value="digital"
                checked={localConfig.style === 'digital'}
                onChange={(e) => setLocalConfig({ ...localConfig, style: e.target.value })}
              />
              数字样式
            </label>
            <label>
              <input
                type="radio"
                name="style"
                value="ring"
                checked={localConfig.style === 'ring'}
                onChange={(e) => setLocalConfig({ ...localConfig, style: e.target.value })}
              />
              环形样式
            </label>
          </div>
        </div>
        <div className="form-group">
          <label>背景图片</label>
          <input type="file" accept="image/*" onChange={handleImageUpload} />
          {localConfig.backgroundImage && (
            <div className="image-preview">
              <img src={localConfig.backgroundImage} alt="预览" />
            </div>
          )}
        </div>
        <button type="submit" className="submit-btn">保存设置</button>
      </form>
    </motion.div>
  )
}

export default ConfigPanel
