import type { FieldPath, UseFormRegister } from 'react-hook-form'

import styles from './FormControl.module.scss'
import type { WizardFormValues } from '@/modules/FormWizard/schemas/formSchema'

type RadioOption = {
  label: string
  value: string
}

type RadioInputProps = {
  id: string
  label: string
  name: FieldPath<WizardFormValues>
  options: RadioOption[]
  register: UseFormRegister<WizardFormValues>
  error?: string
}

export function RadioInput({
  id,
  label,
  name,
  options,
  register,
  error,
}: RadioInputProps) {
  return (
    <div className={styles.control}>
      <fieldset className={styles.fieldset}>
        <legend className={styles.legend}>{label}</legend>
        <div className={styles.radioGroup}>
          {options.map((option) => (
            <div key={option.value} className={styles.radioRow}>
              <input
                id={`${id}-${option.value}`}
                type="radio"
                className={styles.radio}
                value={option.value}
                {...register(name)}
              />
              <label className={styles.label} htmlFor={`${id}-${option.value}`}>
                {option.label}
              </label>
            </div>
          ))}
        </div>
      </fieldset>
      {error ? <span className={styles.error}>{error}</span> : null}
    </div>
  )
}
