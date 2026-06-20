import { z } from 'zod'

const requiredDate = z.string().min(1, 'Date is required')

export const wizardFormSchema = z
  .object({
    accountType: z.enum(['Personal', 'Enterprise'], {
      message: 'Account type is required',
    }),
    companyName: z.string().min(1, 'Company name is required'),
    taxId: z.string().optional(),
    startDate: requiredDate,
    endDate: requiredDate,
    acceptTerms: z.boolean().refine((value) => value, {
      message: 'You must accept the terms',
    }),
  })
  .refine(
    (values) =>
      values.accountType !== 'Enterprise' || Boolean(values.taxId?.trim()),
    {
      path: ['taxId'],
      message: 'Tax ID is required for enterprise accounts',
    },
  )
  .refine(
    (values) =>
      new Date(values.endDate).getTime() > new Date(values.startDate).getTime(),
    {
      path: ['endDate'],
      message: 'End Date must be after Start Date',
    },
  )

export type WizardFormValues = z.infer<typeof wizardFormSchema>
