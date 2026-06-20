import { useMemo, useState } from 'react'

import type { WizardStepConfig } from '../schemas/wizardConfig'

export function useFormWizard(steps: WizardStepConfig[]) {
  const [currentStepIndex, setCurrentStepIndex] = useState(0)

  const safeIndex = steps.length === 0 ? 0 : Math.min(currentStepIndex, steps.length - 1)

  const currentStep = steps[safeIndex]

  const stepState = useMemo(
    () => ({
      currentStep,
      currentStepIndex: safeIndex,
      totalSteps: steps.length,
      isFirstStep: safeIndex === 0,
      isLastStep: safeIndex === steps.length - 1,
    }),
    [currentStep, safeIndex, steps.length],
  )

  return {
    ...stepState,
    goBack: () => setCurrentStepIndex((index) => Math.max(index - 1, 0)),
    goNext: () =>
      setCurrentStepIndex((index) => Math.min(index + 1, Math.max(steps.length - 1, 0))),
  }
}
