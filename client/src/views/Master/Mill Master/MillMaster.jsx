import { CButton, CCard, CCardBody, CCardHeader, CContainer, CFormInput } from '@coreui/react'
import { useEffect, useState } from 'react'
import MillFormModal from './MillFormModal'
import MillDeleteModal from './MillDeleteModal'
import MillTable from './MillTable'
import PaginationControls from '../../../components/PaginationControls'
import Icon from '../../../components/Icon'

const ITEMS_PER_PAGE = 5

export default function MillMaster() {
  const [searchTerm, setSearchTerm] = useState('')
  const [mills, setMills] = useState([])
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [visible, setVisible] = useState(false)
  const [millToEdit, setMillToEdit] = useState(null)
  const [deleteModalVisible, setDeleteModalVisible] = useState(false)
  const [millToDelete, setMillToDelete] = useState(null)

  // Fetch mills from API
  useEffect(() => {
    const fetchMills = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/master/mill')
        const data = await res.json()
        setMills(data.mills || [])
      } catch (err) {
        console.error('Failed to fetch mills:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchMills()
  }, [])

  // Add or update
  const handleSaveMill = async (mill) => {
    try {
      const isEdit = !!mill._id
      const url = isEdit
        ? `http://localhost:5000/api/master/mill/${mill._id}`
        : 'http://localhost:5000/api/master/mill'
      const method = isEdit ? 'PATCH' : 'POST'

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(mill),
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.message || 'Save failed')

      const updatedList = isEdit
        ? mills.map((m) => (m._id === mill._id ? data.mill : m))
        : [...mills, data.mill]

      setMills(updatedList)
      if (!isEdit) {
        setCurrentPage(Math.ceil(updatedList.length / ITEMS_PER_PAGE))
      }

      setVisible(false)
      setMillToEdit(null)
    } catch (err) {
      alert(err.message)
    }
  }

  // Delete mill
  const handleDelete = async () => {
    try {
      const res = await fetch(`http://localhost:5000/api/master/mill/${millToDelete._id}`, {
        method: 'DELETE',
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.message || 'Delete failed')

      const updated = mills.filter((m) => m._id !== millToDelete._id)
      setMills(updated)
      setCurrentPage((prev) => Math.min(prev, Math.ceil(updated.length / ITEMS_PER_PAGE) || 1))
      setDeleteModalVisible(false)
      setMillToDelete(null)
    } catch (err) {
      alert(err.message)
    }
  }

  // ✅ Pagination logic + Search Logic
  const filteredMills = mills.filter((mill) =>
    mill.millName.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const paginatedData = filteredMills.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE,
  )

  return (
    <CCard>
      <CCardHeader>Mill Master</CCardHeader>
      <CCardBody>
        {/* Header with search and buttons */}
        <CContainer className="row justify-content-between mb-4">
          <CContainer className="col-md-4 mb-2 mb-md-0">
            <CFormInput
              className="col-md-4 mb-2"
              type="text"
              placeholder="Search Mills..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value)
                setCurrentPage(1) // reset to first page on search
              }}
            />
          </CContainer>

          <CContainer className="col-md-8 text-md-end ">
            {/* <CButton className="me-2" color="secondary">
              <Icon name="Filter" size={22} /> Filter
            </CButton> */}
            <CButton
              onClick={() => {
                setMillToEdit(null) // 🧼 reset previous selection
                setVisible(true) // 📦 open the modal
              }}
              color="primary"
            >
              <Icon name="Plus" size={22} className="me-2" />
              Add New Mill
            </CButton>
          </CContainer>
        </CContainer>

        {/* Modals */}
        <MillFormModal
          key={millToEdit?._id || 'new'}
          isVisible={visible}
          setIsVisible={setVisible}
          onSubmit={handleSaveMill}
          initialData={millToEdit}
        />
        <MillDeleteModal
          visible={deleteModalVisible}
          mill={millToDelete}
          onCancel={() => setDeleteModalVisible(false)}
          onConfirm={handleDelete}
        />

        {/* Table + Pagination */}
        {loading ? (
          <p>Loading mills...</p>
        ) : (
          <>
            <MillTable
              mills={paginatedData}
              onEdit={(mill) => {
                setMillToEdit(mill)
                setVisible(true)
              }}
              onDelete={(mill) => {
                setMillToDelete(mill)
                setDeleteModalVisible(true)
              }}
            />
            <PaginationControls
              currentPage={currentPage}
              totalPages={Math.ceil(filteredMills.length / ITEMS_PER_PAGE)}
              onPageChange={setCurrentPage}
            />
          </>
        )}
      </CCardBody>
    </CCard>
  )
}
