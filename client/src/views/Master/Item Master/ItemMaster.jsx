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
import { createItem, deleteItem, getAllItems, updateItem } from '../../../api/masters/item'

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

  const fetchItems = async (goToLastPage = false) => {
    try {
      const res = await getAllItems()
      const allItems = res.data.items || []
      setItems(allItems)
      // Set pagination based on context
      if (goToLastPage) {
        setCurrentPage(Math.ceil(allItems.length / ITEMS_PER_PAGE))
      } else {
        setCurrentPage(1)
      }

      // Optionally reset filters/search here too
      setTypeFilter('ALL')
      setSearchTerm('')
      setLoading(false)
    } catch (err) {
      console.error('Failed to fetch Items:', err)
    }
  }

  // 🚀 Fetch items on mount
  useEffect(() => {
    fetchItems()
  }, [])

  // ✅ Save or update item
  const handleSaveItem = async (item) => {
    try {
      const isEdit = !!item._id
      const res = isEdit ? await updateItem(item._id, item) : await createItem(item)

      await fetchItems(!isEdit) // ✅ refetch full data ⬅ true means go to last page on add
      setVisible(false)
      setItemToEdit(null)
    } catch (err) {
      alert(err.message)
    }
  }

  // ❌ Delete item
  const handleDelete = async () => {
    try {
      const res = await deleteItem(itemToDelete._id)
      // const data = await res.json()
      // if (!res.ok) throw new Error(data.message || 'Delete failed')

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
