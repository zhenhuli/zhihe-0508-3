export default function WorkExperienceForm({ workExperience, onChange }) {
  const handleItemChange = (index, field, value) => {
    const updated = [...workExperience];
    updated[index] = { ...updated[index], [field]: value };
    onChange(updated);
  };
  
  const addItem = () => {
    onChange([...workExperience, { company: '', position: '', startDate: '', endDate: '', description: '' }]);
  };
  
  const removeItem = (index) => {
    const updated = workExperience.filter((_, i) => i !== index);
    onChange(updated);
  };
  
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center border-b pb-2">
        <h3 className="text-lg font-semibold text-gray-800">工作经历</h3>
        <button
          type="button"
          onClick={addItem}
          className="px-3 py-1 text-sm bg-green-500 text-white rounded hover:bg-green-600"
        >
          + 添加
        </button>
      </div>
      
      {workExperience.length === 0 ? (
        <p className="text-gray-500 text-sm">暂无工作经历，点击上方按钮添加</p>
      ) : (
        <div className="space-y-4">
          {workExperience.map((work, index) => (
            <div key={index} className="p-4 bg-gray-50 rounded-lg border border-gray-200">
              <div className="flex justify-between items-center mb-3">
                <span className="text-sm font-medium text-gray-600">工作经历 #{index + 1}</span>
                <button
                  type="button"
                  onClick={() => removeItem(index)}
                  className="text-sm text-red-500 hover:text-red-700"
                >
                  删除
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">公司名称</label>
                  <input
                    type="text"
                    value={work.company || ''}
                    onChange={(e) => handleItemChange(index, 'company', e.target.value)}
                    className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                    placeholder="如：阿里巴巴"
                  />
                </div>
                
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">职位</label>
                  <input
                    type="text"
                    value={work.position || ''}
                    onChange={(e) => handleItemChange(index, 'position', e.target.value)}
                    className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                    placeholder="如：前端工程师"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-2 md:col-span-2">
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">开始时间</label>
                    <input
                      type="text"
                      value={work.startDate || ''}
                      onChange={(e) => handleItemChange(index, 'startDate', e.target.value)}
                      className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                      placeholder="2020.09"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">结束时间</label>
                    <input
                      type="text"
                      value={work.endDate || ''}
                      onChange={(e) => handleItemChange(index, 'endDate', e.target.value)}
                      className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                      placeholder="至今"
                    />
                  </div>
                </div>
              </div>
              
              <div className="mt-3">
                <label className="block text-xs font-medium text-gray-600 mb-1">工作描述</label>
                <textarea
                  value={work.description || ''}
                  onChange={(e) => handleItemChange(index, 'description', e.target.value)}
                  rows={3}
                  className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                  placeholder="工作职责和成就..."
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
