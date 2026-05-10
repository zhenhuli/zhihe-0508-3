import { useState } from 'react';

export default function SkillsForm({ skills, onChange }) {
  const [inputValue, setInputValue] = useState('');
  
  const addSkill = () => {
    if (inputValue.trim() && !skills.includes(inputValue.trim())) {
      onChange([...skills, inputValue.trim()]);
      setInputValue('');
    }
  };
  
  const removeSkill = (skill) => {
    onChange(skills.filter(s => s !== skill));
  };
  
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addSkill();
    }
  };
  
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">技能特长</h3>
      
      <div className="flex gap-2">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="输入技能后按回车或点击添加"
        />
        <button
          type="button"
          onClick={addSkill}
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
        >
          添加
        </button>
      </div>
      
      {skills.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {skills.map((skill, index) => (
            <span
              key={index}
              className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
            >
              {skill}
              <button
                type="button"
                onClick={() => removeSkill(skill)}
                className="ml-1 text-blue-600 hover:text-blue-800"
              >
                ×
              </button>
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
