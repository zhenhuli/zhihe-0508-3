import { useState, useEffect } from 'react';
import { resumeApi } from './utils/api';
import ResumePreview from './components/ResumePreview';
import PersonalInfoForm from './components/PersonalInfoForm';
import EducationForm from './components/EducationForm';
import WorkExperienceForm from './components/WorkExperienceForm';
import SkillsForm from './components/SkillsForm';
import TemplateList from './components/TemplateList';

const TEMPLATE_OPTIONS = [
  { value: 'classic', label: '经典简约', desc: '简洁专业，蓝色主题', color: '#1e40af' },
  { value: 'modern', label: '现代双栏', desc: '深色侧边栏，专业高效', color: '#1f2937' },
  { value: 'elegant', label: '优雅简约', desc: '金色装饰，优雅大方', color: '#d97706' },
  { value: 'creative', label: '创意醒目', desc: '大色块设计，适合创意岗位', color: '#6366f1' }
];

const emptyResume = {
  templateName: '',
  template: 'classic',
  personalInfo: { name: '', email: '', phone: '', address: '', summary: '' },
  education: [],
  workExperience: [],
  skills: []
};

export default function App() {
  const [currentResume, setCurrentResume] = useState(emptyResume);
  const [savedResumes, setSavedResumes] = useState([]);
  const [currentId, setCurrentId] = useState(null);
  const [activeTab, setActiveTab] = useState('personal');
  const [showTemplates, setShowTemplates] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    loadSavedResumes();
  }, []);

  const showMessage = (text, type = 'success') => {
    setMessage({ text, type });
    setTimeout(() => setMessage(null), 3000);
  };

  const loadSavedResumes = async () => {
    try {
      const response = await resumeApi.getAll();
      setSavedResumes(response.data);
    } catch (error) {
      console.error('加载简历列表失败:', error);
    }
  };

  const handlePersonalInfoChange = (personalInfo) => {
    setCurrentResume(prev => ({ ...prev, personalInfo }));
  };

  const handleEducationChange = (education) => {
    setCurrentResume(prev => ({ ...prev, education }));
  };

  const handleWorkExperienceChange = (workExperience) => {
    setCurrentResume(prev => ({ ...prev, workExperience }));
  };

  const handleSkillsChange = (skills) => {
    setCurrentResume(prev => ({ ...prev, skills }));
  };

  const handleNewResume = () => {
    setCurrentResume(emptyResume);
    setCurrentId(null);
    setActiveTab('personal');
    setShowTemplates(false);
  };

  const handleSelectResume = (resume) => {
    setCurrentResume({
      templateName: resume.templateName || '',
      template: resume.template || 'classic',
      personalInfo: resume.personalInfo || emptyResume.personalInfo,
      education: resume.education || [],
      workExperience: resume.workExperience || [],
      skills: resume.skills || []
    });
    setCurrentId(resume.id);
    setActiveTab('personal');
    setShowTemplates(false);
  };

  const handleDeleteResume = async (id) => {
    if (!confirm('确定要删除这份简历吗？')) return;
    
    try {
      await resumeApi.delete(id);
      if (currentId === id) {
        handleNewResume();
      }
      await loadSavedResumes();
      showMessage('删除成功');
    } catch (error) {
      console.error('删除失败:', error);
      showMessage('删除失败', 'error');
    }
  };

  const handleSave = async () => {
    if (!currentResume.personalInfo.name) {
      showMessage('请至少填写姓名', 'error');
      return;
    }
    
    setLoading(true);
    try {
      const dataToSave = {
        ...currentResume,
        templateName: currentResume.templateName || currentResume.personalInfo.name + '的简历'
      };
      
      if (currentId) {
        await resumeApi.update(currentId, dataToSave);
        showMessage('更新成功');
      } else {
        const response = await resumeApi.create(dataToSave);
        setCurrentId(response.data.id);
        showMessage('保存成功');
      }
      await loadSavedResumes();
    } catch (error) {
      console.error('保存失败:', error);
      showMessage('保存失败', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleExportPdf = async () => {
    if (!currentResume.personalInfo.name) {
      showMessage('请至少填写姓名', 'error');
      return;
    }
    
    setLoading(true);
    try {
      const response = await fetch('/api/pdf', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(currentResume),
      });
      
      if (!response.ok) {
        throw new Error('PDF生成失败');
      }
      
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${currentResume.personalInfo.name}_简历.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      
      setTimeout(() => {
        window.URL.revokeObjectURL(url);
      }, 1000);
      
      showMessage('PDF导出成功');
    } catch (error) {
      console.error('PDF导出失败:', error);
      showMessage('PDF导出失败', 'error');
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { key: 'personal', label: '个人信息' },
    { key: 'education', label: '教育经历' },
    { key: 'work', label: '工作经历' },
    { key: 'skills', label: '技能特长' }
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      {message && (
        <div className={`fixed top-4 right-4 z-50 px-4 py-2 rounded-md shadow-lg ${
          message.type === 'error' ? 'bg-red-500 text-white' : 'bg-green-500 text-white'
        }`}>
          {message.text}
        </div>
      )}

      <header className="bg-white shadow-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-xl font-bold text-gray-800">简历在线制作</h1>
          <div className="flex gap-2">
            <button
              onClick={() => setShowTemplates(!showTemplates)}
              className="px-4 py-2 text-sm border border-gray-300 rounded-md hover:bg-gray-50"
            >
              {showTemplates ? '返回编辑' : '查看模板'}
            </button>
            <button
              onClick={handleSave}
              disabled={loading}
              className="px-4 py-2 text-sm bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50"
            >
              {loading ? '保存中...' : '保存'}
            </button>
            <button
              onClick={handleExportPdf}
              disabled={loading}
              className="px-4 py-2 text-sm bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50"
            >
              {loading ? '导出中...' : '导出PDF'}
            </button>
          </div>
        </div>
      </header>

      {showTemplates ? (
        <main className="max-w-4xl mx-auto px-4 py-6">
          <TemplateList
            savedResumes={savedResumes}
            onSelect={handleSelectResume}
            onDelete={handleDeleteResume}
            onNew={handleNewResume}
          />
        </main>
      ) : (
        <main className="max-w-7xl mx-auto px-4 py-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="bg-white rounded-lg shadow-sm p-4">
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">模板名称</label>
                  <input
                    type="text"
                    value={currentResume.templateName || ''}
                    onChange={(e) => setCurrentResume(prev => ({ ...prev, templateName: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="用于标识这份简历，如：求职前端工程师"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">简历样式模板</label>
                  <div className="grid grid-cols-2 gap-3">
                    {TEMPLATE_OPTIONS.map((tpl) => (
                      <button
                        key={tpl.value}
                        onClick={() => setCurrentResume(prev => ({ ...prev, template: tpl.value }))}
                        className={`p-3 rounded-lg border-2 text-left transition-all ${
                          currentResume.template === tpl.value
                            ? 'border-blue-500 bg-blue-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <div className="flex items-center gap-2 mb-1">
                          <div
                            className="w-3 h-3 rounded-full"
                            style={{ backgroundColor: tpl.color }}
                          />
                          <span className="font-medium text-sm text-gray-800">{tpl.label}</span>
                        </div>
                        <p className="text-xs text-gray-500">{tpl.desc}</p>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm">
                <div className="flex border-b">
                  {tabs.map(tab => (
                    <button
                      key={tab.key}
                      onClick={() => setActiveTab(tab.key)}
                      className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
                        activeTab === tab.key
                          ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
                          : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>
                
                <div className="p-4 max-h-[500px] overflow-y-auto">
                  {activeTab === 'personal' && (
                    <PersonalInfoForm
                      personalInfo={currentResume.personalInfo}
                      onChange={handlePersonalInfoChange}
                    />
                  )}
                  {activeTab === 'education' && (
                    <EducationForm
                      education={currentResume.education}
                      onChange={handleEducationChange}
                    />
                  )}
                  {activeTab === 'work' && (
                    <WorkExperienceForm
                      workExperience={currentResume.workExperience}
                      onChange={handleWorkExperienceChange}
                    />
                  )}
                  {activeTab === 'skills' && (
                    <SkillsForm
                      skills={currentResume.skills}
                      onChange={handleSkillsChange}
                    />
                  )}
                </div>
              </div>
            </div>

            <div className="lg:sticky lg:top-24 lg:self-start">
              <div className="bg-white rounded-lg shadow-sm p-4">
                <h3 className="text-lg font-semibold text-gray-800 mb-4 text-center">实时预览</h3>
                <div className="overflow-auto max-h-[calc(100vh-220px)] flex justify-center">
                  <div className="w-full max-w-md">
                    <ResumePreview resume={currentResume} template={currentResume.template || 'classic'} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      )}
    </div>
  );
}
