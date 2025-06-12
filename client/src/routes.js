import { element } from 'prop-types'
import React from 'react'

const Dashboard = React.lazy(() => import('./views/dashboard/Dashboard'))
const Login = React.lazy(() => import('./views/pages/login/Login'))
// const Colors = React.lazy(() => import('./views/theme/colors/Colors'))
// const Typography = React.lazy(() => import('./views/theme/typography/Typography'))

// Base
const Accordion = React.lazy(() => import('./views/base/accordion/Accordion'))

// Grey Manager
const GreyOrders = React.lazy(() => import('./views/Grey Manager/Grey Orders/GreyOrders'))
const GreyReceived = React.lazy(() => import('./views/Grey Manager/Grey Received/GreyReceived'))

// Master
const ItemMaster = React.lazy(() => import('./views/Master/Item Master/ItemMaster'))
const PartyMaster = React.lazy(() => import('./views/Master/Party Master/PartyMaster'))
const MillMaster = React.lazy(() => import('./views/Master/Mill Master/MillMaster'))
const AgentMaster = React.lazy(() => import('./views/Master/Agent Master/AgentMaster'))

// Neft Manager
const NeftManager = React.lazy(() => import('./views/Neft Manager/NeftManager'))
const AddNewNeft = React.lazy(() => import('./views/Neft Manager/AddNewNeft'))

// const Breadcrumbs = React.lazy(() => import('./views/base/breadcrumbs/Breadcrumbs'))

const Widgets = React.lazy(() => import('./views/widgets/Widgets'))

const routes = [
  { path: '/', exact: true, name: 'Home' },
  { path: '/dashboard', name: 'Dashboard', element: Dashboard },
  { path: '/login', name: 'Login', element: Login },

  // Grey Manager
  { path: '/api/grey-orders', name: 'Grey Orders', element: GreyOrders },
  { path: '/grey-received', name: 'Grey Received', element: GreyReceived },

  // Master
  { path: '/api/master/items', name: 'Item Master', element: ItemMaster },
  { path: '/api/master/parties', name: 'Party Master', element: PartyMaster },
  { path: '/api/master/mills', name: 'Mill Master', element: MillMaster },
  { path: '/api/master/agents', name: 'Agent Master', element: AgentMaster },

  // Neft Manager
  { path: '/neft-manager', name: 'Neft Manager', element: NeftManager },
  { path: '/add-new-neft', name: 'Add New Neft', element: AddNewNeft },

  { path: '/base/accordion', name: 'Accordion', element: Accordion },

  { path: '/widgets', name: 'Widgets', element: Widgets },
]

export default routes
