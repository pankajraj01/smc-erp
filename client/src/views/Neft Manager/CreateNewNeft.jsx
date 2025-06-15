import {
  CBadge,
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CContainer,
  CFormInput,
  CFormLabel,
  CFormSelect,
  CFormTextarea,
  CRow,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
} from '@coreui/react'
import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import partyList from '../../data/partyList'
import neftData from '../../data/neftData'
import Select from 'react-select'
import ConfirmationModal from './ConfirmationModal'

export default function AddNewNeftBeautiful() {
  const location = useLocation()
  // 1️⃣ Get query params (for Add More Party)
  const params = new URLSearchParams(location.search)
  const urlNeftNo = params.get('neftNo')
  const urlNeftDate = params.get('neftDate')

  // 2️⃣ Get edit mode and prefilled data (for Edit)
  const isEditMode = location.state?.mode === 'edit'
  const initialParty = location.state?.partyData
  const passedNeftNo = location.state?.neftNo
  const passedNeftDate = location.state?.neftDate

  const navigate = useNavigate()
  const [visible, setVisible] = useState(false)

  // 3️⃣ Final values (prioritize edit > query > fallback)
  const neftNo = passedNeftNo || urlNeftNo || neftData.length + 1
  const neftDate = passedNeftDate || urlNeftDate || new Date().toLocaleDateString('en-IN')

  const [formData, setFormData] = useState({
    partyName: initialParty?.partyName || '',
    bankName: initialParty?.bank?.bankName || '',
    accountNo: initialParty?.bank?.accountNo || '',
    ifscCode: initialParty?.bank?.ifsc || '',
  })
  const [billRows, setBillRows] = useState(
    initialParty?.bills || [
      { billNo: '', date: '', amount: '', discount: '', rd: '', tds: '', finalAmount: '' },
    ],
  )
  const [totalNetAmount, setTotalNetAmount] = useState(0)
  const [totalTdsAmount, setTotalTdsAmount] = useState(0)
  const [remark, setRemark] = useState('')

  const options = partyList.map((p) => ({ value: p.partyName, label: p.partyName }))

  const handlePartyChange = (e) => {
    const selectedParty = e.target.value
    const selected = partyList.find((p) => p.partyName === selectedParty)
    if (selected && selected.bankDetail) {
      setFormData({
        partyName: selected.partyName,
        bankName: selected.bankDetail.bankName || '',
        accountNo: selected.bankDetail.accountNo || '',
        ifscCode: selected.bankDetail.ifscCode || '',
      })
    } else {
      setFormData({ partyName: selectedParty, bankName: '', accountNo: '', ifscCode: '' })
    }
  }

  const handleRowChange = (index, field, value) => {
    const updatedRows = [...billRows]
    updatedRows[index][field] = value

    const { amount, discount, rd, tds } = updatedRows[index]
    const a = parseFloat(amount) || 0
    const d = parseFloat(discount) || 0
    const r = parseFloat(rd) || 0
    const t = parseFloat(tds) || 0

    updatedRows[index].finalAmount = a - d - r - t
    setBillRows(updatedRows)

    const totalA = updatedRows.reduce((sum, row) => sum + (parseFloat(row.finalAmount) || 0), 0)
    const totalT = updatedRows.reduce((sum, row) => sum + (parseFloat(row.tds) || 0), 0)
    setTotalNetAmount(totalA)
    setTotalTdsAmount(totalT)
  }

  const handleAddRow = () => {
    setBillRows([
      ...billRows,
      { billNo: '', date: '', amount: '', discount: '', rd: '', tds: '', finalAmount: '' },
    ])
  }

  const handleDeleteRow = (index) => {
    if (billRows.length === 1) return
    const updatedRows = [...billRows]
    updatedRows.splice(index, 1)
    setBillRows(updatedRows)

    // 🔁 Recalculate totals after delete
    const totalA = updatedRows.reduce((sum, row) => sum + (parseFloat(row.finalAmount) || 0), 0)
    const totalT = updatedRows.reduce((sum, row) => sum + (parseFloat(row.tds) || 0), 0)
    setTotalNetAmount(totalA)
    setTotalTdsAmount(totalT)
  }

  const handleRowReset = (index) => {
    const resetRow = {
      billNo: '',
      date: '',
      amount: '',
      discount: '',
      rd: '',
      tds: '',
      finalAmount: '',
    }
    const updatedRows = [...billRows]
    updatedRows[index] = resetRow
    setBillRows(updatedRows)
  }

  return (
    <>
      {/* Header */}
      <CContainer className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="fw-bold text-primary">📝 Create New NEFT Request</h2>
        <CButton
          color="success"
          className="shadow-sm px-4 fw-bold"
          onClick={() => setVisible(true)}
        >
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
            {/* LEFT - Party & Bank Details */}
            <CCol md={8}>
              {/* Party Name Row */}
              <CRow className="align-items-center mb-3">
                <CCol xs={3}>
                  <label className="form-label fw-semibold mb-0">Party Name</label>
                </CCol>
                <CCol>
                  <Select
                    options={options}
                    isSearchable
                    placeholder="Select or type party name"
                    classNamePrefix="select"
                    onChange={(selected) => {
                      setFormData((prev) => ({ ...prev, partyName: selected.value }))
                      handlePartyChange({ target: { value: selected.value } })
                    }}
                  />
                </CCol>
              </CRow>

              {/* Bank Name Row */}
              <CRow className="align-items-center mb-2">
                <CCol xs={3}>
                  <label className="form-label mb-0">Bank Name</label>
                </CCol>
                <CCol>
                  <CFormInput
                    size="sm"
                    value={formData.bankName}
                    readOnly
                    placeholder="Bank Name"
                  />
                </CCol>
              </CRow>

              {/* Account No Row */}
              <CRow className="align-items-center mb-2">
                <CCol xs={3}>
                  <label className="form-label mb-0">Account No</label>
                </CCol>
                <CCol>
                  <CFormInput
                    size="sm"
                    value={formData.accountNo}
                    readOnly
                    placeholder="Account No"
                  />
                </CCol>
              </CRow>

              {/* IFSC Code Row */}
              <CRow className="align-items-center mb-2">
                <CCol xs={3}>
                  <label className="form-label mb-0">IFSC Code</label>
                </CCol>
                <CCol>
                  <CFormInput
                    size="sm"
                    value={formData.ifscCode}
                    readOnly
                    placeholder="IFSC Code"
                  />
                </CCol>
              </CRow>
            </CCol>

            {/* RIGHT - NEFT No. & Date */}
            <CCol
              md={4}
              className="bg-light rounded p-4 shadow-sm border-start border-success border-4"
            >
              <CContainer>
                {/* NEFT No */}
                <CRow className="mb-3 align-items-center">
                  <CCol xs="5">
                    <small className="text-muted">NEFT No</small>
                  </CCol>
                  <CCol>
                    <h4 className="fw-bold text-success mb-0">#{neftNo}</h4>
                  </CCol>
                </CRow>

                {/* NEFT Date */}
                <CRow className="mb-3 align-items-center">
                  <CCol xs="5">
                    <small className="text-muted">Date</small>
                  </CCol>
                  <CCol>
                    <h6 className="fw-semibold text-dark mb-0">{neftDate}</h6>
                  </CCol>
                </CRow>

                {/* NEFT Status */}
                <CRow className="align-items-center">
                  <CCol xs="5">
                    <small className="text-muted">Status</small>
                  </CCol>
                  <CCol>
                    <CBadge color="warning" className="px-3 py-1">
                      Pending
                    </CBadge>
                  </CCol>
                </CRow>

                {/* Optional: Add Party Button */}
                <CRow className="mt-4">
                  <CCol>
                    <CButton
                      color="dark"
                      size="sm"
                      className="w-100"
                      onClick={() => navigate('/master/party-master')}
                    >
                      + Add Party
                    </CButton>
                  </CCol>
                </CRow>
              </CContainer>
            </CCol>
          </CRow>
        </CCardBody>
      </CCard>

      {/* Bill Table */}
      <CCard className="shadow-sm mb-4 border-start border-info border-4">
        <CCardHeader className="bg-light border-bottom">
          <h6 className="text-info mb-0">Bill Details</h6>
        </CCardHeader>
        <CCardBody>
          <CTable striped bordered responsive className="text-center">
            <CTableHead>
              <CTableRow>
                <CTableHeaderCell>Sr.</CTableHeaderCell>
                <CTableHeaderCell>Bill No</CTableHeaderCell>
                <CTableHeaderCell>Date</CTableHeaderCell>
                <CTableHeaderCell>Amount</CTableHeaderCell>
                <CTableHeaderCell>Discount</CTableHeaderCell>
                <CTableHeaderCell>RD</CTableHeaderCell>
                <CTableHeaderCell>TDS</CTableHeaderCell>
                <CTableHeaderCell>Net</CTableHeaderCell>
                <CTableHeaderCell>Action</CTableHeaderCell>
              </CTableRow>
            </CTableHead>
            <CTableBody>
              {billRows.map((row, index) => (
                <CTableRow key={index}>
                  <CTableDataCell>{index + 1}</CTableDataCell>
                  <CTableDataCell>
                    <CFormInput
                      value={row.billNo}
                      onChange={(e) => handleRowChange(index, 'billNo', e.target.value)}
                    />
                  </CTableDataCell>
                  <CTableDataCell>
                    <CFormInput
                      type="date"
                      value={row.date}
                      onChange={(e) => handleRowChange(index, 'date', e.target.value)}
                    />
                  </CTableDataCell>
                  <CTableDataCell>
                    <CFormInput
                      value={row.amount}
                      placeholder="0"
                      onChange={(e) => handleRowChange(index, 'amount', e.target.value)}
                    />
                  </CTableDataCell>
                  <CTableDataCell>
                    <CFormInput
                      value={row.discount}
                      placeholder="0"
                      onChange={(e) => handleRowChange(index, 'discount', e.target.value)}
                    />
                  </CTableDataCell>
                  <CTableDataCell>
                    <CFormInput
                      value={row.rd}
                      placeholder="0"
                      onChange={(e) => handleRowChange(index, 'rd', e.target.value)}
                    />
                  </CTableDataCell>
                  <CTableDataCell>
                    <CFormInput
                      value={row.tds}
                      placeholder="0"
                      onChange={(e) => handleRowChange(index, 'tds', e.target.value)}
                    />
                  </CTableDataCell>
                  <CTableDataCell>
                    <CFormInput value={row.finalAmount} placeholder="0" disabled />
                  </CTableDataCell>
                  <CTableDataCell>
                    {billRows.length === 1 && index === 0 ? (
                      <CButton
                        color="warning"
                        variant="outline"
                        size="sm"
                        onClick={() => handleRowReset(index)}
                      >
                        🔁
                      </CButton>
                    ) : (
                      <CButton
                        color="danger"
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeleteRow(index)}
                      >
                        ❌
                      </CButton>
                    )}
                  </CTableDataCell>
                </CTableRow>
              ))}
            </CTableBody>
          </CTable>
          <CRow className="mt-3">
            <CCol className="text-end">
              <CButton color="info" onClick={handleAddRow}>
                + Add Bill
              </CButton>
            </CCol>
          </CRow>
        </CCardBody>
      </CCard>

      {/* Summary + Remark */}
      <CCard className="mb-4 shadow-sm">
        <CCardBody>
          <CRow>
            <CCol md={8}>
              <CFormTextarea
                rows={3}
                value={remark}
                placeholder="📝 Add any remarks here..."
                onChange={(e) => setRemark(e.target.value)}
              />
            </CCol>
            <CCol>
              <CCard className="bg-light p-3">
                <CRow className="mb-2">
                  <CCol className="text-start">TDS Total:</CCol>
                  <CCol className="text-end text-info fw-bold">₹ {totalTdsAmount}</CCol>
                </CRow>
                <CRow>
                  <CCol className="text-start">Total Amount:</CCol>
                  <CCol className="text-end text-success fw-bold fs-4">₹ {totalNetAmount}</CCol>
                </CRow>
              </CCard>
            </CCol>
          </CRow>
        </CCardBody>
      </CCard>

      {/* Bottom Buttons */}
      <CRow className="mb-4">
        <CCol className="d-flex justify-content-end gap-2">
          <CButton color="danger" variant="outline" onClick={() => navigate(-1)}>
            Cancel
          </CButton>
          <CButton color="success" onClick={() => setVisible(true)}>
            Save NEFT
          </CButton>
        </CCol>
      </CRow>

      {/* Modal */}
      {visible && (
        <ConfirmationModal
          isVisible={visible}
          setIsVisible={() => setVisible(false)}
          neftCNo={neftNo}
          neftDate={neftDate}
          formData={formData}
          billRows={billRows}
          totalNetAmount={totalNetAmount}
          totalTdsAmount={totalTdsAmount}
          remark={remark}
        />
      )}
    </>
  )
}
