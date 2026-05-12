import { formatDuration, formatFileSize } from '../utils/metadataParser';

const MetadataRow = ({ label, value, icon }) => (
  <div className="metadata-row">
    <div className="metadata-label">
      {icon && <span className="metadata-icon">{icon}</span>}
      {label}
    </div>
    <div className="metadata-value">{value || 'N/A'}</div>
  </div>
);

const MetadataSection = ({ title, children, icon }) => (
  <div className="metadata-section">
    <h3 className="section-title">
      {icon && <span className="section-icon">{icon}</span>}
      {title}
    </h3>
    <div className="section-content">
      {children}
    </div>
  </div>
);

const MetadataDisplay = ({ metadata, onReset }) => {
  if (!metadata) return null;

  const getCoverImage = () => {
    const picture = metadata.tags?.picture;
    if (!picture) return null;
    
    if (picture.data) {
      const base64 = btoa(
        picture.data.reduce((data, byte) => data + String.fromCharCode(byte), '')
      );
      return `data:${picture.format};base64,${base64}`;
    }
    return null;
  };

  const coverImage = getCoverImage();

  return (
    <div className="metadata-display">
      <div className="metadata-header">
        <div className="file-info">
          {coverImage && (
            <div className="cover-image">
              <img src={coverImage} alt="封面" />
            </div>
          )}
          <div className="file-basic">
            <h2>{metadata.tags?.title || metadata.fileName}</h2>
            <p className="file-name">{metadata.fileName}</p>
            <div className="file-stats">
              <span className="file-type-badge">{metadata.mediaType}</span>
              <span>{formatFileSize(metadata.fileSize)}</span>
            </div>
          </div>
        </div>
        <button className="reset-btn" onClick={onReset}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/>
            <path d="M3 3v5h5"/>
          </svg>
          上传其他文件
        </button>
      </div>

      <div className="metadata-grid">
        <MetadataSection 
          title="基本信息" 
          icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>}
        >
          <MetadataRow label="文件格式" value={metadata.general?.format || metadata.fileType} />
          <MetadataRow label="时长" value={formatDuration(metadata.general?.duration)} />
          <MetadataRow label="比特率" value={metadata.general?.bitrate ? `${Math.round(metadata.general.bitrate / 1000)} kbps` : 'N/A'} />
          <MetadataRow label="编码格式" value={metadata.general?.codec} />
        </MetadataSection>

        {(metadata.mediaType === 'audio' || metadata.general?.sampleRate) && (
          <MetadataSection 
            title="音频信息" 
            icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/></svg>}
          >
            <MetadataRow label="采样率" value={metadata.general?.sampleRate ? `${metadata.general.sampleRate} Hz` : 'N/A'} />
            <MetadataRow label="声道数" value={metadata.general?.numberOfChannels ? `${metadata.general.numberOfChannels} 声道` : 'N/A'} />
          </MetadataSection>
        )}

        {metadata.mediaType === 'video' && (
          <MetadataSection 
            title="视频信息" 
            icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="2" width="20" height="20" rx="2.18" ry="2.18"/><line x1="7" y1="2" x2="7" y2="22"/><line x1="17" y1="2" x2="17" y2="22"/><line x1="2" y1="12" x2="22" y2="12"/><line x1="2" y1="7" x2="7" y2="7"/><line x1="2" y1="17" x2="7" y2="17"/><line x1="17" y1="17" x2="22" y2="17"/><line x1="17" y1="7" x2="22" y2="7"/></svg>}
          >
            <MetadataRow label="分辨率" value={metadata.video?.resolution} />
            <MetadataRow label="宽度" value={metadata.video?.width ? `${metadata.video.width} px` : 'N/A'} />
            <MetadataRow label="高度" value={metadata.video?.height ? `${metadata.video.height} px` : 'N/A'} />
          </MetadataSection>
        )}

        {(metadata.tags?.artist || metadata.tags?.album) && (
          <MetadataSection 
            title="专辑信息" 
            icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 8v4l3 3m6-3a9 9 0 1 1-18 0 9 9 0 0 1 18 0z"/></svg>}
          >
            <MetadataRow label="标题" value={metadata.tags?.title} />
            <MetadataRow label="艺术家" value={metadata.tags?.artist} />
            <MetadataRow label="专辑" value={metadata.tags?.album} />
            <MetadataRow label="年份" value={metadata.tags?.year} />
            <MetadataRow label="曲目" value={metadata.tags?.track} />
            <MetadataRow label="流派" value={metadata.tags?.genre} />
            {metadata.tags?.comment && <MetadataRow label="注释" value={metadata.tags?.comment} />}
          </MetadataSection>
        )}
      </div>
    </div>
  );
};

export default MetadataDisplay;
