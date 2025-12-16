import { useState, useEffect, useRef } from 'react';
import Nav from './components/Nav';
import Footer from './components/Footer';
import { menuAPI, cartAPI, orderAPI } from './services/api';
import './Menu.css';
import { useNavigate } from 'react-router-dom';

function Menu() {
  const [menuItems, setMenuItems] = useState({ ricePlates: [], riceCongee: [] });
  const [cart, setCart] = useState([]);
  const [cartActive, setCartActive] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const cartSidebarRef = useRef(null);
  const navigate = useNavigate();

  // Load menu items from backend
  useEffect(() => {
    const fetchMenu = async () => {
      try {
        setLoading(true);
        const items = await menuAPI.getAll();
        
        // Group items by category
        const ricePlates = items.filter(item => item.category === 'Rice Plates');
        const riceCongee = items.filter(item => item.category === 'Rice Congee');
        
        setMenuItems({ ricePlates, riceCongee });
        setError(null);
      } catch (err) {
        console.error('Error fetching menu:', err);
        setError('Failed to load menu. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchMenu();
  }, []);

  useEffect(() => {
    const fetchCart = async () => {
      try {
        const cartData = await cartAPI.getCart();
        setCart(cartData.items || []);
      } catch (err) {
        console.error('Error fetching cart:', err);
      }
    };

    fetchCart();
  }, []);

  useEffect(() => {
    const handleOpenCart = () => {
      setCartActive(true);
    };
    window.addEventListener('openCart', handleOpenCart);
    return () => window.removeEventListener('openCart', handleOpenCart);
  }, []);

  // Handle clicking outside cart
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (cartActive && cartSidebarRef.current && !cartSidebarRef.current.contains(event.target)) {
        const cartToggle = document.getElementById('cart-toggle');
        const mobileCartToggle = document.getElementById('mobile-cart-toggle');
        
        if (!cartToggle?.contains(event.target) && !mobileCartToggle?.contains(event.target)) {
          setCartActive(false);
        }
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [cartActive]);

  const addToCart = async (name, price) => {
    try {
      const cartData = await cartAPI.addItem(name, price, 1);
      setCart(cartData.items || []);
    } catch (err) {
      console.error('Error adding to cart:', err);
    }
  };

  const removeFromCart = async (name) => {
    try {
      const cartData = await cartAPI.removeItem(name);
      setCart(cartData.items || []);
    } catch (err) {
      console.error('Error removing from cart:', err);
    }
  };

  const updateQuantity = async (name, change) => {
    try {
      const item = cart.find(i => i.name === name);
      if (!item) return;
      
      const newQuantity = item.quantity + change;
      const cartData = await cartAPI.updateItem(name, newQuantity);
      setCart(cartData.items || []);
    } catch (err) {
      console.error('Error updating quantity:', err);
    }
  };

  const clearCart = async () => {
    if (cart.length === 0) return;
    if (window.confirm('Are you sure you want to clear your cart?')) {
      try {
        await cartAPI.clearCart();
        setCart([]);
      } catch (err) {
        console.error('Error clearing cart:', err);
      }
    }
  };

  const handleCheckout = async () => {
    if (cart.length === 0) {
      alert('Your cart is empty!');
      return;
    }

    try {
      const order = await orderAPI.createOrder();
      alert(`Order placed successfully!\n\nOrder Number: ${order.orderNumber}\n\nYou can check your order status using this number.`);
      setCart([]);
      setCartActive(false);
      navigate('/orders');
    } catch (err) {
      console.error('Error placing order:', err);
      alert('Failed to place order. Please try again.');
    }
  };

  const calculateTotal = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const getTotalItems = () => {
    return cart.reduce((sum, item) => sum + item.quantity, 0);
  };

  const toggleCart = () => {
    setCartActive(!cartActive);
  };

  return (
    <>
      <div className="content-wrapper">
        <Nav cartCount={getTotalItems()} onCartToggle={toggleCart} />
        <h1>Menu</h1>
        
        {loading && <div className="loading-message">Loading menu...</div>}
        {error && <div className="error-message">{error}</div>}
        
        {!loading && !error && (
          <div className="menu-table">
            <div>
              <h2>Rice Plates</h2>
              <table>
                <tbody>
                  {menuItems.ricePlates.map((item, index) => (
                    <tr key={item._id || index}>
                      <td>
                        <button 
                          className="dish-name-btn" 
                          onClick={() => addToCart(item.name, item.price)}
                        >
                          {item.name}
                        </button>
                      </td>
                      <td>${item.price.toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div>
              <h2>Rice Congee</h2>
              <table>
                <tbody>
                  {menuItems.riceCongee.map((item, index) => (
                    <tr key={item._id || index}>
                      <td>
                        <button 
                          className="dish-name-btn" 
                          onClick={() => addToCart(item.name, item.price)}
                        >
                          {item.name}
                        </button>
                      </td>
                      <td>${item.price.toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Shopping Cart Sidebar */}
      <div 
        ref={cartSidebarRef}
        id="cart-sidebar" 
        className={`cart-sidebar ${cartActive ? 'active' : ''}`}
      >
        <div className="cart-header">
          <h2>Shopping Cart</h2>
          <button className="close-cart" onClick={toggleCart}>✕</button>
        </div>
        <div id="cart-items" className="cart-items">
          {cart.length === 0 ? (
            <p className="empty-cart-message">Your cart is empty</p>
          ) : (
            cart.map((item, index) => (
              <div key={index} className="cart-item">
                <div className="cart-item-info">
                  <h3>{item.name}</h3>
                  <p className="cart-item-price">${item.price.toFixed(2)}</p>
                </div>
                <div className="cart-item-controls">
                  <div className="quantity-controls">
                    <button className="quantity-btn" onClick={() => updateQuantity(item.name, -1)}>−</button>
                    <span className="quantity">{item.quantity}</span>
                    <button className="quantity-btn" onClick={() => updateQuantity(item.name, 1)}>+</button>
                  </div>
                  <button className="remove-btn" onClick={() => removeFromCart(item.name)}>Remove</button>
                </div>
              </div>
            ))
          )}
        </div>
        <div className="cart-footer">
          <div className="cart-total">
            <strong>Total:</strong>
            <span id="cart-total">${calculateTotal().toFixed(2)}</span>
          </div>
          <button className="clear-cart-btn" onClick={clearCart}>Clear Cart</button>
          <button className="checkout-btn" onClick={handleCheckout}>Checkout</button>
        </div>
      </div>

      <Footer />
    </>
  );
}

export default Menu;
