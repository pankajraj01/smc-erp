import {
  CTable,
  CTableHead,
  CTableRow,
  CTableHeaderCell,
  CTableBody,
  CTableDataCell,
  CButton,
  CBadge,
  CFormSelect,
} from '@coreui/react'

import StatusBadgeCycle from '../../../components/StatusBadgeCycle'
import { Eye } from 'lucide-react'

export default function GreyOrderTable({ orders, onEdit, onDelete, onStatusChange }) {
  return (
    <CTable responsive striped bordered hover>
      <CTableHead color="dark">
        <CTableRow>
          <CTableHeaderCell>#</CTableHeaderCell>
          <CTableHeaderCell>Date</CTableHeaderCell>
          <CTableHeaderCell>Order No</CTableHeaderCell>
          <CTableHeaderCell>Status</CTableHeaderCell>
          <CTableHeaderCell>Agent</CTableHeaderCell>
          <CTableHeaderCell>Quality</CTableHeaderCell>
          <CTableHeaderCell>Than</CTableHeaderCell>
          <CTableHeaderCell>Rate</CTableHeaderCell>
          <CTableHeaderCell>Party</CTableHeaderCell>
          <CTableHeaderCell>Remarks</CTableHeaderCell>
          <CTableHeaderCell className="text-center">Actions</CTableHeaderCell>
        </CTableRow>
      </CTableHead>
      <CTableBody>
        {orders.length === 0 ? (
          <CTableRow>
            <CTableDataCell colSpan={10} className="text-center text-muted">
              No orders found.
            </CTableDataCell>
          </CTableRow>
        ) : (
          orders.filter(Boolean).map((order, index) => (
            <CTableRow key={order._id}>
              <CTableDataCell>{index + 1}</CTableDataCell>
              <CTableDataCell>
                {order?.orderDate ? new Date(order.orderDate).toLocaleDateString() : '-'}
              </CTableDataCell>
              <CTableDataCell>
                <CBadge color="info" shape="rounded-pill">
                  #{order?.orderNo || '-'}
                </CBadge>
              </CTableDataCell>
              <CTableDataCell>
                <StatusBadgeCycle
                  status={order.status || 'PENDING'}
                  onChange={(newStatus) => onStatusChange(order._id, newStatus)}
                />
              </CTableDataCell>
              <CTableDataCell>{order.agentName}</CTableDataCell>
              <CTableDataCell>{order.itemName}</CTableDataCell>
              <CTableDataCell>{order.than}</CTableDataCell>
              <CTableDataCell>{order.rate}</CTableDataCell>
              <CTableDataCell>{order.partyName || '-'}</CTableDataCell>
              <CTableDataCell className="text-wrap text-break" style={{ maxWidth: '200px' }}>
                {order.remarks || '-'}
              </CTableDataCell>
              <CTableDataCell className="text-center">
                <CButton
                  color="warning"
                  size="sm"
                  variant="outline"
                  className="me-2"
                  onClick={() => onEdit(order)}
                >
                  <Eye size={16} />
                </CButton>
                {/* <CButton color="danger" size="sm" variant="outline" onClick={() => onDelete(order)}>
                  Delete
                </CButton> */}
              </CTableDataCell>
            </CTableRow>
          ))
        )}
      </CTableBody>
    </CTable>
  )
}
