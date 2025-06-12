import {
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
  CButton,
  CBadge,
  CTooltip,
} from '@coreui/react'
import Icon from '../../../components/Icon'

/**
 * AgentTable Component - Beautiful version
 *
 * Props:
 * - agents: Array of agent objects to display
 * - onEdit: Function(agent) to edit
 * - onDelete: Function(agent) to delete
 */
export default function AgentTable({ agents, onEdit, onDelete }) {
  return (
    <CTable responsive hover align="middle" className="text-center">
      {/* Table Header */}
      <CTableHead color="primary" className="text-white">
        <CTableRow>
          <CTableHeaderCell className="text-start ps-4">Agent Name</CTableHeaderCell>
          <CTableHeaderCell>Type</CTableHeaderCell>
          <CTableHeaderCell>Actions</CTableHeaderCell>
        </CTableRow>
      </CTableHead>

      {/* Table Body */}
      <CTableBody>
        {agents.length > 0 ? (
          agents.map((agent, index) => (
            <CTableRow key={agent._id || index}>
              {/* Agent Name */}
              <CTableDataCell className="text-start ps-4">{agent.agentName}</CTableDataCell>

              {/* Type as badge */}
              <CTableDataCell>
                <CBadge color={agent.type === 'GREY' ? 'info' : 'success'}>{agent.type}</CBadge>
              </CTableDataCell>

              {/* Actions with tooltips */}
              <CTableDataCell>
                {/* Edit Button */}
                <CTooltip content="Edit Agent" placement="top">
                  <CButton color="warning" size="sm" className="me-2" onClick={() => onEdit(agent)}>
                    <Icon name="Pencil" size={16} className="me-1" />
                    Edit
                  </CButton>
                </CTooltip>

                {/* Delete Button */}
                <CTooltip content="Delete Agent" placement="top">
                  <CButton color="danger" size="sm" onClick={() => onDelete(agent)}>
                    <Icon name="Trash2" size={16} className="me-1" />
                    Delete
                  </CButton>
                </CTooltip>
              </CTableDataCell>
            </CTableRow>
          ))
        ) : (
          <CTableRow>
            <CTableDataCell colSpan={3} className="text-muted py-4">
              No agents found.
            </CTableDataCell>
          </CTableRow>
        )}
      </CTableBody>
    </CTable>
  )
}
