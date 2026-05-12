import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import DigitalCountdown from './components/DigitalCountdown'
import RingCountdown from './components/RingCountdown'
import ConfigPanel from './components/ConfigPanel'
import './App.css'

const STORAGE_KEY = 'countdown-event-config'

const getDefaultDeadline = () => {
  const date = new Date()
  date.setDate(date.getDate() + 7)
  return date.toISOString().slice(0, 16)
}

const loadConfig = () => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved) {
      return JSON.parse(saved)
    }
  } catch (e) {
    console.error('加载配置失败:', e)
  }
  return {
    eventName: '精彩活动',
    deadline: getDefaultDeadline(),
    style: 'digital',
    backgroundImage: ''
  }
}

const saveConfig = (config) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(config))
  } catch (e) {
    console.error('保存配置失败:', e)
  }
}

const calculateTimeLeft = (deadline) => {
  const difference = new Date(deadline) - new Date()
  
  if (difference <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, isExpired: true }
  }

  return {
    days: Math.floor(difference / (1000 * 60 * 60 * 24)),
    hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((difference / 1000 / 60) % 60),
    seconds: Math.floor((difference / 1000) % 60),
    isExpired: false
  }
}

function App() {
  const [config, setConfig] = useState(loadConfig)
  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft(config.deadline))
  const [showConfig, setShowConfig] = useState(false)

  useEffect(() => {
    saveConfig(config)
    setTimeLeft(calculateTimeLeft(config.deadline))
  }, [config])

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft(config.deadline))
    }, 1000)

    return () => clearInterval(timer)
  }, [config.deadline])

  const handleConfigChange = useCallback((newConfig) => {
    setConfig(newConfig)
  }, [])

  const backgroundStyle = config.backgroundImage
    ? { backgroundImage: `url(${config.backgroundImage})` }
    : {}

  return (
    <div className="app" style={backgroundStyle}>
      <div className="overlay"></div>
      
      <button 
        className="settings-btn"
        onClick={() => setShowConfig(true)}
      >
        ⚙️ 设置
      </button>

      <motion.div 
        className="content"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <motion.h1 
          className="event-title"
          animate={{ scale: [1, 1.02, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          {config.eventName}
        </motion.h1>

        {timeLeft.isExpired ? (
          <motion.div 
            className="expired-message"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            🎉 活动已开始！
          </motion.div>
        ) : (
          config.style === 'digital' 
            ? <DigitalCountdown timeLeft={timeLeft} />
            : <RingCountdown timeLeft={timeLeft} />
        )}
      </motion.div>

      <AnimatePresence>
        {showConfig && (
          <div className="modal-overlay" onClick={() => setShowConfig(false)}>
            <ConfigPanel 
              config={config}
              onConfigChange={handleConfigChange}
              onClose={() => setShowConfig(false)}
            />
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default App
