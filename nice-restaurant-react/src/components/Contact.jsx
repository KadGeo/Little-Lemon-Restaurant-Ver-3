import React from "react";

const Contact = () => (
  <section id="contact" className="contact section">
    <div className="container section-title" data-aos="fade-up">
      <h2>Contact</h2>
      <p>Necessitatibus eius consequatur ex aliquid fuga eum quidem sint consectetur velit</p>
    </div>
    <div className="container" data-aos="fade-up" data-aos-delay="100">
      <div className="row gy-4 mb-5">
        <div className="col-lg-4" data-aos="fade-up" data-aos-delay="100">
          <div className="contact-info-box">
            <div className="icon-box">
              <i className="bi bi-geo-alt"></i>
            </div>
            <div className="info-content">
              <h4>Our Address</h4>
              <p>1842 Maple Avenue, Portland, Oregon 97204</p>
            </div>
          </div>
        </div>
        <div className="col-lg-4" data-aos="fade-up" data-aos-delay="200">
          <div className="contact-info-box">
            <div className="icon-box">
              <i className="bi bi-envelope"></i>
            </div>
            <div className="info-content">
              <h4>Email Address</h4>
              <p>info@example.com</p>
              <p>contact@example.com</p>
            </div>
          </div>
        </div>
        <div className="col-lg-4" data-aos="fade-up" data-aos-delay="300">
          <div className="contact-info-box">
            <div className="icon-box">
              <i className="bi bi-headset"></i>
            </div>
            <div className="info-content">
              <h4>Hours of Operation</h4>
              <p>Sunday-Fri: 9 AM - 6 PM</p>
              <p>Saturday: 9 AM - 4 PM</p>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div className="map-section" data-aos="fade-up" data-aos-delay="200">
      <iframe src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d48389.78314118045!2d-74.006138!3d40.710059!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c25a22a3bda30d%3A0xb89d1fe6bc499443!2sDowntown%20Conference%20Center!5e0!3m2!1sen!2sus!4v1676961268712!5m2!1sen!2sus"
        width="100%" height="500" style={{ border: 0 }} allowFullScreen loading="lazy" referrerPolicy="no-referrer-when-downgrade"></iframe>
    </div>
    <div className="container form-container-overlap">
      <div className="row justify-content-center" data-aos="fade-up" data-aos-delay="300">
        <div className="col-lg-10">
          <div className="contact-form-wrapper">
            <h2 className="text-center mb-4">Get in Touch</h2>
            <form className="php-email-form">
              <div className="row g-3">
                <div className="col-md-6">
                  <div className="form-group">
                    <div className="input-with-icon">
                      <i className="bi bi-person"></i>
                      <input type="text" className="form-control" name="name" placeholder="First Name" required />
                    </div>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="form-group">
                    <div className="input-with-icon">
                      <i className="bi bi-envelope"></i>
                      <input type="email" className="form-control" name="email" placeholder="Email Address" required />
                    </div>
                  </div>
                </div>
                <div className="col-md-12">
                  <div className="form-group">
                    <div className="input-with-icon">
                      <i className="bi bi-text-left"></i>
                      <input type="text" className="form-control" name="subject" placeholder="Subject" required />
                    </div>
                  </div>
                </div>
                <div className="col-12">
                  <div className="form-group">
                    <div className="input-with-icon">
                      <i className="bi bi-chat-dots message-icon"></i>
                      <textarea className="form-control" name="message" placeholder="Write Message..." style={{ height: 180 }} required></textarea>
                    </div>
                  </div>
                </div>
                <div className="col-12">
                  <div className="loading">Loading</div>
                  <div className="error-message"></div>
                  <div className="sent-message">Your message has been sent. Thank you!</div>
                </div>
                <div className="col-12 text-center">
                  <button type="submit" className="btn btn-primary btn-submit">SEND MESSAGE</button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </section>
);

export default Contact;