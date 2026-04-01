import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";

function CartSummary() {
    const { cart, getTotal } = useCart();
    const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

    return (
        <div className="card mb-3">
            <div className="card-body py-2 d-flex flex-wrap align-items-center gap-2">
                <span>Items: {itemCount}</span>
                <span>Total: ${getTotal().toFixed(2)}</span>
                <Link to="/cart" className="ms-auto">
                    View cart
                </Link>
            </div>
        </div>
    );
}

export default CartSummary;
