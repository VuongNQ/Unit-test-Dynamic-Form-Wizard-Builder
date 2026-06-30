import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { I18nextProvider } from 'react-i18next'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it } from 'vitest'

import { App } from '../../App'
import i18n from '../../i18n/i18n'

function renderLoyaltyRoute(initialEntry: string) {
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
        <MemoryRouter initialEntries={[initialEntry]}>
          <App />
        </MemoryRouter>
      </QueryClientProvider>
    </I18nextProvider>,
  )
}

describe('Loyalty workflow module', () => {
  it('renders loyalty route and keeps wizard validation active', async () => {
    const user = userEvent.setup()
    renderLoyaltyRoute('/loyalty')

    expect(await screen.findByRole('heading', { name: 'Loyalty' })).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Next' }))
    expect(await screen.findByText('Company name is required')).toBeInTheDocument()
  })

  it('redirects unknown routes to onboarding module', async () => {
    renderLoyaltyRoute('/unknown')

    expect(await screen.findByRole('heading', { name: 'Onboarding' })).toBeInTheDocument()
  })
})
