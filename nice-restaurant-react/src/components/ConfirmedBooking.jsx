import { useLocation, useNavigate, Link } from 'react-router-dom';
import { useEffect } from 'react';

export default function ConfirmedBooking() {
  const location = useLocation();
  const navigate = useNavigate();
  const booking = location.state?.booking;

  useEffect(() => {
    // If no booking data, redirect to booking page
    if (!booking) {
      navigate('/booking');
    }
  }, [booking, navigate]);

  if (!booking) {
    return null;
  }

  const formatDate = (dateString) => {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  return (
    <section className="confirmed-booking section" id="confirmed">
      <div className="container" data-aos="fade-up">
        <div className="row justify-content-center">
          <div className="col-lg-8">
            <div className="confirmation-card">
              <div className="confirmation-icon">
                <i className="bi bi-check-circle"></i>
              </div>

              <h2>Reservation Confirmed!</h2>
              <p className="lead">
                Thank you for choosing Little Lemon. We look forward to serving you!
              </p>

              <div className="booking-details">
                <h3>Reservation Details</h3>
                <div className="details-grid">
                  <div className="detail-row">
                    <div className="detail-label">
                      <i className="bi bi-calendar-event"></i>
                      <span>Date</span>
                    </div>
                    <div className="detail-value">{formatDate(booking.date)}</div>
                  </div>

                  <div className="detail-row">
                    <div className="detail-label">
                      <i className="bi bi-clock"></i>
                      <span>Time</span>
                    </div>
                    <div className="detail-value">{booking.time}</div>
                  </div>

                  <div className="detail-row">
                    <div className="detail-label">
                      <i className="bi bi-people"></i>
                      <span>Guests</span>
                    </div>
                    <div className="detail-value">
                      {booking.guests} {booking.guests === 1 ? 'Guest' : 'Guests'}
                    </div>
                  </div>

                  {booking.occasion && (
                    <div className="detail-row">
                      <div className="detail-label">
                        <i className="bi bi-star"></i>
                        <span>Occasion</span>
                      </div>
                      <div className="detail-value">{booking.occasion}</div>
                    </div>
                  )}
                </div>
              </div>

              <div className="confirmation-info">
                <div className="info-box">
                  <i className="bi bi-envelope"></i>
                  <p>
                    A confirmation email has been sent to your email address with all
                    the details of your reservation.
                  </p>
                </div>

                <div className="info-box">
                  <i className="bi bi-info-circle"></i>
                  <p>
                    Please arrive 10 minutes before your reservation time. If you need
                    to make any changes, please contact us at +1 (555) 123-4567.
                  </p>
                </div>
              </div>

              <div className="action-buttons">
                <Link to="/" className="btn btn-primary">
                  <i className="bi bi-house"></i>
                  Back to Home
                </Link>
                <Link to="/booking" className="btn btn-outline">
                  <i className="bi bi-calendar-plus"></i>
                  Make Another Reservation
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
