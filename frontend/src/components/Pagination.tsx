export interface PaginationProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
}

export default function Pagination({
    currentPage,
    totalPages,
    onPageChange,
}: PaginationProps) {
    if (totalPages <= 1) {
        return null;
    }

    const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

    return (
        <div className="d-flex justify-content-center flex-wrap gap-2 mt-3 pb-3">
            <button
                className="btn btn-outline-primary btn-sm"
                type="button"
                disabled={currentPage === 1}
                onClick={() => onPageChange(Math.max(currentPage - 1, 1))}
            >
                Prev
            </button>

            {pages.map((page) => (
                <button
                    key={page}
                    className={`btn btn-sm ${page === currentPage ? "btn-primary" : "btn-outline-primary"}`}
                    type="button"
                    disabled={page === currentPage}
                    onClick={() => onPageChange(page)}
                    aria-current={page === currentPage ? "page" : undefined}
                >
                    {page}
                </button>
            ))}

            <button
                className="btn btn-outline-primary btn-sm"
                type="button"
                disabled={currentPage === totalPages}
                onClick={() =>
                    onPageChange(Math.min(currentPage + 1, totalPages))
                }
            >
                Next
            </button>
        </div>
    );
}
