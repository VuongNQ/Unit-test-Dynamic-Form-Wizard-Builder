import type { FieldPath, UseFormRegister } from 'react-hook-form'

import styles from './FormControl.module.css'
import type { WizardFormValues } from '../../schemas/formSchema'

type TextInputProps = {
  id: string
  label: string
  name: FieldPath<WizardFormValues>
  type?: 'text' | 'date'
  placeholder?: string
  register: UseFormRegister<WizardFormValues>
  error?: string
}

export function TextInput({
  id,
  label,
  name,
  type = 'text',
  placeholder,
  register,
  error,
}: TextInputProps) {
  return (
    <div className={styles.control}>
      <label className={styles.label} htmlFor={id}>
        {label}
      </label>
      <input
        id={id}
        className={styles.input}
        type={type}
        placeholder={placeholder}
        {...register(name)}
      />
      {error ? <span className={styles.error}>{error}</span> : null}
    </div>
  )
}
