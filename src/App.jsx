import { useEffect, useState } from 'react';

function App() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const API_URL = import.meta.env.VITE_API_URL;

    fetch(`${API_URL}/orders/`)
      .then((res) => res.json())
      .then((data) => setOrders(data))
      .catch((err) => console.error('Error al pedir datos:', err));
  }, []);

  return (
    <div style={{ padding: '2rem' }}>
      <h1>Listado de Pedidos</h1>
      <ul>
        {orders.map((order) => (
          <li key={order.order_id}>
            Pedido #{order.order_id} - Cliente #{order.customer} - Estado: {order.status}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;