import {
  CButton,
  CContainer,
  CFormInput,
  CModal,
  CModalBody,
  CModalHeader,
  CModalTitle,
  CPagination,
  CPaginationItem,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
} from '@coreui/react'
import neftData from '../../data/neftData'
import { useState } from 'react'
import CIcon from '@coreui/icons-react'
import { cilPencil, cilTrash } from '@coreui/icons'

export default function NeftPageModal({ isVisible, setIsVisible, selectedNeft }) {
  const [currentPage, setCurrentPage] = useState(1)
  const ITEMS_PER_PAGE = 5
  const totalPages = Math.ceil(neftData.length / ITEMS_PER_PAGE)
  const paginatedData = neftData.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE,
  )
  const filterdData = neftData.filter((neft) => neft.neftNo === selectedNeft)
  const neftDate = filterdData[0].neftDate

  return (
    <CModal
      size="xl"
      visible={isVisible}
      backdrop="static"
      keyboard="false"
      onClose={() => setIsVisible(!isVisible)}
    >
      <CModalHeader>
        <CModalTitle>Neft Page</CModalTitle>
      </CModalHeader>
      <CModalBody>
        <CContainer>
          <h2>Neft No. : {selectedNeft}</h2>
          <h2>Neft Date : {neftDate}</h2>
        </CContainer>
        <CContainer className="row align-items-center justify-content-between mb-4">
          {/* <!-- Left: Search Input --> */}
          <CContainer className="col-md-4 mb-2 mb-md-0 ">
            <CFormInput type="text" className="form-control" placeholder="Search Party..." />
          </CContainer>

          {/* <!-- Right: Filter + Add New Buttons --> */}
          <CContainer className="col-md-8 text-md-end ">
            <CButton color="primary" onClick={() => navigate('/add-new-neft')}>
              Add More Party
            </CButton>
          </CContainer>
        </CContainer>

        <CTable responsive hover>
          <CTableHead>
            <CTableRow>
              <CTableHeaderCell scope="col">Party Name</CTableHeaderCell>
              <CTableHeaderCell scope="col">Amount</CTableHeaderCell>
              <CTableHeaderCell scope="col">Edit</CTableHeaderCell>
              <CTableHeaderCell scope="col">SMC Pdf</CTableHeaderCell>
              <CTableHeaderCell scope="col">Pali Pdf</CTableHeaderCell>
              <CTableHeaderCell scope="col">Delete</CTableHeaderCell>
            </CTableRow>
          </CTableHead>
          <CTableBody>
            {filterdData.map((partyList) => {
              return partyList.parties.map((party, index) => (
                <CTableRow key={`${partyList.neftNo}-${index}`}>
                  <CTableDataCell>{party.partyName}</CTableDataCell>
                  <CTableDataCell>{party.partyTotal}</CTableDataCell>
                  <CTableDataCell>
                    <CIcon icon={cilPencil} />
                  </CTableDataCell>
                  <CTableDataCell>SMC PDF</CTableDataCell>
                  <CTableDataCell>PALI PDF</CTableDataCell>
                  <CTableDataCell>
                    <CIcon icon={cilTrash} />
                  </CTableDataCell>
                </CTableRow>
              ))
            })}
          </CTableBody>
        </CTable>

        {/* Pagination */}
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
