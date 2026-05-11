import {
  skinColors,
  hairColors,
  eyeColors,
  lipColors,
  blushColors,
  faceShapes,
  hairStyles,
  eyeStyles,
  noseStyles,
  mouthStyles,
  accessories,
  backgroundColors
} from '../data/avatarData'

function getRandomItem(arr) {
  return arr[Math.floor(Math.random() * arr.length)]
}

export function generateRandomConfig() {
  const glassesAccessories = accessories.filter(a => a.category === 'glasses')
  const hatAccessories = accessories.filter(a => a.category === 'hat')
  const earringAccessories = accessories.filter(a => a.category === 'earring')
  const beardAccessories = accessories.filter(a => a.category === 'beard')

  return {
    skinColor: getRandomItem(skinColors),
    hairColor: getRandomItem(hairColors),
    eyeColor: getRandomItem(eyeColors),
    lipColor: getRandomItem(lipColors),
    blushColor: getRandomItem(blushColors),
    faceShape: getRandomItem(faceShapes).id,
    hairStyle: getRandomItem(hairStyles).id,
    eyeStyle: getRandomItem(eyeStyles).id,
    noseStyle: getRandomItem(noseStyles).id,
    mouthStyle: getRandomItem(mouthStyles).id,
    glasses: getRandomItem(glassesAccessories).id,
    hat: getRandomItem(hatAccessories).id,
    earring: getRandomItem(earringAccessories).id,
    beard: getRandomItem(beardAccessories).id,
    backgroundColor: getRandomItem(backgroundColors),
    eyeOffsetX: 0,
    eyeOffsetY: 0,
    eyeSize: 1,
    mouthOffsetX: 0,
    mouthOffsetY: 0,
    noseOffsetX: 0,
    noseOffsetY: 0
  }
}

export function getDefaultConfig() {
  return {
    skinColor: skinColors[0],
    hairColor: hairColors[0],
    eyeColor: eyeColors[0],
    lipColor: lipColors[0],
    blushColor: blushColors[0],
    faceShape: faceShapes[0].id,
    hairStyle: hairStyles[0].id,
    eyeStyle: eyeStyles[0].id,
    noseStyle: noseStyles[0].id,
    mouthStyle: mouthStyles[0].id,
    glasses: 'none',
    hat: 'none_hat',
    earring: 'none_ear',
    beard: 'none_beard',
    backgroundColor: backgroundColors[0],
    eyeOffsetX: 0,
    eyeOffsetY: 0,
    eyeSize: 1,
    mouthOffsetX: 0,
    mouthOffsetY: 0,
    noseOffsetX: 0,
    noseOffsetY: 0
  }
}
