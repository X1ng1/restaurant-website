import { useState } from 'react';
import Nav from './components/Nav';
import Footer from './components/Footer';
import './Contact.css';

function Contact() {
  const [formData, setFormData] = useState({
    fname: '',
    lname: '',
    email: '',
    message: ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    // Add your form submission logic here
  };

  return (
    <>
      <div className="content-wrapper">
        <Nav />
        <div className="contact-container">
          <form onSubmit={handleSubmit}>
            <div>
              <label htmlFor="fname">First name:</label><br />
              <input 
                type="text" 
                id="fname" 
                name="fname" 
                value={formData.fname}
                onChange={handleChange}
              /><br />
              <label htmlFor="lname">Last name:</label><br />
              <input 
                type="text" 
                id="lname" 
                name="lname" 
                value={formData.lname}
                onChange={handleChange}
              />                    
            </div>
            <label htmlFor="email">Email:</label><br />
            <input 
              type="email" 
              id="email" 
              name="email" 
              value={formData.email}
              onChange={handleChange}
            /><br />
            <label htmlFor="message">Message:</label><br />
            <textarea 
              id="message" 
              name="message" 
              rows="4"
              value={formData.message}
              onChange={handleChange}
            ></textarea>
            <input type="submit" value="Submit" />
          </form>
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d189.00880032679908!2d-73.99716862619971!3d40.714916723099066!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c25a26531815c7%3A0x2ac264f74bc5f997!2sGreat%20NY%20Noodletown!5e0!3m2!1sen!2sus!4v1759374614616!5m2!1sen!2sus"
            width="600" 
            height="450" 
            style={{ border: 0 }} 
            allowFullScreen="" 
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Google Maps Location"
          ></iframe>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default Contact;
