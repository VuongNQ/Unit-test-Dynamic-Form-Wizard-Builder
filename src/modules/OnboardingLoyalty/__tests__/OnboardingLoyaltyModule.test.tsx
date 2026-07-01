import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { I18nextProvider } from 'react-i18next'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it } from 'vitest'

import { App } from '@/App'
import i18n, { getWizardConfig, getLoyaltyWizardConfig } from '@/i18n/i18n'
import { wizardConfigSchema } from '@/modules/FormWizard/schemas/wizardConfig'

const parsedOnboardingConfig = wizardConfigSchema.parse(getWizardConfig())
const parsedLoyaltyConfig = wizardConfigSchema.parse(getLoyaltyWizardConfig())

function renderRoute(initialEntry: string) {
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

describe('OnboardingLoyalty module', () => {
  it('renders loyalty route with 7-step wizard config', async () => {
    expect(parsedLoyaltyConfig.steps.length).toBe(7)

    renderRoute('/loyalty')

    expect(await screen.findByRole('heading', { name: 'Loyalty' })).toBeInTheDocument()
    expect(screen.getByText(/What is your primary objective/i)).toBeInTheDocument()
  })

  it('redirects unknown routes to onboarding module', async () => {
    renderRoute('/unknown')

    expect(await screen.findByRole('heading', { name: 'Onboarding' })).toBeInTheDocument()
  })

  describe('Loyalty wizard full flow', () => {
    it('Scenario A: Happy path through all 7 loyalty steps with state preservation', async () => {
      expect(parsedLoyaltyConfig.steps.length).toBe(7)

      const user = userEvent.setup()
      renderRoute('/loyalty')

      // Step 1: Select primary objective (CLV)
      expect(await screen.findByText(/What is your primary objective/i)).toBeInTheDocument()
      const clvRadio = screen.getByRole('radio', {
        name: /Increase Customer Lifetime Value/i,
      })
      await user.click(clvRadio)

      // Navigate to Step 2
      await user.click(screen.getByRole('button', { name: 'Next' }))
      expect(screen.getByText(/What industry does your store belong to/i)).toBeInTheDocument()

      // Step 2: Select industry (Apparel & Fashion)
      const apparelRadio = screen.getByRole('radio', {
        name: /Apparel & Fashion/i,
      })
      await user.click(apparelRadio)

      // Navigate to Step 3
      await user.click(screen.getByRole('button', { name: 'Next' }))
      expect(screen.getByText(/Where are your target customers primarily located/i)).toBeInTheDocument()

      // Step 3: Select region (EMEA)
      const emearadio = screen.getByRole('radio', {
        name: /Europe, Middle East, Africa and North America/i,
      })
      await user.click(emearadio)

      // Navigate to Step 4
      await user.click(screen.getByRole('button', { name: 'Next' }))
      expect(screen.getByText(/What is your store's current monthly revenue/i)).toBeInTheDocument()

      // Step 4: Select revenue (Under $10K)
      const revenueRadio = screen.getByRole('radio', {
        name: /Under \$10,000/i,
      })
      await user.click(revenueRadio)

      // Navigate to Step 5
      await user.click(screen.getByRole('button', { name: 'Next' }))
      expect(screen.getByText(/What percentage of revenue will you allocate/i)).toBeInTheDocument()

      // Step 5: Select budget (2%)
      const budgetRadio = screen.getByRole('radio', {
        name: /^2%$/,
      })
      await user.click(budgetRadio)

      // Navigate to Step 6
      await user.click(screen.getByRole('button', { name: 'Next' }))
      expect(screen.getByText(/Recommended Earning Rules/i)).toBeInTheDocument()

      // Step 6: Verify pre-checked earning rules and redemption options
      // Pre-checked: earningRule_happyBirthday, earningRule_reviewProduct, all redemptions
      const happyBirthdayCheckbox = screen.getByRole('checkbox', {
        name: /Happy birthday/i,
      }) as HTMLInputElement
      expect(happyBirthdayCheckbox.checked).toBe(true)

      const reviewProductCheckbox = screen.getByRole('checkbox', {
        name: /Review product/i,
      }) as HTMLInputElement
      expect(reviewProductCheckbox.checked).toBe(true)

      const discountCheckbox = screen.getByRole('checkbox', {
        name: /10% off voucher/i,
      }) as HTMLInputElement
      expect(discountCheckbox.checked).toBe(true)

      const shippingCheckbox = screen.getByRole('checkbox', {
        name: /Free shipping/i,
      }) as HTMLInputElement
      expect(shippingCheckbox.checked).toBe(true)

      const productCheckbox = screen.getByRole('checkbox', {
        name: /Free product/i,
      }) as HTMLInputElement
      expect(productCheckbox.checked).toBe(true)

      // Navigate to Step 7
      await user.click(screen.getByRole('button', { name: 'Next' }))
      expect(await screen.findByText(/Suggested plan for you/i)).toBeInTheDocument()

      // Final button should be "Submit"
      expect(screen.getByRole('button', { name: 'Submit' })).toBeInTheDocument()
    })

    it('Scenario C: Back navigation preserves selected state across steps', async () => {
      const user = userEvent.setup()
      renderRoute('/loyalty')

      // Step 1: Select CLV
      const clvRadio = await screen.findByRole('radio', {
        name: /Increase Customer Lifetime Value/i,
      })
      await user.click(clvRadio)
      expect((clvRadio as HTMLInputElement).checked).toBe(true)

      // Step 2
      await user.click(screen.getByRole('button', { name: 'Next' }))
      const apparelRadio = await screen.findByRole('radio', {
        name: /Apparel & Fashion/i,
      })
      await user.click(apparelRadio)

      // Step 3
      await user.click(screen.getByRole('button', { name: 'Next' }))
      const emearadio = await screen.findByRole('radio', {
        name: /Europe, Middle East, Africa and North America/i,
      })
      await user.click(emearadio)

      // Back to Step 2
      await user.click(screen.getByRole('button', { name: 'Back' }))
      expect(screen.getByText(/What industry does your store belong to/i)).toBeInTheDocument()

      // Verify Apparel is still selected
      expect((apparelRadio as HTMLInputElement).checked).toBe(true)

      // Back to Step 1
      await user.click(screen.getByRole('button', { name: 'Back' }))
      expect(screen.getByText(/What is your primary objective/i)).toBeInTheDocument()

      // Verify CLV is still selected
      expect((clvRadio as HTMLInputElement).checked).toBe(true)
    })

    it('Scenario D: Back button disabled on first step', async () => {
      renderRoute('/loyalty')

      expect(await screen.findByRole('heading', { name: 'Loyalty' })).toBeInTheDocument()

      const backButton = screen.getByRole('button', { name: 'Back' })
      expect(backButton).toBeDisabled()
    })

    it('Scenario E: Onboarding route unaffected - still shows 3-step config', async () => {
      expect(parsedOnboardingConfig.steps.length).toBe(3)

      renderRoute('/onboarding')

      // Onboarding should show Company Setup (first of 3 steps)
      expect(await screen.findByRole('heading', { name: 'Onboarding' })).toBeInTheDocument()
      expect(screen.getByText(/Company Setup/i)).toBeInTheDocument()
      expect(screen.getByLabelText(/Account Type/i)).toBeInTheDocument()
      expect(screen.getByLabelText(/Company Name/i)).toBeInTheDocument()
    })

    it('Scenario F: Route separation - loyalty and onboarding configs are independent', async () => {
      const user = userEvent.setup()

      // First: render loyalty, fill in step 1
      const { unmount: unmountLoyalty } = renderRoute('/loyalty')

      const clvRadio = await screen.findByRole('radio', {
        name: /Increase Customer Lifetime Value/i,
      })
      await user.click(clvRadio)
      expect((clvRadio as HTMLInputElement).checked).toBe(true)

      unmountLoyalty()

      // Then: render onboarding - should start fresh
      renderRoute('/onboarding')

      expect(await screen.findByRole('heading', { name: 'Onboarding' })).toBeInTheDocument()

      const selectEl = screen.getByLabelText(/Account Type/i) as HTMLSelectElement
      expect(selectEl.value).toBe('Personal') // default value
    })
  })
})
