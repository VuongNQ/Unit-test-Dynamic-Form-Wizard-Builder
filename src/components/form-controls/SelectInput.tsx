import type { FieldPath, UseFormRegister } from 'react-hook-form'

import styles from './FormControl.module.scss'
import type { WizardFormValues } from '../../schemas/formSchema'

type SelectInputProps = {
  id: string
  label: string
  name: FieldPath<WizardFormValues>
  placeholder?: string
  options: Array<{ label: string; value: string }>
  register: UseFormRegister<WizardFormValues>
  error?: string
}

export function SelectInput({
  id,
  label,
  name,
  options,
  placeholder,
  register,
  error,
}: SelectInputProps) {
  return (
    <div className={styles.control}>
      <label className={styles.label} htmlFor={id}>
        {label}
      </label>
      <select id={id} className={styles.select} defaultValue="" {...register(name)}>
        <option value="" disabled>
          {placeholder ?? 'Select an option'}
        </option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error ? <span className={styles.error}>{error}</span> : null}
    </div>
  )
}
