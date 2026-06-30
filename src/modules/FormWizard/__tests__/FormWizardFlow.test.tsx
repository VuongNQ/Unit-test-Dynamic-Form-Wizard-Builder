import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { I18nextProvider } from 'react-i18next'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it } from 'vitest'

import { App } from '@/App'
import i18n, { getWizardConfig } from '@/i18n/i18n'
import { wizardConfigSchema } from '@/modules/FormWizard/schemas/wizardConfig'

const parsedConfig = wizardConfigSchema.parse(getWizardConfig())

function renderOnboardingRoute() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  })

  return render(
    <I18nextProvider i18n={i18n}>
      <QueryClientProvider client={queryClient}>
        <MemoryRouter initialEntries={['/onboarding']}>
          <App />
        </MemoryRouter>
      </QueryClientProvider>
    </I18nextProvider>,
  )
}

describe('FormWizard module', () => {
  it('handles transitions, validation, conditional rendering, and preserved state', async () => {
    expect(parsedConfig.steps.length).toBeGreaterThan(0)

    const user = userEvent.setup()
    renderOnboardingRoute()

    expect(await screen.findByRole('heading', { name: 'Onboarding' })).toBeInTheDocument()

    const nextButton = screen.getByRole('button', { name: 'Next' })
    expect(nextButton).toHaveClass('nextButton')

    await user.click(nextButton)
    expect(await screen.findByText('Company name is required')).toBeInTheDocument()

    await user.selectOptions(screen.getByLabelText('Account Type'), 'Enterprise')
    await user.type(screen.getByLabelText('Company Name'), 'Acme Corporation')
    await user.click(nextButton)

    expect(screen.getByText('Business Details')).toBeInTheDocument()
    expect(screen.getByLabelText('Tax ID')).toBeInTheDocument()

    await user.type(screen.getByLabelText('Tax ID'), 'TAX-001')
    await user.type(screen.getByLabelText('Start Date'), '2026-07-10')
    await user.type(screen.getByLabelText('End Date'), '2026-07-08')
    await user.click(nextButton)

    expect(await screen.findByText('End Date must be after Start Date')).toBeInTheDocument()

    await user.clear(screen.getByLabelText('End Date'))
    await user.type(screen.getByLabelText('End Date'), '2026-07-12')

    await user.click(screen.getByRole('button', { name: 'Back' }))

    expect(screen.getByText('Company Setup')).toBeInTheDocument()
    expect(screen.getByLabelText('Company Name')).toHaveValue('Acme Corporation')

    await user.click(nextButton)
    expect(screen.getByLabelText('Tax ID')).toHaveValue('TAX-001')
  })
})
