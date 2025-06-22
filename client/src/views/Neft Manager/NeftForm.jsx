// File: /pages/CreateNeftPage/NeftForm.jsx

import {
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CContainer,
  CFormInput,
  CFormTextarea,
  CRow,
  CBadge,
} from '@coreui/react'
import Select from 'react-select'
import BillTable from './BillTable'
import formatDate from '../../utils/formatDate'

export default function NeftForm({
  formData,
  setFormData,
  billRows,
  setBillRows,
  parties,
  neftNo,
  neftDate,
  totalPartyNeftAmount,
  tdsTotal,
  partyRemark,
  setPartyRemark,
  calculateTotals,
  neftStatus,
  onSave,
  onCancel,
}) {
  const handlePartyChange = (selected) => {
    const selectedParty = parties.find((p) => p._id === selected.value)
    if (selectedParty) {
      setFormData({
        partyId: selectedParty._id,
        partyName: selectedParty.partyName,
        bankName: selectedParty.bank?.bankName || '',
        accNo: selectedParty.bank?.accNo || '',
        ifsc: selectedParty.bank?.ifsc || '',
      })
    }
  }

  return (
    <>
      {/* Header */}
      <CContainer className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="fw-bold text-primary">📝 Create New NEFT Request</h2>
        <CButton color="success" className="shadow-sm px-4 fw-bold" onClick={onSave}>
          💾 Save NEFT
        </CButton>
      </CContainer>

      {/* Party + Bank Info */}
      <CCard className="shadow-sm mb-4 border-start border-success border-4 rounded-3">
        <CCardHeader className="bg-light border-bottom">
          <h6 className="text-success mb-0">Party & Bank Details</h6>
        </CCardHeader>
        <CCardBody>
          <CRow>
            <CCol md={8}>
              <CRow className="align-items-center mb-3">
                <CCol xs={3}>
                  <label className="form-label fw-semibold mb-0">Party Name</label>
                </CCol>
                <CCol>
                  <Select
                    options={parties.map((p) => ({ value: p._id, label: p.partyName }))}
                    isSearchable
                    placeholder="Select or type party name"
                    value={
                      formData.partyId
                        ? { value: formData.partyId, label: formData.partyName }
                        : null
                    }
                    onChange={handlePartyChange}
                  />
                </CCol>
              </CRow>

              <CRow className="align-items-center mb-2">
                <CCol xs={3}>
                  <label className="form-label mb-0">Bank Name</label>
                </CCol>
                <CCol>
                  <CFormInput size="sm" value={formData.bankName} readOnly />
                </CCol>
              </CRow>
              <CRow className="align-items-center mb-2">
                <CCol xs={3}>
                  <label className="form-label mb-0">Account No</label>
                </CCol>
                <CCol>
                  <CFormInput size="sm" value={formData.accNo} readOnly />
                </CCol>
              </CRow>
              <CRow className="align-items-center mb-2">
                <CCol xs={3}>
                  <label className="form-label mb-0">IFSC Code</label>
                </CCol>
                <CCol>
                  <CFormInput size="sm" value={formData.ifsc} readOnly />
                </CCol>
              </CRow>
            </CCol>

            <CCol
              md={4}
              className="bg-light rounded p-4 shadow-sm border-start border-success border-4"
            >
              <CContainer>
                <CRow className="mb-3 align-items-center">
                  <CCol xs="5">
                    <small className="text-muted">NEFT No</small>
                  </CCol>
                  <CCol>
                    <h4 className="fw-bold text-success mb-0">#{neftNo || '...'}</h4>
                  </CCol>
                </CRow>
                <CRow className="mb-3 align-items-center">
                  <CCol xs="5">
                    <small className="text-muted">Date</small>
                  </CCol>
                  <CCol>
                    <h6 className="fw-semibold text-dark mb-0">{formatDate(neftDate)}</h6>
                  </CCol>
                </CRow>
                <CRow className="align-items-center">
                  <CCol xs="5">
                    <small className="text-muted">Status</small>
                  </CCol>
                  <CCol>
                    <CBadge
                      color={
                        neftStatus === 'Paid'
                          ? 'success'
                          : neftStatus === 'Partial'
                            ? 'info'
                            : neftStatus === 'Cancelled'
                              ? 'secondary'
                              : 'warning'
                      }
                      className="px-3 py-1 cursor-pointer"
                      // onClick={handleNeftStatusToggle}
                    >
                      {neftStatus}
                    </CBadge>
                  </CCol>
                </CRow>
              </CContainer>
            </CCol>
          </CRow>
        </CCardBody>
      </CCard>

      {/* Bill Table */}
      <BillTable billRows={billRows} setBillRows={setBillRows} calculateTotals={calculateTotals} />

      {/* Summary + Remark */}
      <CCard className="mb-4 shadow-sm">
        <CCardBody>
          <CRow>
            <CCol md={8}>
              <CFormTextarea
                rows={3}
                value={partyRemark}
                placeholder="📝 Add any remarks for Party here..."
                onChange={(e) => setPartyRemark(e.target.value)}
              />
            </CCol>
            <CCol>
              <CCard className="bg-light px-3 py-2">
                <CRow className="mb-2">
                  <CCol className="text-start">TDS Total:</CCol>
                  <CCol className="text-end text-info fw-bold">₹ {tdsTotal}</CCol>
                </CRow>
                <CRow>
                  <CCol className="text-start">Total Amount:</CCol>
                  <CCol className="text-end text-success fw-bold fs-4">
                    ₹ {totalPartyNeftAmount}
                  </CCol>
                </CRow>
              </CCard>
            </CCol>
          </CRow>
        </CCardBody>
      </CCard>

      {/* Bottom Buttons */}
      <CRow className="mb-4">
        <CCol className="d-flex justify-content-end gap-2">
          <CButton color="danger" variant="outline" onClick={onCancel}>
            Cancel
          </CButton>
          <CButton color="success" onClick={onSave}>
            Save NEFT
          </CButton>
        </CCol>
      </CRow>
    </>
  )
}
