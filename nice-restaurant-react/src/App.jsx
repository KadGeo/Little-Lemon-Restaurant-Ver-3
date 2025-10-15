import { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AOS from "aos";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Menu from "./components/Menu";
import Testimonial from "./components/Testimonial";
import Chefs from "./components/Chefs";
import Events from "./components/Events";
import Gallery from "./components/Gallery";
import Contact from "./components/Contact";
import Footer from "./components/Footer";
import ScrollToTop from "./components/ScrollToTop";
import BookingPage from "./components/BookingPage";
import ConfirmedBooking from "./components/ConfirmedBooking";
import './App.css';
import './styles/booking.css';

// Import purecounterjs
import PureCounter from "@srexi/purecounterjs";

// Example gallery items
const items = [
  { id: 1, title: "Bruschetta", src: "/assets/img/bruschetta.jpg", category: "starters" },
  { id: 2, title: "Pasta", src: "/assets/img/pasta.jpg", category: "mains" },
  // …
];

// Home page component
function HomePage() {
  return (
    <>
      <Hero />
      <Menu />
      <Testimonial />
      <Chefs />
      <Events />
      <Gallery items={items} />
      <Contact />
    </>
  );
}

function App() {
  useEffect(() => {
    AOS.init();
    // Initialize purecounterjs
    new PureCounter(); // initialize once on mount

    // Remove preloader after page loads
    const preloader = document.getElementById('preloader');
    if (preloader) {
      window.addEventListener('load', () => {
        preloader.style.opacity = '0';
        setTimeout(() => {
          preloader.style.display = 'none';
        }, 600); // Match the transition duration in CSS
      });
    }
  }, []);

  return (
    <Router>
      <div className="index-page">
        {/* Preloader */}
        <div id="preloader"></div>

        <Navbar />
        <main className="main">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/booking" element={<BookingPage />} />
            <Route path="/booking-confirmed" element={<ConfirmedBooking />} />
          </Routes>
        </main>
        <Footer />
        <ScrollToTop />
        <div>
          <span
            data-purecounter-start="0"
            data-purecounter-end="100"
            data-purecounter-duration="2"
            className="purecounter"
          ></span>
        </div>
      </div>
    </Router>
  );
}

export default App;