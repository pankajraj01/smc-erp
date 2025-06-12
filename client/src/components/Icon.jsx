import * as LucideIcons from 'lucide-react'

/**
 * Icon Wrapper
 * Props:
 * - name: string → Lucide icon name
 *   Examples:
 *     'User', 'UserPlus', 'Edit', 'Trash2', 'Search', 'Filter',
 *     'Save', 'Package', 'Banknote', 'ChevronDown', 'Settings'
 *
 * - size: number → Icon size in px
 *   Examples:
 *     16, 18, 20, 24, 28, 32, 40, 48, 56, 64
 *
 * - color: string → Icon color (CSS or HEX)
 *   Examples:
 *     'red', 'green', 'blue', 'orange', 'black', 'white',
 *     'gray', 'purple', 'yellow', 'currentColor',
 *     '#1e293b' (slate-800), '#0d6efd' (bootstrap-primary)
 *
 * - className: string → Extra CSS or Tailwind classes
 *   Examples:
 *     'me-2', 'ms-1 text-muted', 'cursor-pointer hover:scale-105',
 *     'text-danger', 'text-primary', 'd-block mx-auto mb-2',
 *     'opacity-75', 'rotate-45', 'shadow-sm'
 */

export default function Icon({ name, size = 20, color = 'currentColor', className = '' }) {
  const LucideIcon = LucideIcons[name]

  if (!LucideIcon) {
    console.warn(`Icon '${name}' not found in Lucide set.`)
    return null
  }

  return (
    <LucideIcon
      size={size}
      color={color}
      className={`align-middle ${className}`}
      style={{ lineHeight: 1 }}
    />
  )
}
