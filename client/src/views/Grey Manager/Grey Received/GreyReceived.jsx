import { useState } from 'react'
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

import greyReceived from '../../../data/greyReceived'
import ReceivedFormModal from './ReceivedFormModal'
const ITEMS_PER_PAGE = 10

export default function GreyReceived() {
  const [orders, setOrders] = useState(greyReceived)
  const [currentPage, setCurrentPage] = useState(1)
  const [visible, setVisible] = useState(false)

  const totalPages = Math.ceil(orders.length / ITEMS_PER_PAGE)

  const handleAddOrder = (newOrder) => {
    setOrders((prevOrders) => {
      const newId = prevOrders.length + 1
      const updatedOrder = { ...newOrder, id: newId }
      const updatedList = [...prevOrders, updatedOrder]
      // update both items and currentPage at once
      setCurrentPage(Math.ceil(updatedList.length / ITEMS_PER_PAGE))

      return updatedList
    })
  }

  const paginatedData = orders.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE,
  )
  return (
    <CCard>
      <CCardHeader>Grey Received</CCardHeader>
      <CCardBody>
        <CContainer className="row align-items-center justify-content-between mb-4">
          {/* <!-- Left: Search Input --> */}
          <CContainer className="col-md-4 mb-2 mb-md-0 ">
            <CFormInput
              type="text"
              className="form-control"
              placeholder="Search Received Grey..."
            />
          </CContainer>

          {/* <!-- Right: Filter + Add New Buttons --> */}
          <CContainer className="col-md-8 text-md-end ">
            <CButton className="btn btn-outline-secondary me-2">
              <i className="bi bi-funnel"></i> Filter
            </CButton>
            <CButton className="btn btn-primary" onClick={() => setVisible(!visible)}>
              <i className="bi bi-plus-circle"></i> Add New Received Grey
            </CButton>
          </CContainer>
        </CContainer>

        {visible && (
          <ReceivedFormModal
            isVisible={visible}
            setIsVisible={() => setVisible(!visible)}
            onSubmit={handleAddOrder}
          />
        )}

        <CTable responsive hover>
          <CTableHead>
            <CTableRow>
              <CTableHeaderCell scope="col">Date</CTableHeaderCell>
              <CTableHeaderCell scope="col">Agent</CTableHeaderCell>
              <CTableHeaderCell scope="col">Quality</CTableHeaderCell>
              <CTableHeaderCell scope="col">Taka</CTableHeaderCell>
              <CTableHeaderCell scope="col">Rate</CTableHeaderCell>
              <CTableHeaderCell scope="col">Party Name</CTableHeaderCell>
              <CTableHeaderCell scope="col">Mill</CTableHeaderCell>
              <CTableHeaderCell scope="col">Actions</CTableHeaderCell>
            </CTableRow>
          </CTableHead>
          <CTableBody>
            {paginatedData.map((order) => (
              <CTableRow key={order.id}>
                <CTableDataCell>{order.receiveDate}</CTableDataCell>
                <CTableDataCell>{order.agent}</CTableDataCell>
                <CTableDataCell>{order.quality}</CTableDataCell>
                <CTableDataCell>{order.taka}</CTableDataCell>
                <CTableDataCell>{order.rate}</CTableDataCell>
                <CTableDataCell>{order.partyName}</CTableDataCell>
                <CTableDataCell>{order.mill}</CTableDataCell>
                <CTableDataCell>
                  <CButton color="warning me-2 my-1">Edit</CButton>
                  <CButton color="info my-1">PDF</CButton>
                </CTableDataCell>
              </CTableRow>
            ))}
          </CTableBody>
        </CTable>

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
