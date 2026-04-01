import { useEffect, useState } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import WelcomeBand from "../components/WelcomeBand";
import { useCart } from "../context/CartContext";
import { BOOK_LIST_RESUME_KEY } from "../types/BookListResume";
import type { BookListResume } from "../types/BookListResume";

type DonateLocationState = {
    price?: number;
    resume?: BookListResume;
};

function DonatePage() {
    const navigate = useNavigate();
    const { bookTitle, bookId: bookIdParam } = useParams();
    const location = useLocation();
    const { addToCart } = useCart();
    const state = location.state as DonateLocationState | null;

    const bookId = bookIdParam ? Number(bookIdParam) : NaN;
    const title = bookTitle ? decodeURIComponent(bookTitle) : "";
    const unitPrice = typeof state?.price === "number" ? state.price : 0;

    const [quantity, setQuantity] = useState(1);

    useEffect(() => {
        if (state?.resume) {
            sessionStorage.setItem(BOOK_LIST_RESUME_KEY, JSON.stringify(state.resume));
        }
    }, [state?.resume]);

    const lineSubtotal = unitPrice * quantity;

    const handleAddToCart = () => {
        if (!Number.isFinite(bookId) || !title) return;
        addToCart(bookId, title, unitPrice, quantity);
        navigate("/cart");
    };

    const handleContinueShopping = () => {
        navigate("/");
    };

    return (
        <div className="container py-4">
            <div className="row justify-content-center">
                <div className="col-12 col-md-8 col-lg-6">
                    <WelcomeBand />
                    <h2 className="h4 mb-3">Donate: {title}</h2>
                    <p className="mb-2">
                        <strong>Unit price:</strong> ${unitPrice.toFixed(2)}
                    </p>
                    <div className="mb-3">
                        <label htmlFor="quantity" className="form-label">
                            Quantity
                        </label>
                        <input
                            id="quantity"
                            type="number"
                            className="form-control"
                            min={1}
                            value={quantity}
                            onChange={(e) => {
                                const n = parseInt(e.target.value, 10);
                                setQuantity(Number.isFinite(n) && n >= 1 ? n : 1);
                            }}
                        />
                    </div>
                    <p className="mb-3">
                        <strong>Line subtotal:</strong> ${lineSubtotal.toFixed(2)}
                    </p>
                    <div className="d-flex flex-wrap gap-2">
                        <button type="button" className="btn btn-primary" onClick={handleAddToCart}>
                            Add to cart
                        </button>
                        <button type="button" className="btn btn-outline-secondary" onClick={handleContinueShopping}>
                            Continue shopping
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default DonatePage;
