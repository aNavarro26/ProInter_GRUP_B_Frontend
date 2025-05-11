import { useLocation } from 'react-router-dom';
import './CheckoutPage.css'; // optional styling

export default function CheckoutPage() {
    const location = useLocation();
    const total = location.state?.total || 0;
    const itemCount = location.state?.itemCount || 0;

    const handleSubmit = (e) => {
        e.preventDefault();
        const form = e.target;
        const name = form.name.value.trim();
        const card = form.card.value.trim();
        const date = form.expiry.value;
        const method = form.method.value;
        const notes = form.notes.value.trim();

        if (!name || card.length < 12 || !date || !method) {
            alert("Please complete all required fields correctly.");
            return;
        }

        alert("Purchase confirmed!");
    };

    return (
        <div className="checkout-page">
            <h2>Checkout Summary</h2>
            <p><strong>Total:</strong> €{total.toFixed(2)}</p>
            <p><strong>Number of Items:</strong> {itemCount}</p>

            <form
    onSubmit={(e) => {
        e.preventDefault();
        const form = e.target;

        const name = form.name.value.trim();
        const address = form.address.value.trim();
        const card = form.card.value.trim();
        const cvv = form.cvv.value.trim();
        const date = form.expiry.value;
        const method = form.method.value;
        const notes = form.notes.value.trim();

        if (!name || !address || card.length < 12 || cvv.length !== 3 || !date || !method) {
            alert("Please complete all required fields correctly.");
            return;
        }

        alert("Purchase confirmed!");
    }}
>
    <div>
        <label>Full Name:</label>
        <input type="text" name="name" required />
    </div>


    <div>
        <label>Credit Card Number:</label>
        <input type="number" name="card" required />
    </div>

    <div>
        <label>CVV:</label>
        <input type="number" name="cvv" required min="100" max="999" placeholder="mm/yy"/>
    </div>

    <div>
        <label>Expiry Date:</label>
        <input type="date" name="expiry" required />
    </div>

    <div>
        <label>Payment Method:</label>
        <select name="method" required>
            <option value="">--Select--</option>
            <option value="visa">Visa</option>
            <option value="mastercard">MasterCard</option>
            <option value="paypal">PayPal</option>
        </select>
    </div>

    <div>
        <label>Delivery Notes:</label>
        <textarea name="notes" placeholder="Optional notes..." rows="4" />
    </div>
    <h2>Delivery Information</h2>

<div className="delivery-address">
  <div className="form-row">
    <input type="text" name="firstName" placeholder="First Name *" required />
    <input type="text" name="lastName" placeholder="Last Name *" required />
  </div>

  <div className="form-row">
    <input type="text" name="street" placeholder="Street *" required />
    <input type="text" name="houseNumber" placeholder="House Number *" required />
  </div>

  <div className="form-row">
    <input type="text" name="apartment" placeholder="Apartment, suite, building (optional)" />
  </div>

  <div className="form-row">
    <input type="text" name="postalCode" placeholder="Postal Code *" required />
    <input type="text" name="city" placeholder="City *" required />
    <select name="state" required>
      <option value="">State/Province *</option>
      <option value="A Coruña">A Coruña</option>
      <option value="Barcelona">Barcelona</option>
      <option value="Madrid">Madrid</option>
      <option value="Tarragona">Barcelona</option>
    </select>
  </div>
</div>

    <button type="submit">Confirm Purchase</button>
</form>

        </div>
    );
}
