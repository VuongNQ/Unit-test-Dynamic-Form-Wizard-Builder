import { useMemo, useState } from 'react'
import { useForm, useWatch } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

import { useFormWizard } from '../hooks/useFormWizard'
import { wizardFormSchema, type WizardFormValues } from '../schemas/formSchema'
import type {
  FieldCondition,
  WizardConfig,
  WizardFieldConfig,
} from '../schemas/wizardConfig'
import { CheckboxInput } from './form-controls/CheckboxInput'
import { SelectInput } from './form-controls/SelectInput'
import { TextInput } from './form-controls/TextInput'
import styles from './FormWizard.module.scss'

type FormWizardProps = {
  config: WizardConfig
}

function isConditionMet(
  condition: FieldCondition | undefined,
  values: WizardFormValues,
): boolean {
  if (!condition) {
    return true
  }

  return values[condition.field as keyof WizardFormValues] === condition.equals
}

function getErrorMessage(error: unknown): string | undefined {
  if (!error || typeof error !== 'object' || !('message' in error)) {
    return undefined
  }

  return typeof error.message === 'string' ? error.message : undefined
}

function renderField(
  field: WizardFieldConfig,
  values: WizardFormValues,
  register: ReturnType<typeof useForm<WizardFormValues>>['register'],
  errors: ReturnType<typeof useForm<WizardFormValues>>['formState']['errors'],
) {
  if (!isConditionMet(field.condition, values)) {
    return null
  }

  const fieldName = field.name as keyof WizardFormValues
  const errorMessage = getErrorMessage(errors[fieldName])

  if (field.type === 'text' || field.type === 'date') {
    return (
      <TextInput
        key={field.name}
        id={field.name}
        name={field.name as keyof WizardFormValues}
        label={field.label}
        type={field.type}
        placeholder={field.placeholder}
        register={register}
        error={errorMessage}
      />
    )
  }

  if (field.type === 'select') {
    return (
      <SelectInput
        key={field.name}
        id={field.name}
        name={field.name as keyof WizardFormValues}
        label={field.label}
        placeholder={field.placeholder}
        options={field.options}
        register={register}
        error={errorMessage}
      />
    )
  }

  return (
    <CheckboxInput
      key={field.name}
      id={field.name}
      name={field.name as keyof WizardFormValues}
      label={field.label}
      register={register}
      error={errorMessage}
    />
  )
}

export function FormWizard({ config }: FormWizardProps) {
  const [submittedValues, setSubmittedValues] = useState<
    WizardFormValues | undefined
  >()

  const {
    register,
    control,
    trigger,
    getValues,
    handleSubmit,
    formState: { errors },
  } = useForm<WizardFormValues>({
    resolver: zodResolver(wizardFormSchema),
    shouldUnregister: false,
    defaultValues: {
      accountType: 'Personal',
      companyName: '',
      taxId: '',
      startDate: '',
      endDate: '',
      acceptTerms: false,
    },
  })

  const values = useWatch({ control }) as WizardFormValues

  const visibleSteps = useMemo(
    () => config.steps.filter((step) => isConditionMet(step.condition, values)),
    [config.steps, values],
  )

  const { currentStep, currentStepIndex, totalSteps, isFirstStep, isLastStep, goBack, goNext } =
    useFormWizard(visibleSteps)

  const onSubmit = handleSubmit((data) => {
    setSubmittedValues(data)
  })

  if (!currentStep) {
    return null
  }

  const onNextClick = async () => {
    const visibleFields = currentStep.fields
      .filter((field) => isConditionMet(field.condition, getValues()))
      .map((field) => field.name as keyof WizardFormValues)

    const isValid = await trigger(visibleFields)
    if (!isValid) {
      return
    }

    if (isLastStep) {
      await onSubmit()
      return
    }

    goNext()
  }

  return (
    <form className={styles.wizard} noValidate>
      <header className={styles.header}>
        <p className={styles.progress}>
          Step {currentStepIndex + 1} of {totalSteps}
        </p>
        <h1 className={styles.title}>{currentStep.title}</h1>
      </header>

      <section className={styles.fields}>
        {currentStep.fields.map((field) =>
          renderField(field, values, register, errors),
        )}
      </section>

      <div className={styles.actions}>
        <button
          type="button"
          className={styles.button}
          onClick={goBack}
          disabled={isFirstStep}
        >
          Back
        </button>
        <button
          type="button"
          className={`${styles.button} ${styles.nextButton}`}
          onClick={onNextClick}
        >
          {isLastStep ? 'Submit' : 'Next'}
        </button>
      </div>

      {submittedValues ? (
        <pre className={styles.summary} data-testid="submitted-values">
          {JSON.stringify(submittedValues, null, 2)}
        </pre>
      ) : null}
    </form>
  )
}
