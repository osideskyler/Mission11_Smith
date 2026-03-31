import { useNavigate, useParams } from "react-router-dom";
import WelcomeBand from "../components/WelcomeBand";

function DonatePage() {
    const navigate = useNavigate();
    const {bookTitle} = useParams();
    return (
        <div>
            <WelcomeBand />
            <h2>Donate to {bookTitle}</h2>

            <div>
                <input type="text" placeholder="Enter donation amount" />
                <button onClick={() => navigate(`/cart`)}>Add to Cart</button>
            </div>
            <button onClick={() => navigate(-1)}>Go Back</button>
        </div>
    )
}
export default DonatePage;