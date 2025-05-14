import React from 'react'
import '../../index.css'
import './CartPreview.css'

export default function CartPreview({ visible, items = [], total = 0 }) {
    if (!visible) return null

    if (items.length === 0) {
        return (
            <div className="cart-preview">
                <p>Your cart is empty</p>
                <div className="cart-icon-preview">🛒</div>
                <p>You are <strong>€100.00</strong> away from qualifying for free shipping</p>
            </div>
        )
    }

    return (
        <div className="cart-preview">
            {items.map(item => (
                <div key={item.cart_item_id} style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
                    <img
                        src={item.product.image_url?.[0] || '/default.jpg'}
                        alt={item.product.name}
                        style={{ width: '40px', height: '40px', objectFit: 'cover', borderRadius: '4px' }}
                    />
                    <div>
                        <strong>{item.product.name}</strong><br />
                        x{item.quantity} – €{item.price.toFixed(2)}
                    </div>
                </div>
            ))}
            <hr />
            <p style={{ textAlign: 'right', fontWeight: 'bold' }}>
                Total: €{total.toFixed(2)}
            </p>
        </div>
    )
}
