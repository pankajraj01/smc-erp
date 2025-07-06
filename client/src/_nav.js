import React from 'react'
import CIcon from '@coreui/icons-react'
import {
  cilBell,
  cilCalculator,
  cilChartPie,
  cilCursor,
  cilDescription,
  cilDrop,
  cilExternalLink,
  cilNotes,
  cilPencil,
  cilPuzzle,
  cilSpeedometer,
  cilStar,
} from '@coreui/icons'
import { CNavGroup, CNavItem, CNavTitle } from '@coreui/react'

const _nav = [
  {
    component: CNavItem,
    name: 'Dashboard',
    to: '/dashboard',
    icon: <CIcon icon={cilSpeedometer} customClassName="nav-icon" />,
    badge: {
      color: 'info',
      text: 'NEW',
    },
  },

  // Gray Manager

  {
    component: CNavTitle,
    name: 'Grey Manager',
  },
  {
    component: CNavItem,
    name: 'Grey Orders',
    to: '/grey-orders',
    icon: <CIcon icon={cilNotes} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'Grey Received',
    to: '/grey-received',
    icon: <CIcon icon={cilNotes} customClassName="nav-icon" />,
  },

  // Neft Manager
  {
    component: CNavTitle,
    name: 'Neft Manager',
  },
  {
    component: CNavItem,
    name: 'Neft Manager',
    to: '/neft-manager',
    icon: <CIcon icon={cilCalculator} customClassName="nav-icon" />,
  },

  // Master

  {
    component: CNavTitle,
    name: 'Master',
  },

  {
    component: CNavItem,
    name: 'Item Master',
    to: '/master/item',
    icon: <CIcon icon={cilDescription} customClassName="nav-icon" />,
  },

  {
    component: CNavItem,
    name: 'Party Master',
    to: '/master/party',
    icon: <CIcon icon={cilDescription} customClassName="nav-icon" />,
  },

  {
    component: CNavItem,
    name: 'Agent Master',
    to: '/master/agent',
    icon: <CIcon icon={cilDescription} customClassName="nav-icon" />,
  },

  {
    component: CNavItem,
    name: 'Mill Master',
    to: '/master/mill',
    icon: <CIcon icon={cilDescription} customClassName="nav-icon" />,
  },

  // {
  //   component: CNavItem,
  //   name: 'Docs',
  //   href: 'https://coreui.io/react/docs/templates/installation/',
  //   icon: <CIcon icon={cilDescription} customClassName="nav-icon" />,
  // },
  // {
  //   component: CNavTitle,
  //   name: 'Theme',
  // },
  // {
  //   component: CNavItem,
  //   name: 'Colors',
  //   to: '/theme/colors',
  //   icon: <CIcon icon={cilDrop} customClassName="nav-icon" />,
  // },
  // {
  //   component: CNavTitle,
  //   name: 'Components',
  // },
  // {
  //   component: CNavGroup,
  //   name: 'Base',
  //   to: '/base',
  //   icon: <CIcon icon={cilPuzzle} customClassName="nav-icon" />,
  //   items: [
  //     {
  //       component: CNavItem,
  //       name: 'Accordion',
  //       to: '/base/accordion',
  //     },
  //     {
  //       component: CNavItem,
  //       name: (
  //         <React.Fragment>
  //           {'Calendar'}
  //           <CIcon icon={cilExternalLink} size="sm" className="ms-2" />
  //         </React.Fragment>
  //       ),
  //       href: 'https://coreui.io/react/docs/components/calendar/',
  //       badge: {
  //         color: 'danger',
  //         text: 'PRO',
  //       },
  //     },
  //   ],
  // },
]

export default _nav
