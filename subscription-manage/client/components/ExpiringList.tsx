import type { Member } from '@/types';

interface ExpiringListProps {
  members: Member[];
  onRenew: (member: Member) => void;
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('zh-CN');
}

export default function ExpiringList({ members, onRenew }: ExpiringListProps) {
  if (members.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          ⚠️ 即将到期提醒（7天内）
        </h3>
        <div className="text-center py-8 text-gray-400">
          <p className="text-4xl mb-2">🎉</p>
          <p>暂无即将到期的会员</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">
        ⚠️ 即将到期提醒（7天内）
        <span className="ml-2 px-2 py-1 bg-yellow-100 text-yellow-800 text-sm rounded-full">
          {members.length} 人
        </span>
      </h3>
      <div className="space-y-3 max-h-80 overflow-y-auto">
        {members.map((member) => (
          <div 
            key={member.id} 
            className="flex items-center justify-between p-4 bg-yellow-50 rounded-lg border border-yellow-200"
          >
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-yellow-200 rounded-full flex items-center justify-center">
                <span className="text-lg">{member.name.charAt(0)}</span>
              </div>
              <div>
                <p className="font-medium text-gray-800">{member.name}</p>
                <p className="text-sm text-gray-500">
                  {member.memberNo} · {member.plan?.name}
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-500">到期时间</p>
              <p className="font-medium text-yellow-600">
                {formatDate(member.expireDate)}
              </p>
              <p className="text-xs text-yellow-500">
                剩余 {(member as any).daysLeft} 天
              </p>
            </div>
            <button
              onClick={() => onRenew(member)}
              className="px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg text-sm font-medium transition-colors ml-4"
            >
              续费
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
