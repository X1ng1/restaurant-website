import Nav from './components/Nav';
import Footer from './components/Footer';
import './About.css';

function About() {
  return (
    <>
      <div className="content-wrapper">
        <Nav />
        <h1>Welcome to Great NY Noodletown!</h1>
        <p className="about-content">
          A beloved, no frills Chinese restaurant located at the corner of Bayard & Bowery Street in Manhattan Chinatown. Whether
          you're here for a hearty breakfast, quick lunch, casual dinner or late-night snack, Great New York Noodletown is the
          place for you!
          
          Our menu is stuffed with classic Cantonese dishes such as roasted char sui pork with our signature ginger-scallion
          sauce, shrimp wonton soup and more! Don't miss our famous seasonal specials of Roasted Suckling Pig and Soft Shelled
          Crabs.
          
          Visit us at <span>28 Bowery Street</span> and experience the Cantonese cuisine delighting New Yorkers since 1981!
        </p>
        <br />
        <p className="about-content">
          Please note we are <span>CASH ONLY, NO CREDIT CARDS.</span>
          We operate on a <span>First-Come, First-Serve Basis</span> and do not take reservations.
        </p>
      </div>
      <Footer />
    </>
  );
}

export default About;
