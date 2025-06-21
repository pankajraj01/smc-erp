import {
  CBadge,
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CContainer,
  CFormInput,
  CRow,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilPencil, cilTrash } from '@coreui/icons'
import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import PaginationControls from '../../components/PaginationControls'
import formatDate from '../../utils/formatDate'
import ConfirmDeleteModal from './ConfirmDeleteModal'

export default function NeftPage({ isVisible, setIsVisible, selectedNeft }) {
  const ITEMS_PER_PAGE = 5
  const navigate = useNavigate()
  const { neftId } = useParams()
  const [currentPage, setCurrentPage] = useState(1)
  const [searchTerm, setSearchTerm] = useState('')
  const [neftDetails, setNeftDetails] = useState(null)
  const [partyList, setPartyList] = useState([]) // Initialize as empty array for select party
  const [deleteModalVisible, setDeleteModalVisible] = useState(false)
  const [partyToDelete, setPartyToDelete] = useState(null)

  const statusCycle = ['Pending', 'Paid', 'Partial', 'Cancelled']

  useEffect(() => {
    if (!neftId) return

    const fetchNeft = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/neft-request/${neftId}`)
        const data = await res.json()

        setNeftDetails(data?.neft || null)
        setPartyList(data?.neft?.parties || [])
      } catch (err) {
        console.error('Failed to fetch NEFT details', err)
      }
    }

    fetchNeft()
  }, [neftId])

  const handleNeftStatusToggle = async () => {
    const currentStatus = neftDetails.neftStatus || 'Pending'
    const nextStatus = statusCycle[(statusCycle.indexOf(currentStatus) + 1) % statusCycle.length]

    try {
      const res = await fetch(`http://localhost:5000/api/neft-request/${neftId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: nextStatus }),
      })
      const data = await res.json()
      if (res.ok) {
        setNeftDetails((prev) => ({ ...prev, neftStatus: nextStatus }))
      } else {
        alert(data.message)
      }
    } catch (err) {
      console.error('Failed to update status', err)
    }
  }

  const handlePartyStatusToggle = async (partyId) => {
    const party = partyList.find((p) => p._id === partyId)
    const current = party.partyNeftStatus || 'Pending'
    const next = statusCycle[(statusCycle.indexOf(current) + 1) % statusCycle.length]

    try {
      const res = await fetch(
        `http://localhost:5000/api/neft-request/${neftId}/party/${partyId}/status`,
        {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ status: next }),
        },
      )
      const data = await res.json()
      if (res.ok) {
        const updated = partyList.map((p) =>
          p._id === partyId ? { ...p, partyNeftStatus: next } : p,
        )
        setPartyList(updated)
      } else {
        alert(data.message)
      }
    } catch (err) {
      console.error('Party status update failed', err)
    }
  }

  // ✅ Paginate filtered data
  const allParties = partyList.filter((party) =>
    party.partyName.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const paginatedParties = allParties.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE,
  )
  const totalPages = Math.ceil(allParties.length / ITEMS_PER_PAGE)

  if (!neftDetails) {
    return (
      <CCard className="shadow-sm">
        <CCardHeader>
          <h5>⏳ Loading...</h5>
        </CCardHeader>
      </CCard>
    )
  }

  return (
    <CCard className="shadow-sm">
      <CCardHeader className="bg-primary text-white">
        <h5>🧾 NEFT #{neftDetails.neftNo} Details</h5>
      </CCardHeader>
      <CCardBody className="">
        <CCard className="mb-4 border-start border-4 border-primary shadow-sm">
          <CCardBody>
            <CRow>
              <CCol>
                <h6 className="text-muted mb-1">NEFT No</h6>
                <h4 className="fw-bold text-primary">#{neftDetails.neftNo}</h4>
              </CCol>
              <CCol>
                <h6 className="text-muted mb-1">Date</h6>
                <h5 className="fw-semibold">{formatDate(neftDetails.neftDate)}</h5>
              </CCol>
              <CCol>
                <h6 className="text-muted mb-1">Neft Amount</h6>
                <h5 className="fw-semibold">₹ {neftDetails.neftAmount}</h5>
              </CCol>
              <CCol>
                <h6 className="text-muted mb-1">Status</h6>
                <CBadge
                  color={
                    neftDetails.neftStatus === 'Paid'
                      ? 'success'
                      : neftDetails.neftStatus === 'Partial'
                        ? 'info'
                        : neftDetails.neftStatus === 'Cancelled'
                          ? 'secondary'
                          : 'warning'
                  }
                  className="px-3 py-1 cursor-pointer"
                  onClick={handleNeftStatusToggle}
                  title="Click to change NEFT status"
                >
                  {neftDetails.neftStatus}
                </CBadge>
              </CCol>
            </CRow>
          </CCardBody>
        </CCard>

        <CContainer className="row align-items-center justify-content-between mb-4">
          <CCol md={4}>
            <CFormInput
              type="text"
              className="form-control"
              placeholder="Search Party..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value)
                setCurrentPage(1)
              }}
            />
          </CCol>
          <CCol md={8} className="text-end">
            <CButton color="primary" onClick={() => navigate(`/api/neft-manager/create/${neftId}`)}>
              + Add More Party
            </CButton>
          </CCol>
        </CContainer>

        <CTable bordered responsive hover className="shadow-sm text-center">
          <CTableHead color="light">
            <CTableRow>
              <CTableHeaderCell>Sr.</CTableHeaderCell>
              <CTableHeaderCell>Party Name</CTableHeaderCell>
              <CTableHeaderCell>Status</CTableHeaderCell>
              <CTableHeaderCell>Bill Count</CTableHeaderCell>
              <CTableHeaderCell>Total Amount</CTableHeaderCell>
              <CTableHeaderCell>SMC Pdf</CTableHeaderCell>
              <CTableHeaderCell>Pali Pdf</CTableHeaderCell>
              <CTableHeaderCell>Edit</CTableHeaderCell>
              <CTableHeaderCell>Delete</CTableHeaderCell>
            </CTableRow>
          </CTableHead>
          <CTableBody>
            {paginatedParties.map((party, index) => (
              <CTableRow key={index}>
                <CTableDataCell>{index + 1}</CTableDataCell>
                <CTableDataCell>{party.partyName}</CTableDataCell>
                <CTableDataCell>
                  <CBadge
                    color={
                      party.partyNeftStatus === 'Paid'
                        ? 'success'
                        : party.partyNeftStatus === 'Partial'
                          ? 'info'
                          : party.partyNeftStatus === 'Cancelled'
                            ? 'secondary'
                            : 'warning'
                    }
                    className="px-3 py-1 cursor-pointer"
                    onClick={() => handlePartyStatusToggle(party._id)}
                    title="Click to change Party status"
                  >
                    {party.partyNeftStatus || 'Pending'}
                  </CBadge>
                </CTableDataCell>
                <CTableDataCell>{party.bills?.length || 0}</CTableDataCell>
                <CTableDataCell>₹ {party.totalPartyNeftAmount}</CTableDataCell>
                <CTableDataCell>
                  <CButton color="info" size="sm">
                    SMC PDF
                  </CButton>
                </CTableDataCell>
                <CTableDataCell>
                  <CButton color="warning" size="sm">
                    PALI PDF
                  </CButton>
                </CTableDataCell>
                <CTableDataCell>
                  <CIcon
                    icon={cilPencil}
                    className="text-primary cursor-pointer"
                    onClick={() =>
                      navigate(`/api/neft-manager/create/${neftId}/party/${party.partyId}`)
                    }
                  />
                </CTableDataCell>
                <CTableDataCell>
                  <CIcon
                    icon={cilTrash}
                    className="text-danger cursor-pointer"
                    onClick={() => {
                      setPartyToDelete(party)
                      setDeleteModalVisible(true)
                    }}
                  />
                </CTableDataCell>
              </CTableRow>
            ))}
          </CTableBody>
        </CTable>

        {deleteModalVisible && (
          <ConfirmDeleteModal
            isVisible={deleteModalVisible}
            setIsVisible={setDeleteModalVisible}
            partyName={partyToDelete?.partyName}
            onConfirm={async () => {
              try {
                const res = await fetch(
                  `http://localhost:5000/api/neft-request/${neftId}/party/${partyToDelete._id}`,
                  {
                    method: 'DELETE',
                  },
                )
                const data = await res.json()

                if (res.ok) {
                  // 🔁 Refresh NEFT details
                  const refetch = await fetch(`http://localhost:5000/api/neft-request/${neftId}`)
                  const updated = await refetch.json()
                  setNeftDetails(updated.neft)
                  setPartyList(updated.neft.parties)
                  setDeleteModalVisible(false)
                } else {
                  alert(data.message || 'Delete failed')
                }
              } catch (err) {
                console.error('Delete error:', err)
                alert('Error while deleting party')
              }
            }}
          />
        )}

        <PaginationControls
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      </CCardBody>
    </CCard>
  )
}
