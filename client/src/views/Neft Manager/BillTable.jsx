// File: /pages/CreateNeftPage/BillTable.jsx

import {
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CFormInput,
  CRow,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
} from '@coreui/react'

import formatForInputDate from '../../utils/formatForInputDate'

export default function BillTable({ billRows, setBillRows, calculateTotals }) {
  const handleRowChange = (index, field, value) => {
    const updatedRows = [...billRows]
    updatedRows[index][field] = value

    const a = parseFloat(updatedRows[index].billAmount) || 0
    const d = parseFloat(updatedRows[index].discount) || 0
    const r = parseFloat(updatedRows[index].rd) || 0
    const t = parseFloat(updatedRows[index].tds) || 0

    updatedRows[index].netAmount = a - d - r - t
    setBillRows(updatedRows)
    calculateTotals(updatedRows)
  }

  const handleAddRow = () => {
    setBillRows([
      ...billRows,
      { billNo: '', billDate: '', billAmount: '', discount: '', rd: '', tds: '', netAmount: '' },
    ])
  }

  const handleDeleteRow = (index) => {
    if (billRows.length === 1) return
    const updatedRows = [...billRows]
    updatedRows.splice(index, 1)
    setBillRows(updatedRows)
    calculateTotals(updatedRows)
  }

  const handleRowReset = (index) => {
    const resetRow = {
      billNo: '',
      billDate: '',
      billAmount: '',
      discount: '',
      rd: '',
      tds: '',
      netAmount: '',
    }
    const updatedRows = [...billRows]
    updatedRows[index] = resetRow
    setBillRows(updatedRows)
  }

  return (
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
                    value={formatForInputDate(row.billDate)}
                    onChange={(e) => handleRowChange(index, 'billDate', e.target.value)}
                  />
                </CTableDataCell>
                <CTableDataCell>
                  <CFormInput
                    value={row.billAmount || ''}
                    placeholder="0"
                    onChange={(e) => handleRowChange(index, 'billAmount', e.target.value)}
                  />
                </CTableDataCell>
                <CTableDataCell>
                  <CFormInput
                    value={row.discount || ''}
                    placeholder="0"
                    onChange={(e) => handleRowChange(index, 'discount', e.target.value)}
                  />
                </CTableDataCell>
                <CTableDataCell>
                  <CFormInput
                    value={row.rd || ''}
                    placeholder="0"
                    onChange={(e) => handleRowChange(index, 'rd', e.target.value)}
                  />
                </CTableDataCell>
                <CTableDataCell>
                  <CFormInput
                    value={row.tds || ''}
                    placeholder="0"
                    onChange={(e) => handleRowChange(index, 'tds', e.target.value)}
                  />
                </CTableDataCell>
                <CTableDataCell>
                  <CFormInput value={row.netAmount || ''} placeholder="0" disabled />
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
  )
}
