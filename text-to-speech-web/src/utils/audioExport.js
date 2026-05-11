export const MAX_GOOGLE_TTS_LENGTH = 200

export const getGoogleTTSUrl = (text, lang = 'zh-CN') => {
  if (text.length > MAX_GOOGLE_TTS_LENGTH) {
    throw new Error(`文本过长，Google TTS 最大支持 ${MAX_GOOGLE_TTS_LENGTH} 字符`)
  }
  
  const encodedText = encodeURIComponent(text)
  return `https://translate.google.com/translate_tts?ie=UTF-8&client=tw-ob&q=${encodedText}&tl=${lang}&total=1&idx=0`
}

export const getAlternativeTTSUrl = (text, lang = 'zh-CN') => {
  if (text.length > MAX_GOOGLE_TTS_LENGTH) {
    throw new Error(`文本过长，最大支持 ${MAX_GOOGLE_TTS_LENGTH} 字符`)
  }
  
  const encodedText = encodeURIComponent(text)
  return `https://translate.google.cn/translate_tts?ie=UTF-8&client=tw-ob&q=${encodedText}&tl=${lang}&total=1&idx=0`
}

export const downloadAudioFromUrl = async (url, filename) => {
  try {
    const link = document.createElement('a')
    link.href = url
    link.download = filename
    link.target = '_blank'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    return true
  } catch (error) {
    console.error('下载音频失败:', error)
    throw error
  }
}

export const splitTextForTTS = (text, maxLength = MAX_GOOGLE_TTS_LENGTH) => {
  const segments = []
  let currentSegment = ''
  
  const sentences = text.split(/([。！？.!?\n]+)/)
  
  for (let i = 0; i < sentences.length; i++) {
    const part = sentences[i]
    
    if (currentSegment.length + part.length <= maxLength) {
      currentSegment += part
    } else {
      if (currentSegment.trim()) {
        segments.push(currentSegment.trim())
      }
      
      if (part.length > maxLength) {
        const words = part.split(/([，、,;；]+)/)
        let tempSegment = ''
        for (let j = 0; j < words.length; j++) {
          const word = words[j]
          if (tempSegment.length + word.length <= maxLength) {
            tempSegment += word
          } else {
            if (tempSegment.trim()) {
              segments.push(tempSegment.trim())
            }
            if (word.length > maxLength) {
              for (let k = 0; k < word.length; k += maxLength) {
                segments.push(word.substring(k, k + maxLength))
              }
              tempSegment = ''
            } else {
              tempSegment = word
            }
          }
        }
        if (tempSegment.trim()) {
          segments.push(tempSegment.trim())
        }
        currentSegment = ''
      } else {
        currentSegment = part
      }
    }
  }
  
  if (currentSegment.trim()) {
    segments.push(currentSegment.trim())
  }
  
  return segments
}

export const detectLanguage = (text) => {
  const chineseChars = text.match(/[\u4e00-\u9fa5]/g)
  const englishChars = text.match(/[a-zA-Z]/g)
  
  const chineseCount = chineseChars ? chineseChars.length : 0
  const englishCount = englishChars ? englishChars.length : 0
  
  if (chineseCount > englishCount) {
    return 'zh-CN'
  }
  return 'en-US'
}

export const downloadMultipleAudioSegments = async (segments, lang = 'zh-CN', onProgress) => {
  const results = []
  
  for (let i = 0; i < segments.length; i++) {
    const segment = segments[i]
    if (onProgress) {
      onProgress(i + 1, segments.length, segment)
    }
    
    try {
      const url = getGoogleTTSUrl(segment, lang)
      const link = document.createElement('a')
      link.href = url
      link.download = `speech-part-${String(i + 1).padStart(2, '0')}.mp3`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      results.push({
        index: i,
        success: true,
        segment,
        url
      })
    } catch (error) {
      console.error(`下载第 ${i + 1} 段失败:`, error)
      results.push({
        index: i,
        success: false,
        segment,
        error
      })
    }
  }
  
  return results
}

export const fetchAudioBlob = async (url) => {
  try {
    const response = await fetch(url, {
      mode: 'cors'
    })
    
    if (!response.ok) {
      throw new Error('无法获取音频数据')
    }
    
    return await response.blob()
  } catch (error) {
    console.warn('CORS 请求失败，尝试直接使用 URL')
    return null
  }
}

export const convertTextToSpeechWithAudio = async (text, lang = 'zh-CN', onProgress) => {
  const segments = splitTextForTTS(text)
  const audioUrls = []
  
  for (let i = 0; i < segments.length; i++) {
    const segment = segments[i]
    if (onProgress) {
      onProgress(i + 1, segments.length, segment)
    }
    
    const url = getGoogleTTSUrl(segment, lang)
    audioUrls.push(url)
    
    await new Promise(resolve => setTimeout(resolve, 100))
  }
  
  return {
    segments,
    audioUrls,
    totalSegments: segments.length
  }
}
