import { CButton, CModal, CModalBody, CModalFooter, CModalHeader, CModalTitle } from '@coreui/react'

export default function GreyOrderDeleteModal({ visible, order, onCancel, onConfirm }) {
  return (
    <CModal visible={visible} onClose={onCancel}>
      <CModalHeader>
        <CModalTitle>Confirm Delete</CModalTitle>
      </CModalHeader>
      <CModalBody>
        Are you sure you want to delete order <strong>#{order?.orderNo}</strong> placed by{' '}
        <strong>{order?.partyName}</strong>?
      </CModalBody>
      <CModalFooter>
        <CButton color="secondary" onClick={onCancel}>
          Cancel
        </CButton>
        <CButton color="danger" onClick={onConfirm}>
          Delete
        </CButton>
      </CModalFooter>
    </CModal>
  )
}
