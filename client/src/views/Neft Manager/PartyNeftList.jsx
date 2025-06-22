import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
  CCard,
  CCardHeader,
  CCardBody,
  CTable,
  CTableHead,
  CTableRow,
  CTableHeaderCell,
  CTableBody,
  CTableDataCell,
  CBadge,
  CButton,
} from '@coreui/react'
import formatDate from '../../utils/formatDate'

export default function PartyNeftList() {
  const { partyId } = useParams()
  const navigate = useNavigate()

  const [partyNefts, setPartyNefts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchPartyNefts = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/neft-request/party/${partyId}`)
        const data = await res.json()
        setPartyNefts(data.partyNefts || [])
      } catch (err) {
        console.error('Failed to fetch party NEFTs', err)
      } finally {
        setLoading(false)
      }
    }

    fetchPartyNefts()
  }, [partyId])

  return (
    <CCard className="shadow-sm">
      <CCardHeader className="bg-info text-white">
        <h5 className="mb-0">📄 NEFTs for Selected Party</h5>
      </CCardHeader>
      <CCardBody>
        {loading ? (
          <p>⏳ Loading...</p>
        ) : partyNefts.length === 0 ? (
          <p>No NEFTs found for this party.</p>
        ) : (
          <CTable responsive bordered hover align="middle" className="text-center shadow-sm">
            <CTableHead color="light">
              <CTableRow>
                <CTableHeaderCell>Sr.</CTableHeaderCell>
                <CTableHeaderCell>NEFT No</CTableHeaderCell>
                <CTableHeaderCell>Date</CTableHeaderCell>
                <CTableHeaderCell>Status</CTableHeaderCell>
                <CTableHeaderCell>Amount</CTableHeaderCell>
                <CTableHeaderCell>View</CTableHeaderCell>
              </CTableRow>
            </CTableHead>
            <CTableBody>
              {partyNefts.map((neft, idx) => (
                <CTableRow key={neft.neftId}>
                  <CTableDataCell>{idx + 1}</CTableDataCell>
                  <CTableDataCell>#{neft.neftNo}</CTableDataCell>
                  <CTableDataCell>{formatDate(neft.neftDate)}</CTableDataCell>
                  <CTableDataCell>
                    <CBadge
                      color={
                        neft.partyNeftStatus === 'Paid'
                          ? 'success'
                          : neft.partyNeftStatus === 'Partial'
                            ? 'info'
                            : neft.partyNeftStatus === 'Cancelled'
                              ? 'secondary'
                              : 'warning'
                      }
                    >
                      {neft.partyNeftStatus}
                    </CBadge>
                  </CTableDataCell>
                  <CTableDataCell>₹ {neft.totalPartyNeftAmount}</CTableDataCell>
                  <CTableDataCell>
                    <CButton
                      size="sm"
                      color="dark"
                      onClick={() =>
                        navigate(`/api/neft-manager/create/${neft.neftId}/party/${partyId}`)
                      }
                    >
                      View
                    </CButton>
                  </CTableDataCell>
                </CTableRow>
              ))}
            </CTableBody>
          </CTable>
        )}
      </CCardBody>
    </CCard>
  )
}
