import type { FieldPath, UseFormRegister } from 'react-hook-form'

import styles from './FormControl.module.scss'
import type { WizardFormValues } from '@/modules/FormWizard/schemas/formSchema'

type CheckboxInputProps = {
  id: string
  label: string
  name: FieldPath<WizardFormValues>
  register: UseFormRegister<WizardFormValues>
  error?: string
}

export function CheckboxInput({
  id,
  label,
  name,
  register,
  error,
}: CheckboxInputProps) {
  return (
    <div className={styles.control}>
      <div className={styles.checkboxRow}>
        <input id={id} type="checkbox" className={styles.checkbox} {...register(name)} />
        <label className={styles.label} htmlFor={id}>
          {label}
        </label>
      </div>
      {error ? <span className={styles.error}>{error}</span> : null}
    </div>
  )
}
