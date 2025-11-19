import { useState, useEffect, useRef } from 'react';
import Nav from './components/Nav';
import Footer from './components/Footer';
import './Menu.css';

const menuData = {
  ricePlates: [
    { name: "Eggplant with Chicken on Rice", price: 9.50 },
    { name: "Braised Bean Curd on Rice", price: 8.50 },
    { name: "Beef with Broccoli on Rice", price: 9.50 },
    { name: "Chop Suey on Rice", price: 9.95 },
    { name: "Beef with Vegetables on Rice", price: 9.50 },
    { name: "Chopped Beef with Beans on Rice", price: 9.50 },
    { name: "Beef with Bean Curd on Rice", price: 9.50 },
    { name: "Squid with Pickled Vegetables on Rice", price: 9.50 },
    { name: "Spareribs in Black Bean Sauce on Rice", price: 9.50 }
  ],
  riceCongee: [
    { name: "Plain Congee", price: 3.95 },
    { name: "Pork Stomach Porridge", price: 7.50 },
    { name: "Sliced Fish Congee", price: 7.95 },
    { name: "Fishball and Lettuce Porridge", price: 7.95 },
    { name: "Sampan Porridge", price: 7.50 },
    { name: "Meat Ball Porridge", price: 7.50 },
    { name: "Sliced Fish and Beef Porridge", price: 9.25 },
    { name: "Sliced Pork and Thousand Egg Porridge", price: 7.50 },
    { name: "Beef Porridge", price: 8.25 }
  ]
};

function Menu() {
  const [cart, setCart] = useState([]);
  const [cartActive, setCartActive] = useState(false);
  const cartSidebarRef = useRef(null);

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem('shoppingCart');
    if (savedCart) {
      setCart(JSON.parse(savedCart));
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('shoppingCart', JSON.stringify(cart));
    // Dispatch custom event to update nav cart count
    window.dispatchEvent(new CustomEvent('cartUpdated'));
  }, [cart]);

  // Handle opening cart from other pages
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

  const addToCart = (name, price) => {
    const existingItem = cart.find(item => item.name === name);
    
    if (existingItem) {
      setCart(cart.map(item =>
        item.name === name ? { ...item, quantity: item.quantity + 1 } : item
      ));
    } else {
      setCart([...cart, { name, price, quantity: 1 }]);
    }
  };

  const removeFromCart = (name) => {
    setCart(cart.filter(item => item.name !== name));
  };

  const updateQuantity = (name, change) => {
    setCart(cart.map(item => {
      if (item.name === name) {
        const newQuantity = item.quantity + change;
        return newQuantity > 0 ? { ...item, quantity: newQuantity } : null;
      }
      return item;
    }).filter(Boolean));
  };

  const clearCart = () => {
    if (cart.length === 0) return;
    if (window.confirm('Are you sure you want to clear your cart?')) {
      setCart([]);
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
        <div className="menu-table">
          <div>
            <h2>Rice Plates</h2>
            <table>
              <tbody>
                {menuData.ricePlates.map((item, index) => (
                  <tr key={index}>
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
                {menuData.riceCongee.map((item, index) => (
                  <tr key={index}>
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
          <button className="checkout-btn">Checkout</button>
        </div>
      </div>

      <Footer />
    </>
  );
}

export default Menu;
