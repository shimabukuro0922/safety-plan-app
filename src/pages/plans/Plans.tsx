import React from 'react'
import { useNavigate } from 'react-router-dom'
import { ShieldCheck, Plus, CalendarRange, ChevronRight } from 'lucide-react'
import { Card, Button, SectionHeader, EmptyState } from '@/components/ui'
import { DEMO_PLAN } from '@/lib/demoData'
import { format } from 'date-fns'
import { ja } from 'date-fns/locale'
import toast from 'react-hot-toast'

export const Plans: React.FC = () => {
  const navigate = useNavigate()

  return (
    <div className="px-4 py-6 space-y-5">
      <SectionHeader
        title="年間安全計画"
        action={
          <Button size="sm" variant="primary" onClick={() => toast.success('計画作成ウィザード（近日実装）')}>
            <Plus size={14} /> 新規作成
          </Button>
        }
      />

      {/* 現行計画 */}
      <Card className="p-4 border-2 border-blue-200 bg-blue-50">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shrink-0">
            <ShieldCheck size={20} className="text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <p className="text-sm font-bold text-gray-900 break-anywhere">{DEMO_PLAN.title}</p>
              <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-medium">運用中</span>
            </div>
            <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
              <CalendarRange size={12} />
              {DEMO_PLAN.valid_from ? format(new Date(DEMO_PLAN.valid_from), 'yyyy/M/d', { locale: ja }) : '-'}
              〜
              {DEMO_PLAN.valid_until ? format(new Date(DEMO_PLAN.valid_until), 'yyyy/M/d', { locale: ja }) : '-'}
            </p>
          </div>
          <ChevronRight size={16} className="text-gray-400 shrink-0 mt-1" />
        </div>
      </Card>

      {/* カテゴリ一覧（ダミー） */}
      <Card className="p-4">
        <p className="text-sm font-semibold text-gray-800 mb-3">対象カテゴリ（14項目）</p>
        <div className="flex flex-wrap gap-1.5">
          {['午睡', '食事・誤嚥', '水遊び・プール', '園庭・外遊び', '園外活動', 'トイレ衛生', 'AED・救急', '災害対応', '不審者対応', '119番対応', 'バス送迎', '保護者周知', '職員研修', '再発防止'].map((cat) => (
            <span key={cat} className="text-xs bg-gray-100 text-gray-700 px-2.5 py-1 rounded-full break-anywhere">
              {cat}
            </span>
          ))}
        </div>
      </Card>

      <Card className="p-4 bg-gray-50">
        <p className="text-xs text-gray-500 text-center break-anywhere">
          ※ 計画作成ウィザードは次バージョンで追加予定です
        </p>
      </Card>
      <div className="h-4" />
    </div>
  )
}

export default Plans
