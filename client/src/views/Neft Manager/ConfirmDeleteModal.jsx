import { CModal, CModalHeader, CModalBody, CModalFooter, CButton, CModalTitle } from '@coreui/react'

export default function ConfirmDeleteModal({ isVisible, setIsVisible, onConfirm, partyName }) {
  return (
    <CModal visible={isVisible} onClose={() => setIsVisible(false)}>
      <CModalHeader>
        <CModalTitle>Confirm Deletion</CModalTitle>
      </CModalHeader>
      <CModalBody>
        Are you sure you want to delete <strong>{partyName}</strong> from this NEFT?
      </CModalBody>
      <CModalFooter>
        <CButton color="secondary" onClick={() => setIsVisible(false)}>
          Cancel
        </CButton>
        <CButton color="danger" onClick={onConfirm}>
          Yes, Delete
        </CButton>
      </CModalFooter>
    </CModal>
  )
}
