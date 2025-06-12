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
 * ItemTable Component
 *
 * Props:
 * - items: array → list of item objects to display
 * - onEdit: function(item) → edit handler
 * - onDelete: function(item) → delete handler
 */
export default function ItemTable({ items, onEdit, onDelete }) {
  return (
    <CTable responsive hover>
      {/* Table Head */}
      <CTableHead>
        <CTableRow>
          <CTableHeaderCell>Item Name</CTableHeaderCell>
          <CTableHeaderCell>Type</CTableHeaderCell>
          <CTableHeaderCell>Actions</CTableHeaderCell>
        </CTableRow>
      </CTableHead>

      {/* Table Body */}
      <CTableBody>
        {items.length > 0 ? (
          items.map((item, index) => (
            <CTableRow key={item._id || index}>
              <CTableDataCell>{item.itemName}</CTableDataCell>

              {/* Type as badge */}
              <CTableDataCell>
                <CBadge color={item.type === 'GREY' ? 'info' : 'success'}>{item.type}</CBadge>
              </CTableDataCell>
              <CTableDataCell>
                {/* Edit Button */}
                <CTooltip content="Edit Item" placement="top">
                  <CButton color="warning" size="sm" className="me-2" onClick={() => onEdit(item)}>
                    <Icon name="Pencil" size={16} className="me-1" />
                    Edit
                  </CButton>
                </CTooltip>

                {/* Delete Button */}
                <CTooltip content="Edit Item" placement="top">
                  <CButton color="danger" size="sm" onClick={() => onDelete(item)}>
                    <Icon name="Trash2" size={16} className="me-1" />
                    Delete
                  </CButton>
                </CTooltip>
              </CTableDataCell>
            </CTableRow>
          ))
        ) : (
          <CTableRow>
            <CTableDataCell colSpan={3} className="text-center text-muted">
              No items found.
            </CTableDataCell>
          </CTableRow>
        )}
      </CTableBody>
    </CTable>
  )
}
