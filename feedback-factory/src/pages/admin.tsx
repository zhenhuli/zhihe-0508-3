import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import type { Feedback, FeedbackStatus } from '@/types/feedback';
import type { AdminUser } from '@/types/auth';

const statusConfig: Record<FeedbackStatus, { label: string; color: string; bg: string }> = {
  pending: { label: '待处理', color: 'text-amber-700', bg: 'bg-amber-100' },
  processing: { label: '处理中', color: 'text-blue-700', bg: 'bg-blue-100' },
  resolved: { label: '已解决', color: 'text-green-700', bg: 'bg-green-100' },
};

const categoryLabels: Record<string, string> = {
  bug: 'Bug 报告',
  feature: '功能建议',
  improvement: '体验优化',
  other: '其他',
};

const PAGE_SIZE = 10;

interface PaginationInfo {
  currentPage: number;
  totalPages: number;
  total: number;
  pageSize: number;
}

export default function Admin() {
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [loading, setLoading] = useState(true);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [selectedFeedback, setSelectedFeedback] = useState<Feedback | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [filter, setFilter] = useState<FeedbackStatus | 'all'>('all');
  const [currentUser, setCurrentUser] = useState<AdminUser | null>(null);
  const [loggingOut, setLoggingOut] = useState(false);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [searching, setSearching] = useState(false);
  const [pagination, setPagination] = useState<PaginationInfo>({
    currentPage: 1,
    totalPages: 0,
    total: 0,
    pageSize: PAGE_SIZE,
  });
  const router = useRouter();

  useEffect(() => {
    checkAuth();
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchFeedbacks(searchKeyword, filter, 1);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchKeyword]);

  useEffect(() => {
    fetchFeedbacks(searchKeyword, filter, 1);
  }, [filter]);

  const checkAuth = async () => {
    try {
      const response = await fetch('/api/auth/me');
      const data = await response.json();
      if (response.ok && data.user) {
        setCurrentUser(data.user);
        setCheckingAuth(false);
        fetchFeedbacks();
      } else {
        router.push('/login');
      }
    } catch {
      router.push('/login');
    }
  };

  const fetchFeedbacks = async (
    keyword?: string,
    statusFilter: FeedbackStatus | 'all' = filter,
    page: number = pagination.currentPage
  ) => {
    setSearching(!!keyword);
    setLoading(true);
    try {
      const params = new URLSearchParams();
      params.append('page', String(page));
      params.append('pageSize', String(PAGE_SIZE));
      if (keyword && keyword.trim()) {
        params.append('q', keyword.trim());
      }
      if (statusFilter !== 'all') {
        params.append('status', statusFilter);
      }
      
      const response = await fetch(`/api/feedbacks?${params.toString()}`);
      if (response.status === 401) {
        router.push('/login');
        return;
      }
      const data = await response.json();
      if (response.ok) {
        setFeedbacks(data.feedbacks || []);
        setPagination(data.pagination || {
          currentPage: 1,
          totalPages: 0,
          total: 0,
          pageSize: PAGE_SIZE,
        });
      }
    } catch (error) {
      console.error('Failed to fetch feedbacks:', error);
    } finally {
      setLoading(false);
      setSearching(false);
    }
  };

  const goToPage = (page: number) => {
    if (page >= 1 && page <= pagination.totalPages) {
      fetchFeedbacks(searchKeyword, filter, page);
    }
  };

  const updateStatus = async (id: string, status: FeedbackStatus) => {
    setUpdatingId(id);
    try {
      const response = await fetch(`/api/feedbacks/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      if (response.status === 401) {
        router.push('/login');
        return;
      }
      const data = await response.json();
      if (response.ok) {
        setFeedbacks(prev =>
          prev.map(f => (f.id === id ? data.feedback : f))
        );
        if (selectedFeedback?.id === id) {
          setSelectedFeedback(data.feedback);
        }
      }
    } catch (error) {
      console.error('Failed to update status:', error);
    } finally {
      setUpdatingId(null);
    }
  };

  const handleLogout = async () => {
    if (loggingOut) return;
    setLoggingOut(true);
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      router.push('/login');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setLoggingOut(false);
    }
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const renderPageNumbers = () => {
    const { currentPage, totalPages } = pagination;
    if (totalPages <= 1) return null;

    const pages: (number | string)[] = [];
    const maxVisible = 5;
    let start = Math.max(1, currentPage - Math.floor(maxVisible / 2));
    const end = Math.min(totalPages, start + maxVisible - 1);
    start = Math.max(1, end - maxVisible + 1);

    if (start > 1) {
      pages.push(1);
      if (start > 2) pages.push('...');
    }

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    if (end < totalPages) {
      if (end < totalPages - 1) pages.push('...');
      pages.push(totalPages);
    }

    return pages.map((page, index) => (
      <span key={index}>
        {typeof page === 'number' ? (
          <button
            onClick={() => goToPage(page)}
            className={`min-w-[36px] h-9 px-3 rounded-lg text-sm font-medium transition ${
              page === currentPage
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {page}
          </button>
        ) : (
          <span className="px-2 text-gray-400">...</span>
        )}
      </span>
    ));
  };

  if (checkingAuth) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-500">验证登录状态...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Head>
        <title>管理后台 - Feedback Factory</title>
        <meta name="description" content="管理反馈列表" />
      </Head>

      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-xl font-bold text-gray-800">📝 Feedback Factory 管理后台</h1>
          <div className="flex items-center gap-4">
            {currentUser && (
              <span className="text-sm text-gray-600">
                欢迎，<span className="font-medium">{currentUser.username}</span>
              </span>
            )}
            <button
              onClick={handleLogout}
              disabled={loggingOut}
              className="text-sm text-red-600 hover:text-red-800 disabled:opacity-50"
            >
              {loggingOut ? '退出中...' : '退出登录'}
            </button>
            <Link
              href="/"
              className="text-sm text-blue-600 hover:text-blue-800"
            >
              返回首页
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-6">
          <div className="flex-1">
            <div className="bg-white rounded-lg shadow-md">
              <div className="p-4 border-b border-gray-200">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
                  <h2 className="text-lg font-semibold text-gray-800">
                    反馈列表
                    <span className="ml-2 text-sm font-normal text-gray-500">
                      共 {pagination.total} 条
                    </span>
                    {searching && (
                      <span className="ml-2 text-xs text-blue-600">
                        搜索中...
                      </span>
                    )}
                  </h2>
                  <div className="flex gap-2">
                    {(['all', 'pending', 'processing', 'resolved'] as const).map((s) => (
                      <button
                        key={s}
                        onClick={() => setFilter(s)}
                        className={`px-3 py-1.5 text-sm rounded-lg transition ${
                          filter === s
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                      >
                        {s === 'all' ? '全部' : statusConfig[s].label}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="relative">
                  <input
                    type="text"
                    value={searchKeyword}
                    onChange={(e) => setSearchKeyword(e.target.value)}
                    placeholder="🔍 搜索邮箱或手机号..."
                    className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                  />
                  {searchKeyword && (
                    <button
                      onClick={() => setSearchKeyword('')}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      ✕
                    </button>
                  )}
                </div>
                {searchKeyword && (
                  <p className="text-sm text-gray-500 mt-2">
                    搜索关键词：<span className="text-blue-600 font-medium">{searchKeyword}</span>
                    <span className="ml-2">找到 {pagination.total} 条记录</span>
                  </p>
                )}
              </div>

              {loading ? (
                <div className="p-8 text-center text-gray-500">加载中...</div>
              ) : feedbacks.length === 0 ? (
                <div className="p-8 text-center text-gray-500">
                  {searchKeyword ? '没有找到匹配的反馈记录' : '暂无反馈'}
                </div>
              ) : (
                <>
                  <div className="divide-y divide-gray-100">
                    {feedbacks.map((feedback) => (
                      <div
                        key={feedback.id}
                        onClick={() => setSelectedFeedback(feedback)}
                        className={`p-4 cursor-pointer hover:bg-gray-50 transition ${
                          selectedFeedback?.id === feedback.id ? 'bg-blue-50' : ''
                        }`}
                      >
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="font-medium text-gray-800 line-clamp-1 flex-1 mr-2">
                            {feedback.title}
                          </h3>
                          <span className={`px-2 py-0.5 text-xs rounded-full whitespace-nowrap ${statusConfig[feedback.status].bg} ${statusConfig[feedback.status].color}`}>
                            {statusConfig[feedback.status].label}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 line-clamp-2 mb-2">
                          {feedback.content}
                        </p>
                        <div className="flex flex-wrap items-center gap-2 gap-x-3 text-xs text-gray-400">
                          <span>{categoryLabels[feedback.category] || feedback.category}</span>
                          <span>•</span>
                          {feedback.email && (
                            <span className="inline-flex items-center gap-1">
                              📧 {feedback.email}
                            </span>
                          )}
                          {feedback.phone && (
                            <span className="inline-flex items-center gap-1">
                              📱 {feedback.phone}
                            </span>
                          )}
                          <span>•</span>
                          <span>{formatDate(feedback.createdAt)}</span>
                          {feedback.screenshots.length > 0 && (
                            <>
                              <span>•</span>
                              <span>📷 {feedback.screenshots.length} 张截图</span>
                            </>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>

                  {pagination.totalPages > 1 && (
                    <div className="p-4 border-t border-gray-200 flex flex-col sm:flex-row justify-between items-center gap-4">
                      <div className="text-sm text-gray-500">
                        第 {pagination.currentPage} / {pagination.totalPages} 页，
                        共 {pagination.total} 条记录
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => goToPage(pagination.currentPage - 1)}
                          disabled={pagination.currentPage <= 1}
                          className="px-3 py-1.5 text-sm rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200 transition disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          上一页
                        </button>
                        <div className="flex items-center gap-1">
                          {renderPageNumbers()}
                        </div>
                        <button
                          onClick={() => goToPage(pagination.currentPage + 1)}
                          disabled={pagination.currentPage >= pagination.totalPages}
                          className="px-3 py-1.5 text-sm rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200 transition disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          下一页
                        </button>
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>

          {selectedFeedback && (
            <div className="w-full lg:w-96 bg-white rounded-lg shadow-md lg:sticky lg:top-24 self-start">
              <div className="p-4 border-b border-gray-200 flex justify-between items-center">
                <h3 className="font-semibold text-gray-800">反馈详情</h3>
                <button
                  onClick={() => setSelectedFeedback(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>
              <div className="p-4 space-y-4 max-h-[calc(100vh-200px)] overflow-y-auto">
                <div>
                  <div className="text-xs text-gray-500 mb-1">状态</div>
                  <div className="flex gap-2">
                    {(['pending', 'processing', 'resolved'] as const).map((s) => (
                      <button
                        key={s}
                        onClick={() => updateStatus(selectedFeedback.id, s)}
                        disabled={updatingId === selectedFeedback.id}
                        className={`px-3 py-1 text-xs rounded-lg transition ${
                          selectedFeedback.status === s
                            ? `${statusConfig[s].bg} ${statusConfig[s].color} border-2 border-transparent`
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        } disabled:opacity-50`}
                      >
                        {statusConfig[s].label}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <div className="text-xs text-gray-500 mb-1">标题</div>
                  <div className="text-gray-800 font-medium">{selectedFeedback.title}</div>
                </div>

                <div>
                  <div className="text-xs text-gray-500 mb-1">类型</div>
                  <div className="text-gray-700">
                    {categoryLabels[selectedFeedback.category] || selectedFeedback.category}
                  </div>
                </div>

                <div>
                  <div className="text-xs text-gray-500 mb-1">详细描述</div>
                  <div className="text-gray-700 whitespace-pre-wrap text-sm">
                    {selectedFeedback.content}
                  </div>
                </div>

                {selectedFeedback.email && (
                  <div>
                    <div className="text-xs text-gray-500 mb-1">联系邮箱</div>
                    <div className="text-gray-700 text-sm font-mono">
                      📧 {selectedFeedback.email}
                    </div>
                  </div>
                )}

                {selectedFeedback.phone && (
                  <div>
                    <div className="text-xs text-gray-500 mb-1">联系手机</div>
                    <div className="text-gray-700 text-sm font-mono">
                      📱 {selectedFeedback.phone}
                    </div>
                  </div>
                )}

                {selectedFeedback.screenshots.length > 0 && (
                  <div>
                    <div className="text-xs text-gray-500 mb-2">截图 ({selectedFeedback.screenshots.length})</div>
                    <div className="grid grid-cols-2 gap-2">
                      {selectedFeedback.screenshots.map((url, index) => (
                        <a
                          key={index}
                          href={url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="group relative"
                        >
                          <img
                            src={url}
                            alt={`截图 ${index + 1}`}
                            className="w-full h-24 object-cover rounded-lg border border-gray-200 group-hover:border-blue-400 transition"
                          />
                          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 rounded-lg transition flex items-center justify-center">
                            <span className="text-white text-xs opacity-0 group-hover:opacity-100">
                              点击查看
                            </span>
                          </div>
                        </a>
                      ))}
                    </div>
                  </div>
                )}

                <div className="pt-2 border-t border-gray-100 text-xs text-gray-400 space-y-1">
                  <div>创建时间：{formatDate(selectedFeedback.createdAt)}</div>
                  <div>更新时间：{formatDate(selectedFeedback.updatedAt)}</div>
                  <div>ID：{selectedFeedback.id}</div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
