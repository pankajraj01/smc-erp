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
import { useState } from 'react'

const statusColor = {
  Pending: 'warning',
  Sent: 'info',
  Partial: 'primary',
  Paid: 'success',
  Cancelled: 'secondary',
}

export default function NeftTable({ nefts, onView }) {
  const [neftData, setNefts] = useState(nefts)
  const statusCycle = ['Pending', 'Paid', 'Partial', 'Cancelled']

  const getBadgeColor = (status) => {
    switch (status) {
      case 'Paid':
        return 'success'
      case 'Partial':
        return 'info'
      case 'Cancelled':
        return 'secondary'
      default:
        return 'warning'
    }
  }

  const handleNeftStatusClick = (neftNo) => {
    const updated = neftData.map((neft) => {
      if (neft.neftNo === neftNo) {
        const currentStatus = neft.neftStatus
        const nextStatus =
          statusCycle[(statusCycle.indexOf(currentStatus) + 1) % statusCycle.length]

        return { ...neft, neftStatus: nextStatus }
      }
      return neft
    })
    setNefts(updated)
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
          <CTableHeaderCell>Actions</CTableHeaderCell>
        </CTableRow>
      </CTableHead>
      <CTableBody>
        {neftData.map((neft) => (
          <CTableRow key={neft.neftNo}>
            <CTableDataCell>
              <CButton color="secondary" variant="outline" onClick={() => onView(neft.neftNo)}>
                {neft.neftNo}
              </CButton>
            </CTableDataCell>
            <CTableDataCell>{new Date(neft.neftDate).toLocaleDateString()}</CTableDataCell>
            <CTableDataCell>{neft.parties?.length}</CTableDataCell>
            <CTableDataCell>
              ₹ {neft.neftAmount ? neft.neftAmount.toLocaleString() : '0'}
            </CTableDataCell>
            <CTableDataCell>
              <CBadge
                color={getBadgeColor(neft.neftStatus)}
                className="px-3 py-1 cursor-pointer"
                onClick={() => handleNeftStatusClick(neft.neftNo)}
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
            <CTableDataCell>
              <CButton size="sm" color="danger" variant="outline">
                Cancel
              </CButton>
            </CTableDataCell>
          </CTableRow>
        ))}
      </CTableBody>
    </CTable>
  )
}
