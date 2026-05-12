import './style.css'

class PixelArtMaker {
  constructor() {
    this.canvas = document.getElementById('pixelCanvas')
    this.ctx = this.canvas.getContext('2d')
    
    this.pixelSize = 20
    this.width = 16
    this.height = 16
    
    this.currentTool = 'pencil'
    this.currentColor = '#000000'
    this.showGrid = true
    this.isDrawing = false
    
    this.pixels = []
    
    this.colors = [
      '#000000', '#FFFFFF', '#FF0000', '#00FF00', '#0000FF',
      '#FFFF00', '#FF00FF', '#00FFFF', '#FF8800', '#8800FF',
      '#0088FF', '#00FF88', '#FF8888', '#88FF88', '#8888FF',
      '#888888', '#CCCCCC', '#FFCC00', '#CC00FF', '#00CCFF'
    ]
    
    this.init()
  }
  
  init() {
    this.initPixels()
    this.initColorPalette()
    this.bindEvents()
    this.updateColorPreview()
    this.render()
    this.adjustCanvasSize()
  }
  
  adjustCanvasSize() {
    const wrapper = document.querySelector('.canvas-wrapper')
    const maxWidth = wrapper.clientWidth - 32
    const maxHeight = wrapper.clientHeight - 32
    
    const maxPixelWidth = Math.floor(maxWidth / this.width)
    const maxPixelHeight = Math.floor(maxHeight / this.height)
    
    this.pixelSize = Math.min(maxPixelWidth, maxPixelHeight, 30)
    
    this.canvas.width = this.width * this.pixelSize
    this.canvas.height = this.height * this.pixelSize
    
    this.render()
  }
  
  initPixels() {
    this.pixels = []
    for (let y = 0; y < this.height; y++) {
      this.pixels[y] = []
      for (let x = 0; x < this.width; x++) {
        this.pixels[y][x] = '#FFFFFF'
      }
    }
  }
  
  initColorPalette() {
    const palette = document.getElementById('colorPalette')
    palette.innerHTML = ''
    
    this.colors.forEach((color, index) => {
      const swatch = document.createElement('div')
      swatch.className = 'color-swatch' + (index === 0 ? ' active' : '')
      swatch.style.backgroundColor = color
      swatch.dataset.color = color
      swatch.addEventListener('click', () => this.selectColor(color, swatch))
      palette.appendChild(swatch)
    })
  }
  
  selectColor(color, swatch) {
    this.currentColor = color
    document.getElementById('colorPicker').value = color
    this.updateColorPreview()
    
    document.querySelectorAll('.color-swatch').forEach(s => {
      s.classList.remove('active')
    })
    if (swatch) {
      swatch.classList.add('active')
    }
  }
  
  updateColorPreview() {
    const preview = document.getElementById('colorPreview')
    preview.style.backgroundColor = this.currentColor
    preview.style.borderRadius = '8px'
  }
  
  bindEvents() {
    document.getElementById('colorPicker').addEventListener('input', (e) => {
      this.currentColor = e.target.value
      this.updateColorPreview()
    })
    
    document.querySelectorAll('.tool-item[data-tool]').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.tool-item[data-tool]').forEach(b => b.classList.remove('active'))
        btn.classList.add('active')
        this.currentTool = btn.dataset.tool
      })
    })
    
    document.getElementById('resizeCanvas').addEventListener('click', () => {
      const newWidth = parseInt(document.getElementById('canvasWidth').value)
      const newHeight = parseInt(document.getElementById('canvasHeight').value)
      
      if (newWidth >= 4 && newWidth <= 64 && newHeight >= 4 && newHeight <= 64) {
        this.width = newWidth
        this.height = newHeight
        this.initPixels()
        this.adjustCanvasSize()
        this.closeModal('settingsModal')
      }
    })
    
    document.getElementById('showGrid').addEventListener('change', (e) => {
      this.showGrid = e.target.checked
      this.render()
    })
    
    document.getElementById('savePNG').addEventListener('click', () => {
      this.saveAsPNG()
      this.closeModal('exportModal')
    })
    
    this.canvas.addEventListener('mousedown', (e) => this.handleStart(e))
    this.canvas.addEventListener('mousemove', (e) => this.handleMove(e))
    this.canvas.addEventListener('mouseup', () => this.handleEnd())
    this.canvas.addEventListener('mouseleave', () => this.handleEnd())
    
    this.canvas.addEventListener('touchstart', (e) => this.handleTouchStart(e), { passive: false })
    this.canvas.addEventListener('touchmove', (e) => this.handleTouchMove(e), { passive: false })
    this.canvas.addEventListener('touchend', () => this.handleEnd())
    
    document.getElementById('settingsBtn').addEventListener('click', () => this.openModal('settingsModal'))
    document.getElementById('closeSettings').addEventListener('click', () => this.closeModal('settingsModal'))
    
    document.getElementById('colorTool').addEventListener('click', () => this.openModal('colorModal'))
    document.getElementById('closeColor').addEventListener('click', () => this.closeModal('colorModal'))
    
    document.getElementById('exportBtn').addEventListener('click', () => this.openModal('exportModal'))
    document.getElementById('closeExport').addEventListener('click', () => this.closeModal('exportModal'))
    
    document.querySelectorAll('.modal-overlay').forEach(overlay => {
      overlay.addEventListener('click', (e) => {
        if (e.target === overlay) {
          overlay.classList.remove('show')
        }
      })
    })
    
    window.addEventListener('resize', () => this.adjustCanvasSize())
  }
  
  openModal(modalId) {
    document.getElementById(modalId).classList.add('show')
  }
  
  closeModal(modalId) {
    document.getElementById(modalId).classList.remove('show')
  }
  
  getPixelPosition(e) {
    const rect = this.canvas.getBoundingClientRect()
    const clientX = e.touches ? e.touches[0].clientX : e.clientX
    const clientY = e.touches ? e.touches[0].clientY : e.clientY
    const x = Math.floor((clientX - rect.left) / this.pixelSize)
    const y = Math.floor((clientY - rect.top) / this.pixelSize)
    return { x, y }
  }
  
  handleStart(e) {
    this.isDrawing = true
    const { x, y } = this.getPixelPosition(e)
    this.applyTool(x, y)
  }
  
  handleTouchStart(e) {
    e.preventDefault()
    this.handleStart(e)
  }
  
  handleMove(e) {
    if (!this.isDrawing) return
    if (this.currentTool === 'fill') return
    
    const { x, y } = this.getPixelPosition(e)
    this.applyTool(x, y)
  }
  
  handleTouchMove(e) {
    e.preventDefault()
    this.handleMove(e)
  }
  
  handleEnd() {
    this.isDrawing = false
  }
  
  applyTool(x, y) {
    if (x < 0 || x >= this.width || y < 0 || y >= this.height) return
    
    switch (this.currentTool) {
      case 'pencil':
        this.pixels[y][x] = this.currentColor
        break
      case 'eraser':
        this.pixels[y][x] = '#FFFFFF'
        break
      case 'fill':
        this.floodFill(x, y, this.pixels[y][x], this.currentColor)
        break
    }
    
    this.render()
  }
  
  floodFill(x, y, targetColor, fillColor) {
    if (targetColor === fillColor) return
    if (x < 0 || x >= this.width || y < 0 || y >= this.height) return
    if (this.pixels[y][x] !== targetColor) return
    
    this.pixels[y][x] = fillColor
    
    this.floodFill(x + 1, y, targetColor, fillColor)
    this.floodFill(x - 1, y, targetColor, fillColor)
    this.floodFill(x, y + 1, targetColor, fillColor)
    this.floodFill(x, y - 1, targetColor, fillColor)
  }
  
  render() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
    
    for (let y = 0; y < this.height; y++) {
      for (let x = 0; x < this.width; x++) {
        this.ctx.fillStyle = this.pixels[y][x]
        this.ctx.fillRect(x * this.pixelSize, y * this.pixelSize, this.pixelSize, this.pixelSize)
      }
    }
    
    if (this.showGrid) {
      this.ctx.strokeStyle = '#e0e0e0'
      this.ctx.lineWidth = 1
      
      for (let x = 0; x <= this.width; x++) {
        this.ctx.beginPath()
        this.ctx.moveTo(x * this.pixelSize, 0)
        this.ctx.lineTo(x * this.pixelSize, this.canvas.height)
        this.ctx.stroke()
      }
      
      for (let y = 0; y <= this.height; y++) {
        this.ctx.beginPath()
        this.ctx.moveTo(0, y * this.pixelSize)
        this.ctx.lineTo(this.canvas.width, y * this.pixelSize)
        this.ctx.stroke()
      }
    }
  }
  
  saveAsPNG() {
    const scale = parseInt(document.getElementById('exportScale').value) || 1
    const includeGrid = document.getElementById('exportGrid').checked
    const exportCanvas = document.createElement('canvas')
    exportCanvas.width = this.width * scale
    exportCanvas.height = this.height * scale
    const exportCtx = exportCanvas.getContext('2d')
    
    exportCtx.imageSmoothingEnabled = false
    
    for (let y = 0; y < this.height; y++) {
      for (let x = 0; x < this.width; x++) {
        exportCtx.fillStyle = this.pixels[y][x]
        exportCtx.fillRect(x * scale, y * scale, scale, scale)
      }
    }
    
    if (includeGrid) {
      exportCtx.strokeStyle = '#e0e0e0'
      exportCtx.lineWidth = Math.max(1, Math.floor(scale / 10))
      
      for (let x = 0; x <= this.width; x++) {
        exportCtx.beginPath()
        exportCtx.moveTo(x * scale, 0)
        exportCtx.lineTo(x * scale, exportCanvas.height)
        exportCtx.stroke()
      }
      
      for (let y = 0; y <= this.height; y++) {
        exportCtx.beginPath()
        exportCtx.moveTo(0, y * scale)
        exportCtx.lineTo(exportCanvas.width, y * scale)
        exportCtx.stroke()
      }
    }
    
    const link = document.createElement('a')
    link.download = `pixel-art-${Date.now()}.png`
    link.href = exportCanvas.toDataURL('image/png')
    link.click()
  }
}

document.addEventListener('DOMContentLoaded', () => {
  new PixelArtMaker()
})
