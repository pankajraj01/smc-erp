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
 * PartyTable Component - Styled like AgentTable
 *
 * Props:
 * - parties: Array of party objects to display
 * - onEdit: Function(party) → edit handler
 * - onDelete: Function(party) → delete handler
 */
export default function PartyTable({ parties, onEdit, onDelete }) {
  return (
    <CTable responsive hover align="middle" className="text-center">
      {/* Table Header */}
      <CTableHead color="primary" className="text-white">
        <CTableRow>
          <CTableHeaderCell className="text-start ps-4">Party Name</CTableHeaderCell>
          <CTableHeaderCell>Type</CTableHeaderCell>
          <CTableHeaderCell>Actions</CTableHeaderCell>
        </CTableRow>
      </CTableHead>

      {/* Table Body */}
      <CTableBody>
        {parties.length > 0 ? (
          parties.map((party, index) => (
            <CTableRow key={party._id || index}>
              {/* Party Name */}
              <CTableDataCell className="text-start ps-4">{party.partyName}</CTableDataCell>

              {/* Type Badge */}
              <CTableDataCell>
                <CBadge color={party.type === 'GREY' ? 'info' : 'success'}>{party.type}</CBadge>
              </CTableDataCell>

              {/* Action Buttons */}
              <CTableDataCell>
                <CTooltip content="Edit Party" placement="top">
                  <CButton color="warning" size="sm" className="me-2" onClick={() => onEdit(party)}>
                    <Icon name="Pencil" size={16} className="me-1" />
                    Edit
                  </CButton>
                </CTooltip>

                <CTooltip content="Delete Party" placement="top">
                  <CButton color="danger" size="sm" onClick={() => onDelete(party)}>
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
              No parties found.
            </CTableDataCell>
          </CTableRow>
        )}
      </CTableBody>
    </CTable>
  )
}
