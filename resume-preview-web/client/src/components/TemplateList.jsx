export default function TemplateList({ savedResumes, onSelect, onDelete, onNew }) {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-gray-800">保存的简历</h3>
        <button
          onClick={onNew}
          className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 text-sm"
        >
          + 新建简历
        </button>
      </div>
      
      {savedResumes.length === 0 ? (
        <p className="text-gray-500 text-sm py-8 text-center">暂无保存的简历</p>
      ) : (
        <div className="space-y-2">
          {savedResumes.map((resume) => (
            <div
              key={resume.id}
              className="flex justify-between items-center p-3 border border-gray-200 rounded-md hover:bg-gray-50"
            >
              <button
                onClick={() => onSelect(resume)}
                className="flex-1 text-left"
              >
                <div className="font-medium text-gray-800">
                  {resume.templateName || resume.personalInfo?.name || '未命名简历'}
                </div>
                <div className="text-xs text-gray-500">
                  更新于 {new Date(resume.updatedAt).toLocaleString('zh-CN')}
                </div>
              </button>
              <button
                onClick={() => onDelete(resume.id)}
                className="ml-4 text-sm text-red-500 hover:text-red-700"
              >
                删除
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
