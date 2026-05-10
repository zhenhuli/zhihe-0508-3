export default function PersonalInfoForm({ personalInfo, onChange }) {
  const handleChange = (field, value) => {
    onChange({ ...personalInfo, [field]: value });
  };
  
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">个人信息</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">姓名 *</label>
          <input
            type="text"
            value={personalInfo.name || ''}
            onChange={(e) => handleChange('name', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="请输入姓名"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">电话</label>
          <input
            type="tel"
            value={personalInfo.phone || ''}
            onChange={(e) => handleChange('phone', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="请输入电话"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">邮箱</label>
          <input
            type="email"
            value={personalInfo.email || ''}
            onChange={(e) => handleChange('email', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="请输入邮箱"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">所在地</label>
          <input
            type="text"
            value={personalInfo.address || ''}
            onChange={(e) => handleChange('address', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="请输入城市"
          />
        </div>
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">个人简介</label>
        <textarea
          value={personalInfo.summary || ''}
          onChange={(e) => handleChange('summary', e.target.value)}
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="简要介绍自己的专业背景、职业目标等"
        />
      </div>
    </div>
  );
}
