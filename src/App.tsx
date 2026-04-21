import React, { Suspense } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Toaster } from 'react-hot-toast'
import AppLayout from '@/components/layout/AppLayout'
import { LoadingSpinner } from '@/components/ui'

const Dashboard = React.lazy(() => import('@/pages/Dashboard'))
const MonthlyChecklist = React.lazy(() => import('@/pages/checklists/MonthlyChecklist'))
const SeasonalChecklist = React.lazy(() => import('@/pages/checklists/SeasonalChecklist'))
const Plans = React.lazy(() => import('@/pages/plans/Plans'))
const ReportList = React.lazy(() => import('@/pages/reports/ReportList'))
const ReportCreate = React.lazy(() => import('@/pages/reports/ReportCreate'))
const ReportEditPage = React.lazy(() => import('@/pages/reports/ReportEditPage'))
const RecordList = React.lazy(() => import('@/pages/records/RecordList'))
const StaffMaterial = React.lazy(() => import('@/pages/materials/StaffMaterial'))
const GuardianNotice = React.lazy(() => import('@/pages/materials/GuardianNotice'))
const Settings = React.lazy(() => import('@/pages/settings/Settings'))

const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: 1, staleTime: 1000 * 60 * 5 } },
})

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AppLayout>
          <Suspense fallback={<div className="px-4 py-10"><LoadingSpinner /></div>}>
            <Routes>
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/plans" element={<Plans />} />
              <Route path="/checklists/monthly" element={<MonthlyChecklist />} />
              <Route path="/checklists/seasonal" element={<SeasonalChecklist />} />
              <Route path="/materials/staff" element={<StaffMaterial />} />
              <Route path="/materials/guardian" element={<GuardianNotice />} />
              <Route path="/records" element={<RecordList />} />
              <Route path="/reports" element={<ReportList />} />
              <Route path="/reports/new" element={<ReportCreate />} />
              <Route path="/reports/:id" element={<ReportEditPage />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="*" element={<Navigate to="/dashboard" replace />} />
            </Routes>
          </Suspense>
        </AppLayout>
      </BrowserRouter>
      <Toaster
        position="top-center"
        toastOptions={{
          duration: 3000,
          style: { borderRadius: '12px', fontSize: '14px', maxWidth: '360px' },
        }}
      />
    </QueryClientProvider>
  )
}

export default App
