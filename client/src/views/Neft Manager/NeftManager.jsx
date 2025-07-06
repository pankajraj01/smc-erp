import {
  CButton,
  CButtonGroup,
  CCard,
  CCardBody,
  CCardHeader,
  CContainer,
  CFormInput,
  CFormSelect,
} from '@coreui/react'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { FileSignature } from 'lucide-react'

import NeftTable from './NeftTable'
import PaginationControls from '../../components/PaginationControls'

import { getNefts } from '../../api/nefts.api'

const ITEMS_PER_PAGE = 5

export default function NeftManager() {
  const [searchTerm, setSearchTerm] = useState('')
  const [nefts, setNefts] = useState([])
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [neftPageVisible, setNeftPageVisible] = useState(false)
  const [selectedNeft, setSelectedNeft] = useState(null)
  const [statusFilter, setStatusFilter] = useState('ALL')

  const navigate = useNavigate()

  const fetchNefts = async () => {
    try {
      const res = await getNefts()
      // const data = await res.json()
      setNefts(res.data.nefts || [])
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

  // 🔍 Search Logic + Status Filter Logic
  const filteredNefts = nefts
    .filter((neft) => {
      const term = searchTerm.trim().toLowerCase()
      return (
        neft.neftNo.toString().includes(term) ||
        neft.neftDate?.toLowerCase().includes(term) ||
        neft.neftStatus?.toLowerCase().includes(term)
      )
    })
    .filter((neft) => statusFilter === 'ALL' || neft.neftStatus === statusFilter)

  // ✅ Paginate filtered data
  const paginatedNefts = filteredNefts.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE,
  )

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

            <CButton
              color="light"
              size="sm"
              className="border border-info"
              onClick={() => navigate('/neft-manager/neft-party-center')}
            >
              Party Wise Nefts
            </CButton>

            <CButton
              color="success"
              size="sm"
              className="border border-info ms-2"
              onClick={() => navigate('/neft-manager/create')}
            >
              <FileSignature size={16} className="me-2" />
              <span>Create New Neft</span>
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
