import React, { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { ChevronLeft, ChevronRight, FileText, Check, X, Clock } from 'lucide-react'
import { Button, Card, ProgressBar, Modal, SectionHeader } from '@/components/ui'
import { DEMO_CHECKLIST } from '@/lib/demoData'
import type { ChecklistItem, ChecklistItemStatus } from '@/types'
import { format } from 'date-fns'
import { ja } from 'date-fns/locale'
import toast from 'react-hot-toast'

// ==============================
// チェックカード（モバイル用）
// ==============================
const ChecklistCard: React.FC<{
  item: ChecklistItem
  onDone: (id: string) => void
  onExclude: (id: string, reason: string) => void
}> = ({ item, onDone, onExclude }) => {
  const [showExcludeModal, setShowExcludeModal] = useState(false)
  const [reason, setReason] = useState('')

  return (
    <>
      <Card className={`p-4 ${item.status === 'done' ? 'opacity-70' : ''}`}>
        {/* カテゴリタグ */}
        <span className="text-xs font-medium text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">
          {item.safety_categories?.name ?? 'その他'}
        </span>

        {/* タイトル */}
        <p className={`mt-2 text-sm font-medium break-anywhere leading-relaxed ${
          item.status === 'done' ? 'line-through text-gray-400' : 'text-gray-900'
        }`}>
          {item.title}
        </p>

        {/* 説明 */}
        {item.description && (
          <p className="mt-1 text-xs text-gray-500 break-anywhere leading-relaxed">
            {item.description}
          </p>
        )}

        {/* 除外理由 */}
        {item.status === 'excluded' && item.exclude_reason && (
          <p className="mt-2 text-xs text-gray-500 bg-gray-50 rounded-lg px-3 py-2 break-anywhere">
            除外理由: {item.exclude_reason}
          </p>
        )}

        {/* 実施情報 */}
        {item.status === 'done' && item.done_at && (
          <p className="mt-2 text-xs text-green-600">
            ✓ {format(new Date(item.done_at), 'M月d日 HH:mm', { locale: ja })}
            {item.done_by ? ` · ${item.done_by}` : ''}
          </p>
        )}

        {/* アクションボタン */}
        {item.status === 'pending' && (
          <div className="mt-3 flex gap-2">
            <button
              onClick={() => onDone(item.id)}
              className="flex-1 flex items-center justify-center gap-1.5 py-2.5 bg-green-600 text-white text-sm font-medium rounded-xl min-h-[44px] active:bg-green-700 transition-colors"
            >
              <Check size={16} />
              実施済みにする
            </button>
            <button
              onClick={() => setShowExcludeModal(true)}
              className="px-4 py-2.5 bg-gray-100 text-gray-600 text-sm rounded-xl min-h-[44px] active:bg-gray-200 transition-colors"
            >
              除外
            </button>
          </div>
        )}
        {item.status === 'deferred' && (
          <button
            onClick={() => onDone(item.id)}
            className="mt-3 w-full flex items-center justify-center gap-1.5 py-2.5 bg-blue-100 text-blue-700 text-sm font-medium rounded-xl min-h-[44px] active:bg-blue-200"
          >
            <Clock size={16} />
            実施済みにする
          </button>
        )}
      </Card>

      {/* 除外モーダル */}
      <Modal
        open={showExcludeModal}
        onClose={() => setShowExcludeModal(false)}
        title="除外する理由を入力"
      >
        <p className="text-sm text-gray-700 mb-3 break-anywhere font-medium">{item.title}</p>
        <textarea
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          placeholder="例：先月実施済み、今月は対象外"
          className="w-full border border-gray-300 rounded-xl px-3 py-2.5 text-sm resize-none min-h-[96px] focus:ring-2 focus:ring-blue-500 focus:outline-none break-anywhere"
        />
        <div className="flex gap-2 mt-4">
          <Button
            fullWidth
            variant="danger"
            onClick={() => {
              onExclude(item.id, reason)
              setShowExcludeModal(false)
              setReason('')
            }}
          >
            除外する
          </Button>
          <Button variant="secondary" onClick={() => setShowExcludeModal(false)}>
            キャンセル
          </Button>
        </div>
      </Modal>
    </>
  )
}

// ==============================
// メインページ
// ==============================
export const MonthlyChecklist: React.FC = () => {
  const navigate = useNavigate()
  const now = new Date()
  const [year, setYear] = useState(now.getFullYear())
  const [month, setMonth] = useState(now.getMonth() + 1)
  const [items, setItems] = useState(DEMO_CHECKLIST.checklist_items ?? [])

  const adjustMonth = (delta: number) => {
    let newMonth = month + delta
    let newYear = year
    if (newMonth > 12) { newMonth = 1; newYear++ }
    if (newMonth < 1) { newMonth = 12; newYear-- }
    setMonth(newMonth)
    setYear(newYear)
  }

  const handleDone = (id: string) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id
          ? { ...item, status: 'done' as ChecklistItemStatus, done_at: new Date().toISOString(), done_by: '操作者' }
          : item
      )
    )
    toast.success('実施済みとして記録しました')
  }

  const handleExclude = (id: string, reason: string) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id
          ? { ...item, status: 'excluded' as ChecklistItemStatus, exclude_reason: reason }
          : item
      )
    )
    toast.success('除外しました')
  }

  const grouped = useMemo(() => {
    const map: Record<string, ChecklistItem[]> = {}
    items.forEach((item) => {
      const cat = item.safety_categories?.name ?? 'その他'
      if (!map[cat]) map[cat] = []
      map[cat].push(item)
    })
    return map
  }, [items])

  const doneCount = items.filter((i) => i.status === 'done').length
  const totalCount = items.filter((i) => i.status !== 'excluded').length
  const pendingCount = items.filter((i) => i.status === 'pending').length

  return (
    <div className="px-4 py-6 space-y-5">
      {/* 月セレクタ */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => adjustMonth(-1)}
          className="p-2 rounded-xl border border-gray-200 bg-white min-w-[44px] min-h-[44px] flex items-center justify-center active:bg-gray-50"
          aria-label="前月"
        >
          <ChevronLeft size={18} />
        </button>
        <h2 className="text-base font-bold text-gray-900">
          {year}年{month}月　月次チェック表
        </h2>
        <button
          onClick={() => adjustMonth(+1)}
          className="p-2 rounded-xl border border-gray-200 bg-white min-w-[44px] min-h-[44px] flex items-center justify-center active:bg-gray-50"
          aria-label="翌月"
        >
          <ChevronRight size={18} />
        </button>
      </div>

      {/* 進捗 */}
      <div className="bg-white border border-gray-200 rounded-xl p-4">
        <ProgressBar done={doneCount} total={totalCount} />
      </div>

      {/* 完了バナー */}
      {pendingCount === 0 && totalCount > 0 && (
        <div className="bg-green-50 border border-green-200 rounded-xl px-4 py-3 flex items-center gap-2">
          <Check size={18} className="text-green-600 shrink-0" />
          <p className="text-sm text-green-700 font-medium">今月のチェックが完了しています 🎉</p>
        </div>
      )}

      {/* カテゴリ別チェックリスト（Mobile: カード形式） */}
      <div className="md:hidden space-y-5">
        {Object.entries(grouped).map(([catName, catItems]) => (
          <div key={catName}>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2 px-1">
              {catName}
            </p>
            <div className="space-y-2">
              {catItems.map((item) => (
                <ChecklistCard
                  key={item.id}
                  item={item}
                  onDone={handleDone}
                  onExclude={handleExclude}
                />
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* PC: テーブル形式 */}
      <div className="hidden md:block">
        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left font-semibold text-gray-600 text-xs w-28">カテゴリ</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-600 text-xs">チェック項目</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-600 text-xs w-24">状態</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-600 text-xs w-32">実施日時</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-600 text-xs w-36">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {items.map((item) => (
                <tr key={item.id} className={item.status === 'done' ? 'opacity-60' : ''}>
                  <td className="px-4 py-3">
                    <span className="text-xs text-blue-600 font-medium bg-blue-50 px-2 py-0.5 rounded-full whitespace-nowrap">
                      {item.safety_categories?.name}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <p className={`text-sm break-anywhere ${item.status === 'done' ? 'line-through text-gray-400' : 'text-gray-900'}`}>
                      {item.title}
                    </p>
                    {item.description && (
                      <p className="text-xs text-gray-500 mt-0.5 break-anywhere">{item.description}</p>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                      item.status === 'done' ? 'bg-green-100 text-green-700' :
                      item.status === 'excluded' ? 'bg-gray-100 text-gray-500' :
                      'bg-orange-100 text-orange-700'
                    }`}>
                      {item.status === 'done' ? '実施済み' : item.status === 'excluded' ? '除外' : '未実施'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-xs text-gray-500">
                    {item.done_at ? format(new Date(item.done_at), 'M/d HH:mm', { locale: ja }) : '-'}
                  </td>
                  <td className="px-4 py-3">
                    {item.status === 'pending' && (
                      <button
                        onClick={() => handleDone(item.id)}
                        className="text-xs bg-green-600 text-white px-3 py-1.5 rounded-lg hover:bg-green-700 transition-colors min-h-[32px]"
                      >
                        実施済みにする
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* フッターアクション */}
      <div className="pt-2 space-y-2">
        <Button
          variant="secondary"
          fullWidth
          onClick={() => navigate('/reports/new')}
        >
          <FileText size={16} />
          この結果から報告書を作成する
        </Button>
      </div>

      <div className="h-4" />
    </div>
  )
}

export default MonthlyChecklist
