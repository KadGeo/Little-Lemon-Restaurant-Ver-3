import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";

const Navbar = () => {
  const [mobileNavActive, setMobileNavActive] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [activeSection, setActiveSection] = useState('#hero');
  const location = useLocation();

  // Toggle mobile navigation
  const toggleMobileNav = () => {
    setMobileNavActive(!mobileNavActive);
    document.body.classList.toggle('mobile-nav-active');
  };

  // Close mobile nav when clicking on a link
  const handleNavLinkClick = () => {
    if (mobileNavActive) {
      setMobileNavActive(false);
      document.body.classList.remove('mobile-nav-active');
    }
  };

  // Toggle dropdown menus
  const handleDropdownToggle = (e, dropdownId) => {
    e.preventDefault();
    e.stopPropagation();
    setActiveDropdown(activeDropdown === dropdownId ? null : dropdownId);
  };

  // Scrollspy: Update active link based on scroll position
  useEffect(() => {
    const handleScroll = () => {
      const sections = document.querySelectorAll('section[id]');
      const scrollPosition = window.scrollY + 200;

      sections.forEach((section) => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        const sectionId = '#' + section.getAttribute('id');

        if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
          setActiveSection(sectionId);
        }
      });
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Call once on mount

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Update body class when mobile nav state changes
  useEffect(() => {
    if (mobileNavActive) {
      document.body.classList.add('mobile-nav-active');
    } else {
      document.body.classList.remove('mobile-nav-active');
    }

    return () => {
      document.body.classList.remove('mobile-nav-active');
    };
  }, [mobileNavActive]);

  // Check if we're on the home page
  const isHomePage = location.pathname === '/';

  return (
    <header id="header" className="header d-flex align-items-center sticky-top">
      <div className="container position-relative d-flex align-items-center justify-content-between">
        <nav id="navmenu" className="navmenu order-1">
          <ul>
            {isHomePage ? (
              <>
                <li><a href="#hero" className={activeSection === '#hero' ? 'active' : ''} onClick={handleNavLinkClick}>Home</a></li>
                <li><a href="#about" className={activeSection === '#about' ? 'active' : ''} onClick={handleNavLinkClick}>About</a></li>
                <li><a href="#menu" className={activeSection === '#menu' ? 'active' : ''} onClick={handleNavLinkClick}>Menu</a></li>
                <li><Link to="/booking" className={location.pathname === '/booking' ? 'active' : ''} onClick={handleNavLinkClick}>Book a Table</Link></li>
                <li><a href="#chefs" className={activeSection === '#chefs' ? 'active' : ''} onClick={handleNavLinkClick}>Chefs</a></li>
                <li><a href="#events" className={activeSection === '#events' ? 'active' : ''} onClick={handleNavLinkClick}>Events</a></li>
                <li><a href="#contact" className={activeSection === '#contact' ? 'active' : ''} onClick={handleNavLinkClick}>Contact</a></li>
              </>
            ) : (
              <>
                <li><Link to="/" onClick={handleNavLinkClick}>Home</Link></li>
                <li><Link to="/#about" onClick={handleNavLinkClick}>About</Link></li>
                <li><Link to="/#menu" onClick={handleNavLinkClick}>Menu</Link></li>
                <li><Link to="/booking" className={location.pathname === '/booking' ? 'active' : ''} onClick={handleNavLinkClick}>Book a Table</Link></li>
                <li><Link to="/#chefs" onClick={handleNavLinkClick}>Chefs</Link></li>
                <li><Link to="/#events" onClick={handleNavLinkClick}>Events</Link></li>
                <li><Link to="/#contact" onClick={handleNavLinkClick}>Contact</Link></li>
              </>
            )}
          </ul>
          <i
            className={`mobile-nav-toggle d-xl-none bi ${mobileNavActive ? 'bi-x' : 'bi-list'}`}
            onClick={toggleMobileNav}
          ></i>
        </nav>
        <Link to="/" className="logo order-2 mx-auto">
          <img src="/assets/img/misc/Logo.png" alt="Nice Restaurant Logo" className="logo-img" />
        </Link>
        <Link className="btn-getstarted order-3 d-none d-sm-block" to="/booking">Book a Table</Link>
      </div>
    </header>
  );
};

export default Navbar;