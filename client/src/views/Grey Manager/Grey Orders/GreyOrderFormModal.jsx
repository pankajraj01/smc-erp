import {
  CButton,
  CCol,
  CForm,
  CFormInput,
  CFormLabel,
  CModal,
  CModalBody,
  CModalFooter,
  CModalHeader,
  CModalTitle,
  CRow,
  CBadge,
} from '@coreui/react'
import { useState, useEffect, useRef } from 'react'
import Select from 'react-select'

export default function GreyOrderFormModal({ isVisible, setIsVisible, onSubmit, initialData }) {
  const [formData, setFormData] = useState({
    agentName: '',
    itemName: '',
    rate: '',
    than: '',
    partyName: '',
    remarks: '',
    orderDate: new Date().toISOString().split('T')[0],
  })

  const [agents, setAgents] = useState([])
  const [items, setItems] = useState([])
  const [orderNo, setOrderNo] = useState('')
  const agentSelectRef = useRef(null)

  useEffect(() => {
    fetch('http://localhost:5000/api/master/agents')
      .then((res) => res.json())
      .then((data) => setAgents((data.agents || []).filter((a) => a.type === 'GREY')))
      .catch(console.error)

    fetch('http://localhost:5000/api/master/items')
      .then((res) => res.json())
      .then((data) => setItems((data.items || []).filter((i) => i.type === 'GREY')))
      .catch(console.error)

    if (!initialData) {
      fetch('http://localhost:5000/api/grey-orders')
        .then((res) => res.json())
        .then((data) => {
          const last = data.greyOrders?.slice(-1)[0]?.orderNo || '0'
          const next = String(parseInt(last) + 1)
          setOrderNo(next)
        })
        .catch(console.error)
    } else {
      setOrderNo(initialData.orderNo || '')
    }
  }, [initialData])

  useEffect(() => {
    if (initialData) {
      setFormData({
        agentName: initialData.agentName || '',
        itemName: initialData.itemName || '',
        rate: initialData.rate || '',
        than: initialData.than || '',
        partyName: initialData.partyName || '',
        remarks: initialData.remarks || '',
        orderDate: initialData.orderDate?.split('T')[0] || new Date().toISOString().split('T')[0],
      })
    }
  }, [initialData])

  useEffect(() => {
    setTimeout(() => agentSelectRef.current?.focus(), 150)
  }, [isVisible])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const dataToSend = initialData?._id ? { ...formData, _id: initialData._id } : formData
    onSubmit(dataToSend)
  }

  return (
    <CModal visible={isVisible} onClose={() => setIsVisible(false)} backdrop="static" size="lg">
      <CModalHeader className="bg-primary text-white">
        <CModalTitle>{initialData ? 'Edit Grey Order' : 'New Grey Order'}</CModalTitle>
      </CModalHeader>

      <CModalBody className="bg-light">
        <CForm onSubmit={handleSubmit}>
          <CRow className="mb-3">
            <CCol md={4}>
              <CFormLabel>Order No</CFormLabel>
              <CBadge color="info" className="fs-5 px-3 py-2 d-block rounded">
                #{orderNo}
              </CBadge>
            </CCol>
            <CCol md={4}>
              <CFormLabel>Order Date *</CFormLabel>
              <CFormInput
                type="date"
                name="orderDate"
                value={formData.orderDate}
                onChange={handleChange}
                required
              />
            </CCol>
          </CRow>

          <CRow className="mb-3">
            <CCol md={6}>
              <CFormLabel>Agent Name *</CFormLabel>
              <Select
                ref={agentSelectRef}
                name="agentName"
                value={
                  agents.find((a) => a.agentName === formData.agentName)
                    ? { label: formData.agentName, value: formData.agentName }
                    : null
                }
                onChange={(selected) =>
                  setFormData((prev) => ({ ...prev, agentName: selected.value }))
                }
                options={agents.map((a) => ({ value: a.agentName, label: a.agentName }))}
                isSearchable
                placeholder="Select or search agent..."
              />
              <CButton size="sm" color="info"  className="rounded-pill mt-2">
                + Add New Agent
              </CButton>
            </CCol>

            <CCol md={6}>
              <CFormLabel>Item Name *</CFormLabel>
              <Select
                name="itemName"
                value={
                  items.find((i) => i.itemName === formData.itemName)
                    ? { label: formData.itemName, value: formData.itemName }
                    : null
                }
                onChange={(selected) =>
                  setFormData((prev) => ({ ...prev, itemName: selected.value }))
                }
                options={items.map((i) => ({ value: i.itemName, label: i.itemName }))}
                isSearchable
                placeholder="Select or search item..."
              />
              <CButton size="sm" color="info" className="rounded-pill mt-2">
                + Add New Item
              </CButton>
            </CCol>
          </CRow>

          <CRow className="mb-3">
            <CCol md={6}>
              <CFormLabel>Rate *</CFormLabel>
              <CFormInput
                type="number"
                name="rate"
                value={formData.rate}
                onChange={handleChange}
                required
              />
            </CCol>
            <CCol md={6}>
              <CFormLabel>Than *</CFormLabel>
              <CFormInput
                type="number"
                name="than"
                value={formData.than}
                onChange={handleChange}
                required
              />
            </CCol>
          </CRow>

          <CRow className="mb-3">
            <CCol md={6}>
              <CFormLabel>Party Name</CFormLabel>
              <CFormInput name="partyName" value={formData.partyName} onChange={handleChange} />
            </CCol>
            <CCol md={6}>
              <CFormLabel>Remarks</CFormLabel>
              <CFormInput
                name="remarks"
                value={formData.remarks}
                onChange={handleChange}
                placeholder="Any special instructions or notes"
              />
            </CCol>
          </CRow>

          <div className="text-end mt-4">
            <CButton type="submit" color="success">
              {initialData ? 'Update Order' : 'Create Order'}
            </CButton>
          </div>
        </CForm>
      </CModalBody>

      <CModalFooter className="bg-light">
        <CButton color="secondary" onClick={() => setIsVisible(false)}>
          Cancel
        </CButton>
      </CModalFooter>
    </CModal>
  )
}
