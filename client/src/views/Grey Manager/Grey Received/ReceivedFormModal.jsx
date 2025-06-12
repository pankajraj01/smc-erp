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
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import agentList from '../../../data/agentList'
import itemList from '../../../data/itemList'
import millList from '../../../data/millList'
import partyList from '../../../data/partyList'

export default function ReceivedFormModal({ isVisible, setIsVisible, onSubmit }) {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    id: '',
    receiveDate: '',
    agent: '',
    quality: '',
    taka: 0,
    rate: 0,
    partyName: '',
    mill: '',
  })

  const greyAgents = agentList.filter((agent) => agent.type === 'Grey' || agent.type === 'Both')
  const greyItems = itemList.filter((item) => item.type === 'Grey' || item.type === 'Both')
  const greyParties = partyList.filter((party) => party.type === 'Grey' || party.type === 'Both')

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = () => {
    const newItem = {
      ...formData,
    }

    onSubmit(newItem) // send data back to ItemMaster
    setIsVisible(false) // close modal
    setFormData({
      id: '',
      receiveDate: '',
      agent: '',
      quality: '',
      taka: 0,
      rate: 0,
      partyName: '',
      mill: '',
    }) // reset form
  }

  return (
    <CModal
      size="lg"
      visible={isVisible}
      onClose={() => setIsVisible(!isVisible)}
      backdrop="static"
      keyboard={false}
    >
      <CModalHeader>
        <CModalTitle>Add New Grey Receive</CModalTitle>
      </CModalHeader>
      <CModalBody>
        <CForm>
          <CRow>
            <CCol xs={3} className="mb-2">
              <CFormLabel className="col-form-label">Date :</CFormLabel>
            </CCol>
            <CCol xs={6}>
              <CFormInput
                type="date"
                name="receiveDate"
                value={formData.receiveDate}
                onChange={handleChange}
              />
            </CCol>
          </CRow>

          <CRow>
            <CCol xs={3} className="mb-2">
              <CFormLabel className="col-form-label">Agent Name :</CFormLabel>
            </CCol>
            <CCol xs={6}>
              <CFormSelect type="text" name="agent" value={formData.agent} onChange={handleChange}>
                {greyAgents.map((agent) => (
                  <option key={agent.id} value={agent.agentName}>
                    {agent.agentName}
                  </option>
                ))}
              </CFormSelect>
            </CCol>
            <CCol>
              <CButton color="info" onClick={() => navigate('/master/party-master')}>
                +
              </CButton>
            </CCol>
          </CRow>
          <CRow>
            <CCol xs={3} className="mb-2">
              <CFormLabel className="col-form-label">Quality :</CFormLabel>
            </CCol>
            <CCol xs={6}>
              <CFormSelect
                type="text"
                name="quality"
                value={formData.quality}
                onChange={handleChange}
              >
                {greyItems.map((item) => (
                  <option key={item.id} value={item.itemName}>
                    {item.itemName}
                  </option>
                ))}
              </CFormSelect>
            </CCol>
            <CCol>
              <CButton color="info" onClick={() => navigate('/master/item-master')}>
                +
              </CButton>
            </CCol>
          </CRow>
          <CRow>
            <CCol xs={3} className="mb-2">
              <CFormLabel className="col-form-label">Taka :</CFormLabel>
            </CCol>
            <CCol xs={6}>
              <CFormInput
                type="number"
                name="taka"
                value={formData.taka}
                onChange={handleChange}
                placeholder="Enter Taka"
              />
            </CCol>
          </CRow>
          <CRow>
            <CCol xs={3} className="mb-2">
              <CFormLabel className="col-form-label">Rate :</CFormLabel>
            </CCol>
            <CCol xs={6}>
              <CFormInput
                type="number"
                name="rate"
                value={formData.rate}
                onChange={handleChange}
                placeholder="Enter Rate"
              />
            </CCol>
          </CRow>
          <CRow>
            <CCol xs={3} className="mb-2">
              <CFormLabel className="col-form-label">Party Name :</CFormLabel>
            </CCol>
            <CCol xs={6}>
              <CFormSelect
                type="text"
                name="partyName"
                value={formData.partyName}
                onChange={handleChange}
              >
                {greyParties.map((party) => (
                  <option key={party.id} value={party.partyName}>
                    {party.partyName}
                  </option>
                ))}
              </CFormSelect>
              {/* <CFormInput
                type="text"
                name="partyName"
                value={formData.partyName}
                onChange={handleChange}
                placeholder="Enter Weaver Name"
              /> */}
            </CCol>
            <CCol>
              <CButton color="info" onClick={() => navigate('/master/party-master')}>
                +
              </CButton>
            </CCol>
          </CRow>
          <CRow>
            <CCol xs={3} className="mb-2">
              <CFormLabel className="col-form-label">Mill Name :</CFormLabel>
            </CCol>
            <CCol xs={6}>
              <CFormSelect type="text" name="mill" value={formData.mill} onChange={handleChange}>
                {millList.map((mill) => (
                  <option key={mill.id} value={mill.millName}>
                    {mill.millName}
                  </option>
                ))}
              </CFormSelect>
              {/* <CFormInput
                type="text"
                name="mill"
                value={formData.mill}
                onChange={handleChange}
                placeholder="Enter Mill Name Here...."
              /> */}
            </CCol>
          </CRow>
        </CForm>
      </CModalBody>
      <CModalFooter>
        <CButton color="secondary" onClick={() => setIsVisible(!isVisible)}>
          Close
        </CButton>
        <CButton color="primary" onClick={handleSubmit}>
          Save changes
        </CButton>
      </CModalFooter>
    </CModal>
  )
}
