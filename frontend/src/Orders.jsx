import { useState, useEffect } from 'react';
import Nav from './components/Nav';
import Footer from './components/Footer';
import { orderAPI } from './services/api';
import './Orders.css';

function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const orderData = await orderAPI.getMyOrders();
        setOrders(orderData);
        setError(null);
      } catch (err) {
        console.error('Error fetching orders:', err);
        setError('Failed to load orders. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <>
      <div className="content-wrapper">
        <Nav />
        <h1>My Orders</h1>

        {loading && <div className="loading-message">Loading orders...</div>}
        {error && <div className="error-message">{error}</div>}

        {!loading && !error && orders.length === 0 && (
          <div className="no-orders">
            <p>You haven't placed any orders yet.</p>
            <a href="#/menu" className="order-now-link">Start ordering now!</a>
          </div>
        )}

        {!loading && !error && orders.length > 0 && (
          <div className="orders-container">
            {orders.map((order) => (
              <div key={order._id} className="order-card">
                <div className="order-header">
                  <div className="order-number">
                    <strong>Order #</strong> {order.orderNumber}
                  </div>
                </div>

                <div className="order-date">
                  {formatDate(order.createdAt)}
                </div>

                <div className="order-items">
                  <h3>Items:</h3>
                  <ul>
                    {order.items.map((item, index) => (
                      <li key={index}>
                        <span className="item-name">{item.name}</span>
                        <span className="item-details">
                          ${item.price.toFixed(2)} × {item.quantity}
                          <span className="item-subtotal">
                            ${(item.price * item.quantity).toFixed(2)}
                          </span>
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="order-total">
                  <strong>Total:</strong> <span>${order.total.toFixed(2)}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <Footer />
    </>
  );
}

export default Orders;
