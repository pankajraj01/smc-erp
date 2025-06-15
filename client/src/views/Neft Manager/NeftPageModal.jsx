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
  CPagination,
  CPaginationItem,
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
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import neftData from '../../data/neftData'

export default function NeftPageModal({ isVisible, setIsVisible, selectedNeft }) {
  const [currentPage, setCurrentPage] = useState(1)
  const ITEMS_PER_PAGE = 5
  const totalPages = Math.ceil(neftData.length / ITEMS_PER_PAGE)
  const navigate = useNavigate()

  const filterdData = neftData.filter((neft) => neft.neftNo === selectedNeft)
  const neftDate = filterdData[0]?.neftDate
  const status = filterdData[0]?.status || 'Pending'

  return (
    <CModal
      size="xl"
      visible={isVisible}
      backdrop="static"
      keyboard={false}
      onClose={() => setIsVisible(!isVisible)}
    >
      <CModalHeader className="bg-primary text-white">
        <CModalTitle>🧾 NEFT #{selectedNeft} Details</CModalTitle>
      </CModalHeader>
      <CModalBody className="bg-light">
        <CCard className="mb-4 border-start border-4 border-primary shadow-sm">
          <CCardBody>
            <CRow>
              <CCol>
                <h6 className="text-muted mb-1">NEFT No</h6>
                <h4 className="fw-bold text-primary">#{selectedNeft}</h4>
              </CCol>
              <CCol>
                <h6 className="text-muted mb-1">Date</h6>
                <h5 className="fw-semibold">{neftDate}</h5>
              </CCol>
              <CCol>
                <h6 className="text-muted mb-1">Status</h6>
                <CBadge
                  color={
                    status === 'Paid'
                      ? 'success'
                      : status === 'Partial'
                        ? 'info'
                        : status === 'Cancelled'
                          ? 'secondary'
                          : 'warning'
                  }
                  className="px-3 py-1"
                >
                  {status}
                </CBadge>
              </CCol>
            </CRow>
          </CCardBody>
        </CCard>

        <CContainer className="row align-items-center justify-content-between mb-4">
          <CCol md={4}>
            <CFormInput type="text" className="form-control" placeholder="Search Party..." />
          </CCol>
          <CCol md={8} className="text-end">
            <CButton
              color="primary"
              onClick={() =>
                navigate(`/create-new-neft?neftNo=${selectedNeft}&neftDate=${neftDate}`)
              }
            >
              + Add More Party
            </CButton>
          </CCol>
        </CContainer>

        <CTable bordered responsive hover className="shadow-sm text-center">
          <CTableHead color="light">
            <CTableRow>
              <CTableHeaderCell>Party Name</CTableHeaderCell>
              <CTableHeaderCell>Status</CTableHeaderCell>
              <CTableHeaderCell>Bill Count</CTableHeaderCell>
              <CTableHeaderCell>Total Amount</CTableHeaderCell>
              <CTableHeaderCell>Edit</CTableHeaderCell>
              <CTableHeaderCell>SMC Pdf</CTableHeaderCell>
              <CTableHeaderCell>Pali Pdf</CTableHeaderCell>
              <CTableHeaderCell>Delete</CTableHeaderCell>
            </CTableRow>
          </CTableHead>
          <CTableBody>
            {filterdData.map((partyList) => {
              return partyList.parties.map((party, index) => (
                <CTableRow key={`${partyList.neftNo}-${index}`}>
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
                      className="px-3 py-1"
                    >
                      {party.partyStatus || 'Pending'}
                    </CBadge>
                  </CTableDataCell>
                  <CTableDataCell>{party.bills?.length || 0}</CTableDataCell>
                  <CTableDataCell>₹ {party.partyTotal}</CTableDataCell>
                  <CTableDataCell>
                    <CIcon
                      icon={cilPencil}
                      className="text-primary cursor-pointer"
                      onClick={() =>
                        navigate('/create-new-neft', {
                          state: {
                            mode: 'edit',
                            neftNo: partyList.neftNo,
                            neftDate: partyList.neftDate,
                            partyData: party, // full party object
                          },
                        })
                      }
                    />
                  </CTableDataCell>
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
                    <CIcon icon={cilTrash} className="text-danger cursor-pointer" />
                  </CTableDataCell>
                </CTableRow>
              ))
            })}
          </CTableBody>
        </CTable>

        <CPagination align="center" className="mt-3">
          <CPaginationItem
            aria-label="Previous"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(currentPage - 1)}
          >
            <span aria-hidden="true">&laquo;</span>
          </CPaginationItem>
          {[...Array(totalPages)].map((_, index) => (
            <CPaginationItem
              key={index}
              active={currentPage === index + 1}
              onClick={() => setCurrentPage(index + 1)}
            >
              {index + 1}
            </CPaginationItem>
          ))}
          <CPaginationItem
            aria-label="Next"
            onClick={() => setCurrentPage(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            <span aria-hidden="true">&raquo;</span>
          </CPaginationItem>
        </CPagination>
      </CModalBody>
    </CModal>
  )
}
