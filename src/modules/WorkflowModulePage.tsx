import { useQuery } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'

import { FormWizard } from '../components/FormWizard'
import { getWizardConfig } from '../i18n/i18n'
import { wizardConfigSchema } from '../schemas/wizardConfig'

type WorkflowModulePageProps = {
  moduleTitleKey: string
  queryKey: string
}

async function fetchWizardConfig() {
  return wizardConfigSchema.parse(getWizardConfig())
}

export function WorkflowModulePage({
  moduleTitleKey,
  queryKey,
}: WorkflowModulePageProps) {
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
