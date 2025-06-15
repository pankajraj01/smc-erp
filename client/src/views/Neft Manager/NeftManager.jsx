import {
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CContainer,
  CFormInput,
  CPagination,
  CPaginationItem,
} from '@coreui/react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

import neftData from '../../data/neftData'
import NeftTable from './NeftTable'
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

  const handleViewNeft = (neftNo) => {
    setSelectedNeft(neftNo)
    setNeftPageVisible(true)
  }

  return (
    <CCard className="shadow-sm">
      <CCardHeader className="bg-primary text-white">
        <h5 className="mb-0">💸 NEFT Manager</h5>
      </CCardHeader>
      <CCardBody>
        {/* Search and Actions */}
        <CContainer className="row align-items-center justify-content-between mb-4">
          <CContainer className="col-md-4 mb-2 mb-md-0">
            <CFormInput type="text" placeholder="🔍 Search NEFTs..." />
          </CContainer>
          <CContainer className="col-md-8 text-md-end">
            <CButton color="secondary" className="me-2">
              <i className="bi bi-funnel"></i> Filter
            </CButton>
            <CButton color="success" onClick={() => navigate('/create-new-neft')}>
              + Create New NEFT
            </CButton>
          </CContainer>
        </CContainer>

        {/* NEFT Table */}
        <NeftTable nefts={paginatedData} onView={handleViewNeft} />

        {/* Modal */}
        {neftPageVisible && (
          <NeftPageModal
            isVisible={neftPageVisible}
            setIsVisible={() => setNeftPageVisible(false)}
            selectedNeft={selectedNeft}
          />
        )}

        {/* Pagination */}
        <CPagination align="center" className="mt-4">
          <CPaginationItem
            aria-label="Previous"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(currentPage - 1)}
          >
            &laquo;
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
            &raquo;
          </CPaginationItem>
        </CPagination>
      </CCardBody>
    </CCard>
  )
}
