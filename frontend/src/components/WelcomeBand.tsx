import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";

function WelcomeBand() {
    const { cart } = useCart();
    const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

    return (
        <div className="welcome-band d-flex flex-wrap justify-content-between align-items-center gap-2 mb-3">
            <h1 className="h2 mb-0">Welcome to ABookADay</h1>
            <Link to="/cart" className="btn btn-outline-primary btn-sm">
                Cart{" "}
                <span className="badge text-bg-primary rounded-pill">{itemCount}</span>
            </Link>
        </div>
    );
}

export default WelcomeBand;
