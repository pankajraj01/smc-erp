import { CBadge } from '@coreui/react'
import { CheckCircle, XCircle, Clock } from 'lucide-react'

export default function StatusBadgeCycle({ status, onChange }) {
  const statuses = ['PENDING', 'COMPLETED', 'CANCELLED']

  const getBadgeStyle = (value) => {
    switch (value) {
      case 'COMPLETED':
        return {
          text: 'Completed',
          color: 'bg-success text-white',
          icon: <CheckCircle size={14} />,
        }
      case 'CANCELLED':
        return { text: 'Cancelled', color: 'bg-danger text-white', icon: <XCircle size={14} /> }
      default:
        return { text: 'Pending', color: 'bg-warning text-dark', icon: <Clock size={14} /> }
    }
  }

  const handleClick = () => {
    const index = statuses.indexOf(status)
    const nextStatus = statuses[(index + 1) % statuses.length]
    onChange(nextStatus)
  }

  const { text, color, icon } = getBadgeStyle(status)

  return (
    <CBadge
      className={`d-inline-flex align-items-center gap-1 px-3 py-1 rounded-pill fw-semibold ${color} cursor-pointer`}
      onClick={handleClick}
      role="button"
    >
      {icon} {text}
    </CBadge>
  )
}
