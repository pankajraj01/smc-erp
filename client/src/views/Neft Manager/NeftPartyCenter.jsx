import {
  CCard,
  CCardBody,
  CCardHeader,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
  CButton,
  CContainer,
} from '@coreui/react'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import PaginationControls from '../../components/PaginationControls'
import { getNefts } from '../../api/nefts.api'

export default function NeftPartyCenter() {
  const [nefts, setNefts] = useState([])
  const [partyMap, setPartyMap] = useState({})
  const [searchTerm, setSearchTerm] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const ITEMS_PER_PAGE = 5
  const navigate = useNavigate()

  const filteredParties = Object.values(partyMap).filter((party) => {
    const term = searchTerm.toLowerCase()
    return (
      party.partyName.toLowerCase().includes(term) || party.latestNeftNo.toString().includes(term)
    )
  })

  const paginatedParties = filteredParties.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE,
  )

  useEffect(() => {
    const fetchNefts = async () => {
      try {
        const res = await getNefts()
        const data = await res.data
        const map = {}

        data.nefts.forEach((neft) => {
          neft.parties.forEach((p) => {
            const pid = typeof p.partyId === 'object' ? p.partyId._id : p.partyId
            const pname =
              typeof p.partyId === 'object' ? p.partyId.name || p.partyName : p.partyName

            if (!map[pid] || map[pid].neftNo < neft.neftNo) {
              map[pid] = {
                partyId: pid,
                partyName: pname,
                latestNeftNo: neft.neftNo,
                latestNeftDate: neft.neftDate,
                latestNeftAmount: p.totalPartyNeftAmount || 0,
              }
            }
          })
        })

        setPartyMap(map)
      } catch (err) {
        console.error('Failed to fetch NEFTs:', err)
      }
    }

    fetchNefts()
  }, [])

  return (
    <CCard className="shadow-sm">
      <CCardHeader className="bg-dark text-white">
        <h5 className="mb-0">🤝 Party-wise NEFT Center</h5>
      </CCardHeader>
      <CCardBody>
        <CContainer className="d-flex justify-content-between align-items-center mb-3">
          <input
            type="text"
            className="form-control w-50"
            placeholder="🔍 Search by Party or NEFT No..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value)
              setCurrentPage(1)
            }}
          />
        </CContainer>
        <CTable striped hover responsive bordered align="middle">
          <CTableHead color="light">
            <CTableRow>
              <CTableHeaderCell>Sr</CTableHeaderCell>
              <CTableHeaderCell>Party Name</CTableHeaderCell>
              <CTableHeaderCell>Latest NEFT No</CTableHeaderCell>
              <CTableHeaderCell>Date</CTableHeaderCell>
              <CTableHeaderCell>Amount</CTableHeaderCell>
              <CTableHeaderCell>Action</CTableHeaderCell>
            </CTableRow>
          </CTableHead>
          <CTableBody>
            {paginatedParties.map((party, index) => (
              <CTableRow key={party.partyId}>
                <CTableDataCell>{(currentPage - 1) * ITEMS_PER_PAGE + index + 1}</CTableDataCell>
                <CTableDataCell>{party.partyName}</CTableDataCell>
                <CTableDataCell>#{party.latestNeftNo}</CTableDataCell>
                <CTableDataCell>
                  {new Date(party.latestNeftDate).toLocaleDateString()}
                </CTableDataCell>
                <CTableDataCell>₹ {party.latestNeftAmount}</CTableDataCell>
                <CTableDataCell>
                  <CButton
                    color="primary"
                    size="sm"
                    onClick={() =>
                      navigate(`/neft-manager/neft-party/${party.partyId}`, {
                        state: { partyName: party.partyName }, // ✅ passing name here
                      })
                    }
                  >
                    View All NEFTs
                  </CButton>
                </CTableDataCell>
              </CTableRow>
            ))}
          </CTableBody>
        </CTable>

        {/* 📍 Pagination */}
        <PaginationControls
          currentPage={currentPage}
          totalPages={Math.ceil(filteredParties.length / ITEMS_PER_PAGE)}
          onPageChange={setCurrentPage}
        />
      </CCardBody>
    </CCard>
  )
}
