import {
  CButton,
  CCol,
  CForm,
  CFormInput,
  CFormLabel,
  CFormSelect,
  CModal,
  CModalBody,
  CModalFooter,
  CModalHeader,
  CModalTitle,
  CRow,
} from '@coreui/react'
import { useEffect, useState } from 'react'

export default function MillFormModal({ isVisible, setIsVisible, onSubmit, initialData }) {
  const emptyForm = {
    millName: '',
    bank: { bankName: '', accountNo: '', ifsc: '' },
  }

  const [formData, setFormData] = useState(emptyForm)

  // Load or reset data
  useEffect(() => {
    setFormData(initialData || emptyForm)
  }, [initialData])

  // Handle input
  const handleChange = ({ target: { name, value } }) => {
    if (['bankName', 'accountNo', 'ifsc'].includes(name)) {
      setFormData((prev) => ({
        ...prev,
        bank: { ...prev.bank, [name]: value.toUpperCase() },
      }))
    } else {
      setFormData((prev) => ({ ...prev, [name]: value.toUpperCase() }))
    }
  }

  // Submit
  const handleSubmit = () => {
    if (!formData.millName.trim()) {
      alert('Mill name is required.')
      return
    }

    onSubmit(formData)
    if (!initialData) setFormData(emptyForm)
  }

  return (
    <CModal size="lg" visible={isVisible} onClose={() => setIsVisible(false)} backdrop="static">
      <CModalHeader className="bg-primary text-white">
        <CModalTitle>{initialData ? 'Update Mill' : 'Add New Mill'}</CModalTitle>
      </CModalHeader>

      <CModalBody>
        <CForm>
          {[
            { label: 'Mill Name', name: 'millName', value: formData.millName },
            { label: 'Bank Name', name: 'bankName', value: formData.bank.bankName },
            { label: 'Account No.', name: 'accountNo', value: formData.bank.accountNo },
            { label: 'IFSC', name: 'ifsc', value: formData.bank.ifsc },
          ].map(({ label, name, value }) => (
            <CRow className="mb-3" key={name}>
              <CCol md={3}>
                <CFormLabel>{label}</CFormLabel>
              </CCol>
              <CCol md={9}>
                <CFormInput
                  name={name}
                  value={value}
                  onChange={handleChange}
                  placeholder={`Enter ${label}`}
                />
              </CCol>
            </CRow>
          ))}
        </CForm>
      </CModalBody>

      <CModalFooter>
        <CButton color="secondary" variant="outline" onClick={() => setIsVisible(false)}>
          Cancel
        </CButton>
        <CButton color="primary" onClick={handleSubmit}>
          {initialData ? 'Update Mill' : 'Add Mill'}
        </CButton>
      </CModalFooter>
    </CModal>
  )
}
