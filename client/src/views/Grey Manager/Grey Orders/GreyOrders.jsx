import { useEffect, useState } from 'react'
import { CButton, CCard, CCardBody, CCardHeader, CContainer, CFormInput } from '@coreui/react'

import Icon from '../../../components/Icon'
import GreyOrderFormModal from './GreyOrderFormModal'
import GreyOrderTable from './GreyOrderTable'
import GreyOrderDeleteModal from './GreyOrderDeleteModal'
import PaginationControls from '../../../components/PaginationControls'

const ITEMS_PER_PAGE = 10

export default function GreyOrderMaster() {
  // ✅ State Management
  const [orders, setOrders] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [visible, setVisible] = useState(false)
  const [orderToEdit, setOrderToEdit] = useState(null)
  const [orderToDelete, setOrderToDelete] = useState(null)
  const [deleteModalVisible, setDeleteModalVisible] = useState(false)
  const [loading, setLoading] = useState(true)

  // ✅ Fetch all grey orders once on component mount
  const fetchOrders = async (goToLastPage = false) => {
    try {
      const res = await fetch('http://localhost:5000/api/grey-orders')
      const data = await res.json()
      const allOrders = data.greyOrders || []

      setOrders(allOrders)

      if (goToLastPage) {
        setCurrentPage(Math.ceil(allOrders.length / ITEMS_PER_PAGE))
      }

      // setTypeFilter('ALL')
      setSearchTerm('')
      setLoading(false)
    } catch (err) {
      console.error('Failed to fetch Agents:', err)
    }
  }
  useEffect(() => {
    fetchOrders()
  }, [])

  // ✅ Create or update order logic
  const handleSaveOrder = async (order) => {
    try {
      const isEdit = !!order._id
      const url = isEdit
        ? `http://localhost:5000/api/grey-orders/${order._id}`
        : 'http://localhost:5000/api/grey-orders'
      const method = isEdit ? 'PUT' : 'POST'

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(order),
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.message || 'Operation failed')

      const updatedOrders = isEdit
        ? orders.map((o) => (o._id === order._id ? data.greyOrder : o))
        : [...orders, data.greyOrder]

      await fetchOrders(!isEdit) // ✅ refetch full data ⬅ true means go to last page on add

      setVisible(false)
      setOrderToEdit(null)
    } catch (err) {
      alert(err.message)
    }
  }

  // ✅ Delete order logic
  const handleDeleteOrder = async () => {
    try {
      const res = await fetch(`http://localhost:5000/api/grey-orders/${orderToDelete._id}`, {
        method: 'DELETE',
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.message || 'Delete failed')

      const updated = orders.filter((o) => o._id !== orderToDelete._id)
      setOrders(updated)
      setCurrentPage((prev) => Math.min(prev, Math.ceil(updated.length / ITEMS_PER_PAGE) || 1))
      setDeleteModalVisible(false)
      setOrderToDelete(null)
    } catch (err) {
      alert(err.message)
    }
  }

  // ✅ Filter + Search + Pagination Logic
  const filteredOrders = orders.filter((order) => {
    // const term = searchTerm.toLowerCase()
    // return order.agentName.toLowerCase().includes(term)
  })

  const paginatedOrders = orders.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE,
  )

  // ✅ Status change handler
  const handleStatusChange = (orderId, newStatus) => {
    const updated = orders.map((order) =>
      order._id === orderId ? { ...order, status: newStatus } : order,
    )
    setOrders(updated)
  }

  // ✅ UI Starts
  return (
    <CCard>
      <CCardHeader>Grey Order Master</CCardHeader>
      <CCardBody>
        {/* Header with search + Add Button */}
        <CContainer className="row justify-content-between mb-4">
          <CContainer className="col-md-4 mb-2">
            <CFormInput
              type="text"
              placeholder="Search by agent..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value)
                setCurrentPage(1)
              }}
            />
          </CContainer>
          <CContainer className="col-md-8 text-md-end">
            <CButton
              onClick={() => {
                setOrderToEdit(null)
                setVisible(true)
              }}
              color="primary"
            >
              <Icon name="Plus" size={22} className="me-2" />
              Add New Order
            </CButton>
          </CContainer>
        </CContainer>

        {/* Modals */}
        {visible && (
          <GreyOrderFormModal
            key={orderToEdit?._id || 'new'}
            isVisible={visible}
            setIsVisible={setVisible}
            onSubmit={handleSaveOrder}
            initialData={orderToEdit}
          />
        )}

        <GreyOrderDeleteModal
          visible={deleteModalVisible}
          order={orderToDelete}
          onCancel={() => setDeleteModalVisible(false)}
          onConfirm={handleDeleteOrder}
        />

        {/* Table + Pagination */}
        {loading ? (
          <p>Loading orders...</p>
        ) : (
          <>
            <GreyOrderTable
              orders={paginatedOrders}
              onEdit={(order) => {
                setOrderToEdit(order)
                setVisible(true)
              }}
              onDelete={(order) => {
                setOrderToDelete(order)
                setDeleteModalVisible(true)
              }}
              onStatusChange={handleStatusChange}
            />
            <PaginationControls
              currentPage={currentPage}
              totalPages={Math.ceil(filteredOrders.length / ITEMS_PER_PAGE)}
              onPageChange={setCurrentPage}
            />
          </>
        )}
      </CCardBody>
    </CCard>
  )
}
