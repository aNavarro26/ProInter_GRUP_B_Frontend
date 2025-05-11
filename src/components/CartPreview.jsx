import '../index.css'

export default function CartPreview({ visible }) {
    if (!visible) return null

    return (
        <div className="cart-preview">
            <p>Your cart is empty</p>
            <div className="cart-icon-preview">🛒</div>
            <p>You are <strong>€100.00</strong> away from qualifying for free shipping</p>
        </div>
    )
}
