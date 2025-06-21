import {
  CBadge,
  CButton,
  CCard,
  CCardBody,
  CCol,
  CContainer,
  CFormInput,
  CModal,
  CModalBody,
  CModalHeader,
  CModalTitle,
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
import { useNavigate } from 'react-router-dom'
import PaginationControls from '../../components/PaginationControls'
import formatDate from '../../utils/formatDate'

export default function NeftPageModal({ isVisible, setIsVisible, selectedNeft }) {
  const ITEMS_PER_PAGE = 5
  const navigate = useNavigate()
  const [currentPage, setCurrentPage] = useState(1)
  const [searchTerm, setSearchTerm] = useState('')
  const [neftDetails, setNeftDetails] = useState(null)
  const [partyList, setPartyList] = useState([]) // Initialize as empty array for select party
  // const [neftStatus, setNeftStatus] = useState('Pending')

  // const neftStatusCycle = ['Pending', 'Paid', 'Partial', 'Cancelled']
  // const partyStatusCycle = ['Pending', 'Paid', 'Partial', 'Cancelled']

  useEffect(() => {
    if (!selectedNeft || !isVisible) return

    const fetchNeft = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/neft-request/${selectedNeft}`)
        const data = await res.json()
        setNeftDetails(data?.neft || null)
        setPartyList(data?.neft?.parties || [])
      } catch (err) {
        console.error('Failed to fetch NEFT details', err)
      }
    }

    fetchNeft()
  }, [selectedNeft, isVisible])

  // const handleNeftStatusClick = () => {
  //   const nextStatus =
  //     neftStatusCycle[(neftStatusCycle.indexOf(neftStatus) + 1) % neftStatusCycle.length]
  //   setNeftStatus(nextStatus)
  // }

  // const handlePartyStatusClick = (index) => {
  //   const updated = [...partyList]
  //   const currentStatus = updated[index].partyStatus || 'Pending'
  //   const nextStatus =
  //     partyStatusCycle[(partyStatusCycle.indexOf(currentStatus) + 1) % partyStatusCycle.length]

  //   updated[index].partyStatus = nextStatus
  //   setPartyList(updated)
  // }

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
      <CModal
        size="xl"
        visible={isVisible}
        backdrop="static"
        keyboard={false}
        onClose={() => setIsVisible(false)}
      >
        <CModalHeader>
          <CModalTitle>⏳ Loading...</CModalTitle>
        </CModalHeader>
      </CModal>
    )
  }

  return (
    <CModal
      size="xl"
      visible={isVisible}
      backdrop="static"
      keyboard={false}
      onClose={() => setIsVisible(false)}
    >
      <CModalHeader className="bg-primary text-white">
        <CModalTitle>🧾 NEFT #{neftDetails.neftNo} Details</CModalTitle>
      </CModalHeader>
      <CModalBody className="bg-light">
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
                  // onClick={handleNeftStatusClick}
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
            <CButton
              color="primary"
              // onClick={() => navigate(`/api/neft-manager/create?${neftDetails._id}`)}
            >
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
                      party.partyStatus === 'Paid'
                        ? 'success'
                        : party.partyStatus === 'Partial'
                          ? 'info'
                          : party.partyStatus === 'Cancelled'
                            ? 'secondary'
                            : 'warning'
                    }
                    className="px-3 py-1 cursor-pointer"
                    onClick={() =>
                      handlePartyStatusClick((currentPage - 1) * ITEMS_PER_PAGE + index)
                    }
                    title="Click to change status"
                  >
                    {party.partyStatus || 'Pending'}
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
                      navigate('/api/neft-manager/create', {
                        state: {
                          mode: 'edit',
                          neftNo: selectedNeft,
                          neftDate: neftDetails.neftDate,
                          partyData: party,
                        },
                      })
                    }
                  />
                </CTableDataCell>
                <CTableDataCell>
                  <CIcon icon={cilTrash} className="text-danger cursor-pointer" />
                </CTableDataCell>
              </CTableRow>
            ))}
          </CTableBody>
        </CTable>

        <PaginationControls
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      </CModalBody>
    </CModal>
  )
}
