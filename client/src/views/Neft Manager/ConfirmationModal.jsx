import {
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
import { isPatternOrGradient } from 'chart.js/helpers'

import { useNavigate } from 'react-router-dom'

export default function ConfirmationModal({
  isVisible,
  setIsVisible,
  neftCNo,
  neftDate,
  formData,
  billRows,
  totalNetAmount,
  totalTdsAmount,
  remark,
}) {
  const navigate = useNavigate()
  return (
    <CModal
      size="xl"
      visible={isVisible}
      backdrop="static"
      keyboard={false}
      onClose={() => setIsVisible(!isVisible)}
    >
      <CModalHeader>
        <CModalTitle>Confirmation</CModalTitle>
      </CModalHeader>
      <CModalBody>
        <CRow>
          <CCol>
            <CRow>
              <CCol xs={3} className="mb-3">
                <p>Party Name :</p>
              </CCol>
              <CCol>
                <h3>{formData.partyName}</h3>
              </CCol>
            </CRow>
            <CContainer className="border border-dark rounded-3">
              <CRow>
                <CCol className="border">
                  <CRow className="my-2">
                    <CCol>
                      <CRow>
                        <CCol>
                          <p>Bank Name :</p>
                        </CCol>
                        <CCol>
                          <p>{formData.bankName}</p>
                        </CCol>
                      </CRow>
                    </CCol>
                  </CRow>
                  <CRow>
                    <CCol>
                      <CRow>
                        <CCol>
                          <p>Account No :</p>
                        </CCol>
                        <CCol>
                          <p>{formData.accountNo}</p>
                        </CCol>
                      </CRow>
                    </CCol>
                  </CRow>
                  <CRow className="my-2">
                    <CCol>
                      <CRow>
                        <CCol>
                          <p>IFSC Code :</p>
                        </CCol>
                        <CCol>
                          <p>{formData.ifscCode}</p>
                        </CCol>
                      </CRow>
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
                <h1>{neftCNo}</h1>
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

        {/* Bills */}

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
              </CTableRow>
            </CTableHead>
            <CTableBody className="text-center">
              {billRows.map((row, index) => (
                <CTableRow key={index}>
                  <CTableHeaderCell scope="row">{index + 1}</CTableHeaderCell>
                  <CTableDataCell>
                    <p>{row.billNo}</p>
                  </CTableDataCell>
                  <CTableDataCell>
                    <p>{row.date}</p>
                  </CTableDataCell>
                  <CTableDataCell>
                    <p>{row.amount}</p>
                  </CTableDataCell>
                  <CTableDataCell>
                    <p>{row.rd}</p>
                  </CTableDataCell>
                  <CTableDataCell>
                    <p>{row.discount}</p>
                  </CTableDataCell>
                  <CTableDataCell>
                    <p>{row.tds}</p>
                  </CTableDataCell>
                  <CTableDataCell>
                    <p>{row.finalAmount}</p>
                  </CTableDataCell>
                </CTableRow>
              ))}
            </CTableBody>
          </CTable>
        </CRow>
        <CRow>
          <CCol xs={8}>
            <p className="border h-100 d-inline-block w-100 p-2" rows={3} placeholder="Remark">
              {remark}
            </p>
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
        <CRow className="my-3">
          <CCol className="d-flex justify-content-end gap-2">
            <CButton color="danger" onClick={() => setIsVisible(!isVisible)}>
              Cancel
            </CButton>
            <CButton color="success" onClick={() => navigate('/neft-manager')}>
              Save
            </CButton>
          </CCol>
        </CRow>
      </CModalBody>
    </CModal>
  )
}
