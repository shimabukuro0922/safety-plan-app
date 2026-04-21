import React, { useState } from 'react'
import { Sparkles, FileDown, Users, BookOpen, UserPlus } from 'lucide-react'
import { Card, Button, SectionHeader } from '@/components/ui'
import toast from 'react-hot-toast'

type MaterialType = 'morning' | 'training' | 'newcomer'

const MATERIAL_TYPES: { key: MaterialType; label: string; icon: React.ReactNode; description: string }[] = [
  { key: 'morning', label: '朝礼用1枚資料', icon: <BookOpen size={18} className="text-blue-500" />, description: '毎朝の安全確認事項をA4一枚にまとめたもの' },
  { key: 'training', label: '園内研修用資料', icon: <Users size={18} className="text-green-500" />, description: '定期研修で使える詳細な解説・演習シート' },
  { key: 'newcomer', label: '新人向けガイド', icon: <UserPlus size={18} className="text-purple-500" />, description: '新入職員が最初に学ぶ安全の基礎' },
]

export const StaffMaterial: React.FC = () => {
  const [selected, setSelected] = useState<MaterialType>('morning')
  const [isGenerating, setIsGenerating] = useState(false)
  const [generated, setGenerated] = useState<string | null>(null)

  const handleGenerate = async () => {
    setIsGenerating(true)
    await new Promise((r) => setTimeout(r, 1800))
    setIsGenerating(false)
    const demos: Record<MaterialType, string> = {
      morning: `【本日の安全確認ポイント】\n\n✅ 午睡確認\n・5分ごとに呼吸・体位を確認\n・うつぶせ寝を発見したら仰向けに直す\n\n✅ 食事・誤嚥対策\n・アレルギー確認シートと照合\n・食事中は目を離さない\n\n✅ 救急備品\n・救急箱の場所: 職員室棚上段\n・AEDの場所: 玄関横\n\n※何か気になることがあればすぐに主任に報告してください`,
      training: `【安全管理研修資料】\n\n1. 午睡中の安全管理\n乳幼児突然死症候群(SIDS)の予防として、午睡中は5分ごとに呼吸確認を行います...\n\n2. 誤嚥・窒息対応\nハイムリック法と背部叩打法の手順を確認します...\n\n3. AED・心肺蘇生\n万が一の際には躊躇なくAEDを使用してください...`,
      newcomer: `【新入職員 安全管理ガイド】\n\nこの園で大切にしていること\n「子どもの安全を最優先に」\n\n1. まず覚えること\n・救急箱とAEDの場所\n・緊急連絡先一覧の場所\n・避難経路\n\n2. 毎日の確認\n・出勤したら安全確認チェックシートを見る\n・気になることは即報告する...`,
    }
    setGenerated(demos[selected])
    toast.success('資料を作成しました')
  }

  return (
    <div className="px-4 py-6 space-y-5">
      <SectionHeader title="職員向け資料を作る" subtitle="AIが下書きを生成します。内容を確認してから使ってください" />

      {/* 種別選択 */}
      <div className="space-y-2">
        {MATERIAL_TYPES.map((m) => (
          <Card
            key={m.key}
            className={`p-4 cursor-pointer border-2 transition-colors ${selected === m.key ? 'border-blue-500 bg-blue-50' : 'border-gray-200'}`}
            onClick={() => { setSelected(m.key); setGenerated(null) }}
          >
            <div className="flex items-center gap-3">
              <div className={`w-4 h-4 rounded-full border-2 shrink-0 ${selected === m.key ? 'border-blue-500 bg-blue-500' : 'border-gray-400'}`} />
              <div className="flex items-center gap-2">
                {m.icon}
                <div>
                  <p className="text-sm font-medium text-gray-900">{m.label}</p>
                  <p className="text-xs text-gray-500 break-anywhere">{m.description}</p>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <Button variant="ai" fullWidth size="lg" loading={isGenerating} onClick={handleGenerate}>
        <Sparkles size={18} />
        AIで資料を作る
      </Button>

      {/* 生成結果 */}
      {generated && (
        <Card className="p-4">
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm font-bold text-gray-900">作成された資料（下書き）</p>
            <span className="text-xs bg-violet-100 text-violet-700 px-2 py-0.5 rounded-full">AI生成</span>
          </div>
          <textarea
            defaultValue={generated}
            className="w-full border border-gray-200 rounded-xl px-3 py-3 text-sm resize-none min-h-[200px] leading-relaxed break-anywhere focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
          <div className="mt-3 flex gap-2">
            <Button variant="secondary" size="sm" fullWidth onClick={() => toast.success('PDF出力（デモ）')}>
              <FileDown size={14} /> PDFで出力
            </Button>
            <Button variant="primary" size="sm" fullWidth onClick={() => toast.success('研修記録を登録しました（デモ）')}>
              研修記録を登録
            </Button>
          </div>
        </Card>
      )}
      <div className="h-4" />
    </div>
  )
}

export default StaffMaterial
