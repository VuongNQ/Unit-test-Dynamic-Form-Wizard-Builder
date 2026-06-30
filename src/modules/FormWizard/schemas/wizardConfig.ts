import { z } from 'zod'

const conditionSchema = z.object({
  field: z.string().min(1),
  equals: z.union([z.string(), z.boolean()]),
})

const baseFieldSchema = z.object({
  name: z.string().min(1),
  label: z.string().min(1),
  condition: conditionSchema.optional(),
})

const textFieldSchema = baseFieldSchema.extend({
  type: z.enum(['text', 'date']),
  placeholder: z.string().optional(),
})

const selectFieldSchema = baseFieldSchema.extend({
  type: z.literal('select'),
  placeholder: z.string().optional(),
  options: z.array(z.object({ label: z.string(), value: z.string() })).min(1),
})

const checkboxFieldSchema = baseFieldSchema.extend({
  type: z.literal('checkbox'),
})

export const fieldSchema = z.discriminatedUnion('type', [
  textFieldSchema,
  selectFieldSchema,
  checkboxFieldSchema,
])

export const wizardStepSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1),
  fields: z.array(fieldSchema),
  condition: conditionSchema.optional(),
})

export const wizardConfigSchema = z.object({
  steps: z.array(wizardStepSchema).min(1),
})

export type FieldCondition = z.infer<typeof conditionSchema>
export type WizardFieldConfig = z.infer<typeof fieldSchema>
export type WizardStepConfig = z.infer<typeof wizardStepSchema>
export type WizardConfig = z.infer<typeof wizardConfigSchema>
