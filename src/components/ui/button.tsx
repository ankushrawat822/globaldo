import * as React from 'react'
import { cn } from '@/lib/utils'

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'secondary' | 'ghost' | 'danger'
  size?: 'default' | 'sm' | 'lg'
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'default', size = 'default', ...props }, ref) => {
    const variantClasses = {
      default: 'btn-primary',
      secondary: 'btn-secondary',
      ghost: 'bg-transparent text-ink hover:bg-stone/50 border-transparent',
      danger: 'btn-danger',
    }

    const sizeClasses = {
      default: '',
      sm: 'btn-sm',
      lg: 'btn-lg',
    }

    return (
      <button
        className={cn('btn', variantClasses[variant], sizeClasses[size], className)}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = 'Button'

export { Button }