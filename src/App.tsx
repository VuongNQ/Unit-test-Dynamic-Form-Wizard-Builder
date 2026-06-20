import { useQuery } from '@tanstack/react-query'

import { FormWizard } from './components/FormWizard'
import { wizardConfigSchema } from './schemas/wizardConfig'

const formWizardConfig = {
  steps: [
    {
      id: 'company',
      title: 'Company Setup',
      fields: [
        {
          type: 'select',
          name: 'accountType',
          label: 'Account Type',
          placeholder: 'Select account type',
          options: [
            { label: 'Personal', value: 'Personal' },
            { label: 'Enterprise', value: 'Enterprise' },
          ],
        },
        {
          type: 'text',
          name: 'companyName',
          label: 'Company Name',
          placeholder: 'Acme Inc.',
        },
      ],
    },
    {
      id: 'details',
      title: 'Business Details',
      fields: [
        {
          type: 'text',
          name: 'taxId',
          label: 'Tax ID',
          placeholder: 'TAX-001',
          condition: {
            field: 'accountType',
            equals: 'Enterprise',
          },
        },
        {
          type: 'date',
          name: 'startDate',
          label: 'Start Date',
        },
        {
          type: 'date',
          name: 'endDate',
          label: 'End Date',
        },
      ],
    },
    {
      id: 'consent',
      title: 'Review & Consent',
      fields: [
        {
          type: 'checkbox',
          name: 'acceptTerms',
          label: 'I accept the terms and conditions',
        },
      ],
    },
  ],
}

async function fetchWizardConfig() {
  return wizardConfigSchema.parse(formWizardConfig)
}

function App() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['wizard-config'],
    queryFn: fetchWizardConfig,
    staleTime: Number.POSITIVE_INFINITY,
  })

  if (isLoading) {
    return <p>Loading form configuration...</p>
  }

  if (error || !data) {
    return <p>Unable to load form configuration.</p>
  }

  return <FormWizard config={data} />
}

export default App
