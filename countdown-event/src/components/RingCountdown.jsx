import { motion } from 'framer-motion'

const RingCountdown = ({ timeLeft }) => {
  const timeUnits = [
    { label: '天', value: timeLeft.days, max: 365 },
    { label: '时', value: timeLeft.hours, max: 24 },
    { label: '分', value: timeLeft.minutes, max: 60 },
    { label: '秒', value: timeLeft.seconds, max: 60 }
  ]

  const calculateProgress = (value, max) => {
    return (value / max) * 100
  }

  const circumference = 2 * Math.PI * 45

  return (
    <div className="ring-countdown">
      {timeUnits.map((unit, index) => (
        <motion.div
          key={unit.label}
          className="ring-block"
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: index * 0.1 }}
        >
          <svg className="ring-svg" viewBox="0 0 100 100">
            <circle
              className="ring-bg"
              cx="50"
              cy="50"
              r="45"
              fill="none"
              strokeWidth="5"
            />
            <motion.circle
              className="ring-progress"
              cx="50"
              cy="50"
              r="45"
              fill="none"
              strokeWidth="5"
              strokeLinecap="round"
              transform="rotate(-90 50 50)"
              initial={{ pathLength: 0 }}
              animate={{ 
                pathLength: calculateProgress(unit.value, unit.max) / 100 
              }}
              transition={{ duration: 0.5 }}
            />
          </svg>
          <div className="ring-content">
            <motion.span
              className="ring-value"
              key={unit.value}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              {String(unit.value).padStart(2, '0')}
            </motion.span>
            <span className="ring-label">{unit.label}</span>
          </div>
        </motion.div>
      ))}
    </div>
  )
}

export default RingCountdown
