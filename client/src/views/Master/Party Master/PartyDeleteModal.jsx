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
 * PartyDeleteModal - Styled confirmation modal for party deletion
 *
 * Props:
 * - visible: boolean → show/hide modal
 * - party: object → party data to show in confirmation
 * - onCancel: function → cancel button handler
 * - onConfirm: function → delete confirm handler
 */
const PartyDeleteModal = ({ visible, party, onCancel, onConfirm }) => {
  if (!party) return null

  return (
    <CModal visible={visible} onClose={onCancel} alignment="center">
      {/* 🔺 Header with warning icon */}
      <CModalHeader className="bg-danger text-white">
        <CModalTitle className="d-flex align-items-center gap-2">
          <CIcon icon={cilWarning} className="me-2" />
          Confirm Party Deletion
        </CModalTitle>
      </CModalHeader>

      {/* 📝 Body: show party details in a clean layout */}
      <CModalBody>
        <p className="mb-3">
          You are about to permanently delete the following party. This action cannot be undone.
        </p>
        <CRow className="mb-2">
          <CCol xs="4" className="fw-bold text-end">
            Name:
          </CCol>
          <CCol xs="8">{party.partyName}</CCol>
        </CRow>
        <CRow className="mb-2">
          <CCol xs="4" className="fw-bold text-end">
            Type:
          </CCol>
          <CCol xs="8">{party.type}</CCol>
        </CRow>
      </CModalBody>

      {/* ⚙️ Footer actions */}
      <CModalFooter>
        <CButton color="secondary" variant="outline" onClick={onCancel}>
          Cancel
        </CButton>
        <CButton color="danger" onClick={onConfirm}>
          Yes, Delete Party
        </CButton>
      </CModalFooter>
    </CModal>
  )
}

export default PartyDeleteModal
