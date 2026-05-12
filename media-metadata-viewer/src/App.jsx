import { useState } from 'react'
import FileUpload from './components/FileUpload'
import MetadataDisplay from './components/MetadataDisplay'
import { parseMediaMetadata } from './utils/metadataParser'
import './App.css'

function App() {
  const [metadata, setMetadata] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)

  const handleFileSelect = async (file) => {
    setIsLoading(true)
    setError(null)
    try {
      const result = await parseMediaMetadata(file)
      setMetadata(result)
    } catch (err) {
      setError('解析文件失败，请确保文件格式正确')
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleReset = () => {
    setMetadata(null)
    setError(null)
  }

  return (
    <div className="app">
      <header className="app-header">
        <h1>音视频元数据查看器</h1>
        <p>上传音视频文件，自动解析并展示详细的元数据信息</p>
      </header>

      <main className="app-main">
        {error && <div className="error-message">{error}</div>}
        
        {!metadata ? (
          <FileUpload onFileSelect={handleFileSelect} isLoading={isLoading} />
        ) : (
          <MetadataDisplay metadata={metadata} onReset={handleReset} />
        )}
      </main>

      <footer className="app-footer">
        <p>支持常见音视频格式，所有处理都在浏览器本地完成，不会上传到服务器</p>
      </footer>
    </div>
  )
}

export default App
