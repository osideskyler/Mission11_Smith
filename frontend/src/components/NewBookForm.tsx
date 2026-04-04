import { useState, type ChangeEvent, type FormEvent } from "react";
import { addBook, type BookInput } from "../api/booksAPI";

const empty: BookInput = {
    title: "",
    author: "",
    publisher: "",
    isbn: "",
    classification: "",
    category: "",
    pageCount: 0,
    price: 0,
};

export default function NewBookForm({
    onSuccess,
    onCancel,
}: {
    onSuccess: () => void;
    onCancel: () => void;
}) {
    const [formData, setFormData] = useState<BookInput>(empty);
    const [submitError, setSubmitError] = useState<string | null>(null);

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
            await addBook(formData);
            setFormData(empty);
            onSuccess();
        } catch (err) {
            setSubmitError(err instanceof Error ? err.message : "Failed to add book");
        }
    }

    return (
        <form className="card shadow-sm mb-4" onSubmit={handleSubmit}>
            <div className="card-body">
                <h2 className="h5 mb-3">Add book</h2>
                {submitError && (
                    <div className="alert alert-danger py-2" role="alert">
                        {submitError}
                    </div>
                )}
                <div className="row g-2">
                    <div className="col-md-6">
                        <label className="form-label" htmlFor="new-title">
                            Title
                        </label>
                        <input
                            className="form-control form-control-sm"
                            id="new-title"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="col-md-6">
                        <label className="form-label" htmlFor="new-author">
                            Author
                        </label>
                        <input
                            className="form-control form-control-sm"
                            id="new-author"
                            name="author"
                            value={formData.author}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="col-md-6">
                        <label className="form-label" htmlFor="new-publisher">
                            Publisher
                        </label>
                        <input
                            className="form-control form-control-sm"
                            id="new-publisher"
                            name="publisher"
                            value={formData.publisher}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="col-md-6">
                        <label className="form-label" htmlFor="new-isbn">
                            ISBN
                        </label>
                        <input
                            className="form-control form-control-sm"
                            id="new-isbn"
                            name="isbn"
                            value={formData.isbn}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="col-md-6">
                        <label className="form-label" htmlFor="new-classification">
                            Classification
                        </label>
                        <input
                            className="form-control form-control-sm"
                            id="new-classification"
                            name="classification"
                            value={formData.classification}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="col-md-6">
                        <label className="form-label" htmlFor="new-category">
                            Category
                        </label>
                        <input
                            className="form-control form-control-sm"
                            id="new-category"
                            name="category"
                            value={formData.category}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="col-md-6">
                        <label className="form-label" htmlFor="new-pageCount">
                            Page count
                        </label>
                        <input
                            className="form-control form-control-sm"
                            id="new-pageCount"
                            name="pageCount"
                            type="number"
                            min={0}
                            value={formData.pageCount || ""}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="col-md-6">
                        <label className="form-label" htmlFor="new-price">
                            Price
                        </label>
                        <input
                            className="form-control form-control-sm"
                            id="new-price"
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
                    <button type="submit" className="btn btn-success btn-sm">
                        Save
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
