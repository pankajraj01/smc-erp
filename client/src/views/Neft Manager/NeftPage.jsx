import {
  CBadge,
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CContainer,
  CFormInput,
  CFormSelect,
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
import { FileSignature, FileText, FileTextIcon, PencilIcon, Trash2Icon } from 'lucide-react'

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
  const [editMode, setEditMode] = useState(false)
  const [remarkInput, setRemarkInput] = useState('')
  const [statusFilter, setStatusFilter] = useState('ALL')

  const statusCycle = ['Pending', 'Paid', 'Partial', 'Cancelled']

  const handleDownloadPartyPdf = (neftId, partyId) => {
    const url = `http://localhost:5000/api/neft/pdf/${neftId}/party/${partyId}`
    window.open(url, '_blank')
  }

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

  const handleSaveRemark = async () => {
    try {
      const res = await fetch(`http://localhost:5000/api/neft-request/${neftId}/remark`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ remark: remarkInput }),
      })

      const data = await res.json()
      if (res.ok) {
        setNeftDetails((prev) => ({ ...prev, neftRemark: remarkInput }))
        setEditMode(false)
      } else {
        alert(data.message || 'Failed to update remark')
      }
    } catch (err) {
      console.error('Error updating remark:', err)
      alert('Error updating remark')
    }
  }

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

  // 🔍 Search Logic + Status Filter Logic

  const allParties = partyList
    .filter((party) => party.partyName.toLowerCase().includes(searchTerm.toLowerCase()))
    .filter((party) => statusFilter === 'ALL' || party.partyNeftStatus === statusFilter)

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
            <CRow>
              <CCol md={12} className="mt-4">
                <h6 className="text-muted mb-1">Remark</h6>

                {editMode ? (
                  <div className="d-flex align-items-center gap-2">
                    <CFormInput
                      type="text"
                      value={remarkInput}
                      onChange={(e) => setRemarkInput(e.target.value)}
                      className="me-2"
                      placeholder="Enter NEFT remark"
                    />
                    <CButton color="success" size="sm" onClick={handleSaveRemark}>
                      Save
                    </CButton>
                    <CButton color="danger" size="sm" onClick={() => setEditMode(false)}>
                      Cancel
                    </CButton>
                  </div>
                ) : (
                  <div className="d-flex align-items-center justify-content-between">
                    <h6 className="fw-semibold mb-0 text-dark">
                      {neftDetails.neftRemark || 'No remark added'}
                    </h6>
                    <CButton
                      color="secondary"
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setEditMode(true)
                        setRemarkInput(neftDetails.neftRemark || '')
                      }}
                    >
                      Edit
                    </CButton>
                  </div>
                )}
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
            <CFormSelect
              className="form-select d-inline-block w-auto me-2"
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value)
                setCurrentPage(1)
              }}
            >
              <option value="ALL">All Status</option>
              <option value="Pending">Pending</option>
              <option value="Paid">Paid</option>
              <option value="Partial">Partial</option>
              <option value="Cancelled">Cancelled</option>
            </CFormSelect>
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
              <CTableHeaderCell>Pdf</CTableHeaderCell>
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
                  <CButton
                    size="sm"
                    color="light"
                    className="border border-info text-info"
                    onClick={() =>
                      handleDownloadPartyPdf(
                        neftId,
                        typeof party.partyId === 'object' ? party.partyId._id : party.partyId,
                      )
                    }
                  >
                    <FileTextIcon size={16} />
                  </CButton>
                </CTableDataCell>

                <CTableDataCell>
                  <CButton
                    size="sm"
                    color="light"
                    className="border border-info text-info"
                    onClick={() =>
                      navigate(`/api/neft-manager/create/${neftId}/party/${party.partyId}`)
                    }
                  >
                    <PencilIcon size={16} />
                  </CButton>
                </CTableDataCell>
                <CTableDataCell>
                  <CButton
                    size="sm"
                    color="light"
                    className="border border-info text-info"
                    onClick={() => {
                      setPartyToDelete(party)
                      setDeleteModalVisible(true)
                    }}
                  >
                    <Trash2Icon size={16} />
                  </CButton>
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
