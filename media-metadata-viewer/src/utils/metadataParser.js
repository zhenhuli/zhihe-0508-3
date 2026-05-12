import jsmediatags from 'jsmediatags';
import { parseBlob as mmParseBlob } from 'music-metadata';

export const formatDuration = (seconds) => {
  if (!seconds || isNaN(seconds)) return 'N/A';
  const hrs = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);
  if (hrs > 0) {
    return `${hrs}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};

export const formatFileSize = (bytes) => {
  if (!bytes) return 'N/A';
  const units = ['B', 'KB', 'MB', 'GB'];
  let size = bytes;
  let unitIndex = 0;
  while (size >= 1024 && unitIndex < units.length - 1) {
    size /= 1024;
    unitIndex++;
  }
  return `${size.toFixed(2)} ${units[unitIndex]}`;
};

export const parseAudioMetadata = (file) => {
  return new Promise((resolve, reject) => {
    jsmediatags.read(file, {
      onSuccess: (tag) => {
        resolve(tag);
      },
      onError: (error) => {
        reject(error);
      }
    });
  });
};

export const parseVideoMetadata = (file) => {
  return new Promise((resolve, reject) => {
    const video = document.createElement('video');
    video.preload = 'metadata';
    video.onloadedmetadata = () => {
      URL.revokeObjectURL(video.src);
      resolve({
        duration: video.duration,
        videoWidth: video.videoWidth,
        videoHeight: video.videoHeight
      });
    };
    video.onerror = () => {
      URL.revokeObjectURL(video.src);
      reject(new Error('无法解析视频元数据'));
    };
    video.src = URL.createObjectURL(file);
  });
};

export const getMediaType = (file) => {
  if (file.type.startsWith('audio/')) return 'audio';
  if (file.type.startsWith('video/')) return 'video';
  return 'unknown';
};

const getFileExtension = (filename) => {
  const ext = filename.split('.').pop().toLowerCase();
  return ext;
};

const getFormatFromMimeType = (mimeType) => {
  const map = {
    'audio/mpeg': 'MP3',
    'audio/wav': 'WAV',
    'audio/wave': 'WAV',
    'audio/x-wav': 'WAV',
    'audio/flac': 'FLAC',
    'audio/aac': 'AAC',
    'audio/ogg': 'OGG',
    'audio/mp4': 'M4A',
    'audio/x-m4a': 'M4A',
    'video/mp4': 'MP4',
    'video/webm': 'WebM',
    'video/ogg': 'OGV',
    'video/quicktime': 'MOV',
    'video/x-msvideo': 'AVI',
    'video/x-matroska': 'MKV'
  };
  return map[mimeType] || mimeType.split('/')[1]?.toUpperCase() || 'Unknown';
};

const estimateBitrate = (fileSize, duration) => {
  if (!duration || duration <= 0) return null;
  return Math.round((fileSize * 8) / duration);
};

const parseWithWebAudio = async (file) => {
  try {
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const arrayBuffer = await file.arrayBuffer();
    const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
    
    const result = {
      duration: audioBuffer.duration,
      numberOfChannels: audioBuffer.numberOfChannels,
      sampleRate: audioBuffer.sampleRate,
      length: audioBuffer.length
    };
    
    audioContext.close();
    return result;
  } catch (e) {
    console.warn('Web Audio API 解析失败:', e.message);
    return null;
  }
};

const getCodecFromFile = (file) => {
  const ext = getFileExtension(file.name).toLowerCase();
  const codecMap = {
    'mp3': 'MPEG-1 Audio Layer 3',
    'wav': 'Linear PCM',
    'flac': 'FLAC (Free Lossless Audio Codec)',
    'aac': 'Advanced Audio Coding',
    'ogg': 'Vorbis',
    'oga': 'Vorbis',
    'm4a': 'AAC / ALAC',
    'mp4': 'H.264 / AAC',
    'webm': 'VP9 / Opus',
    'mov': 'H.264',
    'avi': 'Various'
  };
  return codecMap[ext] || null;
};

export const parseMediaMetadata = async (file) => {
  const mediaType = getMediaType(file);
  const result = {
    fileName: file.name,
    fileSize: file.size,
    fileType: file.type,
    mediaType: mediaType,
    general: {
      format: getFormatFromMimeType(file.type) || getFileExtension(file.name).toUpperCase()
    },
    audio: {},
    video: {},
    tags: {}
  };

  const codecFromFile = getCodecFromFile(file);
  if (codecFromFile && !result.general.codec) {
    result.general.codec = codecFromFile;
  }

  try {
    console.log('开始使用 music-metadata 解析...');
    const mmMetadata = await mmParseBlob(file, {
      skipCovers: false,
      duration: true
    });
    
    console.log('music-metadata 解析结果:', mmMetadata);
    
    if (mmMetadata.format) {
      result.general = {
        ...result.general,
        format: mmMetadata.format.container || result.general.format,
        duration: mmMetadata.format.duration,
        bitrate: mmMetadata.format.bitrate,
        sampleRate: mmMetadata.format.sampleRate,
        numberOfChannels: mmMetadata.format.numberOfChannels,
        codec: mmMetadata.format.codec || result.general.codec
      };
    }

    if (mmMetadata.common) {
      result.tags = {
        title: mmMetadata.common.title,
        artist: mmMetadata.common.artist,
        album: mmMetadata.common.album,
        year: mmMetadata.common.year,
        track: mmMetadata.common.track?.no ? String(mmMetadata.common.track.no) : undefined,
        genre: mmMetadata.common.genre?.join(', '),
        comment: mmMetadata.common.comment?.join('\n'),
        picture: mmMetadata.common.picture?.[0]
      };
    }
  } catch (e) {
    console.warn('music-metadata 解析失败:', e.message);
  }

  if (mediaType === 'audio') {
    try {
      const webAudioResult = await parseWithWebAudio(file);
      if (webAudioResult) {
        console.log('Web Audio API 解析结果:', webAudioResult);
        if (!result.general.duration) result.general.duration = webAudioResult.duration;
        if (!result.general.sampleRate) result.general.sampleRate = webAudioResult.sampleRate;
        if (!result.general.numberOfChannels) result.general.numberOfChannels = webAudioResult.numberOfChannels;
      }
    } catch (e) {
      console.warn('Web Audio API 解析失败:', e.message);
    }

    try {
      const audioTags = await parseAudioMetadata(file);
      console.log('jsmediatags 解析结果:', audioTags);
      
      if (audioTags.tags) {
        result.tags = {
          ...result.tags,
          title: result.tags.title || audioTags.tags.title,
          artist: result.tags.artist || audioTags.tags.artist,
          album: result.tags.album || audioTags.tags.album,
          year: result.tags.year || audioTags.tags.year,
          track: result.tags.track || audioTags.tags.track,
          genre: result.tags.genre || audioTags.tags.genre,
          picture: result.tags.picture || audioTags.tags.picture
        };
      }
    } catch (e) {
      console.warn('jsmediatags 解析失败:', e.message);
    }

    await new Promise((resolve) => {
      const audio = new Audio();
      audio.onloadedmetadata = () => {
        console.log('Audio 元素解析结果:', { duration: audio.duration });
        if (!result.general.duration) {
          result.general.duration = audio.duration;
        }
        URL.revokeObjectURL(audio.src);
        resolve();
      };
      audio.onerror = () => {
        console.warn('Audio 元素加载失败');
        URL.revokeObjectURL(audio.src);
        resolve();
      };
      audio.src = URL.createObjectURL(file);
    });
  }

  if (file.size && result.general.duration) {
    const estimatedBitrate = estimateBitrate(file.size, result.general.duration);
    if (!result.general.bitrate && estimatedBitrate) {
      result.general.bitrate = estimatedBitrate;
    }
  }

  if (mediaType === 'video') {
    try {
      const videoMeta = await parseVideoMetadata(file);
      console.log('Video 元素解析结果:', videoMeta);
      result.general.duration = result.general.duration || videoMeta.duration;
      result.video = {
        width: videoMeta.videoWidth,
        height: videoMeta.videoHeight,
        resolution: videoMeta.videoWidth && videoMeta.videoHeight 
          ? `${videoMeta.videoWidth}x${videoMeta.videoHeight}` 
          : 'N/A'
      };
    } catch (e) {
      console.warn('视频元数据解析失败:', e.message);
    }
  }

  console.log('最终解析结果:', result);
  return result;
};
