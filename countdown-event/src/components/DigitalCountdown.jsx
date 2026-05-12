import React from 'react'
import { motion } from 'framer-motion'

const DigitalCountdown = ({ timeLeft }) => {
  const timeUnits = [
    { label: '天', value: timeLeft.days },
    { label: '时', value: timeLeft.hours },
    { label: '分', value: timeLeft.minutes },
    { label: '秒', value: timeLeft.seconds }
  ]

  return (
    <div className="digital-countdown">
      {timeUnits.map((unit, index) => (
        <React.Fragment key={unit.label}>
          <motion.div
            className="time-block"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 }}
          >
            <motion.span
              className="time-value"
              key={unit.value}
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              {String(unit.value).padStart(2, '0')}
            </motion.span>
            <span className="time-label">{unit.label}</span>
          </motion.div>
          {index < timeUnits.length - 1 && <span className="separator">:</span>}
        </React.Fragment>
      ))}
    </div>
  )
}

export default DigitalCountdown
