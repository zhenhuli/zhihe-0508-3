import { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';

const categories = [
  { value: 'bug', label: 'Bug 报告' },
  { value: 'feature', label: '功能建议' },
  { value: 'improvement', label: '体验优化' },
  { value: 'other', label: '其他' },
];

function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

function isValidPhone(phone: string): boolean {
  const phoneRegex = /^1[3-9]\d{9}$/;
  return phoneRegex.test(phone);
}

export default function Home() {
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    category: 'bug',
    email: '',
    phone: '',
  });
  const [screenshots, setScreenshots] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    setError('');

    for (const file of Array.from(files)) {
      if (!file.type.startsWith('image/')) {
        setError('只能上传图片文件');
        continue;
      }
      if (file.size > 5 * 1024 * 1024) {
        setError('单张图片不能超过 5MB');
        continue;
      }

      try {
        const base64 = await fileToBase64(file);
        const response = await fetch('/api/upload', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ file: base64, fileName: file.name }),
        });
        const data = await response.json();
        if (response.ok && data.url) {
          setScreenshots(prev => [...prev, data.url]);
        } else {
          setError(data.error || '上传失败');
        }
      } catch (err) {
        setError('上传失败，请重试');
      }
    }

    setUploading(false);
    e.target.value = '';
  };

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = error => reject(error);
    });
  };

  const removeScreenshot = (index: number) => {
    setScreenshots(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    setSuccess(false);

    if (!formData.title.trim() || !formData.content.trim()) {
      setError('请填写标题和内容');
      setSubmitting(false);
      return;
    }

    const email = formData.email.trim();
    const phone = formData.phone.trim();

    if (!email && !phone) {
      setError('请填写邮箱或手机号，以便后续联系您');
      setSubmitting(false);
      return;
    }

    if (email && !isValidEmail(email)) {
      setError('邮箱格式不正确');
      setSubmitting(false);
      return;
    }

    if (phone && !isValidPhone(phone)) {
      setError('手机号格式不正确，请输入11位手机号');
      setSubmitting(false);
      return;
    }

    try {
      const response = await fetch('/api/feedbacks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: formData.title.trim(),
          content: formData.content.trim(),
          category: formData.category,
          email: email || undefined,
          phone: phone || undefined,
          screenshots,
        }),
      });

      const data = await response.json();
      if (response.ok) {
        setSuccess(true);
        setFormData({ title: '', content: '', category: 'bug', email: '', phone: '' });
        setScreenshots([]);
      } else {
        setError(data.error || '提交失败，请重试');
      }
    } catch (err) {
      setError('提交失败，请稍后重试');
    }

    setSubmitting(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Head>
        <title>意见反馈 - Feedback Factory</title>
        <meta name="description" content="提交您的意见反馈" />
      </Head>

      <header className="bg-white shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-xl font-bold text-gray-800">📝 Feedback Factory</h1>
          <Link
            href="/admin"
            className="text-sm text-blue-600 hover:text-blue-800"
          >
            管理后台
          </Link>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-md p-6 md:p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">提交反馈</h2>
          <p className="text-gray-600 mb-6">我们重视您的每一条建议和意见</p>

          {success && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg text-green-700">
              🎉 反馈提交成功！感谢您的反馈，我们会尽快处理。
            </div>
          )}

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                标题 <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="简要描述您的问题或建议"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                反馈类型
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
              >
                {categories.map((cat) => (
                  <option key={cat.value} value={cat.value}>
                    {cat.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                详细描述 <span className="text-red-500">*</span>
              </label>
              <textarea
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                placeholder="请详细描述您遇到的问题或建议..."
                rows={5}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition resize-none"
                required
              />
            </div>

            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
              <p className="text-sm text-amber-800 mb-3">
                <span className="font-medium">联系方式（邮箱或手机号至少填一项）</span>
                <span className="text-red-500">*</span>
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    邮箱
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="example@email.com"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    手机号
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="13800138000"
                    maxLength={11}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                  />
                </div>
              </div>
              <p className="text-xs text-amber-700 mt-2">
                💡 提供联系方式有助于我们在需要时与您取得联系，并在有奖励活动时通知您
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                上传截图（可选，支持多张，单张不超过 5MB）
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-500 transition cursor-pointer">
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleFileChange}
                  className="hidden"
                  id="screenshot-upload"
                  disabled={uploading}
                />
                <label
                  htmlFor="screenshot-upload"
                  className="cursor-pointer"
                >
                  {uploading ? (
                    <div className="text-gray-500">
                      <span className="animate-pulse">⏳</span> 上传中...
                    </div>
                  ) : (
                    <div>
                      <div className="text-3xl mb-2">📷</div>
                      <div className="text-gray-600">点击或拖拽上传截图</div>
                      <div className="text-sm text-gray-400 mt-1">支持 JPG、PNG、GIF</div>
                    </div>
                  )}
                </label>
              </div>

              {screenshots.length > 0 && (
                <div className="mt-4 grid grid-cols-3 gap-4">
                  {screenshots.map((url, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={url}
                        alt={`截图 ${index + 1}`}
                        className="w-full h-24 object-cover rounded-lg border border-gray-200"
                      />
                      <button
                        type="button"
                        onClick={() => removeScreenshot(index)}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm opacity-0 group-hover:opacity-100 transition hover:bg-red-600"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-blue-700 focus:ring-4 focus:ring-blue-200 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? '提交中...' : '提交反馈'}
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}
