import { useQuery } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'

import { FormWizard } from './components/FormWizard'
import { getWizardConfig } from './i18n/i18n'
import { wizardConfigSchema } from './schemas/wizardConfig'

async function fetchWizardConfig() {
  return wizardConfigSchema.parse(getWizardConfig())
}

function App() {
  const { t } = useTranslation()

  const { data, isLoading, error } = useQuery({
    queryKey: ['wizard-config'],
    queryFn: fetchWizardConfig,
    staleTime: Number.POSITIVE_INFINITY,
  })

  if (isLoading) {
    return <p>{t('app.loadingConfig')}</p>
  }

  if (error || !data) {
    return <p>{t('app.loadError')}</p>
  }

  return <FormWizard config={data} />
}

export default App
