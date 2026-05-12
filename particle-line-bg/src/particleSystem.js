const PARTICLE_TYPES = ['circle', 'star', 'square', 'triangle', 'diamond'];
const COLORS = [
  'rgba(255, 255, 255, 0.9)',
  'rgba(255, 215, 0, 0.9)',
  'rgba(0, 255, 255, 0.9)',
  'rgba(255, 105, 180, 0.9)',
  'rgba(144, 238, 144, 0.9)'
];

const EFFECT_PRESETS = {
  default: {
    name: '默认粒子',
    particleCount: 100,
    lineDistance: 150,
    speed: 1,
    particleType: 'mixed',
    lineColor: 'rgba(255, 255, 255, 0.5)',
    showLines: true,
    gravity: 0,
    bgGradient: ['#667eea', '#764ba2']
  },
  starfield: {
    name: '星空效果',
    particleCount: 200,
    lineDistance: 0,
    speed: 0.3,
    particleType: 'circle',
    lineColor: 'rgba(255, 255, 255, 0)',
    showLines: false,
    gravity: 0,
    twinkle: true,
    bgGradient: ['#0f0c29', '#302b63', '#24243e']
  },
  fire: {
    name: '火焰效果',
    particleCount: 80,
    lineDistance: 0,
    speed: 1.5,
    particleType: 'circle',
    showLines: false,
    gravity: -0.05,
    fireColors: true,
    fadeOut: true,
    bgGradient: ['#1a1a2e', '#16213e']
  },
  snow: {
    name: '雪花效果',
    particleCount: 150,
    lineDistance: 0,
    speed: 0.5,
    particleType: 'circle',
    showLines: false,
    gravity: 0.03,
    snowSway: true,
    bgGradient: ['#83a4d4', '#b6fbff']
  },
  neon: {
    name: '霓虹效果',
    particleCount: 60,
    lineDistance: 200,
    speed: 0.8,
    particleType: 'mixed',
    lineColor: 'rgba(255, 0, 255, 0.3)',
    showLines: true,
    glow: true,
    neonColors: true,
    bgGradient: ['#0a0a0a', '#1a1a2e']
  },
  bubble: {
    name: '泡泡效果',
    particleCount: 50,
    lineDistance: 0,
    speed: 0.6,
    particleType: 'circle',
    showLines: false,
    gravity: -0.02,
    bubbleWobble: true,
    transparent: true,
    bgGradient: ['#2193b0', '#6dd5ed']
  },
  matrix: {
    name: '矩阵雨',
    particleCount: 120,
    lineDistance: 0,
    speed: 2,
    particleType: 'square',
    showLines: false,
    gravity: 0.1,
    matrixGreen: true,
    bgGradient: ['#000000', '#0d0d0d']
  }
};

class ParticleSystem {
  constructor(canvas, options = {}) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.particles = [];
    this.animationId = null;
    this.mouse = { x: null, y: null, radius: 150 };
    this.currentPreset = 'default';
    this.time = 0;

    this.options = {
      particleCount: options.particleCount || 100,
      lineDistance: options.lineDistance || 150,
      speed: options.speed || 1,
      particleColor: options.particleColor || 'rgba(255, 255, 255, 0.8)',
      lineColor: options.lineColor || 'rgba(255, 255, 255, 0.5)',
      particleRadius: options.particleRadius || 3,
      particleType: options.particleType || 'mixed',
      showLines: options.showLines !== undefined ? options.showLines : true,
      gravity: options.gravity || 0,
      twinkle: options.twinkle || false,
      fireColors: options.fireColors || false,
      fadeOut: options.fadeOut || false,
      snowSway: options.snowSway || false,
      glow: options.glow || false,
      neonColors: options.neonColors || false,
      bubbleWobble: options.bubbleWobble || false,
      transparent: options.transparent || false,
      matrixGreen: options.matrixGreen || false
    };

    this.init();
    this.setupEventListeners();
  }

  init() {
    this.resizeCanvas();
    this.createParticles();
    this.animate();
  }

  resizeCanvas() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
  }

  getParticleColor() {
    if (this.options.fireColors) {
      const fireColors = [
        'rgba(255, 100, 0, 0.9)',
        'rgba(255, 200, 0, 0.9)',
        'rgba(255, 50, 0, 0.9)',
        'rgba(255, 150, 0, 0.9)'
      ];
      return fireColors[Math.floor(Math.random() * fireColors.length)];
    }
    if (this.options.neonColors) {
      const neonColors = [
        'rgba(255, 0, 255, 0.9)',
        'rgba(0, 255, 255, 0.9)',
        'rgba(0, 255, 0, 0.9)',
        'rgba(255, 255, 0, 0.9)',
        'rgba(255, 0, 0, 0.9)'
      ];
      return neonColors[Math.floor(Math.random() * neonColors.length)];
    }
    if (this.options.matrixGreen) {
      return `rgba(0, ${150 + Math.random() * 105}, 0, ${0.5 + Math.random() * 0.5})`;
    }
    if (this.options.transparent) {
      return `rgba(255, 255, 255, ${0.2 + Math.random() * 0.3})`;
    }
    return COLORS[Math.floor(Math.random() * COLORS.length)];
  }

  createParticles() {
    this.particles = [];
    for (let i = 0; i < this.options.particleCount; i++) {
      const type = this.options.particleType === 'mixed' 
        ? PARTICLE_TYPES[Math.floor(Math.random() * PARTICLE_TYPES.length)]
        : this.options.particleType;
      
      let x = Math.random() * this.canvas.width;
      let y = Math.random() * this.canvas.height;
      let dx = (Math.random() - 0.5) * this.options.speed;
      let dy = (Math.random() - 0.5) * this.options.speed;

      if (this.options.gravity < 0) {
        y = this.canvas.height + Math.random() * 100;
      }
      if (this.options.gravity > 0) {
        y = -Math.random() * 100;
      }

      this.particles.push({
        x: x,
        y: y,
        dx: dx,
        dy: dy,
        radius: this.options.bubbleWobble 
          ? 2 + Math.random() * 8 
          : Math.random() * this.options.particleRadius + 1,
        type: type,
        color: this.getParticleColor(),
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.02,
        alpha: 1,
        swayOffset: Math.random() * Math.PI * 2,
        originalRadius: this.options.bubbleWobble ? 2 + Math.random() * 8 : null
      });
    }
  }

  setupEventListeners() {
    window.addEventListener('resize', () => {
      this.resizeCanvas();
      this.createParticles();
    });

    window.addEventListener('mousemove', (e) => {
      this.mouse.x = e.x;
      this.mouse.y = e.y;
    });

    window.addEventListener('mouseout', () => {
      this.mouse.x = null;
      this.mouse.y = null;
    });
  }

  drawCircle(x, y, radius, color, alpha = 1) {
    this.ctx.save();
    this.ctx.globalAlpha = alpha;
    this.ctx.beginPath();
    this.ctx.arc(x, y, radius, 0, Math.PI * 2);
    this.ctx.fillStyle = color;
    this.ctx.fill();
    this.ctx.restore();
  }

  drawStar(x, y, radius, color, rotation, alpha = 1) {
    this.ctx.save();
    this.ctx.globalAlpha = alpha;
    this.ctx.translate(x, y);
    this.ctx.rotate(rotation);
    
    this.ctx.beginPath();
    for (let i = 0; i < 5; i++) {
      const angle = (i * 4 * Math.PI) / 5 - Math.PI / 2;
      const px = Math.cos(angle) * radius;
      const py = Math.sin(angle) * radius;
      if (i === 0) this.ctx.moveTo(px, py);
      else this.ctx.lineTo(px, py);
    }
    this.ctx.closePath();
    this.ctx.fillStyle = color;
    this.ctx.fill();
    
    this.ctx.restore();
  }

  drawSquare(x, y, radius, color, rotation, alpha = 1) {
    this.ctx.save();
    this.ctx.globalAlpha = alpha;
    this.ctx.translate(x, y);
    this.ctx.rotate(rotation);
    
    this.ctx.fillStyle = color;
    this.ctx.fillRect(-radius, -radius, radius * 2, radius * 2);
    
    this.ctx.restore();
  }

  drawTriangle(x, y, radius, color, rotation, alpha = 1) {
    this.ctx.save();
    this.ctx.globalAlpha = alpha;
    this.ctx.translate(x, y);
    this.ctx.rotate(rotation);
    
    this.ctx.beginPath();
    this.ctx.moveTo(0, -radius);
    this.ctx.lineTo(-radius * 0.866, radius * 0.5);
    this.ctx.lineTo(radius * 0.866, radius * 0.5);
    this.ctx.closePath();
    this.ctx.fillStyle = color;
    this.ctx.fill();
    
    this.ctx.restore();
  }

  drawDiamond(x, y, radius, color, rotation, alpha = 1) {
    this.ctx.save();
    this.ctx.globalAlpha = alpha;
    this.ctx.translate(x, y);
    this.ctx.rotate(rotation);
    
    this.ctx.beginPath();
    this.ctx.moveTo(0, -radius);
    this.ctx.lineTo(radius * 0.7, 0);
    this.ctx.lineTo(0, radius);
    this.ctx.lineTo(-radius * 0.7, 0);
    this.ctx.closePath();
    this.ctx.fillStyle = color;
    this.ctx.fill();
    
    this.ctx.restore();
  }

  drawParticle(particle) {
    const alpha = particle.alpha !== undefined ? particle.alpha : 1;
    
    if (this.options.glow) {
      this.ctx.save();
      this.ctx.shadowBlur = 20;
      this.ctx.shadowColor = particle.color;
    }

    switch (particle.type) {
      case 'star':
        this.drawStar(particle.x, particle.y, particle.radius * 1.5, particle.color, particle.rotation, alpha);
        break;
      case 'square':
        this.drawSquare(particle.x, particle.y, particle.radius, particle.color, particle.rotation, alpha);
        break;
      case 'triangle':
        this.drawTriangle(particle.x, particle.y, particle.radius * 1.3, particle.color, particle.rotation, alpha);
        break;
      case 'diamond':
        this.drawDiamond(particle.x, particle.y, particle.radius * 1.3, particle.color, particle.rotation, alpha);
        break;
      case 'circle':
      default:
        this.drawCircle(particle.x, particle.y, particle.radius, particle.color, alpha);
    }

    if (this.options.glow) {
      this.ctx.restore();
    }
  }

  drawLine(p1, p2, opacity) {
    this.ctx.beginPath();
    this.ctx.moveTo(p1.x, p1.y);
    this.ctx.lineTo(p2.x, p2.y);
    this.ctx.strokeStyle = this.options.lineColor.replace('0.5', opacity);
    this.ctx.lineWidth = 1;
    this.ctx.stroke();
  }

  updateParticle(particle, index) {
    particle.x += particle.dx;
    particle.y += particle.dy;
    particle.rotation += particle.rotationSpeed;

    if (this.options.gravity !== 0) {
      particle.dy += this.options.gravity;
    }

    if (this.options.twinkle) {
      particle.alpha = 0.3 + Math.sin(this.time * 0.05 + index) * 0.5;
    }

    if (this.options.snowSway) {
      particle.dx = Math.sin(this.time * 0.02 + particle.swayOffset) * 0.5;
    }

    if (this.options.bubbleWobble) {
      particle.radius = particle.originalRadius * (1 + Math.sin(this.time * 0.03 + particle.swayOffset) * 0.2);
    }

    if (this.options.gravity < 0 && particle.y < -50) {
      particle.y = this.canvas.height + 50;
      particle.x = Math.random() * this.canvas.width;
      particle.color = this.getParticleColor();
    }
    if (this.options.gravity > 0 && particle.y > this.canvas.height + 50) {
      particle.y = -50;
      particle.x = Math.random() * this.canvas.width;
      particle.color = this.getParticleColor();
    }

    if (this.options.gravity === 0) {
      if (particle.x < 0 || particle.x > this.canvas.width) {
        particle.dx = -particle.dx;
      }
      if (particle.y < 0 || particle.y > this.canvas.height) {
        particle.dy = -particle.dy;
      }
    }

    if (this.mouse.x !== null && this.mouse.y !== null) {
      const dx = this.mouse.x - particle.x;
      const dy = this.mouse.y - particle.y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < this.mouse.radius) {
        const force = (this.mouse.radius - distance) / this.mouse.radius;
        particle.x -= dx * force * 0.02;
        particle.y -= dy * force * 0.02;
      }
    }
  }

  connectParticles() {
    if (!this.options.showLines) return;
    
    for (let i = 0; i < this.particles.length; i++) {
      for (let j = i + 1; j < this.particles.length; j++) {
        const dx = this.particles[i].x - this.particles[j].x;
        const dy = this.particles[i].y - this.particles[j].y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < this.options.lineDistance) {
          const opacity = 1 - distance / this.options.lineDistance;
          this.drawLine(this.particles[i], this.particles[j], opacity);
        }
      }
    }
  }

  animate() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.time++;

    this.particles.forEach((particle, index) => {
      this.updateParticle(particle, index);
      this.drawParticle(particle);
    });

    this.connectParticles();

    this.animationId = requestAnimationFrame(() => this.animate());
  }

  applyPreset(presetName) {
    const preset = EFFECT_PRESETS[presetName];
    if (!preset) return;

    this.currentPreset = presetName;
    Object.assign(this.options, preset);
    this.createParticles();
    
    const gradient = this.ctx.createLinearGradient(0, 0, this.canvas.width, this.canvas.height);
    preset.bgGradient.forEach((color, index) => {
      gradient.addColorStop(index / (preset.bgGradient.length - 1), color);
    });
    document.getElementById('particleCanvas').style.background = preset.bgGradient.length === 2 
      ? `linear-gradient(135deg, ${preset.bgGradient[0]} 0%, ${preset.bgGradient[1]} 100%)`
      : `linear-gradient(135deg, ${preset.bgGradient[0]} 0%, ${preset.bgGradient[1]} 50%, ${preset.bgGradient[2]} 100%)`;
  }

  getPresets() {
    return EFFECT_PRESETS;
  }

  setParticleCount(count) {
    this.options.particleCount = count;
    this.createParticles();
  }

  setLineDistance(distance) {
    this.options.lineDistance = distance;
  }

  setSpeed(speed) {
    this.options.speed = speed;
    this.particles.forEach(particle => {
      particle.dx = (Math.random() - 0.5) * speed;
      particle.dy = (Math.random() - 0.5) * speed;
    });
  }

  setParticleType(type) {
    this.options.particleType = type;
    this.createParticles();
  }

  getParticleTypes() {
    return PARTICLE_TYPES;
  }

  destroy() {
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
    }
  }
}

export default ParticleSystem;
