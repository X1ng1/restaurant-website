import { useState, useEffect } from 'react';
import Nav from './components/Nav';
import Footer from './components/Footer';
import './Home.css';
import restaurantImg from './assets/restaurant.webp';
import interiorImg from './assets/interior.jpg';
import wontonImg from './assets/wonton-mian.jpg';
import gaiFanImg from './assets/gai-fan.jpg';
import duckImg from './assets/duck.jpg';
import softshellImg from './assets/softshell.jpg';

function Home() {
  const [slideIndex, setSlideIndex] = useState(1);

  const images = [
    restaurantImg,
    interiorImg,
    wontonImg,
    gaiFanImg,
    duckImg,
    softshellImg
  ];

  useEffect(() => {
    showSlides(slideIndex);
  }, [slideIndex]);

  const plusSlides = (n) => {
    setSlideIndex(prev => {
      const newIndex = prev + n;
      if (newIndex > images.length) return 1;
      if (newIndex < 1) return images.length;
      return newIndex;
    });
  };

  const currentSlide = (n) => {
    setSlideIndex(n);
  };

  const showSlides = (n) => {
    // The slides are shown/hidden via CSS based on slideIndex
  };

  return (
    <>
      <div className="content-wrapper">
        <Nav />
        <h1>Great NY Noodletown</h1>
        <p>
          A beloved, no frills Chinese restaurant located at the corner of Bayard & Bowery Street in Manhattan Chinatown. Whether
          you're here for a hearty breakfast, quick lunch, casual dinner or late-night snack, Great New York Noodletown is the
          place for you!
        </p>
        <div className="image-gallery">
          {images.map((img, index) => (
            <div 
              key={index}
              className={`mySlides fade ${slideIndex === index + 1 ? 'active-slide' : ''}`}
              style={{ display: slideIndex === index + 1 ? 'block' : 'none' }}
            >
              <div className="numbertext">{index + 1} / {images.length}</div>
              <img src={img} alt={`Slide ${index + 1}`} style={{ width: '100%' }} />
            </div>
          ))}

          <a className="prev" onClick={() => plusSlides(-1)}>&#10094;</a>
          <a className="next" onClick={() => plusSlides(1)}>&#10095;</a>

          <div className="dot-container">
            {images.map((_, index) => (
              <span 
                key={index}
                className={`dot ${slideIndex === index + 1 ? 'active' : ''}`}
                onClick={() => currentSlide(index + 1)}
              ></span>
            ))}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default Home;
