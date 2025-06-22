import {
  CModal,
  CModalBody,
  CModalHeader,
  CModalTitle,
  CButton,
  CRow,
  CCol,
  CCard,
  CCardBody,
  CCardHeader,
  CTable,
  CTableBody,
  CTableHead,
  CTableHeaderCell,
  CTableDataCell,
  CTableRow,
  CContainer,
  CBadge,
} from '@coreui/react'

import formatDate from '../../utils/formatDate'

export default function ConfirmationModal({
  isVisible,
  setIsVisible,
  neftNo,
  neftDate,
  formData,
  billRows,
  totalPartyNeftAmount,
  tdsTotal,
  partyRemark,
  onFinalSave,
}) {
  return (
    <CModal size="xl" visible={isVisible} backdrop="static" keyboard={false} onClose={setIsVisible}>
      <CModalHeader className="bg-success text-white">
        <CModalTitle>🧾 Confirm NEFT Submission</CModalTitle>
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
                      <h6 className="fw-semibold text-dark mb-0">{formatDate(neftDate)}</h6>
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
                    <CTableDataCell>{row.billNo || '-'}</CTableDataCell>
                    <CTableDataCell>{formatDate(row.billDate)}</CTableDataCell>
                    <CTableDataCell>{row.billAmount || 0}</CTableDataCell>
                    <CTableDataCell>{row.discount || 0}</CTableDataCell>
                    <CTableDataCell>{row.rd || 0}</CTableDataCell>
                    <CTableDataCell>{row.tds || 0}</CTableDataCell>
                    <CTableDataCell>{row.netAmount || 0}</CTableDataCell>
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
                <h6 className="text-muted">Party Remark:</h6>
                <p className="border p-3 bg-light rounded">{partyRemark || '-'}</p>
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
            <CButton color="success" onClick={onFinalSave}>
              ✅ Confirm & Save
            </CButton>
          </CCol>
        </CRow>
      </CModalBody>
    </CModal>
  )
}
