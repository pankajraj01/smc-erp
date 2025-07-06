import {
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CContainer,
  CFormInput,
  CFormSelect,
} from '@coreui/react'
import { useEffect, useState } from 'react'
import PartyFormModal from './PartyFormModal'
import PartyDeleteModal from './PartyDeleteModal'
import PartyTable from './PartyTable'
import PaginationControls from '../../../components/PaginationControls'
import Icon from '../../../components/Icon'
import {
  createParty,
  deleteParty,
  getAllParties,
  getPartyById,
  updateParty,
} from '../../../api/masters/party'

const ITEMS_PER_PAGE = 5

export default function PartyMaster() {
  const [typeFilter, setTypeFilter] = useState('ALL') // 'ALL', 'GREY', 'FINISH'
  const [searchTerm, setSearchTerm] = useState('')
  const [parties, setParties] = useState([])
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [visible, setVisible] = useState(false)
  const [partyToEdit, setPartyToEdit] = useState(null)
  const [deleteModalVisible, setDeleteModalVisible] = useState(false)
  const [partyToDelete, setPartyToDelete] = useState(null)

  // function to Fetch parties
  const fetchParties = async (goToLastPage = false) => {
    try {
      const res = await getAllParties()
      const allParties = res.data.parties || []

      setParties(allParties)

      // Set pagination based on context
      if (goToLastPage) {
        setCurrentPage(Math.ceil(allParties.length / ITEMS_PER_PAGE))
      } else {
        setCurrentPage(1)
      }

      // Optionally reset filters/search here too
      setTypeFilter('ALL')
      setSearchTerm('')
      setLoading(false)
    } catch (err) {
      console.error('Failed to fetch parties:', err)
    }
  }

  // Fetch parties on load
  useEffect(() => {
    fetchParties()
  }, [])

  // Add or update
  const handleSaveParty = async (party) => {
    try {
      const isEdit = !!party._id
      const res = isEdit ? await updateParty(party._id, party) : await createParty(party)

      await fetchParties(!isEdit) // ✅ refetch full data ⬅ true means go to last page on add
      setVisible(false) // ✅ close modal
      setPartyToEdit(null) // ✅ reset form state
    } catch (err) {
      alert(err.message)
    }
  }

  // Delete party
  const handleDelete = async () => {
    try {
      const res = await deleteParty(partyToDelete._id)
      // const data = await res.data
      // if (!res.ok) throw new Error(data.message || 'Delete failed')

      const updated = parties.filter((p) => p._id !== partyToDelete._id)
      setParties(updated)
      setCurrentPage((prev) => Math.min(prev, Math.ceil(updated.length / ITEMS_PER_PAGE) || 1))
      setDeleteModalVisible(false)
      setPartyToDelete(null)
    } catch (err) {
      alert(err.message)
    }
  }

  // ✅ Pagination logic + Filter + Search Logic
  const filteredParties = parties.filter((party) => {
    const term = searchTerm.toLowerCase()
    const matchesType = typeFilter === 'ALL' || party.type === typeFilter
    const matchesSearch = party.partyName.toLowerCase().includes(term)
    return matchesType && matchesSearch
  })

  const paginatedData = filteredParties.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE,
  )

  return (
    <CCard>
      <CCardHeader>Party Master</CCardHeader>
      <CCardBody>
        {/* Header with search and buttons */}
        <CContainer className="row justify-content-between mb-4">
          <CContainer className="col-md-4 mb-2 mb-md-0">
            <CFormInput
              className="col-md-4 mb-2"
              type="text"
              placeholder="Search Parties..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value)
                setCurrentPage(1) // reset to first page on search
              }}
            />
          </CContainer>

          <CContainer className="col-md-8 text-md-end ">
            <CFormSelect
              className="form-select d-inline-block w-auto me-2"
              value={typeFilter}
              onChange={(e) => {
                setTypeFilter(e.target.value)
                setCurrentPage(1)
              }}
            >
              <option value="ALL">All Types</option>
              <option value="GREY">Grey</option>
              <option value="FINISH">Finish</option>
            </CFormSelect>

            <CButton
              onClick={() => {
                setPartyToEdit(null) // 🧼 reset previous selection
                setVisible(true) // 📦 open the modal
              }}
              color="primary"
            >
              <Icon name="Plus" size={22} className="me-2" />
              Add New Party
            </CButton>
          </CContainer>
        </CContainer>

        {/* Modals */}
        <PartyFormModal
          key={partyToEdit?._id || 'new'}
          isVisible={visible}
          setIsVisible={setVisible}
          onSubmit={handleSaveParty}
          initialData={partyToEdit}
        />
        <PartyDeleteModal
          visible={deleteModalVisible}
          party={partyToDelete}
          onCancel={() => setDeleteModalVisible(false)}
          onConfirm={handleDelete}
        />
        {/* Table + Pagination */}
        {loading ? (
          <p>Loading parties...</p>
        ) : (
          <>
            <PartyTable
              parties={paginatedData}
              onEdit={(party) => {
                setPartyToEdit(party)
                setVisible(true)
              }}
              onDelete={(party) => {
                setPartyToDelete(party)
                setDeleteModalVisible(true)
              }}
            />
            <PaginationControls
              currentPage={currentPage}
              totalPages={Math.ceil(filteredParties.length / ITEMS_PER_PAGE)}
              onPageChange={setCurrentPage}
            />
          </>
        )}
      </CCardBody>
    </CCard>
  )
}
