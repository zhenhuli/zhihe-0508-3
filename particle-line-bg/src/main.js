import './style.css'
import ParticleSystem from './particleSystem.js'

const canvas = document.getElementById('particleCanvas')
const particleSystem = new ParticleSystem(canvas, {
  particleCount: 100,
  lineDistance: 150,
  speed: 1,
  particleColor: 'rgba(255, 255, 255, 0.8)',
  lineColor: 'rgba(255, 255, 255, 0.5)',
  particleRadius: 3
})

const particleCountSlider = document.getElementById('particleCount')
const lineDistanceSlider = document.getElementById('lineDistance')
const moveSpeedSlider = document.getElementById('moveSpeed')

const particleValue = document.getElementById('particleValue')
const distanceValue = document.getElementById('distanceValue')
const speedValue = document.getElementById('speedValue')

particleCountSlider.addEventListener('input', (e) => {
  const value = parseInt(e.target.value)
  particleValue.textContent = value
  particleSystem.setParticleCount(value)
})

lineDistanceSlider.addEventListener('input', (e) => {
  const value = parseInt(e.target.value)
  distanceValue.textContent = value
  particleSystem.setLineDistance(value)
})

moveSpeedSlider.addEventListener('input', (e) => {
  const value = parseFloat(e.target.value)
  speedValue.textContent = value.toFixed(1)
  particleSystem.setSpeed(value)
})

const particleTypeSelect = document.getElementById('particleType')
particleTypeSelect.addEventListener('change', (e) => {
  particleSystem.setParticleType(e.target.value)
})

const effectPresetSelect = document.getElementById('effectPreset')
effectPresetSelect.addEventListener('change', (e) => {
  particleSystem.applyPreset(e.target.value)
  
  const preset = particleSystem.getPresets()[e.target.value]
  document.getElementById('particleCount').value = preset.particleCount
  document.getElementById('particleValue').textContent = preset.particleCount
  document.getElementById('lineDistance').value = preset.lineDistance
  document.getElementById('distanceValue').textContent = preset.lineDistance
  document.getElementById('moveSpeed').value = preset.speed
  document.getElementById('speedValue').textContent = preset.speed.toFixed(1)
  document.getElementById('particleType').value = preset.particleType
})

const toggleBtn = document.getElementById('togglePanel')
const controlContent = document.getElementById('controlContent')
let isCollapsed = false

toggleBtn.addEventListener('click', () => {
  isCollapsed = !isCollapsed
  controlContent.classList.toggle('collapsed', isCollapsed)
  toggleBtn.textContent = isCollapsed ? '+' : '−'
})

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault()
    const target = document.querySelector(this.getAttribute('href'))
    if (target) {
      target.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      })
    }
  })
})
