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
import { cilWarning, cilUser } from '@coreui/icons'

/**
 * AgentDeleteModal - Styled confirmation modal for agent deletion
 *
 * Props:
 * - visible: boolean → show/hide modal
 * - agent: object → agent data to show in confirmation
 * - onCancel: function → cancel button handler
 * - onConfirm: function → delete confirm handler
 */
const AgentDeleteModal = ({ visible, agent, onCancel, onConfirm }) => {
  if (!agent) return null

  return (
    <CModal visible={visible} onClose={onCancel} alignment="center">
      {/* 🔺 Header with warning icon */}
      <CModalHeader className="bg-danger text-white">
        <CModalTitle className="d-flex align-items-center gap-2">
          <CIcon icon={cilWarning} className="me-2" />
          Confirm Agent Deletion
        </CModalTitle>
      </CModalHeader>

      {/* 📝 Body: show agent details in a clean layout */}
      <CModalBody>
        <p className="mb-3">
          You are about to permanently delete the following agent. This action cannot be undone.
        </p>
        <CRow className="mb-2">
          <CCol xs="4" className="fw-bold text-end">
            Name:
          </CCol>
          <CCol xs="8">{agent.agentName}</CCol>
        </CRow>
        <CRow className="mb-2">
          <CCol xs="4" className="fw-bold text-end">
            Type:
          </CCol>
          <CCol xs="8">{agent.type}</CCol>
        </CRow>
      </CModalBody>

      {/* ⚙️ Footer actions */}
      <CModalFooter>
        <CButton color="secondary" variant="outline" onClick={onCancel}>
          Cancel
        </CButton>
        <CButton color="danger" onClick={onConfirm}>
          Yes, Delete Agent
        </CButton>
      </CModalFooter>
    </CModal>
  )
}

export default AgentDeleteModal
