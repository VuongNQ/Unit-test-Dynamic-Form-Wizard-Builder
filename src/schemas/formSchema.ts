import { z } from 'zod'

import i18n from '../i18n/i18n'

const requiredDate = z.string().min(1, i18n.t('validation.dateRequired'))

export const wizardFormSchema = z
  .object({
    accountType: z.enum(['Personal', 'Enterprise'], {
      message: i18n.t('validation.accountTypeRequired'),
    }),
    companyName: z.string().min(1, i18n.t('validation.companyNameRequired')),
    taxId: z.string().optional(),
    startDate: requiredDate,
    endDate: requiredDate,
    acceptTerms: z.boolean().refine((value) => value, {
      message: i18n.t('validation.acceptTermsRequired'),
    }),
  })
  .refine(
    (values) =>
      values.accountType !== 'Enterprise' || Boolean(values.taxId?.trim()),
    {
      path: ['taxId'],
      message: i18n.t('validation.taxIdRequired'),
    },
  )
  .refine(
    (values) =>
      new Date(values.endDate).getTime() > new Date(values.startDate).getTime(),
    {
      path: ['endDate'],
      message: i18n.t('validation.endDateAfterStartDate'),
    },
  )

export type WizardFormValues = z.infer<typeof wizardFormSchema>
