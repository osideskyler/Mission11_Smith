import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import type { Book } from "../types/Book";
import {
    fetchBooks,
    fetchBookCount,
    deleteBook,
    type SortBy,
} from "../api/booksAPI";
import Pagination from "../components/Pagination";
import NewBookForm from "../components/NewBookForm";
import EditBookForm from "../components/EditBookForm";

export default function AdminBooksPage() {
    const [books, setBooks] = useState<Book[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [showForm, setShowForm] = useState(false);
    const [editingBook, setEditingBook] = useState<Book | null>(null);
    const [resultsPerPage, setResultsPerPage] = useState(10);
    const [currentPage, setCurrentPage] = useState(1);
    const [sortBy, setSortBy] = useState<SortBy>("title");
    const [totalBooks, setTotalBooks] = useState(0);

    const selectedCategories: string[] = [];

    const loadData = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const [list, count] = await Promise.all([
                fetchBooks(currentPage, resultsPerPage, sortBy, selectedCategories),
                fetchBookCount(selectedCategories),
            ]);
            setBooks(list);
            setTotalBooks(count);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to load books");
        } finally {
            setLoading(false);
        }
    }, [currentPage, resultsPerPage, sortBy]);

    useEffect(() => {
        loadData();
    }, [loadData]);

    const totalPages = Math.ceil(totalBooks / resultsPerPage);

    useEffect(() => {
        if (totalPages > 0 && currentPage > totalPages) {
            setCurrentPage(totalPages);
        }
    }, [totalPages, currentPage]);

    async function handleDelete(book: Book) {
        if (
            !window.confirm(
                `Delete "${book.title}" (ID ${book.bookId})? This cannot be undone.`
            )
        ) {
            return;
        }
        try {
            await deleteBook(book.bookId);
            await loadData();
            if (editingBook?.bookId === book.bookId) {
                setEditingBook(null);
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : "Delete failed");
        }
    }

    return (
        <div className="container py-4">
            <div className="d-flex flex-wrap align-items-center gap-2 mb-3">
                <Link to="/" className="btn btn-outline-secondary btn-sm">
                    Back to catalog
                </Link>
                <h1 className="h3 mb-0">Admin — Books</h1>
            </div>

            {error && (
                <div className="alert alert-warning" role="alert">
                    {error}
                </div>
            )}

            {loading && <p className="text-muted">Loading books…</p>}

            {!loading && (
                <>
                    <div className="d-flex flex-wrap gap-2 mb-3">
                        <button
                            type="button"
                            className="btn btn-success btn-sm"
                            onClick={() => {
                                setShowForm((s) => !s);
                                setEditingBook(null);
                            }}
                        >
                            {showForm ? "Hide add form" : "Add book"}
                        </button>
                    </div>

                    {showForm && (
                        <NewBookForm
                            onSuccess={() => {
                                setShowForm(false);
                                loadData();
                            }}
                            onCancel={() => setShowForm(false)}
                        />
                    )}

                    {editingBook && (
                        <EditBookForm
                            book={editingBook}
                            onSuccess={() => {
                                setEditingBook(null);
                                loadData();
                            }}
                            onCancel={() => setEditingBook(null)}
                        />
                    )}

                    <div className="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-3">
                        <div className="d-flex align-items-center">
                            <label htmlFor="admin-sortBy" className="me-2 mb-0 fw-semibold">
                                Sort by:
                            </label>
                            <select
                                id="admin-sortBy"
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
                            <label
                                htmlFor="admin-resultsPerPage"
                                className="me-2 mb-0 fw-semibold"
                            >
                                Results per page:
                            </label>
                            <select
                                id="admin-resultsPerPage"
                                className="form-select form-select-sm w-auto"
                                value={resultsPerPage}
                                onChange={(e) => {
                                    setResultsPerPage(parseInt(e.target.value, 10));
                                    setCurrentPage(1);
                                }}
                            >
                                <option value={5}>5</option>
                                <option value={10}>10</option>
                                <option value={50}>50</option>
                            </select>
                        </div>
                    </div>

                    <div className="table-responsive">
                        <table className="table table-striped table-sm align-middle">
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Title</th>
                                    <th>Author</th>
                                    <th>Publisher</th>
                                    <th>ISBN</th>
                                    <th>Classification</th>
                                    <th>Category</th>
                                    <th>Pages</th>
                                    <th>Price</th>
                                    <th aria-label="Actions" />
                                </tr>
                            </thead>
                            <tbody>
                                {books.map((b) => (
                                    <tr key={b.bookId}>
                                        <td>{b.bookId}</td>
                                        <td>{b.title}</td>
                                        <td>{b.author}</td>
                                        <td>{b.publisher}</td>
                                        <td>{b.isbn}</td>
                                        <td>{b.classification}</td>
                                        <td>{b.category}</td>
                                        <td>{b.pageCount}</td>
                                        <td>${b.price.toFixed(2)}</td>
                                        <td className="text-nowrap">
                                            <button
                                                type="button"
                                                className="btn btn-primary btn-sm me-1"
                                                onClick={() => {
                                                    setEditingBook(b);
                                                    setShowForm(false);
                                                }}
                                            >
                                                Edit
                                            </button>
                                            <button
                                                type="button"
                                                className="btn btn-danger btn-sm"
                                                onClick={() => handleDelete(b)}
                                            >
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={setCurrentPage}
                    />
                </>
            )}
        </div>
    );
}
