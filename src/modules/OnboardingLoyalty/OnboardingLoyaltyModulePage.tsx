import { useQuery } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'

import { FormWizard } from '@/modules/FormWizard/FormWizard'
import { getValidatedWizardConfig } from '@/modules/OnboardingLoyalty/schemas/wizardConfig'

type OnboardingLoyaltyModulePageProps = {
  moduleTitleKey: string
  queryKey: string
}

async function fetchWizardConfig() {
  return getValidatedWizardConfig()
}

export function OnboardingLoyaltyModulePage({
  moduleTitleKey,
  queryKey,
}: OnboardingLoyaltyModulePageProps) {
  const { t } = useTranslation()

  const { data, isLoading, error } = useQuery({
    queryKey: ['wizard-config', queryKey],
    queryFn: fetchWizardConfig,
    staleTime: Number.POSITIVE_INFINITY,
  })

  if (isLoading) {
    return <p>{t('app.loadingConfig')}</p>
  }

  if (error || !data) {
    return <p>{t('app.loadError')}</p>
  }

  return (
    <section>
      <h2>{t(moduleTitleKey)}</h2>
      <FormWizard config={data} />
    </section>
  )
}
