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

export default function PartyFormModal({ isVisible, setIsVisible, onSubmit, initialData }) {
  const emptyForm = {
    partyName: '',
    type: 'GREY',
    bank: { bankName: '', accNo: '', ifsc: '' },
  }

  const [formData, setFormData] = useState(emptyForm)

  // Reset or load initial data
  useEffect(() => {
    setFormData(initialData || emptyForm)
  }, [initialData])

  // Input handler
  const handleChange = ({ target: { name, value } }) => {
    if (['bankName', 'accNo', 'ifsc'].includes(name)) {
      setFormData((prev) => ({
        ...prev,
        bank: { ...prev.bank, [name]: value.toUpperCase() },
      }))
    } else {
      setFormData((prev) => ({ ...prev, [name]: value.toUpperCase() }))
    }
  }

  // Submission with basic validation
  const handleSubmit = () => {
    if (!formData.partyName.trim()) {
      alert('Party name is required.')
      return
    }

    onSubmit(formData)
    if (!initialData) setFormData(emptyForm)
  }

  return (
    <CModal size="lg" visible={isVisible} onClose={() => setIsVisible(false)} backdrop="static">
      <CModalHeader className="bg-primary text-white">
        <CModalTitle>{initialData ? 'Update Party' : 'Add New Party'}</CModalTitle>
      </CModalHeader>

      <CModalBody>
        <CForm>
          {[
            { label: 'Party Name', name: 'partyName', value: formData.partyName },
            { label: 'Bank Name', name: 'bankName', value: formData.bank.bankName },
            { label: 'Account No.', name: 'accNo', value: formData.bank.accNo },
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

          <CRow className="mb-3">
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

      <CModalFooter>
        <CButton color="secondary" variant="outline" onClick={() => setIsVisible(false)}>
          Cancel
        </CButton>
        <CButton color="primary" onClick={handleSubmit}>
          {initialData ? 'Update Party' : 'Add Party'}
        </CButton>
      </CModalFooter>
    </CModal>
  )
}
