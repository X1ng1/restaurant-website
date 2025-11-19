import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Nav.css';
import iconImg from '../assets/icon.png';

function Nav({ cartCount, onCartToggle }) {
  const [mobileNavActive, setMobileNavActive] = useState(false);
  const [globalCartCount, setGlobalCartCount] = useState(0);
  const navigate = useNavigate();

  // Load cart count from localStorage
  useEffect(() => {
    const loadCartCount = () => {
      const savedCart = localStorage.getItem('shoppingCart');
      if (savedCart) {
        const cart = JSON.parse(savedCart);
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        setGlobalCartCount(totalItems);
      }
    };

    loadCartCount();
    
    // Listen for storage changes (when cart is updated on menu page)
    const handleStorageChange = () => loadCartCount();
    window.addEventListener('storage', handleStorageChange);
    
    // Also listen for custom cart update events
    const handleCartUpdate = () => loadCartCount();
    window.addEventListener('cartUpdated', handleCartUpdate);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('cartUpdated', handleCartUpdate);
    };
  }, []);

  const toggleMobileNav = () => {
    setMobileNavActive(!mobileNavActive);
  };

  const handleMobileCartClick = () => {
    if (onCartToggle) {
      onCartToggle();
    } else {
      // If not on menu page, navigate to menu and open cart
      navigate('/menu');
      // Use setTimeout to ensure navigation completes before opening cart
      setTimeout(() => {
        window.dispatchEvent(new CustomEvent('openCart'));
      }, 100);
    }
    setMobileNavActive(false);
  };

  return (
    <nav>
      <img src={iconImg} alt="Hamburger Logo" />
      <div className="nav-links">
        <Link to="/">Home</Link>
        <Link to="/menu">Menu</Link>
        <Link to="/about">About</Link>
        <Link to="/contact">Contact</Link>
      </div>
      <div className="nav-button">
        <Link to="/menu"><button>Order Now</button></Link>
        {cartCount !== undefined && (
          <button id="cart-toggle" className="cart-btn" onClick={onCartToggle}>
            Cart (<span id="cart-count">{cartCount}</span>)
          </button>
        )}
      </div>
      {(cartCount !== undefined || globalCartCount > 0) && (
        <button id="mobile-cart-toggle" className="mobile-cart-btn" onClick={handleMobileCartClick}>
          Cart (<span id="mobile-cart-count">{cartCount !== undefined ? cartCount : globalCartCount}</span>)
        </button>
      )}
      <div 
        className={`hamburger ${mobileNavActive ? 'active' : ''}`} 
        onClick={toggleMobileNav}
      >
        <span></span>
        <span></span>
        <span></span>
      </div>
      <div className={`mobile-nav ${mobileNavActive ? 'active' : ''}`} id="mobileNav">
        <Link to="/" onClick={toggleMobileNav}>Home</Link>
        <Link to="/menu" onClick={toggleMobileNav}>Menu</Link>
        <Link to="/about" onClick={toggleMobileNav}>About</Link>
        <Link to="/contact" onClick={toggleMobileNav}>Contact</Link>
        <Link to="/menu" onClick={toggleMobileNav}><button>Order Now</button></Link>
      </div>
    </nav>
  );
}

export default Nav;
