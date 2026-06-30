import { useTranslation } from 'react-i18next'
import { Navigate, NavLink, Route, Routes } from 'react-router-dom'

import { getWizardConfig } from '@/i18n/i18n'
import { OnboardingLoyaltyModulePage } from '@/modules/OnboardingLoyalty'
import { wizardConfigSchema } from '@/modules/FormWizard/schemas/wizardConfig'

export function App() {
  const { t } = useTranslation()

  wizardConfigSchema.parse(getWizardConfig())

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
            <OnboardingLoyaltyModulePage
              moduleTitleKey="app.modules.onboarding"
              queryKey="onboarding"
            />
          }
        />
        <Route
          path="/loyalty"
          element={
            <OnboardingLoyaltyModulePage
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
