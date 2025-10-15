import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Autoplay } from 'swiper/modules';
import { Link } from 'react-router-dom';

const Hero = () => (
  <section id="hero" className="hero section dark-background"
    style={{ backgroundImage: "url(/assets/img/bg/LittleLemonOnline-Bootstrap-bg-Image.png)" }}>
    <div className="container-fluid hero-container" data-aos="fade-up">
      <div className="row g-0 align-items-center">
        <div className="col-lg-6 content-col">
          <div className="content-wrapper">
            <div className="status-badge">Reservations Open</div>
            <h2>Savor the Moment, One Bite at a Time</h2>
            <p>Discover a journey of flavors at our exquisite restaurant. Immerse yourself in a delightful dining experience crafted with passion and precision.</p>
            <div className="opening-hours" data-aos="fade-up" data-aos-delay="500">
              <i className="bi bi-clock"></i>
              <span>Open Daily: 11am - 10pm</span>
            </div>
            <div className="btn-group">
              <Link to="/booking" className="btn btn-book">Book a Table</Link>
              <a href="#menu" className="btn btn-menu">Explore Our Menu</a>
            </div>
            <div className="social-links">
              <a href="#"><i className="bi bi-facebook"></i></a>
              <a href="#"><i className="bi bi-instagram"></i></a>
              <a href="#"><i className="bi bi-twitter"></i></a>
              <a href="#"><i className="bi bi-youtube"></i></a>
            </div>
          </div>
        </div>
        <div className="col-lg-6 swiper-col">
          <div className="swiper hero-swiper" data-aos="zoom-out" data-aos-delay="100">
            <Swiper
              modules={[Navigation, Autoplay]}
              spaceBetween={0}
              slidesPerView={1}
              navigation={{
                nextEl: '.hero-swiper .swiper-button-next',
                prevEl: '.hero-swiper .swiper-button-prev',
              }}
              autoplay={{
                delay: 5000,
                disableOnInteraction: false,
              }}
              loop={true}
              speed={600}
            >
              <SwiperSlide>
                <div className="img-container">
                  <img src="/assets/img/restaurant/Little-Lemon-Restaurant-Setting.jpg" alt="Restaurant Ambience" />
                </div>
              </SwiperSlide>
              <SwiperSlide>
                <div className="img-container">
                  <img src="/assets/img/restaurant/Little-Lemon-Restaurant-People.jpg" alt="Signature Dish" />
                </div>
              </SwiperSlide>
              <SwiperSlide>
                <div className="img-container">
                  <img src="/assets/img/restaurant/Little-Lemon-Restaurant-Food.jpg" alt="Expert Chefs" />
                </div>
              </SwiperSlide>
            </Swiper>
            <div className="swiper-button-next"></div>
            <div className="swiper-button-prev"></div>
          </div>
        </div>
      </div>
    </div>
  </section>
);

export default Hero;