import React, { useState } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import {
  LayoutDashboard, ClipboardCheck, History,
  FileText, Settings, ChevronLeft, Menu, X,
  ShieldCheck,
} from 'lucide-react'

interface NavItem {
  label: string
  path: string
  icon: React.ReactNode
}

const NAV_ITEMS: NavItem[] = [
  { label: 'ホーム', path: '/dashboard', icon: <LayoutDashboard size={20} /> },
  { label: 'チェック表', path: '/checklists/monthly', icon: <ClipboardCheck size={20} /> },
  { label: '記録・証跡', path: '/records', icon: <History size={20} /> },
  { label: '報告書', path: '/reports', icon: <FileText size={20} /> },
  { label: '設定', path: '/settings', icon: <Settings size={20} /> },
]

const PC_NAV_ITEMS = [
  {
    section: '安全計画',
    items: [
      { label: 'ダッシュボード', path: '/dashboard', icon: <LayoutDashboard size={16} /> },
      { label: '年間計画', path: '/plans', icon: <ShieldCheck size={16} /> },
      { label: '月次チェック', path: '/checklists/monthly', icon: <ClipboardCheck size={16} /> },
      { label: '季節前チェック', path: '/checklists/seasonal', icon: <ClipboardCheck size={16} /> },
    ],
  },
  {
    section: '資料・周知',
    items: [
      { label: '職員向け資料', path: '/materials/staff', icon: <FileText size={16} /> },
      { label: '保護者周知文', path: '/materials/guardian', icon: <FileText size={16} /> },
    ],
  },
  {
    section: '記録・報告',
    items: [
      { label: '実施履歴・証跡', path: '/records', icon: <History size={16} /> },
      { label: '報告書', path: '/reports', icon: <FileText size={16} /> },
    ],
  },
  {
    section: '管理',
    items: [
      { label: '設定', path: '/settings', icon: <Settings size={16} /> },
    ],
  },
]

// PC サイドバー
const Sidebar: React.FC = () => (
  <aside className="hidden md:flex flex-col fixed left-0 top-0 bottom-0 w-60 bg-white border-r border-gray-200 z-40 overflow-y-auto">
    {/* ロゴ */}
    <div className="px-5 py-5 border-b border-gray-100">
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center shrink-0">
          <ShieldCheck size={18} className="text-white" />
        </div>
        <div className="min-w-0">
          <p className="text-xs font-bold text-gray-900 leading-tight">安全計画</p>
          <p className="text-xs text-gray-500 leading-tight">使える化サポート</p>
        </div>
      </div>
    </div>

    {/* ナビ */}
    <nav className="flex-1 px-3 py-4 space-y-5">
      {PC_NAV_ITEMS.map((group) => (
        <div key={group.section}>
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider px-2 mb-1">
            {group.section}
          </p>
          {group.items.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors
                ${isActive
                  ? 'bg-blue-50 text-blue-700'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`
              }
            >
              {item.icon}
              <span className="break-anywhere">{item.label}</span>
            </NavLink>
          ))}
        </div>
      ))}
    </nav>

    {/* フッター */}
    <div className="px-5 py-4 border-t border-gray-100">
      <p className="text-xs text-gray-400">さくら保育園</p>
    </div>
  </aside>
)

// モバイル ボトムナビ
const BottomNav: React.FC = () => (
  <nav
    className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50"
    style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}
  >
    <div className="flex h-16">
      {NAV_ITEMS.map((item) => (
        <NavLink
          key={item.path}
          to={item.path}
          className={({ isActive }) =>
            `flex-1 flex flex-col items-center justify-center gap-0.5 text-xs transition-colors
            ${isActive ? 'text-blue-600' : 'text-gray-400'}`
          }
        >
          {item.icon}
          <span className="text-[10px] font-medium">{item.label}</span>
        </NavLink>
      ))}
    </div>
  </nav>
)

// モバイル ヘッダー
const MobileHeader: React.FC<{ title: string }> = ({ title }) => {
  const location = useLocation()
  const isTop = location.pathname === '/dashboard'

  return (
    <header
      className="md:hidden sticky top-0 z-50 bg-white border-b border-gray-200"
      style={{ paddingTop: 'env(safe-area-inset-top, 0px)' }}
    >
      <div className="h-14 flex items-center px-4 gap-2">
        {!isTop && (
          <button
            onClick={() => window.history.back()}
            className="p-2 -ml-2 text-gray-500 min-w-[40px] min-h-[40px] flex items-center justify-center"
          >
            <ChevronLeft size={20} />
          </button>
        )}
        {isTop && (
          <div className="w-7 h-7 bg-blue-600 rounded-lg flex items-center justify-center">
            <ShieldCheck size={15} className="text-white" />
          </div>
        )}
        <h1 className="text-base font-bold text-gray-900 break-anywhere truncate flex-1">
          {title}
        </h1>
      </div>
    </header>
  )
}

// ページタイトル解決
function getPageTitle(pathname: string): string {
  const map: Record<string, string> = {
    '/dashboard': '安全計画 使える化',
    '/plans': '年間安全計画',
    '/plans/new': '安全計画を作成',
    '/checklists/monthly': '月次チェック表',
    '/checklists/seasonal': '季節前チェック表',
    '/materials/staff': '職員向け資料',
    '/materials/guardian': '保護者周知文',
    '/records': '実施履歴・証跡',
    '/reports': '報告書',
    '/reports/new': '報告書を作成',
    '/settings': '設定',
  }
  if (map[pathname]) return map[pathname]
  if (pathname.startsWith('/reports/')) return '報告書エディタ'
  if (pathname.startsWith('/plans/')) return '安全計画詳細'
  return '安全計画 使える化'
}

// メインレイアウト
export const AppLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation()
  const title = getPageTitle(location.pathname)

  return (
    <div className="min-h-dvh w-full overflow-x-hidden bg-gray-50">
      <Sidebar />
      <MobileHeader title={title} />
      <main className="main-content">
        <div className="max-w-4xl mx-auto">
          {children}
        </div>
      </main>
      <BottomNav />
    </div>
  )
}

export default AppLayout
