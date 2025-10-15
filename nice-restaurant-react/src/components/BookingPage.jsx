import Main from './Main';

/**
 * BookingPage component - Provides the UI/layout wrapper for the booking system
 * The actual booking logic is handled by the Main component
 */
export default function BookingPage() {
  return (
    <section className="book-a-table section" id="booking">
      <div className="container" data-aos="fade-up">
        <div className="section-title">
          <h2>Reserve Your Table</h2>
          <p>Book your dining experience at Little Lemon</p>
        </div>

        <div className="row">
          <div className="col-lg-5 mb-4 mb-lg-0">
            <div className="reservation-info h-100">
              <h3>Why Book With Us?</h3>
              <p>
                Experience exceptional dining at Little Lemon. Our reservation
                system ensures you get the perfect table for your special
                occasion.
              </p>

              <div className="reservation-details">
                <div className="detail-item">
                  <i className="bi bi-clock"></i>
                  <div>
                    <h5>Opening Hours</h5>
                    <p>Mon - Fri: 5:00 PM - 11:00 PM</p>
                    <p>Sat - Sun: 5:00 PM - 12:00 AM</p>
                  </div>
                </div>

                <div className="detail-item">
                  <i className="bi bi-telephone"></i>
                  <div>
                    <h5>Contact Us</h5>
                    <p>Phone: +1 (555) 123-4567</p>
                    <p>Email: reservations@littlelemon.com</p>
                  </div>
                </div>

                <div className="detail-item">
                  <i className="bi bi-geo-alt"></i>
                  <div>
                    <h5>Location</h5>
                    <p>123 Citrus Street</p>
                    <p>Downtown, City 12345</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="col-lg-7">
            <div className="reservation-form-wrapper">
              <div className="form-header">
                <h3>Book Your Table</h3>
                <p>Fill in the details below to reserve your table</p>
              </div>
              {/* Main component handles all booking logic and state */}
              <Main />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
