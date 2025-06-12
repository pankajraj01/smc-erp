import {
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
  CForm,
  CFormLabel,
  CFormInput,
  CFormSelect,
  CRow,
  CCol,
  CButton,
} from '@coreui/react'
import { useState, useEffect } from 'react'

/**
 * ItemFormModal Component
 *
 * Props:
 * - isVisible: boolean → modal open state
 * - setIsVisible: function → toggle modal
 * - onSubmit: function → submit handler
 * - initialData: object → item to edit (if any)
 */
export default function ItemFormModal({ isVisible, setIsVisible, onSubmit, initialData }) {
  const emptyForm = {
    itemName: '',
    type: 'GREY', // Default type
  }

  const [formData, setFormData] = useState(emptyForm)

  // Load form data when editing or resetting
  useEffect(() => {
    if (isVisible) {
      setFormData(initialData || emptyForm)
    }
  }, [initialData, isVisible])

  // Handle input changes
  const handleChange = ({ target: { name, value } }) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value.toUpperCase(),
    }))
  }

  // Submit logic with basic validation
  const handleSubmit = () => {
    if (!formData.itemName.trim()) {
      alert('Item name is required.')
      return
    }

    onSubmit(formData)

    if (!initialData) {
      setFormData(emptyForm)
    }
  }

  return (
    <CModal
      size="lg"
      visible={isVisible}
      onClose={() => setIsVisible(false)}
      backdrop="static"
      keyboard={false}
    >
      {/* 🔵 Modal Header */}
      <CModalHeader className="bg-primary text-white">
        <CModalTitle>{initialData ? 'Update Item' : 'Add New Item'}</CModalTitle>
      </CModalHeader>

      {/* 🧾 Form Body */}
      <CModalBody>
        <CForm>
          {/* Item Name Field */}
          <CRow className="mb-3">
            <CCol md={3}>
              <CFormLabel>Item Name</CFormLabel>
            </CCol>
            <CCol md={9}>
              <CFormInput
                name="itemName"
                value={formData.itemName}
                onChange={handleChange}
                placeholder="Enter Item Name"
                autoFocus
              />
            </CCol>
          </CRow>

          {/* Type Dropdown */}
          <CRow>
            <CCol md={3}>
              <CFormLabel>Type</CFormLabel>
            </CCol>
            <CCol md={9}>
              <CFormSelect
                name="type"
                value={formData.type}
                onChange={handleChange}
                options={[
                  { label: 'GREY', value: 'GREY' },
                  { label: 'FINISH', value: 'FINISH' },
                ]}
              />
            </CCol>
          </CRow>
        </CForm>
      </CModalBody>

      {/* ⚙️ Modal Footer Buttons */}
      <CModalFooter>
        <CButton color="secondary" variant="outline" onClick={() => setIsVisible(false)}>
          Cancel
        </CButton>
        <CButton color="primary" onClick={handleSubmit}>
          {initialData ? 'Update Item' : 'Add Item'}
        </CButton>
      </CModalFooter>
    </CModal>
  )
}
