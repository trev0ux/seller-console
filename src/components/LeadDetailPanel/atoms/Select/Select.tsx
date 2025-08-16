import type { SelectProps } from './Select.types'

export default function Select({
  value,
  onChange,
  options,
  placeholder = 'Select an option...',
  disabled = false,
  className = '',
  error = false,
  'aria-label': ariaLabel,
}: SelectProps) {
  const baseClasses = `
    w-full px-3 py-2 border rounded-md 
    focus:outline-none focus:ring-2 focus:ring-blue-500 
    transition-colors duration-200
    disabled:bg-gray-50 disabled:text-gray-400 disabled:cursor-not-allowed
  `

  const borderClasses = error
    ? 'border-red-300 focus:border-red-500'
    : 'border-gray-300 focus:border-blue-500'

  return (
    <select
      value={value}
      onChange={e => onChange(e.target.value)}
      disabled={disabled}
      aria-label={ariaLabel}
      className={`${baseClasses} ${borderClasses} ${className}`.trim()}
    >
      {placeholder && (
        <option value="" disabled>
          {placeholder}
        </option>
      )}
      {options.map(option => (
        <option key={option.value} value={option.value} disabled={option.disabled}>
          {option.label}
        </option>
      ))}
    </select>
  )
}
