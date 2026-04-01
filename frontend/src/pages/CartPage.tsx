import { useNavigate } from "react-router-dom";
import WelcomeBand from "../components/WelcomeBand";
import { useCart } from "../context/CartContext";

function CartPage() {
    const navigate = useNavigate();
    const { cart, removeFromCart, getTotal } = useCart();

    const handleContinueShopping = () => {
        navigate("/");
    };

    return (
        <div className="container py-4">
            <div className="row">
                <div className="col-12">
                    <WelcomeBand />
                    <h1 className="h3 mb-3">Your cart</h1>

                    {cart.length === 0 ? (
                        <div className="alert alert-info" role="alert">
                            Your cart is empty.
                        </div>
                    ) : (
                        <>
                            <div className="table-responsive mb-3">
                                <table className="table table-sm table-striped table-bordered">
                                    <thead>
                                        <tr>
                                            <th scope="col">Title</th>
                                            <th scope="col">Quantity</th>
                                            <th scope="col">Price</th>
                                            <th scope="col">Subtotal</th>
                                            <th scope="col"></th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {cart.map((item) => (
                                            <tr key={item.bookId}>
                                                <td>{item.title}</td>
                                                <td>{item.quantity}</td>
                                                <td>${item.price.toFixed(2)}</td>
                                                <td>${(item.price * item.quantity).toFixed(2)}</td>
                                                <td>
                                                    <button
                                                        type="button"
                                                        className="btn btn-outline-danger btn-sm"
                                                        onClick={() => removeFromCart(item.bookId)}
                                                    >
                                                        Remove
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                            <p className="fw-semibold">
                                Total: ${getTotal().toFixed(2)}
                            </p>
                        </>
                    )}

                    <button type="button" className="btn btn-primary" onClick={handleContinueShopping}>
                        Continue shopping
                    </button>
                </div>
            </div>
        </div>
    );
}

export default CartPage;
