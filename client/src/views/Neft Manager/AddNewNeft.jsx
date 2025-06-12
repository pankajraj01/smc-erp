import {
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
import { useNavigate } from 'react-router-dom'
import partyList from '../../data/partyList'
import neftData from '../../data/neftData'
import Select from 'react-select'
import ConfirmationModal from './ConfirmationModal'

export default function AddNewNeft() {
  const [visible, setVisible] = useState(false)
  const navigate = useNavigate()
  const neftNo = neftData.length + 1

  const neftDate = new Date().toLocaleDateString('en-IN')
  const [formData, setFormData] = useState({
    partyName: '',
    bankName: '',
    accountNo: '',
    ifscCode: '',
  })
  const [billRows, setBillRows] = useState([
    { billNo: '', date: '', amount: '', discount: '', rd: '', tds: '', finalAmount: '' },
  ])
  const options = partyList.map((p) => ({
    value: p.partyName,
    label: p.partyName,
  }))
  const [totalNetAmount, setTotalNetAmount] = useState(0)
  const [totalTdsAmount, setTotalTdsAmount] = useState(0)
  const [remark, setRemark] = useState('')

  const calculateTotalNetAmount = (rows) => {
    const totalA = rows.reduce((sum, row) => {
      return sum + (parseFloat(row.finalAmount) || 0)
    }, 0)
    const totalTds = rows.reduce((sum, row) => {
      return sum + (parseFloat(row.tds) || 0)
    }, 0)
    setTotalNetAmount(totalA)
    setTotalTdsAmount(totalTds)
  }

  const handleRowChange = (index, field, value) => {
    const updatedRows = [...billRows]
    updatedRows[index][field] = value

    // Auto-calculate finalAmount when any numeric field changes
    const { amount, discount, rd, tds } = updatedRows[index]

    const a = parseFloat(amount) || 0
    const d = parseFloat(discount) || 0
    const r = parseFloat(rd) || 0
    const t = parseFloat(tds) || 0

    updatedRows[index].finalAmount = a - d - r - t

    const totalNetAmount = billRows.reduce((sum, row) => {
      return sum + (parseFloat(row.finalAmount) || 0)
    }, 0)
    const totalTdsAmount = billRows.reduce((sum, row) => {
      return sum + (parseFloat(row.tds) || 0)
    }, 0)

    setTotalNetAmount(totalNetAmount)
    setTotalTdsAmount(totalTdsAmount)

    setBillRows(updatedRows)
  }
  const handleAddRow = () => {
    setBillRows((prev) => [
      ...prev,
      { billNo: '', date: '', amount: 0, discount: 0, rd: 0, tds: 0, finalAmount: 0 },
    ])
  }
  const handleDeleteRow = (index) => {
    if (billRows.length === 1) return // don't delete the last row
    const updatedRows = [...billRows]
    updatedRows.splice(index, 1)
    setBillRows(updatedRows)
    calculateTotalNetAmount(updatedRows)
  }

  const handleRowReset = (index) => {
    const resetRow = {
      billNo: '',
      date: '',
      amount: 0,
      discount: 0,
      rd: 0,
      tds: 0,
      finalAmount: 0,
      remark: '',
    }

    const updatedRows = [...billRows]
    updatedRows[index] = resetRow

    setBillRows(updatedRows)
    calculateTotalNetAmount(updatedRows) // update total if needed
  }

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
      setFormData({
        partyName: selectedParty,
        bankName: '',
        accountNo: '',
        ifscCode: '',
      })
    }
  }

  return (
    <>
      <CContainer className="row align-items-center justify-content-between mb-4">
        {/* <!-- Left: side Header --> */}
        <h1 className="col-md-6 mb-2 mb-md-0 ">Create New Neft</h1>

        {/* <!-- Right: Filter + Add New Buttons --> */}
        <CContainer className="col-md-6 text-md-end ">
          <CButton color="success" onClick={() => setVisible(!visible)}>
            Save
          </CButton>
        </CContainer>
      </CContainer>
      <CCard>
        <CCardBody>
          <CRow>
            <CCol>
              <CRow>
                <CCol xs={3} className="mb-3">
                  <CFormLabel className="col-form-label">Party Name :</CFormLabel>
                </CCol>
                <CCol>
                  <Select
                    options={options}
                    isSearchable
                    placeholder="Select or type party name"
                    onChange={(selected) => {
                      setFormData((prev) => ({
                        ...prev,
                        partyName: selected.value,
                      }))
                      handlePartyChange({ target: { value: selected.value } })
                    }}
                  />
                </CCol>
              </CRow>
              <CContainer className="border border-dark">
                <CRow>
                  <CCol sm={8} className="">
                    <CRow className="my-2">
                      <CCol>
                        <CFormInput value={formData.bankName} readOnly placeholder="Bank Name" />
                      </CCol>
                    </CRow>
                    <CRow>
                      <CCol>
                        <CFormInput value={formData.accountNo} readOnly placeholder="Account No" />
                      </CCol>
                    </CRow>
                    <CRow className="my-2">
                      <CCol>
                        <CFormInput value={formData.ifscCode} readOnly placeholder="IFSC Code" />
                      </CCol>
                    </CRow>
                  </CCol>
                  <CCol>
                    <CRow className="my-3">
                      <CCol>
                        <CButton color="dark" onClick={() => navigate('/master/party-master')}>
                          + Party
                        </CButton>
                      </CCol>
                    </CRow>
                  </CCol>
                </CRow>
              </CContainer>
            </CCol>
            <CCol>
              <CRow className=" m-2 align-items-center justify-content-end">
                <CCol xs="auto">
                  <h3>Neft No. :</h3>
                </CCol>
                <CCol xs="auto">
                  <h1>{neftNo}</h1>
                </CCol>
              </CRow>
              <CRow className=" m-2 align-items-center justify-content-end">
                <CCol xs="auto">
                  <h3>Neft Date :</h3>
                </CCol>
                <CCol xs="auto">
                  <h3>{neftDate}</h3>
                </CCol>
              </CRow>
            </CCol>
          </CRow>
        </CCardBody>
      </CCard>
      <CCard className="my-4">
        <CCardBody>
          <CRow className="mt-4">
            <CTable bordered responsive>
              <CTableHead>
                <CTableRow className="text-center">
                  <CTableHeaderCell scope="col">Sr.</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Bill No.</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Bill Date</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Bill Amount</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Discount</CTableHeaderCell>
                  <CTableHeaderCell scope="col">RD</CTableHeaderCell>
                  <CTableHeaderCell scope="col">TDS</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Net Amount</CTableHeaderCell>
                  <CTableHeaderCell scope="col"></CTableHeaderCell>
                </CTableRow>
              </CTableHead>
              <CTableBody>
                {billRows.map((row, index) => (
                  <CTableRow key={index}>
                    <CTableHeaderCell scope="row">{index + 1}</CTableHeaderCell>
                    <CTableDataCell>
                      <CFormInput
                        type="text"
                        value={row.billNo}
                        onChange={(e) => handleRowChange(index, 'billNo', e.target.value)}
                        placeholder="Enter Bill No."
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
                        type="number"
                        value={row.amount}
                        onChange={(e) => handleRowChange(index, 'amount', e.target.value)}
                        placeholder="0"
                      />
                    </CTableDataCell>
                    <CTableDataCell>
                      <CFormInput
                        type="number"
                        value={row.discount}
                        onChange={(e) => handleRowChange(index, 'discount', e.target.value)}
                        placeholder="0"
                      />
                    </CTableDataCell>
                    <CTableDataCell>
                      <CFormInput
                        type="number"
                        value={row.rd}
                        onChange={(e) => handleRowChange(index, 'rd', e.target.value)}
                        placeholder="0"
                      />
                    </CTableDataCell>
                    <CTableDataCell>
                      <CFormInput
                        type="number"
                        value={row.tds}
                        onChange={(e) => handleRowChange(index, 'tds', e.target.value)}
                        placeholder="0"
                      />
                    </CTableDataCell>
                    <CTableDataCell>
                      <CFormInput
                        type="number"
                        value={row.finalAmount}
                        onChange={(e) => handleRowChange(index, 'finalAmount', e.target.value)}
                        placeholder="0"
                        disabled
                      />
                    </CTableDataCell>
                    <CTableDataCell>
                      {index === 0 ? (
                        <CButton color="warning" onClick={() => handleRowReset(index)}>
                          0
                        </CButton>
                      ) : (
                        <CButton color="danger" onClick={() => handleDeleteRow(index)}>
                          -
                        </CButton>
                      )}
                    </CTableDataCell>
                  </CTableRow>
                ))}
              </CTableBody>
            </CTable>
          </CRow>
          <CRow>
            <CCol className="text-end">
              <CButton color="info" onClick={handleAddRow}>
                +
              </CButton>
            </CCol>
          </CRow>
        </CCardBody>
      </CCard>

      {/* Confirmation Modal */}
      {visible && (
        <ConfirmationModal
          isVisible={visible}
          setIsVisible={() => setVisible(!visible)}
          neftCNo={neftNo}
          neftDate={neftDate}
          formData={formData}
          billRows={billRows}
          totalNetAmount={totalNetAmount}
          totalTdsAmount={totalTdsAmount}
          remark={remark}

          // setIsVisible={() => setVisible(!visible)}
          // onSubmit={handleAddOrder}
        />
      )}

      <CCard className="mb-4">
        <CCardBody>
          <CRow>
            <CCol xs={8}>
              <CFormTextarea
                className="form-control"
                rows={3}
                name={remark}
                placeholder="Remark"
                onChange={(e) => setRemark(e.target.value)}
              ></CFormTextarea>
            </CCol>
            <CCol color="info" className="me-2 bg-light">
              <CRow className="d-flex justify-content-between align-items-center my-3">
                <CCol className="text-start">
                  <h5>Tds Total :</h5>
                </CCol>
                <CCol className="text-end">
                  <h5>&#8377;{totalTdsAmount}</h5>
                </CCol>
              </CRow>
              <CRow className="d-flex justify-content-between align-items-center">
                <CCol className="text-start">
                  <h5>Total Amount :</h5>
                </CCol>
                <CCol className="text-end">
                  <h2>&#8377;{totalNetAmount}</h2>
                </CCol>
              </CRow>
            </CCol>
          </CRow>
        </CCardBody>
      </CCard>
      <CRow className="mb-3">
        <CCol className="d-flex justify-content-end gap-2">
          <CButton color="danger">Cancel</CButton>
          <CButton color="success" onClick={() => setVisible(!visible)}>
            Save
          </CButton>
        </CCol>
      </CRow>
    </>
  )
}
