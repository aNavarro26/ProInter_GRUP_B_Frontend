import { useLocation, Link } from 'react-router-dom';
import './OrderSuccess.css';

export default function OrderSuccess() {
    const location = useLocation();
    const orderId = location.state?.orderId;

    return (
        <div className="order-success-page">
            <h1>✅ Order Completed</h1>
            {orderId ? (
                <p>Your order <strong>#{orderId}</strong> has been successfully placed.</p>
            ) : (
                <p>Thank you for your purchase!</p>
            )}
            <div className="order-success-links">
                <Link to="/profile" state={{ section: 'orders' }} className="btn btn-primary">
                    View your orders
                </Link>
                <Link to="/" className="btn btn-secondary">
                    Back to Home
                </Link>
            </div>
        </div>
    );
}
