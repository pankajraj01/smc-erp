import {
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
  CBadge,
  CButton,
} from '@coreui/react'
import formatDate from '../../utils/formatDate'
import { useNavigate } from 'react-router-dom'

export default function NeftTable({ nefts, refreshNefts }) {
  const navigate = useNavigate()
  const statusCycle = ['Pending', 'Paid', 'Partial', 'Cancelled']

  const handleNeftStatusToggle = async (neftId, currentStatus) => {
    const nextStatus = statusCycle[(statusCycle.indexOf(currentStatus) + 1) % statusCycle.length]

    try {
      const res = await fetch(`http://localhost:5000/api/neft-request/${neftId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: nextStatus }),
      })

      if (!res.ok) {
        throw new Error('Failed to update status')
      }

      refreshNefts?.()
    } catch (err) {
      console.error('❌ Status update error:', err)
      alert('Something went wrong while updating NEFT status.')
    }
  }

  return (
    <CTable responsive bordered hover align="middle" className="text-center">
      <CTableHead color="light">
        <CTableRow>
          <CTableHeaderCell>Neft No</CTableHeaderCell>
          <CTableHeaderCell>Date</CTableHeaderCell>
          <CTableHeaderCell>Neft Count</CTableHeaderCell>
          <CTableHeaderCell>Total Amount</CTableHeaderCell>
          <CTableHeaderCell>Status</CTableHeaderCell>
          <CTableHeaderCell>SMC PDF</CTableHeaderCell>
          <CTableHeaderCell>Pali PDF</CTableHeaderCell>
        </CTableRow>
      </CTableHead>
      <CTableBody>
        {nefts.map((neft) => (
          <CTableRow key={neft.neftNo}>
            <CTableDataCell>
              <CButton
                color="secondary"
                variant="outline"
                onClick={() => navigate(`/api/neft-manager/${neft._id}`)}
              >
                {neft.neftNo}
              </CButton>
            </CTableDataCell>
            <CTableDataCell>{formatDate(neft.neftDate)}</CTableDataCell>
            <CTableDataCell>{neft.parties?.length}</CTableDataCell>
            <CTableDataCell>
              ₹ {neft.neftAmount ? neft.neftAmount.toLocaleString() : '0'}
            </CTableDataCell>
            <CTableDataCell>
              <CBadge
                color={
                  neft.neftStatus === 'Paid'
                    ? 'success'
                    : neft.neftStatus === 'Partial'
                      ? 'info'
                      : neft.neftStatus === 'Cancelled'
                        ? 'secondary'
                        : 'warning'
                }
                className="px-3 py-1 cursor-pointer"
                onClick={() => handleNeftStatusToggle(neft._id, neft.neftStatus)}
                title="Click to change NEFT status"
              >
                {neft.neftStatus}
              </CBadge>
            </CTableDataCell>
            <CTableDataCell>
              <CButton size="sm" color="info">
                SMC PDF
              </CButton>
            </CTableDataCell>
            <CTableDataCell>
              <CButton size="sm" color="warning">
                PALI PDF
              </CButton>
            </CTableDataCell>
          </CTableRow>
        ))}
      </CTableBody>
    </CTable>
  )
}
