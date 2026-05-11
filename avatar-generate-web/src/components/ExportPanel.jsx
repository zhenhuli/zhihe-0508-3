import React, { useState, useRef } from 'react'
import { toPng, toSvg } from 'html-to-image'

const exportSizes = [
  { id: 'small', name: '小 (256x256)', size: 256 },
  { id: 'medium', name: '中 (512x512)', size: 512 },
  { id: 'large', name: '大 (1024x1024)', size: 1024 },
  { id: 'xlarge', name: '超大 (2048x2048)', size: 2048 }
]

function ExportPanel({ avatarRef }) {
  const [selectedSize, setSelectedSize] = useState('medium')
  const [exporting, setExporting] = useState(false)
  const hiddenRef = useRef(null)

  const getSelectedSize = () => {
    return exportSizes.find(s => s.id === selectedSize)?.size || 512
  }

  const exportAsPng = async () => {
    if (!avatarRef.current) return
    setExporting(true)
    try {
      const dataUrl = await toPng(avatarRef.current, {
        quality: 1,
        pixelRatio: 2
      })
      downloadFile(dataUrl, `avatar-${Date.now()}.png`)
    } catch (error) {
      console.error('Export failed:', error)
      alert('导出失败，请重试')
    } finally {
      setExporting(false)
    }
  }

  const exportAsSvg = async () => {
    if (!avatarRef.current) return
    setExporting(true)
    try {
      const dataUrl = await toSvg(avatarRef.current)
      downloadFile(dataUrl, `avatar-${Date.now()}.svg`)
    } catch (error) {
      console.error('Export failed:', error)
      alert('导出失败，请重试')
    } finally {
      setExporting(false)
    }
  }

  const downloadFile = (dataUrl, filename) => {
    const link = document.createElement('a')
    link.download = filename
    link.href = dataUrl
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-3 text-gray-700">导出尺寸</h3>
        <div className="space-y-2">
          {exportSizes.map((size) => (
            <button
              key={size.id}
              onClick={() => setSelectedSize(size.id)}
              className={`w-full px-4 py-3 rounded-lg border-2 transition-all text-left ${
                selectedSize === size.id
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <span className={`font-medium ${selectedSize === size.id ? 'text-blue-700' : 'text-gray-700'}`}>
                {size.name}
              </span>
            </button>
          ))}
        </div>
      </div>

      <div className="pt-4 border-t">
        <h3 className="text-lg font-semibold mb-3 text-gray-700">导出格式</h3>
        <div className="space-y-3">
          <button
            onClick={exportAsPng}
            disabled={exporting}
            className="w-full px-4 py-3 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 text-white rounded-lg transition-colors font-medium flex items-center justify-center gap-2"
          >
            {exporting ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                导出中...
              </>
            ) : (
              '导出 PNG'
            )}
          </button>
          <button
            onClick={exportAsSvg}
            disabled={exporting}
            className="w-full px-4 py-3 bg-purple-500 hover:bg-purple-600 disabled:bg-gray-300 text-white rounded-lg transition-colors font-medium"
          >
            导出 SVG
          </button>
        </div>
      </div>

      <div className="pt-4 border-t">
        <p className="text-sm text-gray-500 text-center">
          当前选择尺寸: {getSelectedSize()}x{getSelectedSize()} 像素
        </p>
      </div>

      <div ref={hiddenRef} style={{ display: 'none' }}></div>
    </div>
  )
}

export default ExportPanel
