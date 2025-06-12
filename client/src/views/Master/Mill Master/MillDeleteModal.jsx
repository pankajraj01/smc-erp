import React from 'react'
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
import { CIcon } from '@coreui/icons-react'
import { cilWarning } from '@coreui/icons'

/**
 * DeleteMillModal - Confirmation modal for mill deletion
 *
 * Props:
 * - visible: boolean → modal visibility
 * - mill: object → mill data to confirm deletion
 * - onCancel: function → cancel button action
 * - onConfirm: function → confirm delete action
 */
const DeleteMillModal = ({ visible, mill, onCancel, onConfirm }) => {
  if (!mill) return null

  return (
    <CModal visible={visible} onClose={onCancel} alignment="center">
      {/* Header with icon */}
      <CModalHeader className="bg-danger text-white">
        <CModalTitle className="d-flex align-items-center gap-2">
          <CIcon icon={cilWarning} className="me-2" />
          Confirm Mill Deletion
        </CModalTitle>
      </CModalHeader>

      {/* Body with mill details */}
      <CModalBody>
        <p className="mb-3">
          You are about to permanently delete the following mill. This action cannot be undone.
        </p>
        <CRow className="mb-2">
          <CCol xs="4" className="fw-bold text-end">
            Name:
          </CCol>
          <CCol xs="8">{mill.millName}</CCol>
        </CRow>
      </CModalBody>

      {/* Footer */}
      <CModalFooter>
        <CButton color="secondary" variant="outline" onClick={onCancel}>
          Cancel
        </CButton>
        <CButton color="danger" onClick={onConfirm}>
          Yes, Delete Mill
        </CButton>
      </CModalFooter>
    </CModal>
  )
}

export default DeleteMillModal
