import { useEffect, useState, type ChangeEvent, type FormEvent } from "react";
import type { Book } from "../types/Book";
import { updateBook } from "../api/booksAPI";

export default function EditBookForm({
    book,
    onSuccess,
    onCancel,
}: {
    book: Book;
    onSuccess: () => void;
    onCancel: () => void;
}) {
    const [formData, setFormData] = useState<Book>({ ...book });
    const [submitError, setSubmitError] = useState<string | null>(null);

    useEffect(() => {
        setFormData({ ...book });
    }, [book]);

    function handleChange(e: ChangeEvent<HTMLInputElement>) {
        const { name, value } = e.target;
        if (name === "pageCount") {
            setFormData((prev) => ({
                ...prev,
                pageCount: value === "" ? 0 : parseInt(value, 10),
            }));
            return;
        }
        if (name === "price") {
            setFormData((prev) => ({
                ...prev,
                price: value === "" ? 0 : parseFloat(value),
            }));
            return;
        }
        setFormData((prev) => ({ ...prev, [name]: value }));
    }

    async function handleSubmit(e: FormEvent) {
        e.preventDefault();
        setSubmitError(null);
        try {
            await updateBook(book.bookId, { ...formData, bookId: book.bookId });
            onSuccess();
        } catch (err) {
            setSubmitError(err instanceof Error ? err.message : "Failed to update book");
        }
    }

    return (
        <form className="card shadow-sm mb-4" onSubmit={handleSubmit}>
            <div className="card-body">
                <h2 className="h5 mb-3">Edit book #{book.bookId}</h2>
                {submitError && (
                    <div className="alert alert-danger py-2" role="alert">
                        {submitError}
                    </div>
                )}
                <div className="row g-2">
                    <div className="col-md-6">
                        <label className="form-label" htmlFor="edit-title">
                            Title
                        </label>
                        <input
                            className="form-control form-control-sm"
                            id="edit-title"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="col-md-6">
                        <label className="form-label" htmlFor="edit-author">
                            Author
                        </label>
                        <input
                            className="form-control form-control-sm"
                            id="edit-author"
                            name="author"
                            value={formData.author}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="col-md-6">
                        <label className="form-label" htmlFor="edit-publisher">
                            Publisher
                        </label>
                        <input
                            className="form-control form-control-sm"
                            id="edit-publisher"
                            name="publisher"
                            value={formData.publisher}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="col-md-6">
                        <label className="form-label" htmlFor="edit-isbn">
                            ISBN
                        </label>
                        <input
                            className="form-control form-control-sm"
                            id="edit-isbn"
                            name="isbn"
                            value={formData.isbn}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="col-md-6">
                        <label className="form-label" htmlFor="edit-classification">
                            Classification
                        </label>
                        <input
                            className="form-control form-control-sm"
                            id="edit-classification"
                            name="classification"
                            value={formData.classification}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="col-md-6">
                        <label className="form-label" htmlFor="edit-category">
                            Category
                        </label>
                        <input
                            className="form-control form-control-sm"
                            id="edit-category"
                            name="category"
                            value={formData.category}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="col-md-6">
                        <label className="form-label" htmlFor="edit-pageCount">
                            Page count
                        </label>
                        <input
                            className="form-control form-control-sm"
                            id="edit-pageCount"
                            name="pageCount"
                            type="number"
                            min={0}
                            value={formData.pageCount || ""}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="col-md-6">
                        <label className="form-label" htmlFor="edit-price">
                            Price
                        </label>
                        <input
                            className="form-control form-control-sm"
                            id="edit-price"
                            name="price"
                            type="number"
                            step="0.01"
                            min={0}
                            value={formData.price || ""}
                            onChange={handleChange}
                            required
                        />
                    </div>
                </div>
                <div className="mt-3 d-flex gap-2">
                    <button type="submit" className="btn btn-primary btn-sm">
                        Update
                    </button>
                    <button
                        type="button"
                        className="btn btn-outline-secondary btn-sm"
                        onClick={onCancel}
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </form>
    );
}
