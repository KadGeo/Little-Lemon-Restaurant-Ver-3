import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination } from 'swiper/modules';

const testimonials = [
  {
    img: "/assets/img/person/person-m-9.webp",
    name: "Saul Goodman",
    role: "Ceo & Founder",
    text: "Proin iaculis purus consequat sem cure digni ssim donec porttitora entum suscipit rhoncus. Accusantium quam, ultricies eget id, aliquam eget nibh et. Maecen aliquam, risus at semper."
  },
  {
    img: "/assets/img/person/person-f-5.webp",
    name: "Sara Wilsson",
    role: "Designer",
    text: "Export tempor illum tamen malis malis eram quae irure esse labore quem cillum quid cillum eram malis quorum velit fore eram velit sunt aliqua noster fugiat irure amet legam anim culpa."
  },
  {
    img: "/assets/img/person/person-f-12.webp",
    name: "Jena Karlis",
    role: "Store Owner",
    text: "Enim nisi quem export duis labore cillum quae magna enim sint quorum nulla quem veniam duis minim tempor labore quem eram duis noster aute amet eram fore quis sint minim."
  },
  {
    img: "/assets/img/person/person-m-12.webp",
    name: "Matt Brandon",
    role: "Freelancer",
    text: "Fugiat enim eram quae cillum dolore dolor amet nulla culpa multos export minim fugiat minim velit minim dolor enim duis veniam ipsum anim magna sunt elit fore quem dolore labore illum veniam."
  },
  {
    img: "/assets/img/person/person-m-13.webp",
    name: "John Larson",
    role: "Entrepreneur",
    text: "Quis quorum aliqua sint quem legam fore sunt eram irure aliqua veniam tempor noster veniam enim culpa labore duis sunt culpa nulla illum cillum fugiat legam esse veniam culpa fore nisi cillum quid."
  }
];

export default function Testimonials() {
  return (
    <section className="testimonials section">
      <div className="container section-title" data-aos="fade-up">
        <h2>Testimonials</h2>
        <p>Necessitatibus eius consequatur ex aliquid fuga eum quidem sint consectetur velit</p>
      </div>
      <div className="container" data-aos="fade-up" data-aos-delay="100">
        <Swiper
          modules={[Autoplay, Pagination]}
          spaceBetween={30}
          slidesPerView={1}
          centeredSlides={true}
          pagination={{
            clickable: true,
          }}
          autoplay={{
            delay: 5000,
            disableOnInteraction: false,
          }}
          loop={true}
          speed={600}
          breakpoints={{
            1200: {
              slidesPerView: 3,
            },
          }}
        >
          {testimonials.map((t, i) => (
            <SwiperSlide key={i}>
              <div className="testimonial-item">
                <div className="stars">
                  {[...Array(5)].map((_, idx) => (
                    <i className="bi bi-star-fill" key={idx}></i>
                  ))}
                </div>
                <p>{t.text}</p>
                <div className="profile mt-auto">
                  <img src={t.img} className="testimonial-img" alt={t.name} />
                  <h3>{t.name}</h3>
                  <h4>{t.role}</h4>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
}
