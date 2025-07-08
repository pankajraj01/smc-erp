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
import { FileSignature, FileText } from 'lucide-react'
import { getNeftPdf, updateNeftStatus } from '../../api/nefts.api'

export default function NeftTable({ nefts, refreshNefts }) {
  const navigate = useNavigate()
  const statusCycle = ['Pending', 'Partial', 'Paid', 'Cancelled']

  const handleViewNeftPdf = async (neftId) => {
    try {
      const response = await getNeftPdf(neftId) // returns blob
      const file = new Blob([response.data], { type: 'application/pdf' })
      const fileURL = URL.createObjectURL(file)
      window.open(fileURL, '_blank') // View in new tab
    } catch (err) {
      console.error('PDF View Error:', err)
      alert('Failed to open PDF')
    }
  }

  const handleNeftStatusToggle = async (neftId, currentStatus) => {
    const nextStatus = statusCycle[(statusCycle.indexOf(currentStatus) + 1) % statusCycle.length]

    try {
      await updateNeftStatus(neftId, nextStatus)
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
          <CTableHeaderCell>Party Count</CTableHeaderCell>
          <CTableHeaderCell>Total Amount</CTableHeaderCell>
          <CTableHeaderCell>Status</CTableHeaderCell>
          <CTableHeaderCell>PDF</CTableHeaderCell>
        </CTableRow>
      </CTableHead>
      <CTableBody>
        {nefts.length > 0 ? (
          nefts.map((neft) => (
            <CTableRow key={neft.neftNo}>
              <CTableDataCell>
                <CButton
                  color="secondary"
                  variant="outline"
                  onClick={() => navigate(`/neft-manager/${neft._id}`)}
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
              <CTableDataCell className="">
                <CButton
                  size="sm"
                  color="light"
                  className="border border-info text-info"
                  onClick={() => handleViewNeftPdf(neft._id)}
                  title="Download NEFT PDF"
                >
                  <FileText size={16} />
                  {/* <span className="fw-medium ms-1">PDF</span> */}
                </CButton>
              </CTableDataCell>
            </CTableRow>
          ))
        ) : (
          <CTableRow>
            <CTableDataCell colSpan={6} className="text-center text-muted">
              No Nefts found.
            </CTableDataCell>
          </CTableRow>
        )}
      </CTableBody>
    </CTable>
  )
}
