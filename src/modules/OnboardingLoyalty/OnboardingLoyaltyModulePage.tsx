import { useQuery } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'

import { FormWizard } from '@/modules/FormWizard/FormWizard'
import type { WizardConfig } from '@/modules/FormWizard/schemas/wizardConfig'
import { getValidatedWizardConfig } from '@/modules/OnboardingLoyalty/schemas/wizardConfig'

type OnboardingLoyaltyModulePageProps = {
  moduleTitleKey: string
  queryKey: string
  configFetcher?: () => WizardConfig
}

async function fetchWizardConfig(configFetcher: () => WizardConfig) {
  return configFetcher()
}

export function OnboardingLoyaltyModulePage({
  moduleTitleKey,
  queryKey,
  configFetcher = getValidatedWizardConfig,
}: OnboardingLoyaltyModulePageProps) {
  const { t } = useTranslation()

  const { data, isLoading, error } = useQuery({
    queryKey: ['wizard-config', queryKey],
    queryFn: () => fetchWizardConfig(configFetcher),
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
