import { Link } from 'react-router-dom'
import '../../index.css'
import './Cart.css';

export default function Cart() {
    return (
        <div className="cart-container">
            <h2>Cart</h2>
            <div className="cart-icon-placeholder">
                <div className="cart-icon">🛒</div>
            </div>
            <p className="cart-message">
                Your shopping cart is empty<br />
                <span className="cart-subtext">But it doesn’t have to be.</span>
            </p>
            <div className="cart-buttons">
                <Link to="/login">
                    <button className="cart-btn">Login</button>
                </Link>
                <Link to="/">
                    <button className="cart-btn">Buy</button>
                </Link>
            </div>
        </div>
    )
}
