import React from "react";

const team = [
  {
    img: "/assets/img/restaurant/chef-2.webp",
    name: "Sophia Martinez",
    role: "Pastry Chef",
    details: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec dignissim purus a ipsum faucibus, et porttitor."
  },
  {
    img: "/assets/img/restaurant/chef-3.webp",
    name: "Marcus Chen",
    role: "Sous Chef",
    details: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec dignissim purus a ipsum faucibus, et porttitor."
  },
  {
    img: "/assets/img/restaurant/chef-4.webp",
    name: "Jonathan Williams",
    role: "Head of Bar",
    details: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec dignissim purus a ipsum faucibus, et porttitor."
  },
  {
    img: "/assets/img/restaurant/chef-5.webp",
    name: "Isabella Romano",
    role: "Grill Master",
    details: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec dignissim purus a ipsum faucibus, et porttitor."
  }
];

const Chefs = () => (
  <section id="chefs" className="chefs section">
    <div className="container section-title" data-aos="fade-up">
      <h2>Chefs</h2>
      <p>Necessitatibus eius consequatur ex aliquid fuga eum quidem sint consectetur velit</p>
    </div>
    <div className="container" data-aos="fade-up" data-aos-delay="100">
      <div className="row">
        <div className="col-lg-5">
          <div className="chef-highlight" data-aos="fade-right" data-aos-delay="200">
            <figure className="chef-image">
              <img src="/assets/img/restaurant/chef-1.webp" className="img-fluid" alt="Executive Chef" />
            </figure>
            <div className="chef-details">
              <h3>Executive Chef</h3>
              <h2>Gabriel Turner</h2>
              <div className="chef-awards">
                <span><i className="bi bi-star-fill"></i> James Beard Award</span>
                <span><i className="bi bi-star-fill"></i> Two Michelin Stars</span>
              </div>
              <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut elit tellus, luctus nec ullamcorper mattis, pulvinar dapibus leo. Proin gravida nibh vel velit auctor aliquet. Aenean sollicitudin, lorem quis bibendum auctor nisi elit.</p>
              <div className="chef-signature">
                <img src="/assets/img/misc/signature-1.webp" alt="Chef Signature" />
              </div>
            </div>
          </div>
        </div>
        <div className="col-lg-7">
          <div className="team-container" data-aos="fade-left" data-aos-delay="300">
            <div className="row g-4">
              {team.map((chef, i) => (
                <div className="col-md-6" key={i}>
                  <div className="chef-card" data-aos="zoom-in" data-aos-delay={200 + i * 50}>
                    <div className="chef-img">
                      <img src={chef.img} className="img-fluid" alt={chef.name} />
                      <div className="social-links">
                        <a href="#"><i className="bi bi-instagram"></i></a>
                        <a href="#"><i className="bi bi-twitter-x"></i></a>
                        <a href="#"><i className="bi bi-facebook"></i></a>
                      </div>
                    </div>
                    <div className="chef-info">
                      <h4>{chef.name}</h4>
                      <p className="role">{chef.role}</p>
                      <p className="details">{chef.details}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
);

export default Chefs;