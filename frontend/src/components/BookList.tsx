import { useEffect, useLayoutEffect, useRef, useState } from "react";
import type { Book } from "../types/Book";
import { useNavigate } from "react-router-dom";
import { BOOK_LIST_RESUME_KEY } from "../types/BookListResume";

type SortBy = "title" | "id";

function BookList({
    selectedCategories,
    onRestoreCategories,
}: {
    selectedCategories: string[];
    onRestoreCategories: (categories: string[]) => void;
}) {
    const [books, setBooks] = useState<Book[]>([]);
    const [resultsPerPage, setResultsPerPage] = useState<number>(10);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [totalBooks, setTotalBooks] = useState<number>(0);
    const [sortBy, setSortBy] = useState<SortBy>("title");
    const navigate = useNavigate();
    const skipCategoryPageResetRef = useRef(false);

    useEffect(() => {
        const raw = sessionStorage.getItem(BOOK_LIST_RESUME_KEY);
        if (!raw) return;
        try {
            const r = JSON.parse(raw) as {
                page: number;
                categories: string[];
                sortBy: SortBy;
                resultsPerPage: number;
            };
            skipCategoryPageResetRef.current = true;
            setCurrentPage(r.page);
            setSortBy(r.sortBy);
            setResultsPerPage(r.resultsPerPage);
            onRestoreCategories(r.categories ?? []);
        } catch {
            // ignore
        } finally {
            sessionStorage.removeItem(BOOK_LIST_RESUME_KEY);
        }
    }, [onRestoreCategories]);
    useEffect(() => {
        const fetchBooks = async () => {
            const categoryParams =
                selectedCategories.length > 0
                    ? "&" +
                      selectedCategories
                          .map((c) => `categories=${encodeURIComponent(c)}`)
                          .join("&")
                    : "";
            // Use Vite dev-server proxy (see vite.config.ts). ASP.NET binds List<string> from repeated "categories=" params.
            const response = await fetch(
                `/api/book?page=${currentPage}&pageSize=${resultsPerPage}&sortBy=${sortBy}${categoryParams}`
            );
            if (!response.ok) {
                const text = await response.text().catch(() => "");
                throw new Error(`GET /api/book failed: ${response.status} ${response.statusText} ${text}`);
            }
            const data = await response.json();
            setBooks(data);
        };
        fetchBooks();
    }, [currentPage, resultsPerPage, sortBy, selectedCategories]);

    useEffect(() => {
        const fetchCount = async () => {
            const categoryParams =
                selectedCategories.length > 0
                    ? "?" +
                      selectedCategories
                          .map((c) => `categories=${encodeURIComponent(c)}`)
                          .join("&")
                    : "";
            const response = await fetch(`/api/book/count${categoryParams}`);
            if (!response.ok) {
                const text = await response.text().catch(() => "");
                throw new Error(`GET /api/book/count failed: ${response.status} ${response.statusText} ${text}`);
            }

            const data = await response.json();
            setTotalBooks(data);
        };

        fetchCount().catch((err) => {
            console.error(err);
        });
    }, [selectedCategories]);

    useLayoutEffect(() => {
        if (skipCategoryPageResetRef.current) {
            skipCategoryPageResetRef.current = false;
            return;
        }
        setCurrentPage(1);
    }, [selectedCategories]);

    const totalPages = Math.ceil(totalBooks / resultsPerPage);
    const pages = totalPages > 0 ? Array.from({ length: totalPages }, (_, i) => i + 1) : [];

    useEffect(() => {
        // If the page-size change reduces total pages, keep the current page valid.
        if (totalPages > 0 && currentPage > totalPages) {
            setCurrentPage(totalPages);
        }
    }, [totalPages, currentPage]);

    return (
        <div className="py-2">
            <div className="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-3">
                <div className="d-flex align-items-center">
                    <label htmlFor="sortBy" className="me-2 mb-0 fw-semibold">Sort by:</label>
                    <select
                        id="sortBy"
                        className="form-select form-select-sm w-auto"
                        value={sortBy}
                        onChange={(e) => {
                            setSortBy(e.target.value as SortBy);
                            setCurrentPage(1);
                        }}
                    >
                        <option value="title">Book Title</option>
                        <option value="id">Book ID</option>
                    </select>
                </div>
                <div className="d-flex align-items-center">
                    <label htmlFor="resultsPerPage" className="me-2 mb-0 fw-semibold">Results Per Page:</label>
                    <select
                        id="resultsPerPage"
                        className="form-select form-select-sm w-auto"
                        value={resultsPerPage}
                        onChange={e => {
                            setResultsPerPage(parseInt(e.target.value));
                            setCurrentPage(1);
                        }}
                    >
                        <option value="5">5</option>
                        <option value="10">10</option>
                        <option value="50">50</option>
                    </select>
                </div>
            </div>

            {books.map((b) => (
                <div key={b.bookId} className="card shadow-sm mb-3">
                    <div className="card-body">
                        <h2 className="h4 mb-3">{b.title}</h2>
                        <p className="mb-1"><strong>Author: </strong>{b.author}</p>
                        <p className="mb-1"><strong>Publisher: </strong>{b.publisher}</p>
                        <p className="mb-1"><strong>ISBN: </strong>{b.isbn}</p>
                        <p className="mb-1"><strong>Classification: </strong> {b.classification}</p>
                        <p className="mb-1"><strong>Category: </strong> {b.category}</p>
                        <p className="mb-1"><strong>Pages: </strong> {b.pageCount}</p>
                        <p className="mb-3"><strong>Price: </strong> ${b.price.toFixed(2)}</p>
                        <button
                            type="button"
                            className="btn btn-primary btn-sm"
                            onClick={() => {
                                const resume = {
                                    page: currentPage,
                                    categories: selectedCategories,
                                    sortBy,
                                    resultsPerPage,
                                };
                                navigate(`/donate/${encodeURIComponent(b.title)}/${b.bookId}`, {
                                    state: { price: b.price, resume },
                                });
                            }}
                        >
                            Donate
                        </button>
                    </div>
                </div>
            ))}

            {totalPages > 1 && (
                <div className="d-flex justify-content-center flex-wrap gap-2 mt-3 pb-3">
                    <button
                        className="btn btn-outline-primary btn-sm"
                        type="button"
                        disabled={currentPage === 1}
                        onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                    >
                        Prev
                    </button>

                    {pages.map((page) => (
                        <button
                            key={page}
                            className={`btn btn-sm ${page === currentPage ? "btn-primary" : "btn-outline-primary"}`}
                            type="button"
                            disabled={page === currentPage}
                            onClick={() => setCurrentPage(page)}
                            aria-current={page === currentPage ? "page" : undefined}
                        >
                            {page}
                        </button>
                    ))}

                    <button
                        className="btn btn-outline-primary btn-sm"
                        type="button"
                        disabled={currentPage === totalPages}
                        onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                    >
                        Next
                    </button>
                </div>
            )}
        </div>
    );
}
export default BookList;