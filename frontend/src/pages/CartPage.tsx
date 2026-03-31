import { useNavigate } from "react-router-dom";
import WelcomeBand from "../components/WelcomeBand";
import { useEffect, useState } from "react";

function CartPage() {
    const navigate = useNavigate();
    const [total, setTotal] = useState(0);
    useEffect(() => {
        const total = localStorage.getItem('total');
        if (total) {
            setTotal(Number(total));
        }
    }, []);
    return (
        <>
        <WelcomeBand />
        <div className="container">
            <h1>Your Cart</h1>
            <h2>Total: {total.toFixed(2)}</h2>
            <button onClick={() => navigate(-1)}>Go Back</button>
        </div>
        </>
    )
}
export default CartPage;