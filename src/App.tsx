import { useTranslation } from 'react-i18next'
import { Navigate, NavLink, Route, Routes } from 'react-router-dom'

import { WorkflowModulePage } from './modules/WorkflowModulePage'

export function App() {
  const { t } = useTranslation()

  return (
    <main>
      <nav aria-label={t('app.moduleNavigation')}>
        <NavLink to="/onboarding">{t('app.modules.onboarding')}</NavLink>
        {' | '}
        <NavLink to="/loyalty">{t('app.modules.loyalty')}</NavLink>
      </nav>

      <Routes>
        <Route
          path="/onboarding"
          element={
            <WorkflowModulePage
              moduleTitleKey="app.modules.onboarding"
              queryKey="onboarding"
            />
          }
        />
        <Route
          path="/loyalty"
          element={
            <WorkflowModulePage
              moduleTitleKey="app.modules.loyalty"
              queryKey="loyalty"
            />
          }
        />
        <Route path="*" element={<Navigate to="/onboarding" replace />} />
      </Routes>
    </main>
  )
}
