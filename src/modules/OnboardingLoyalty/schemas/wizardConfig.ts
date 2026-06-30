import type { WizardConfig } from '@/modules/FormWizard/schemas/wizardConfig'
import { wizardConfigSchema } from '@/modules/FormWizard/schemas/wizardConfig'

import { getWizardConfig } from '@/i18n/i18n'

export function getValidatedWizardConfig(): WizardConfig {
  return wizardConfigSchema.parse(getWizardConfig())
}
