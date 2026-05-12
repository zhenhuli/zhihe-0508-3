import { useState, useCallback } from 'react';
const FileUpload = ({ onFileSelect, isLoading }) => {
 const [isDragging, setIsDragging] = useState(false);
 const handleDragOver = useCallback((e) => {
 e.preventDefault();
 setIsDragging(true);
 }, []);
 const handleDragLeave = useCallback((e) => {
 e.preventDefault();
 setIsDragging(false);
 }, []);
 const handleDrop = useCallback((e) => {
 e.preventDefault();
 setIsDragging(false);
 const files = Array.from(e.dataTransfer.files).filter(file => file.type.startsWith('audio/') || file.type.startsWith('video/'));
 if (files.length > 0) {
 onFileSelect(files[0]);
 }
 }, [onFileSelect]);
 const handleFileChange = useCallback((e) => {
 const file = e.target.files[0];
 if (file) {
 onFileSelect(file);
 }
 }, [onFileSelect]);
 const handleClick = () => {
 document.getElementById('fileInput').click();
 };
 return (<div className={`upload-area ${isDragging ? 'dragging' : ''}`} onDragOver={handleDragOver} onDragLeave={handleDragLeave} onDrop={handleDrop} onClick={handleClick}>
 <input type="file" id="fileInput" accept="audio/*,video/*" onChange={handleFileChange} style={{ display: 'none' }}/>
 {isLoading ? (<div className="loading-spinner">
 <div className="spinner"></div>
 <p>正在解析元数据...</p>
 </div>) : (<>
 <div className="upload-icon">
 <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
 <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
 <polyline points="17 8 12 3 7 8"/>
 <line x1="12" y1="3" x2="12" y2="15"/>
 </svg>
 </div>
 <h3>拖拽音视频文件到这里</h3>
 <p>或点击选择文件</p>
 <p className="file-types">支持格式：MP3, WAV, FLAC, MP4, AVI, MOV 等</p>
 </>)}
 </div>);
};
export default FileUpload;

