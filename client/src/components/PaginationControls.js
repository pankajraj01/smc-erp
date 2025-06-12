import { CPagination, CPaginationItem } from '@coreui/react'

/**
 * PaginationControls Component
 *
 * Props:
 * - currentPage: number → current active page
 * - totalPages: number → total number of pages
 * - onPageChange: function → function to update page number (e.g., setCurrentPage)
 *
 * This component renders pagination buttons and handles navigation logic.
 */
export default function PaginationControls({ currentPage, totalPages, onPageChange }) {
  // 🧠 Optimization: If only 1 page, no need to show pagination
  if (totalPages <= 1) return null

  return (
    <CPagination align="center" className="mt-3">
      {/* ◀️ Previous Button */}
      <CPaginationItem
        disabled={currentPage === 1} // disable if on first page
        onClick={() => onPageChange(currentPage - 1)} // go to previous page
      >
        &laquo;
      </CPaginationItem>

      {/* 🔢 Page Numbers (e.g., 1 2 3 ...) */}
      {[...Array(totalPages)].map((_, index) => {
        const pageNumber = index + 1
        return (
          <CPaginationItem
            key={pageNumber}
            active={currentPage === pageNumber} // highlight current page
            onClick={() => onPageChange(pageNumber)} // go to selected page
          >
            {pageNumber}
          </CPaginationItem>
        )
      })}

      {/* ▶️ Next Button */}
      <CPaginationItem
        disabled={currentPage === totalPages} // disable if on last page
        onClick={() => onPageChange(currentPage + 1)} // go to next page
      >
        &raquo;
      </CPaginationItem>
    </CPagination>
  )
}
