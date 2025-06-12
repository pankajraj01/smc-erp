import {
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
  CButton,
  CRow,
  CCol,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilTrash } from '@coreui/icons'

/**
 * DeleteItemModal Component
 *
 * Props:
 * - visible: boolean → show/hide modal
 * - item: object → selected item to delete
 * - onCancel: function → called on cancel
 * - onConfirm: function → called on confirm delete
 */
export default function DeleteItemModal({ visible, item, onCancel, onConfirm }) {
  if (!item) return null

  return (
    <CModal visible={visible} onClose={onCancel} alignment="center">
      {/* 🔴 Header */}
      <CModalHeader className="bg-danger text-white">
        <CModalTitle className="d-flex align-items-center gap-2">
          <CIcon icon={cilTrash} className="me-2" />
          Confirm Item Deletion
        </CModalTitle>
      </CModalHeader>

      {/* 📝 Body with item details */}
      <CModalBody>
        <p className="mb-3">
          Are you sure you want to permanently delete this item? This action cannot be undone.
        </p>
        <CRow className="mb-2">
          <CCol xs={4} className="fw-bold text-end">
            Name:
          </CCol>
          <CCol xs={8}>{item.itemName}</CCol>
        </CRow>
        <CRow className="mb-2">
          <CCol xs={4} className="fw-bold text-end">
            Type:
          </CCol>
          <CCol xs={8}>{item.type}</CCol>
        </CRow>
      </CModalBody>

      {/* ⚙️ Footer buttons */}
      <CModalFooter>
        <CButton color="secondary" variant="outline" onClick={onCancel}>
          Cancel
        </CButton>
        <CButton color="danger" onClick={onConfirm}>
          Yes, Delete Item
        </CButton>
      </CModalFooter>
    </CModal>
  )
}
