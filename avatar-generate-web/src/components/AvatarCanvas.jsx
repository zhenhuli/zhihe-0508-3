import React from 'react'

function AvatarCanvas({ config, size = 400 }) {
  const {
    skinColor,
    hairColor,
    eyeColor,
    lipColor,
    faceShape,
    hairStyle,
    eyeStyle,
    noseStyle,
    mouthStyle,
    glasses,
    hat,
    earring,
    beard,
    blushColor,
    backgroundColor,
    eyeOffsetX = 0,
    eyeOffsetY = 0,
    eyeSize = 1,
    mouthOffsetX = 0,
    mouthOffsetY = 0,
    noseOffsetX = 0,
    noseOffsetY = 0
  } = config

  const centerX = size / 2
  const centerY = size / 2

  const renderFace = () => {
    switch (faceShape) {
      case 'round':
        return <circle cx={centerX} cy={centerY} r={size * 0.35} fill={skinColor} />
      case 'oval':
        return <ellipse cx={centerX} cy={centerY} rx={size * 0.3} ry={size * 0.38} fill={skinColor} />
      case 'square':
        return <rect x={centerX - size * 0.3} y={centerY - size * 0.32} width={size * 0.6} height={size * 0.64} rx={size * 0.1} fill={skinColor} />
      case 'heart':
        return (
          <path
            d={`M ${centerX} ${centerY - size * 0.25} 
                Q ${centerX + size * 0.35} ${centerY - size * 0.45} ${centerX + size * 0.35} ${centerY - size * 0.1}
                Q ${centerX + size * 0.35} ${centerY + size * 0.35} ${centerX} ${centerY + size * 0.35}
                Q ${centerX - size * 0.35} ${centerY + size * 0.35} ${centerX - size * 0.35} ${centerY - size * 0.1}
                Q ${centerX - size * 0.35} ${centerY - size * 0.45} ${centerX} ${centerY - size * 0.25} Z`}
            fill={skinColor}
          />
        )
      default:
        return <circle cx={centerX} cy={centerY} r={size * 0.35} fill={skinColor} />
    }
  }

  const renderHair = () => {
    if (hairStyle === 'bald') return null

    switch (hairStyle) {
      case 'short':
        return (
          <g>
            <path
              d={`M ${centerX - size * 0.35} ${centerY - size * 0.15}
                  Q ${centerX - size * 0.4} ${centerY - size * 0.45} ${centerX} ${centerY - size * 0.45}
                  Q ${centerX + size * 0.4} ${centerY - size * 0.45} ${centerX + size * 0.35} ${centerY - size * 0.15}
                  Q ${centerX + size * 0.3} ${centerY - size * 0.3} ${centerX} ${centerY - size * 0.3}
                  Q ${centerX - size * 0.3} ${centerY - size * 0.3} ${centerX - size * 0.35} ${centerY - size * 0.15} Z`}
              fill={hairColor}
            />
            <ellipse cx={centerX - size * 0.28} cy={centerY - size * 0.15} rx={size * 0.08} ry={size * 0.12} fill={hairColor} />
            <ellipse cx={centerX + size * 0.28} cy={centerY - size * 0.15} rx={size * 0.08} ry={size * 0.12} fill={hairColor} />
          </g>
        )
      case 'medium':
        return (
          <g>
            <path
              d={`M ${centerX - size * 0.38} ${centerY + size * 0.1}
                  Q ${centerX - size * 0.45} ${centerY - size * 0.5} ${centerX} ${centerY - size * 0.5}
                  Q ${centerX + size * 0.45} ${centerY - size * 0.5} ${centerX + size * 0.38} ${centerY + size * 0.1}
                  Q ${centerX + size * 0.3} ${centerY - size * 0.3} ${centerX} ${centerY - size * 0.3}
                  Q ${centerX - size * 0.3} ${centerY - size * 0.3} ${centerX - size * 0.38} ${centerY + size * 0.1} Z`}
              fill={hairColor}
            />
          </g>
        )
      case 'long':
        return (
          <g>
            <path
              d={`M ${centerX - size * 0.4} ${centerY + size * 0.4}
                  Q ${centerX - size * 0.5} ${centerY - size * 0.5} ${centerX} ${centerY - size * 0.5}
                  Q ${centerX + size * 0.5} ${centerY - size * 0.5} ${centerX + size * 0.4} ${centerY + size * 0.4}
                  Q ${centerX + size * 0.3} ${centerY - size * 0.3} ${centerX} ${centerY - size * 0.3}
                  Q ${centerX - size * 0.3} ${centerY - size * 0.3} ${centerX - size * 0.4} ${centerY + size * 0.4} Z`}
              fill={hairColor}
            />
          </g>
        )
      case 'curly':
        return (
          <g>
            <circle cx={centerX - size * 0.25} cy={centerY - size * 0.35} r={size * 0.15} fill={hairColor} />
            <circle cx={centerX + size * 0.25} cy={centerY - size * 0.35} r={size * 0.15} fill={hairColor} />
            <circle cx={centerX} cy={centerY - size * 0.45} r={size * 0.15} fill={hairColor} />
            <circle cx={centerX - size * 0.35} cy={centerY - size * 0.2} r={size * 0.12} fill={hairColor} />
            <circle cx={centerX + size * 0.35} cy={centerY - size * 0.2} r={size * 0.12} fill={hairColor} />
            <circle cx={centerX - size * 0.3} cy={centerY + size * 0.1} r={size * 0.1} fill={hairColor} />
            <circle cx={centerX + size * 0.3} cy={centerY + size * 0.1} r={size * 0.1} fill={hairColor} />
          </g>
        )
      default:
        return null
    }
  }

  const renderEyes = () => {
    const leftEyeX = centerX - size * 0.15 + eyeOffsetX
    const rightEyeX = centerX + size * 0.15 + eyeOffsetX
    const eyeY = centerY - size * 0.05 + eyeOffsetY
    const baseEyeSize = size * 0.05 * eyeSize

    const renderEyeShape = (x, y, isLeft) => {
      switch (eyeStyle) {
        case 'normal':
          return (
            <g>
              <ellipse cx={x} cy={y} rx={baseEyeSize} ry={baseEyeSize * 0.8} fill="white" stroke="#333" strokeWidth="1" />
              <circle cx={x} cy={y} r={baseEyeSize * 0.5} fill={eyeColor} />
              <circle cx={x - baseEyeSize * 0.2} cy={y - baseEyeSize * 0.2} r={baseEyeSize * 0.2} fill="white" />
            </g>
          )
        case 'big':
          return (
            <g>
              <ellipse cx={x} cy={y} rx={baseEyeSize * 1.3} ry={baseEyeSize * 1.2} fill="white" stroke="#333" strokeWidth="1" />
              <circle cx={x} cy={y} r={baseEyeSize * 0.7} fill={eyeColor} />
              <circle cx={x - baseEyeSize * 0.3} cy={y - baseEyeSize * 0.3} r={baseEyeSize * 0.25} fill="white" />
            </g>
          )
        case 'small':
          return (
            <g>
              <ellipse cx={x} cy={y} rx={baseEyeSize * 0.7} ry={baseEyeSize * 0.4} fill="white" stroke="#333" strokeWidth="1" />
              <circle cx={x} cy={y} r={baseEyeSize * 0.3} fill={eyeColor} />
            </g>
          )
        case 'wink':
          if (isLeft) {
            return (
              <g>
                <path d={`M ${x - baseEyeSize} ${y} Q ${x} ${y - baseEyeSize * 0.5} ${x + baseEyeSize} ${y}`} stroke="#333" strokeWidth="2" fill="none" />
              </g>
            )
          }
          return (
            <g>
              <ellipse cx={x} cy={y} rx={baseEyeSize} ry={baseEyeSize * 0.8} fill="white" stroke="#333" strokeWidth="1" />
              <circle cx={x} cy={y} r={baseEyeSize * 0.5} fill={eyeColor} />
            </g>
          )
        case 'happy':
          return (
            <g>
              <path d={`M ${x - baseEyeSize} ${y} Q ${x} ${y + baseEyeSize * 0.5} ${x + baseEyeSize} ${y}`} stroke="#333" strokeWidth="2" fill="none" />
            </g>
          )
        case 'sleepy':
          return (
            <g>
              <path d={`M ${x - baseEyeSize} ${y} Q ${x} ${y - baseEyeSize * 0.2} ${x + baseEyeSize} ${y}`} stroke="#333" strokeWidth="2" fill="none" />
            </g>
          )
        default:
          return null
      }
    }

    return (
      <g>
        {renderEyeShape(leftEyeX, eyeY, true)}
        {renderEyeShape(rightEyeX, eyeY, false)}
      </g>
    )
  }

  const renderNose = () => {
    const noseX = centerX + noseOffsetX
    const noseY = centerY + size * 0.08 + noseOffsetY

    switch (noseStyle) {
      case 'small':
        return (
          <g>
            <circle cx={noseX} cy={noseY} r={size * 0.02} fill={skinColor} stroke="#333" strokeWidth="1" opacity="0.5" />
          </g>
        )
      case 'medium':
        return (
          <g>
            <path
              d={`M ${noseX - size * 0.02} ${noseY - size * 0.02}
                  Q ${noseX} ${noseY + size * 0.03} ${noseX + size * 0.02} ${noseY - size * 0.02}`}
              stroke="#333"
              strokeWidth="1"
              fill="none"
            />
            <circle cx={noseX - size * 0.01} cy={noseY + size * 0.02} r={size * 0.008} fill="#333" opacity="0.3" />
            <circle cx={noseX + size * 0.01} cy={noseY + size * 0.02} r={size * 0.008} fill="#333" opacity="0.3" />
          </g>
        )
      case 'big':
        return (
          <g>
            <ellipse cx={noseX} cy={noseY + size * 0.01} rx={size * 0.035} ry={size * 0.025} fill={skinColor} stroke="#333" strokeWidth="1" />
            <circle cx={noseX - size * 0.015} cy={noseY + size * 0.02} r={size * 0.01} fill="#333" opacity="0.2" />
            <circle cx={noseX + size * 0.015} cy={noseY + size * 0.02} r={size * 0.01} fill="#333" opacity="0.2" />
          </g>
        )
      default:
        return null
    }
  }

  const renderMouth = () => {
    const mouthX = centerX + mouthOffsetX
    const mouthY = centerY + size * 0.18 + mouthOffsetY

    switch (mouthStyle) {
      case 'smile':
        return (
          <path
            d={`M ${mouthX - size * 0.06} ${mouthY}
                Q ${mouthX} ${mouthY + size * 0.05} ${mouthX + size * 0.06} ${mouthY}`}
            stroke={lipColor}
            strokeWidth="3"
            fill="none"
            strokeLinecap="round"
          />
        )
      case 'bigSmile':
        return (
          <g>
            <path
              d={`M ${mouthX - size * 0.08} ${mouthY}
                  Q ${mouthX} ${mouthY + size * 0.08} ${mouthX + size * 0.08} ${mouthY}`}
              fill={lipColor}
              stroke="#333"
              strokeWidth="1"
            />
            <path
              d={`M ${mouthX - size * 0.06} ${mouthY}
                  Q ${mouthX} ${mouthY + size * 0.03} ${mouthX + size * 0.06} ${mouthY}`}
              fill="white"
            />
          </g>
        )
      case 'serious':
        return (
          <line
            x1={mouthX - size * 0.05}
            y1={mouthY}
            x2={mouthX + size * 0.05}
            y2={mouthY}
            stroke={lipColor}
            strokeWidth="3"
            strokeLinecap="round"
          />
        )
      case 'surprised':
        return (
          <ellipse
            cx={mouthX}
            cy={mouthY}
            rx={size * 0.035}
            ry={size * 0.05}
            fill={lipColor}
            stroke="#333"
            strokeWidth="1"
          />
        )
      case 'sad':
        return (
          <path
            d={`M ${mouthX - size * 0.06} ${mouthY + size * 0.03}
                Q ${mouthX} ${mouthY - size * 0.02} ${mouthX + size * 0.06} ${mouthY + size * 0.03}`}
            stroke={lipColor}
            strokeWidth="3"
            fill="none"
            strokeLinecap="round"
          />
        )
      default:
        return null
    }
  }

  const renderGlasses = () => {
    const leftX = centerX - size * 0.15
    const rightX = centerX + size * 0.15
    const eyeY = centerY - size * 0.05

    switch (glasses) {
      case 'glasses':
        return (
          <g>
            <circle cx={leftX} cy={eyeY} r={size * 0.07} fill="none" stroke="#333" strokeWidth="2" />
            <circle cx={rightX} cy={eyeY} r={size * 0.07} fill="none" stroke="#333" strokeWidth="2" />
            <line x1={leftX + size * 0.07} y1={eyeY} x2={rightX - size * 0.07} y2={eyeY} stroke="#333" strokeWidth="2" />
            <line x1={leftX - size * 0.07} y1={eyeY} x2={leftX - size * 0.12} y2={eyeY - size * 0.02} stroke="#333" strokeWidth="2" />
            <line x1={rightX + size * 0.07} y1={eyeY} x2={rightX + size * 0.12} y2={eyeY - size * 0.02} stroke="#333" strokeWidth="2" />
          </g>
        )
      case 'sunglasses':
        return (
          <g>
            <rect x={leftX - size * 0.06} y={eyeY - size * 0.05} width={size * 0.12} height={size * 0.1} rx={size * 0.02} fill="#333" opacity="0.8" />
            <rect x={rightX - size * 0.06} y={eyeY - size * 0.05} width={size * 0.12} height={size * 0.1} rx={size * 0.02} fill="#333" opacity="0.8" />
            <line x1={leftX + size * 0.06} y1={eyeY} x2={rightX - size * 0.06} y2={eyeY} stroke="#333" strokeWidth="2" />
            <line x1={leftX - size * 0.06} y1={eyeY} x2={leftX - size * 0.12} y2={eyeY - size * 0.02} stroke="#333" strokeWidth="2" />
            <line x1={rightX + size * 0.06} y1={eyeY} x2={rightX + size * 0.12} y2={eyeY - size * 0.02} stroke="#333" strokeWidth="2" />
          </g>
        )
      case 'roundGlasses':
        return (
          <g>
            <circle cx={leftX} cy={eyeY} r={size * 0.08} fill="none" stroke="#8B4513" strokeWidth="3" />
            <circle cx={rightX} cy={eyeY} r={size * 0.08} fill="none" stroke="#8B4513" strokeWidth="3" />
            <line x1={leftX + size * 0.08} y1={eyeY} x2={rightX - size * 0.08} y2={eyeY} stroke="#8B4513" strokeWidth="3" />
            <line x1={leftX - size * 0.08} y1={eyeY} x2={leftX - size * 0.13} y2={eyeY - size * 0.02} stroke="#8B4513" strokeWidth="3" />
            <line x1={rightX + size * 0.08} y1={eyeY} x2={rightX + size * 0.13} y2={eyeY - size * 0.02} stroke="#8B4513" strokeWidth="3" />
          </g>
        )
      default:
        return null
    }
  }

  const renderHat = () => {
    switch (hat) {
      case 'cap':
        return (
          <g>
            <ellipse cx={centerX} cy={centerY - size * 0.35} rx={size * 0.25} ry={size * 0.1} fill="#FF6B6B" />
            <rect x={centerX - size * 0.25} y={centerY - size * 0.45} width={size * 0.5} height={size * 0.15} rx={size * 0.02} fill="#FF6B6B" />
            <rect x={centerX} y={centerY - size * 0.3} width={size * 0.35} height={size * 0.04} rx={size * 0.01} fill="#CC5555" />
          </g>
        )
      case 'beanie':
        return (
          <g>
            <path
              d={`M ${centerX - size * 0.3} ${centerY - size * 0.25}
                  Q ${centerX - size * 0.35} ${centerY - size * 0.5} ${centerX} ${centerY - size * 0.5}
                  Q ${centerX + size * 0.35} ${centerY - size * 0.5} ${centerX + size * 0.3} ${centerY - size * 0.25}
                  Q ${centerX} ${centerY - size * 0.2} ${centerX - size * 0.3} ${centerY - size * 0.25} Z`}
              fill="#4A90D9"
            />
            <circle cx={centerX} cy={centerY - size * 0.52} r={size * 0.04} fill="#FF6B6B" />
            <rect x={centerX - size * 0.3} y={centerY - size * 0.3} width={size * 0.6} height={size * 0.08} fill="#357ABD" />
          </g>
        )
      case 'crown':
        return (
          <g>
            <path
              d={`M ${centerX - size * 0.25} ${centerY - size * 0.3}
                  L ${centerX - size * 0.25} ${centerY - size * 0.45}
                  L ${centerX - size * 0.15} ${centerY - size * 0.35}
                  L ${centerX} ${centerY - size * 0.5}
                  L ${centerX + size * 0.15} ${centerY - size * 0.35}
                  L ${centerX + size * 0.25} ${centerY - size * 0.45}
                  L ${centerX + size * 0.25} ${centerY - size * 0.3} Z`}
              fill="#FFD700"
              stroke="#FFA500"
              strokeWidth="2"
            />
            <circle cx={centerX} cy={centerY - size * 0.42} r={size * 0.025} fill="#FF0000" />
            <circle cx={centerX - size * 0.18} cy={centerY - size * 0.38} r={size * 0.015} fill="#0000FF" />
            <circle cx={centerX + size * 0.18} cy={centerY - size * 0.38} r={size * 0.015} fill="#0000FF" />
          </g>
        )
      case 'bow':
        return (
          <g>
            <ellipse cx={centerX - size * 0.2} cy={centerY - size * 0.38} rx={size * 0.1} ry={size * 0.05} fill="#FF69B4" />
            <ellipse cx={centerX + size * 0.2} cy={centerY - size * 0.38} rx={size * 0.1} ry={size * 0.05} fill="#FF69B4" />
            <circle cx={centerX} cy={centerY - size * 0.38} r={size * 0.03} fill="#FF1493" />
          </g>
        )
      default:
        return null
    }
  }

  const renderEarrings = () => {
    const leftEarX = centerX - size * 0.32
    const rightEarX = centerX + size * 0.32
    const earY = centerY + size * 0.05

    switch (earring) {
      case 'earring':
        return (
          <g>
            <circle cx={leftEarX} cy={earY} r={size * 0.02} fill="#C0C0C0" stroke="#808080" strokeWidth="1" />
            <circle cx={rightEarX} cy={earY} r={size * 0.02} fill="#C0C0C0" stroke="#808080" strokeWidth="1" />
          </g>
        )
      case 'hoop':
        return (
          <g>
            <circle cx={leftEarX} cy={earY} r={size * 0.035} fill="none" stroke="#C0C0C0" strokeWidth="3" />
            <circle cx={rightEarX} cy={earY} r={size * 0.035} fill="none" stroke="#C0C0C0" strokeWidth="3" />
          </g>
        )
      default:
        return null
    }
  }

  const renderBeard = () => {
    const beardColor = hairColor

    switch (beard) {
      case 'stubble':
        return (
          <g opacity="0.6">
            {[...Array(30)].map((_, i) => {
              const angle = (i / 30) * Math.PI * 2
              const radius = size * 0.2 + Math.random() * size * 0.05
              const x = centerX + Math.cos(angle) * radius
              const y = centerY + size * 0.15 + Math.sin(angle) * radius * 0.5
              return <circle key={i} cx={x} cy={y} r={size * 0.008} fill={beardColor} />
            })}
          </g>
        )
      case 'goatee':
        return (
          <g>
            <ellipse
              cx={centerX}
              cy={centerY + size * 0.28}
              rx={size * 0.06}
              ry={size * 0.08}
              fill={beardColor}
            />
            <path
              d={`M ${centerX - size * 0.03} ${centerY + size * 0.12}
                  Q ${centerX - size * 0.01} ${centerY + size * 0.18} ${centerX} ${centerY + size * 0.2}
                  Q ${centerX + size * 0.01} ${centerY + size * 0.18} ${centerX + size * 0.03} ${centerY + size * 0.12}`}
              fill={beardColor}
            />
          </g>
        )
      case 'mustache':
        return (
          <g>
            <path
              d={`M ${centerX - size * 0.1} ${centerY + size * 0.12}
                  Q ${centerX - size * 0.15} ${centerY + size * 0.1} ${centerX - size * 0.12} ${centerY + size * 0.08}
                  Q ${centerX - size * 0.05} ${centerY + size * 0.1} ${centerX} ${centerY + size * 0.14}
                  Q ${centerX + size * 0.05} ${centerY + size * 0.1} ${centerX + size * 0.12} ${centerY + size * 0.08}
                  Q ${centerX + size * 0.15} ${centerY + size * 0.1} ${centerX + size * 0.1} ${centerY + size * 0.12}
                  Q ${centerX} ${centerY + size * 0.18} ${centerX - size * 0.1} ${centerY + size * 0.12} Z`}
              fill={beardColor}
            />
          </g>
        )
      case 'fullBeard':
        return (
          <g>
            <path
              d={`M ${centerX - size * 0.25} ${centerY}
                  Q ${centerX - size * 0.3} ${centerY + size * 0.3} ${centerX} ${centerY + size * 0.4}
                  Q ${centerX + size * 0.3} ${centerY + size * 0.3} ${centerX + size * 0.25} ${centerY}
                  Q ${centerX + size * 0.15} ${centerY + size * 0.1} ${centerX} ${centerY + size * 0.05}
                  Q ${centerX - size * 0.15} ${centerY + size * 0.1} ${centerX - size * 0.25} ${centerY} Z`}
              fill={beardColor}
            />
            <path
              d={`M ${centerX - size * 0.08} ${centerY + size * 0.1}
                  Q ${centerX} ${centerY + size * 0.05} ${centerX + size * 0.08} ${centerY + size * 0.1}
                  Q ${centerX + size * 0.05} ${centerY + size * 0.15} ${centerX} ${centerY + size * 0.18}
                  Q ${centerX - size * 0.05} ${centerY + size * 0.15} ${centerX - size * 0.08} ${centerY + size * 0.1} Z`}
              fill={skinColor}
            />
          </g>
        )
      case 'handlebar':
        return (
          <g>
            <path
              d={`M ${centerX - size * 0.18} ${centerY + size * 0.12}
                  Q ${centerX - size * 0.25} ${centerY + size * 0.05} ${centerX - size * 0.2} ${centerY}
                  Q ${centerX - size * 0.15} ${centerY + size * 0.05} ${centerX - size * 0.08} ${centerY + size * 0.1}
                  Q ${centerX} ${centerY + size * 0.14} ${centerX + size * 0.08} ${centerY + size * 0.1}
                  Q ${centerX + size * 0.15} ${centerY + size * 0.05} ${centerX + size * 0.2} ${centerY}
                  Q ${centerX + size * 0.25} ${centerY + size * 0.05} ${centerX + size * 0.18} ${centerY + size * 0.12}
                  Q ${centerX} ${centerY + size * 0.18} ${centerX - size * 0.18} ${centerY + size * 0.12} Z`}
              fill={beardColor}
            />
          </g>
        )
      default:
        return null
    }
  }

  const renderBlush = () => {
    if (!blushColor || blushColor === 'transparent') return null

    return (
      <g opacity="0.5">
        <ellipse
          cx={centerX - size * 0.22}
          cy={centerY + size * 0.05}
          rx={size * 0.08}
          ry={size * 0.05}
          fill={blushColor}
        />
        <ellipse
          cx={centerX + size * 0.22}
          cy={centerY + size * 0.05}
          rx={size * 0.08}
          ry={size * 0.05}
          fill={blushColor}
        />
      </g>
    )
  }

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      style={{ backgroundColor }}
    >
      {renderHair()}
      {renderFace()}
      {renderEars()}
      {renderEyes()}
      {renderNose()}
      {renderMouth()}
      {renderBlush()}
      {renderBeard()}
      {renderGlasses()}
      {renderHat()}
      {renderEarrings()}
    </svg>
  )

  function renderEars() {
    return (
      <g>
        <ellipse cx={centerX - size * 0.32} cy={centerY} rx={size * 0.05} ry={size * 0.08} fill={skinColor} stroke="#333" strokeWidth="1" opacity="0.8" />
        <ellipse cx={centerX + size * 0.32} cy={centerY} rx={size * 0.05} ry={size * 0.08} fill={skinColor} stroke="#333" strokeWidth="1" opacity="0.8" />
      </g>
    )
  }
}

export default AvatarCanvas
