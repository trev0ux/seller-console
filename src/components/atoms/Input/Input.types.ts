export interface InputProps {
  type?: 'text' | 'email' | 'number' | 'password' | 'search' | 'tel' | 'url'
  placeholder?: string
  value: string
  onChange: (value: string) => void
  onBlur?: () => void
  onFocus?: () => void
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void
  error?: string
  disabled?: boolean
  required?: boolean
  autoFocus?: boolean
  size?: 'sm' | 'md' | 'lg'
  variant?: 'default' | 'filled'
  className?: string
  id?: string
  name?: string
  min?: number
  max?: number
  step?: number
  maxLength?: number
  readOnly?: boolean
}
