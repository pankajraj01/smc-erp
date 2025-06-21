import { CButton, CCard, CCardBody, CCardHeader, CContainer, CFormInput } from '@coreui/react'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import NeftTable from './NeftTable'
import PaginationControls from '../../components/PaginationControls'

const ITEMS_PER_PAGE = 5

export default function NeftManager() {
  const [searchTerm, setSearchTerm] = useState('')
  const [nefts, setNefts] = useState([])
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [neftPageVisible, setNeftPageVisible] = useState(false)
  const [selectedNeft, setSelectedNeft] = useState(null)

  const navigate = useNavigate()

  const fetchNefts = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/neft-request')
      const data = await res.json()
      setNefts(data.nefts || [])
      setLoading(false)
    } catch (error) {
      console.error('Failed to fetch NEFTs:', error)
      setLoading(false)
    }
  }
  // 🚀 Fetch NEFTs from API
  useEffect(() => {
    fetchNefts()
  }, [])

  // 🔍 Search Logic
  const filteredNefts = nefts.filter((neft) => {
    const term = searchTerm.trim().toLowerCase()
    return (
      neft.neftNo.toString().includes(term) ||
      neft.neftDate?.toLowerCase().includes(term) ||
      neft.neftStatus?.toLowerCase().includes(term)
    )
  })

  // ✅ Paginate filtered data
  const paginatedNefts = filteredNefts.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE,
  )

  // 👁️ Modal trigger
  // const handleViewNeft = (neftNo) => {
  //   setSelectedNeft(neftNo)
  //   setNeftPageVisible(true)
  // }

  return (
    <CCard className="shadow-sm">
      <CCardHeader className="bg-primary text-white">
        <h5 className="mb-0">💸 NEFT Manager</h5>
      </CCardHeader>
      <CCardBody>
        {/* 🔎 Search and Create */}
        <CContainer className="row align-items-center justify-content-between mb-4">
          <CContainer className="col-md-4 mb-2 mb-md-0">
            <CFormInput
              type="text"
              placeholder="🔍 Search NEFTs..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value)
                setCurrentPage(1)
              }}
            />
          </CContainer>
          <CContainer className="col-md-8 text-md-end">
            <CButton color="secondary" className="me-2">
              <i className="bi bi-funnel"></i> Filter
            </CButton>
            <CButton color="success" onClick={() => navigate('/api/neft-manager/create')}>
              + Create New NEFT
            </CButton>
          </CContainer>
        </CContainer>

        {/* 📊 Table Display */}
        {loading ? (
          <p>Loading NEFTs...</p>
        ) : (
          <NeftTable nefts={paginatedNefts} refreshNefts={fetchNefts} />
        )}

        {/* 📍 Pagination */}
        <PaginationControls
          currentPage={currentPage}
          totalPages={Math.ceil(filteredNefts.length / ITEMS_PER_PAGE)}
          onPageChange={setCurrentPage}
        />

        {/* 🧾 Modal */}
        {neftPageVisible && (
          <NeftPageModal
            isVisible={neftPageVisible}
            setIsVisible={() => setNeftPageVisible(false)}
            selectedNeft={selectedNeft}
          />
        )}
      </CCardBody>
    </CCard>
  )
}
