import React from 'react'
import { useNavigate } from 'react-router-dom'
import {
  AlertTriangle, ClipboardCheck, Clock, FileText,
  ChevronRight, TrendingUp, CalendarDays,
} from 'lucide-react'
import { SummaryCard, Card, ProgressBar, Button, SectionHeader } from '@/components/ui'
import { DEMO_CHECKLIST, DEMO_REPORTS, DEMO_TRAININGS } from '@/lib/demoData'
import { useFacilityStore } from '@/stores/facilityStore'
import { REPORT_TYPE_LABELS } from '@/types'
import { format } from 'date-fns'
import { ja } from 'date-fns/locale'

export const Dashboard: React.FC = () => {
  const navigate = useNavigate()
  const { facility } = useFacilityStore()

  const items = DEMO_CHECKLIST.checklist_items ?? []
  const doneCount = items.filter((i) => i.status === 'done').length
  const pendingCount = items.filter((i) => i.status === 'pending').length
  const totalCount = items.filter((i) => i.status !== 'excluded').length
  const pendingApproval = DEMO_REPORTS.filter((r) => r.status === 'reviewing').length

  const now = new Date()
  const monthLabel = format(now, 'M月', { locale: ja })

  return (
    <div className="px-4 py-6 space-y-6">
      {/* ウェルカム */}
      <div>
        <p className="text-xs text-gray-500">
          {format(now, 'yyyy年M月d日（E）', { locale: ja })}
        </p>
        <h1 className="text-xl font-bold text-gray-900 break-anywhere mt-0.5">
          {facility?.name ?? 'さくら保育園'}
        </h1>
      </div>

      {/* 未実施アラート */}
      {pendingCount > 0 && (
        <div
          onClick={() => navigate('/checklists/monthly')}
          className="flex items-center gap-3 bg-red-50 border border-red-200 rounded-xl px-4 py-3 cursor-pointer active:bg-red-100"
        >
          <AlertTriangle size={18} className="text-red-500 shrink-0" />
          <p className="text-sm text-red-700 font-medium flex-1 break-anywhere">
            {monthLabel}のチェック未実施が <strong>{pendingCount}件</strong> あります
          </p>
          <ChevronRight size={16} className="text-red-400 shrink-0" />
        </div>
      )}

      {/* サマリーカード */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        <SummaryCard
          icon={<AlertTriangle size={20} className="text-red-500" />}
          label={`${monthLabel}の未実施`}
          value={pendingCount}
          unit="件"
          urgent={pendingCount > 0}
          onClick={() => navigate('/checklists/monthly')}
        />
        <SummaryCard
          icon={<ClipboardCheck size={20} className="text-green-500" />}
          label={`${monthLabel}の実施済み`}
          value={doneCount}
          unit="件"
        />
        <SummaryCard
          icon={<Clock size={20} className="text-yellow-500" />}
          label="承認待ち報告書"
          value={pendingApproval}
          unit="件"
          urgent={pendingApproval > 0}
          className="col-span-2 md:col-span-1"
          onClick={() => navigate('/reports')}
        />
      </div>

      {/* 月次進捗 */}
      <Card className="p-4">
        <div className="flex items-center gap-2 mb-3">
          <TrendingUp size={16} className="text-blue-500" />
          <p className="text-sm font-semibold text-gray-800">{monthLabel}の実施進捗</p>
        </div>
        <ProgressBar done={doneCount} total={totalCount} />
      </Card>

      {/* CTAボタン */}
      <div className="space-y-2.5">
        <Button
          variant="primary"
          fullWidth
          size="lg"
          onClick={() => navigate('/checklists/monthly')}
        >
          <ClipboardCheck size={18} />
          今月のチェック表を開く
        </Button>
        <Button
          variant="secondary"
          fullWidth
          onClick={() => navigate('/reports/new')}
        >
          <FileText size={16} />
          報告書を作成する
        </Button>
      </div>

      {/* 直近の研修 */}
      <div>
        <SectionHeader
          title="直近の研修記録"
          action={
            <button
              onClick={() => navigate('/records')}
              className="text-xs text-blue-600 flex items-center gap-1"
            >
              すべて見る <ChevronRight size={14} />
            </button>
          }
        />
        <div className="space-y-2">
          {DEMO_TRAININGS.slice(0, 2).map((t) => (
            <Card key={t.id} className="p-4">
              <p className="text-sm font-medium text-gray-900 break-anywhere">{t.title}</p>
              <div className="flex items-center gap-2 mt-1.5">
                <CalendarDays size={12} className="text-gray-400 shrink-0" />
                <p className="text-xs text-gray-500">
                  {format(new Date(t.held_date), 'M月d日', { locale: ja })}
                  　{t.duration_min ? `${t.duration_min}分` : ''}
                </p>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* 報告書 */}
      <div>
        <SectionHeader
          title="最近の報告書"
          action={
            <button
              onClick={() => navigate('/reports')}
              className="text-xs text-blue-600 flex items-center gap-1"
            >
              すべて見る <ChevronRight size={14} />
            </button>
          }
        />
        <div className="space-y-2">
          {DEMO_REPORTS.slice(0, 2).map((r) => (
            <Card key={r.id} className="p-4 cursor-pointer" onClick={() => navigate(`/reports/${r.id}`)}>
              <div className="flex items-start gap-2 justify-between">
                <p className="text-sm font-medium text-gray-900 break-anywhere flex-1">{r.title}</p>
                <span className={`shrink-0 text-xs px-2 py-0.5 rounded-full font-medium ${
                  r.status === 'approved' ? 'bg-green-100 text-green-700' :
                  r.status === 'reviewing' ? 'bg-yellow-100 text-yellow-700' :
                  'bg-gray-100 text-gray-700'
                }`}>
                  {r.status === 'approved' ? '承認済み' : r.status === 'reviewing' ? 'レビュー中' : '下書き'}
                </span>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                {REPORT_TYPE_LABELS[r.report_type]}
              </p>
            </Card>
          ))}
        </div>
      </div>

      <div className="h-4" />
    </div>
  )
}

export default Dashboard
