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
 * MillTable Component - Styled version
 *
 * Props:
 * - mills: Array of mill objects
 * - onEdit: Function(mill) → called on edit
 * - onDelete: Function(mill) → called on delete
 */
export default function MillTable({ mills, onEdit, onDelete }) {
  return (
    <CTable responsive hover align="middle" className="text-center">
      {/* Table Header */}
      <CTableHead color="primary" className="text-white">
        <CTableRow>
          <CTableHeaderCell className="text-start ps-4">Mill Name</CTableHeaderCell>
          <CTableHeaderCell>Actions</CTableHeaderCell>
        </CTableRow>
      </CTableHead>

      {/* Table Body */}
      <CTableBody>
        {mills.length > 0 ? (
          mills.map((mill, index) => (
            <CTableRow key={mill._id || index}>
              {/* Mill Name */}
              <CTableDataCell className="text-start ps-4">{mill.millName}</CTableDataCell>

              {/* Actions */}
              <CTableDataCell>
                <CTooltip content="Edit Mill" placement="top">
                  <CButton color="warning" size="sm" className="me-2" onClick={() => onEdit(mill)}>
                    <Icon name="Pencil" size={16} className="me-1" />
                    Edit
                  </CButton>
                </CTooltip>

                <CTooltip content="Delete Mill" placement="top">
                  <CButton color="danger" size="sm" onClick={() => onDelete(mill)}>
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
              No mills found.
            </CTableDataCell>
          </CTableRow>
        )}
      </CTableBody>
    </CTable>
  )
}
