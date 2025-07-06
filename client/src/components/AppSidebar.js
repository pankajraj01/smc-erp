import React from 'react'
import { useSelector, useDispatch } from 'react-redux'

import {
  CCloseButton,
  CCol,
  CFormSelect,
  CRow,
  CSidebar,
  CSidebarBrand,
  CSidebarFooter,
  CSidebarHeader,
  CSidebarToggler,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'

import { AppSidebarNav } from './AppSidebarNav'

import logo from '../assets/images/logo.png'
import { sygnet } from 'src/assets/brand/sygnet'

// sidebar nav config
import navigation from '../_nav'

const AppSidebar = () => {
  const dispatch = useDispatch()
  const unfoldable = useSelector((state) => state.sidebarUnfoldable)
  const sidebarShow = useSelector((state) => state.sidebarShow)

  return (
    <CSidebar
      className="border-end"
      colorScheme="dark"
      position="fixed"
      unfoldable={unfoldable}
      visible={sidebarShow}
      onVisibleChange={(visible) => {
        dispatch({ type: 'set', sidebarShow: visible })
      }}
    >
      <CSidebarHeader className="border-bottom">
        <CSidebarBrand
          className="w-100 flex justify-content-center align-items-center text-decoration-none"
          to="/"
        >
          <CRow className="w-100 text-center ">
            <CCol>
              <img src={logo} alt="Logo" className="sidebar-brand-full" height={52} />
              <img src={logo} alt="Logo" className="sidebar-brand-narrow" height={32} />
            </CCol>
            <CCol className="sidebar-brand-full">
              <span
                className="sidebar-brand-full text-warning fw-bold fs-6 d-block mt-2 text-decoration-none text-center"
                style={{
                  letterSpacing: '0.5px',
                  maxWidth: '100%',
                  wordWrap: 'break-word',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}
              >
                Shree Mega Creation
              </span>
            </CCol>
          </CRow>
          <CRow className="w-100 mt-3 px-3 sidebar-brand-full">
            <CCol className="text-center">
              <label
                className="text-light fw-semibold small mb-1 d-block"
                style={{ letterSpacing: '0.5px' }}
              >
                Financial Year
              </label>
              <CFormSelect
                className="form-select w-100 text-center py-1 fw-medium border-0 rounded-3 shadow-sm"
                style={{
                  backgroundColor: '#ffffff',
                  color: '#343a40',
                  fontSize: '0.875rem',
                  maxWidth: '180px',
                  margin: '0 auto',
                }}
                onChange={(e) => {
                  // setTypeFilter(e.target.value)
                  // setCurrentPage(1)
                }}
              >
                <option value="FY 2025-2026">FY 2025-2026</option>
                <option value="FY 2024-2025">FY 2024-2025</option>
                <option value="FY 2023-2024">FY 2023-2024</option>
              </CFormSelect>
            </CCol>
          </CRow>
        </CSidebarBrand>

        <CCloseButton
          className="d-lg-none"
          dark
          onClick={() => dispatch({ type: 'set', sidebarShow: false })}
        />
      </CSidebarHeader>

      <AppSidebarNav items={navigation} />
      <CSidebarFooter className="border-top d-none d-lg-flex">
        <CSidebarToggler
          onClick={() => dispatch({ type: 'set', sidebarUnfoldable: !unfoldable })}
        />
      </CSidebarFooter>
    </CSidebar>
  )
}

export default React.memo(AppSidebar)
