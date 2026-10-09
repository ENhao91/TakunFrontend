function Pagination({ page, totalPages, onPageChange }) {
    if (!totalPages || totalPages <= 1) {
        return null
    }

    const numbers = Array.from({ length: totalPages }, (_, index) => index)

    return (
        <div className="pagination" aria-label="分頁導覽">
            <button
                type="button"
                className="page-button"
                disabled={page <= 0}
                onClick={() => onPageChange(Math.max(0, page - 1))}
            >
                上一頁
            </button>

            {numbers.map((pageIndex) => (
                <button
                    key={pageIndex}
                    type="button"
                    className={`page-button ${pageIndex === page ? 'active' : ''}`}
                    onClick={() => onPageChange(pageIndex)}
                >
                    {pageIndex + 1}
                </button>
            ))}

            <button
                type="button"
                className="page-button"
                disabled={page >= totalPages - 1}
                onClick={() => onPageChange(Math.min(totalPages - 1, page + 1))}
            >
                下一頁
            </button>
        </div>
    )
}

export default Pagination
