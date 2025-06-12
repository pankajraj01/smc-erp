import React from 'react'
import { CFooter } from '@coreui/react'

const AppFooter = () => {
  return (
    <CFooter className="px-4">
      <div>
        <a href="https://pankajrajpurohit.com/" target="_blank" rel="noopener noreferrer">
          Pankaj Rajpurohit
        </a>
        <span className="ms-1">&copy; 2025 Shree Mega Creation</span>
      </div>
      <div className="ms-auto">
        <span className="me-1">Powered by</span>
        <a href="https://shreemegacreation.com/" target="_blank" rel="noopener noreferrer">
          Shree Mega Creation
        </a>
      </div>
    </CFooter>
  )
}

export default React.memo(AppFooter)
