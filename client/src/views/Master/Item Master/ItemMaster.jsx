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
import ItemFormModal from './ItemFormModal'
import DeleteItemModal from './DeleteItemModal'
import ItemTable from './ItemTable'
import PaginationControls from '../../../components/PaginationControls'
import Icon from '../../../components/Icon'

const ITEMS_PER_PAGE = 5

export default function ItemMaster() {
  const [typeFilter, setTypeFilter] = useState('ALL') // 'ALL', 'GREY', 'FINISH'
  const [searchTerm, setSearchTerm] = useState('')
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [visible, setVisible] = useState(false)
  const [itemToEdit, setItemToEdit] = useState(null)
  const [deleteModalVisible, setDeleteModalVisible] = useState(false)
  const [itemToDelete, setItemToDelete] = useState(null)

  // 🚀 Fetch items on mount
  useEffect(() => {
    const fetchItems = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/master/items')
        const data = await res.json()
        setItems(data.items || [])
      } catch (err) {
        console.error('Failed to fetch items:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchItems()
  }, [])

  // ✅ Save or update item
  const handleSaveItem = async (item) => {
    try {
      const url = item._id
        ? `http://localhost:5000/api/master/items/${item._id}`
        : 'http://localhost:5000/api/master/items'
      const method = item._id ? 'PATCH' : 'POST'

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(item),
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.message || 'Save failed')

      const updatedItems = item._id
        ? items.map((i) => (i._id === item._id ? data.item : i))
        : [...items, data.item]

      setItems(updatedItems)
      setCurrentPage(Math.ceil(updatedItems.length / ITEMS_PER_PAGE))
      setVisible(false)
      setItemToEdit(null)
    } catch (err) {
      alert(err.message)
    }
  }

  // ❌ Delete item
  const handleDelete = async () => {
    try {
      const res = await fetch(`http://localhost:5000/api/master/items/${itemToDelete._id}`, {
        method: 'DELETE',
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.message || 'Delete failed')

      const updated = items.filter((i) => i._id !== itemToDelete._id)
      setItems(updated)
      setCurrentPage((prev) => Math.min(prev, Math.ceil(updated.length / ITEMS_PER_PAGE) || 1))
      setDeleteModalVisible(false)
      setItemToDelete(null)
    } catch (err) {
      alert(err.message)
    }
  }

  // ✅ Pagination logic + Filter + Search Logic
  const filteredItems = items.filter((item) => {
    const term = searchTerm.toLowerCase()
    const matchesType = typeFilter === 'ALL' || item.type === typeFilter
    const matchesSearch = item.itemName.toLowerCase().includes(term)
    // item.type.toLowerCase().includes(term) ||
    // item.bank?.bankName?.toLowerCase().includes(term) ||
    // item.bank?.ifsc?.toLowerCase().includes(term)

    return matchesType && matchesSearch
  })

  const paginatedData = filteredItems.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE,
  )

  return (
    <CCard>
      <CCardHeader>Item Master</CCardHeader>
      <CCardBody>
        {/* Header with search and buttons */}
        <CContainer className="row justify-content-between mb-4">
          <CContainer className="col-md-4 mb-2 mb-md-0">
            <CFormInput
              className="col-md-4 mb-2"
              type="text"
              placeholder="Search Items..."
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
                setItemToEdit(null) // 🧼 reset previous selection
                setVisible(true) // 📦 open the modal
              }}
              color="primary"
            >
              <Icon name="Plus" size={22} className="me-2" />
              Add New Item
            </CButton>
          </CContainer>
        </CContainer>

        {/* 🧾 Form & Delete Modal */}
        <ItemFormModal
          key={itemToEdit?._id || 'new'}
          isVisible={visible}
          setIsVisible={setVisible}
          onSubmit={handleSaveItem}
          initialData={itemToEdit}
        />
        <DeleteItemModal
          visible={deleteModalVisible}
          item={itemToDelete}
          onCancel={() => setDeleteModalVisible(false)}
          onConfirm={handleDelete}
        />

        {/* 📋 Table + Pagination */}
        {loading ? (
          <p>Loading items...</p>
        ) : (
          <>
            <ItemTable
              items={paginatedData}
              onEdit={(item) => {
                setItemToEdit(item)
                setVisible(true)
              }}
              onDelete={(item) => {
                setItemToDelete(item)
                setDeleteModalVisible(true)
              }}
            />
            <PaginationControls
              currentPage={currentPage}
              totalPages={Math.ceil(filteredItems.length / ITEMS_PER_PAGE)}
              onPageChange={setCurrentPage}
            />
          </>
        )}
      </CCardBody>
    </CCard>
  )
}
