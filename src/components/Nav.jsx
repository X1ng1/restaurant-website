import { useState } from 'react';
import { Link } from 'react-router-dom';
import './Nav.css';
import iconImg from '../assets/icon.png';

function Nav({ cartCount, onCartToggle }) {
  const [mobileNavActive, setMobileNavActive] = useState(false);

  const toggleMobileNav = () => {
    setMobileNavActive(!mobileNavActive);
  };

  const handleMobileCartClick = () => {
    onCartToggle();
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
        {cartCount !== undefined && (
          <button id="mobile-cart-toggle" className="cart-btn" onClick={handleMobileCartClick}>
            Cart (<span id="cart-count">{cartCount}</span>)
          </button>
        )}
      </div>
    </nav>
  );
}

export default Nav;
