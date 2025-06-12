import {
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CContainer,
  CFormInput,
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
import { useNavigate } from 'react-router-dom'
import NeftPageModal from './NeftPageModal'

export default function NeftManager() {
  const [nefts, setNefts] = useState(neftData)
  const [neftPageVisible, setNeftPageVisible] = useState(false)
  const [selectedNeft, setSelectedNeft] = useState(null)
  const [currentPage, setCurrentPage] = useState(1)
  const ITEMS_PER_PAGE = 5
  const totalPages = Math.ceil(nefts.length / ITEMS_PER_PAGE)
  const navigate = useNavigate()

  const paginatedData = nefts.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE,
  )

  // const neftClickHandle = (neftNo)=>{
  //   setNeftPageVisible(!neftPageVisible)
  //   setSelectedNeft(neftNo)
  // }

  return (
    <CCard>
      <CCardHeader>Neft Manager</CCardHeader>
      <CCardBody>
        <CContainer className="row align-items-center justify-content-between mb-4">
          {/* <!-- Left: Search Input --> */}
          <CContainer className="col-md-4 mb-2 mb-md-0 ">
            <CFormInput type="text" className="form-control" placeholder="Search orders..." />
          </CContainer>

          {/* <!-- Right: Filter + Add New Buttons --> */}
          <CContainer className="col-md-8 text-md-end ">
            <CButton className="btn btn-outline-secondary me-2">
              <i className="bi bi-funnel"></i> Filter
            </CButton>
            <CButton color="primary" onClick={() => navigate('/add-new-neft')}>
              Add New Neft
            </CButton>
          </CContainer>
        </CContainer>

        <CTable responsive hover>
          <CTableHead>
            <CTableRow>
              <CTableHeaderCell scope="col">Neft No</CTableHeaderCell>
              <CTableHeaderCell scope="col">Neft Date</CTableHeaderCell>
              <CTableHeaderCell scope="col">Neft Amount</CTableHeaderCell>
              <CTableHeaderCell scope="col">SMC Pdf</CTableHeaderCell>
              <CTableHeaderCell scope="col">Pali Pdf</CTableHeaderCell>
              <CTableHeaderCell scope="col">Delete</CTableHeaderCell>
            </CTableRow>
          </CTableHead>
          <CTableBody>
            {paginatedData.map((neft) => (
              <CTableRow key={neft.neftNo}>
                <CTableDataCell>
                  <CButton
                    color="secondary"
                    onClick={() => {
                      setSelectedNeft(neft.neftNo)
                      setNeftPageVisible(!neftPageVisible)
                    }}
                  >
                    {neft.neftNo}
                  </CButton>
                </CTableDataCell>
                <CTableDataCell>{neft.neftDate}</CTableDataCell>
                <CTableDataCell>{neft.totalNeftAmount}</CTableDataCell>
                <CTableDataCell>
                  <CButton color="info">SMFT PDF</CButton>
                </CTableDataCell>
                <CTableDataCell>
                  <CButton color="warning">PALI PDF</CButton>
                </CTableDataCell>
                <CTableDataCell>
                  <CButton color="danger">X</CButton>
                </CTableDataCell>
              </CTableRow>
            ))}
          </CTableBody>
        </CTable>

        {neftPageVisible && (
          <NeftPageModal
            isVisible={neftPageVisible}
            setIsVisible={() => setNeftPageVisible(!neftPageVisible)}
            selectedNeft={selectedNeft}
          />
        )}

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
      </CCardBody>
    </CCard>
  )
}
