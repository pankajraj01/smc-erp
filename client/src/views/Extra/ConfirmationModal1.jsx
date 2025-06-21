// 🌟 BEAUTIFUL CONFIRMATION MODAL — ConfirmationModal.jsx
import {
  CBadge,
  CButton,
  CCard,
  CCardBody,
  CCol,
  CContainer,
  CModal,
  CModalBody,
  CModalHeader,
  CModalTitle,
  CRow,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
} from '@coreui/react'
import { useNavigate } from 'react-router-dom'

export default function ConfirmationModal({
  isVisible,
  setIsVisible,
  neftNo,
  neftDate,
  formData,
  billRows,
  totalPartyNeftAmount,
  tdsTotal,
  remark,
}) {
  const navigate = useNavigate()

  const handleSave = async () => {
    const finalPayload = {
      neftNo,
      neftDate: new Date(neftDate), // ensure it's a Date object
      neftAmount: totalPartyNeftAmount,
      tdsTotal,
      neftStatus: 'Pending',
      remark,
      parties: [
        {
          partyId: formData.partyId, // ✅ now real ID from DB
          partyName: formData.partyName,
          bank: {
            bankName: formData.bankName,
            accNo: formData.accNo,
            ifsc: formData.ifsc,
          },
          bills: billRows.map((bill) => ({
            ...bill,
            billDate: new Date(bill.billDate),
          })),
          totalPartyNeftAmount,
          remark,
          partyStatus: 'Pending',
        },
      ],
    }
    console.log('payload', finalPayload)

    const res = await fetch('http://localhost:5000/api/neft-request/create', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(finalPayload),
    })

    let result = {}
    try {
      result = await res.json()
    } catch (e) {
      console.error('❌ Failed to parse JSON:', e)
    }

    if (res.ok) {
      alert('✅ NEFT saved successfully!')
      setIsVisible(false)
    } else {
      alert('❌ Failed to save: ' + (result.message || 'Server Error'))
    }
  }

  return (
    <CModal
      size="xl"
      visible={isVisible}
      backdrop="static"
      keyboard={false}
      onClose={() => setIsVisible(false)}
    >
      <CModalHeader className="bg-success text-white">
        <CModalTitle>✅ Confirm NEFT Entry</CModalTitle>
      </CModalHeader>
      <CModalBody>
        {/* Party & Bank Section */}
        <CCard className="shadow-sm mb-4 border-start border-success border-4">
          <CCardBody>
            <CRow>
              <CCol md={8}>
                <h5 className="text-muted">Party Name:</h5>
                <h4 className="fw-bold text-success">{formData.partyName}</h4>

                <CCard className="p-3 bg-light border">
                  <CRow className="mb-2">
                    <CCol>
                      <strong>Bank Name:</strong>
                    </CCol>
                    <CCol>{formData.bankName}</CCol>
                  </CRow>
                  <CRow className="mb-2">
                    <CCol>
                      <strong>Account No:</strong>
                    </CCol>
                    <CCol>{formData.accNo}</CCol>
                  </CRow>
                  <CRow>
                    <CCol>
                      <strong>IFSC Code:</strong>
                    </CCol>
                    <CCol>{formData.ifsc}</CCol>
                  </CRow>
                </CCard>
              </CCol>

              <CCol
                md={4}
                className="bg-light rounded p-4 shadow-sm border-start border-success border-4 d-flex flex-column justify-content-between"
              >
                <CContainer>
                  {/* NEFT No */}
                  <CRow className="mb-3">
                    <CCol xs="5">
                      <small className="text-muted">NEFT No</small>
                    </CCol>
                    <CCol>
                      <h4 className="fw-bold text-success mb-0">#{neftNo}</h4>
                    </CCol>
                  </CRow>

                  {/* NEFT Date */}
                  <CRow className="mb-3">
                    <CCol xs="5">
                      <small className="text-muted">Date</small>
                    </CCol>
                    <CCol>
                      <h6 className="fw-semibold text-dark mb-0">{neftDate}</h6>
                    </CCol>
                  </CRow>

                  {/* NEFT Status */}
                  <CRow>
                    <CCol xs="5">
                      <small className="text-muted">Status</small>
                    </CCol>
                    <CCol>
                      <CBadge
                        color={
                          formData.neftStatus === 'Paid'
                            ? 'success'
                            : formData.neftStatus === 'Pending'
                              ? 'warning'
                              : formData.neftStatus === 'Partial'
                                ? 'info'
                                : 'secondary'
                        }
                        className="px-3 py-1"
                      >
                        {formData.neftStatus || 'Pending'}
                      </CBadge>
                    </CCol>
                  </CRow>
                </CContainer>
              </CCol>
            </CRow>
          </CCardBody>
        </CCard>

        {/* Bill Details Table */}
        <CCard className="shadow-sm mb-4 border-start border-info border-4">
          <CCardBody>
            <h6 className="text-info mb-3">Bill Breakdown</h6>
            <CTable bordered responsive hover striped className="text-center">
              <CTableHead color="light">
                <CTableRow>
                  <CTableHeaderCell>Sr.</CTableHeaderCell>
                  <CTableHeaderCell>Bill No</CTableHeaderCell>
                  <CTableHeaderCell>Date</CTableHeaderCell>
                  <CTableHeaderCell>Amount</CTableHeaderCell>
                  <CTableHeaderCell>Discount</CTableHeaderCell>
                  <CTableHeaderCell>RD</CTableHeaderCell>
                  <CTableHeaderCell>TDS</CTableHeaderCell>
                  <CTableHeaderCell>Net</CTableHeaderCell>
                </CTableRow>
              </CTableHead>
              <CTableBody>
                {billRows.map((row, index) => (
                  <CTableRow key={index}>
                    <CTableDataCell>{index + 1}</CTableDataCell>
                    <CTableDataCell>{row.billNo}</CTableDataCell>
                    <CTableDataCell>{row.billDate}</CTableDataCell>
                    <CTableDataCell>{row.billAmount}</CTableDataCell>
                    <CTableDataCell>{row.discount}</CTableDataCell>
                    <CTableDataCell>{row.rd}</CTableDataCell>
                    <CTableDataCell>{row.tds}</CTableDataCell>
                    <CTableDataCell>{row.netAmount}</CTableDataCell>
                  </CTableRow>
                ))}
              </CTableBody>
            </CTable>
          </CCardBody>
        </CCard>

        {/* Summary & Remark */}
        <CCard className="mb-4 shadow-sm">
          <CCardBody>
            <CRow>
              <CCol md={8}>
                <h6 className="text-muted">Remark:</h6>
                <p className="border p-3 bg-light rounded">{remark}</p>
              </CCol>
              <CCol>
                <CCard className="bg-light p-3">
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

        {/* Actions */}
        <CRow className="my-3">
          <CCol className="d-flex justify-content-end gap-2">
            <CButton color="danger" variant="outline" onClick={() => setIsVisible(false)}>
              Cancel
            </CButton>
            <CButton color="success" onClick={handleSave}>
              ✅ Confirm & Save
            </CButton>
          </CCol>
        </CRow>
      </CModalBody>
    </CModal>
  )
}
