import React, { forwardRef } from 'react'
import type { InputProps } from './Input.types'

const sizes = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-3 py-2 text-sm',
  lg: 'px-4 py-3 text-base',
}

const variants = {
  default: 'border-gray-300 bg-white focus:border-blue-500 focus:ring-blue-500',
  filled: 'border-gray-200 bg-gray-50 focus:border-blue-500 focus:ring-blue-500 focus:bg-white',
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      type = 'text',
      placeholder,
      value,
      onChange,
      onKeyDown,
      error,
      disabled = false,
      required = false,
      autoFocus = false,
      size = 'md',
      variant = 'default',
      className = '',
      id,
      name,
      readOnly = false,
    },
    ref
  ) => {
    const baseClasses =
      'w-full border rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-offset-0 disabled:opacity-50 disabled:cursor-not-allowed'

    const errorClasses = error
      ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
      : variants[variant]

    const classes = `${baseClasses} ${sizes[size]} ${errorClasses} ${className}`

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      onChange(e.target.value)
    }

    return (
      <div className="w-full">
        <input
          ref={ref}
          type={type}
          id={id}
          name={name}
          placeholder={placeholder}
          value={value}
          onChange={handleChange}
          onKeyDown={onKeyDown}
          disabled={disabled}
          required={required}
          autoFocus={autoFocus}
          className={classes}
          readOnly={readOnly}
        />

        {error && (
          <p id={`${id}-error`} className="mt-1 text-sm text-red-600">
            {error}
          </p>
        )}
      </div>
    )
  }
)

Input.displayName = 'Input'

export default Input
