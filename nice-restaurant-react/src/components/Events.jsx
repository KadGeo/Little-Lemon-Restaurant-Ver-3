import React from "react";

const eventTypes = [
  {
    icon: "bi-calendar-heart",
    title: "Weddings & Celebrations",
    desc: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut elit tellus, luctus nec ullamcorper mattis.",
    capacity: "Up to 150 guests"
  },
  {
    icon: "bi-building",
    title: "Corporate Events",
    desc: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut elit tellus, luctus nec ullamcorper mattis.",
    capacity: "Up to 100 guests"
  },
  {
    icon: "bi-people",
    title: "Private Gatherings",
    desc: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut elit tellus, luctus nec ullamcorper mattis.",
    capacity: "Up to 50 guests"
  }
];

const featuredEvents = [
  {
    month: "Jun",
    day: "18",
    img: "/assets/img/restaurant/event-3.webp",
    title: "Summer Wine Festival",
    time: "6:00 PM - 10:00 PM",
    location: "Garden Terrace",
    desc: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean sed justo magna dolor sit amet."
  },
  {
    month: "Jul",
    day: "05",
    img: "/assets/img/restaurant/event-8.webp",
    title: "Gourmet Tasting Night",
    time: "7:30 PM - 11:00 PM",
    location: "Main Dining Hall",
    desc: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean sed justo magna dolor sit amet."
  }
];

const Events = () => (
  <section id="events" className="events section">
    <div className="container" data-aos="fade-up" data-aos-delay="100">
      <div className="intro-text text-center mb-5" data-aos="fade-up" data-aos-delay="150">
        <h2>Create Unforgettable Moments</h2>
        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin gravida nibh vel velit auctor aliquet. Aenean sollicitudin, lorem quis bibendum auctor, nisi elit consequat ipsum.</p>
      </div>
      <div className="event-types">
        <div className="row">
          {eventTypes.map((ev, i) => (
            <div className="col-lg-4 col-md-6" data-aos="fade-up" data-aos-delay={200 + i * 50} key={i}>
              <div className="event-type-card">
                <div className="icon-wrapper">
                  <i className={`bi ${ev.icon}`}></i>
                </div>
                <h3>{ev.title}</h3>
                <p>{ev.desc}</p>
                <span className="capacity">{ev.capacity}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="gallery-showcase" data-aos="fade-up" data-aos-delay="150">
        <div className="row g-3">
          <div className="col-lg-8">
            <div className="main-image" data-aos="zoom-in" data-aos-delay="200">
              <img src="/assets/img/restaurant/event-1.webp" alt="Event Space" className="img-fluid" />
            </div>
          </div>
          <div className="col-lg-4">
            <div className="row g-3">
              <div className="col-lg-12 col-md-6">
                <div className="gallery-item" data-aos="zoom-in" data-aos-delay="250">
                  <img src="/assets/img/restaurant/event-5.webp" alt="Event" className="img-fluid" />
                </div>
              </div>
              <div className="col-lg-12 col-md-6">
                <div className="gallery-item" data-aos="zoom-in" data-aos-delay="300">
                  <img src="/assets/img/restaurant/event-7.webp" alt="Event" className="img-fluid" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="event-cta" data-aos="fade-up" data-aos-delay="200">
        <div className="row align-items-center">
          <div className="col-lg-8">
            <h3>Ready to plan your special event?</h3>
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean sed justo magna. Contact us today to discuss your requirements.</p>
          </div>
          <div className="col-lg-4 text-lg-end">
            <a href="#" className="btn-reserve">Reserve Venue</a>
          </div>
        </div>
      </div>
      <div className="featured-events" data-aos="fade-up" data-aos-delay="200">
        <h3>Upcoming Featured Events</h3>
        <div className="row g-4">
          {featuredEvents.map((ev, i) => (
            <div className="col-lg-6 col-md-6" key={i}>
              <div className="featured-event-card" data-aos="fade-up" data-aos-delay={250 + i * 50}>
                <div className="event-date">
                  <span className="month">{ev.month}</span>
                  <span className="day">{ev.day}</span>
                </div>
                <div className="event-content">
                  <div className="event-image">
                    <img src={ev.img} alt={ev.title} className="img-fluid" />
                  </div>
                  <div className="event-info">
                    <h4>{ev.title}</h4>
                    <ul className="event-meta">
                      <li><i className="bi bi-clock"></i> {ev.time}</li>
                      <li><i className="bi bi-geo-alt"></i> {ev.location}</li>
                    </ul>
                    <p>{ev.desc}</p>
                    <a href="#" className="btn-details">View Details</a>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  </section>
);

export default Events;