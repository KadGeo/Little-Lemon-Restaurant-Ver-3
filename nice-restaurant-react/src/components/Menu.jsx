import { useState, useEffect, useRef } from "react";
import Isotope from 'isotope-layout';
import imagesLoaded from 'imagesloaded';

const menuItems = [
	{
		img: "/assets/img/restaurant/starter-2.webp",
		title: "Bruschetta Trio",
		tag: "Vegetarian",
		desc: "Lorem ipsum dolor sit amet, consectetur adipiscing elit curabitur sed.",
		price: "$8.95",
		filter: "filter-starters",
	},
	{
		img: "/assets/img/restaurant/starter-5.webp",
		title: "Calamari Fritti",
		tag: "Seafood",
		desc: "Lorem ipsum dolor sit amet, consectetur adipiscing elit curabitur sed.",
		price: "$10.95",
		filter: "filter-starters",
	},
	{
		img: "/assets/img/restaurant/main-1.webp",
		title: "Wild Mushroom Risotto",
		tag: "Vegetarian",
		desc: "Lorem ipsum dolor sit amet, consectetur adipiscing elit curabitur sed.",
		price: "$18.95",
		filter: "filter-main",
	},
	{
		img: "/assets/img/restaurant/main-4.webp",
		title: "Braised Lamb Shank",
		tag: "Chef's Choice",
		desc: "Lorem ipsum dolor sit amet, consectetur adipiscing elit curabitur sed.",
		price: "$26.95",
		filter: "filter-main",
	},
	{
		img: "/assets/img/restaurant/dessert-2.webp",
		title: "Chocolate Lava Cake",
		tag: "Gluten Free",
		desc: "Lorem ipsum dolor sit amet, consectetur adipiscing elit curabitur sed.",
		price: "$9.95",
		filter: "filter-dessert",
	},
	{
		img: "/assets/img/restaurant/dessert-7.webp",
		title: "Tiramisu",
		tag: "Classic",
		desc: "Lorem ipsum dolor sit amet, consectetur adipiscing elit curabitur sed.",
		price: "$8.95",
		filter: "filter-dessert",
	},
	{
		img: "/assets/img/restaurant/drink-3.webp",
		title: "Signature Cocktail",
		tag: "Alcoholic",
		desc: "Lorem ipsum dolor sit amet, consectetur adipiscing elit curabitur sed.",
		price: "$12.95",
		filter: "filter-drinks",
	},
	{
		img: "/assets/img/restaurant/drink-8.webp",
		title: "Berry Smoothie",
		tag: "Non-Alcoholic",
		desc: "Lorem ipsum dolor sit amet, consectetur adipiscing elit curabitur sed.",
		price: "$7.95",
		filter: "filter-drinks",
	},
];

const specials = [
	{
		img: "/assets/img/restaurant/main-3.webp",
		badges: ["Special", "Vegan"],
		title: "Mediterranean Grilled Salmon",
		desc: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent ut aliquam metus. Vivamus fermentum magna quis.",
		price: "$24.99",
	},
	{
		img: "/assets/img/restaurant/main-7.webp",
		badges: ["Special", "Spicy"],
		title: "Signature Ribeye Steak",
		desc: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam accumsan risus ut dui pretium, eget elementum nisi.",
		price: "$32.99",
	},
];

const Menu = () => {
	const [activeFilter, setActiveFilter] = useState('*');
	const isotopeRef = useRef(null);
	const containerRef = useRef(null);

	// Initialize Isotope after images load
	useEffect(() => {
		if (!containerRef.current) return;

		const imgLoad = imagesLoaded(containerRef.current);

		imgLoad.on('done', () => {
			isotopeRef.current = new Isotope(containerRef.current, {
				itemSelector: '.isotope-item',
				layoutMode: 'masonry',
				masonry: {
					columnWidth: '.isotope-item',
					gutter: 0
				}
			});
		});

		return () => {
			if (isotopeRef.current) {
				isotopeRef.current.destroy();
			}
		};
	}, []);

	// Handle filter change
	const handleFilterChange = (filter) => {
		setActiveFilter(filter);
		if (isotopeRef.current) {
			isotopeRef.current.arrange({ filter: filter });
		}
	};

	return (
		<section id="menu" className="menu section">
			<div className="container section-title" data-aos="fade-up">
				<h2>Menu</h2>
				<p>
					Necessitatibus eius consequatur ex aliquid fuga eum quidem sint
					consectetur velit
				</p>
			</div>
			<div className="container" data-aos="fade-up">
				<div className="isotope-layout">
					<div className="menu-filters isotope-filters mb-5">
						<ul>
							<li
								className={activeFilter === '*' ? 'filter-active' : ''}
								onClick={() => handleFilterChange('*')}
							>
								All
							</li>
							<li
								className={activeFilter === '.filter-starters' ? 'filter-active' : ''}
								onClick={() => handleFilterChange('.filter-starters')}
							>
								Starters
							</li>
							<li
								className={activeFilter === '.filter-main' ? 'filter-active' : ''}
								onClick={() => handleFilterChange('.filter-main')}
							>
								Main Courses
							</li>
							<li
								className={activeFilter === '.filter-dessert' ? 'filter-active' : ''}
								onClick={() => handleFilterChange('.filter-dessert')}
							>
								Desserts
							</li>
							<li
								className={activeFilter === '.filter-drinks' ? 'filter-active' : ''}
								onClick={() => handleFilterChange('.filter-drinks')}
							>
								Drinks
							</li>
						</ul>
					</div>
					<div className="menu-container isotope-container row gy-4" ref={containerRef}>
						{menuItems.map((item, i) => (
							<div
								key={i}
								className={`col-lg-6 isotope-item ${item.filter}`}
							>
								<div className="menu-item d-flex align-items-center gap-4">
									<img
										src={item.img}
										alt={item.title}
										className="menu-img img-fluid rounded-3"
									/>
									<div className="menu-content">
										<h5>
											{item.title}{" "}
											<span className="menu-tag">{item.tag}</span>
										</h5>
										<p>{item.desc}</p>
										<div className="price">{item.price}</div>
									</div>
								</div>
							</div>
						))}
					</div>
				</div>
				<div className="text-center mt-5" data-aos="fade-up">
					<a href="#" className="download-menu">
						<i className="bi bi-file-earmark-pdf"></i> Download Full Menu
					</a>
				</div>
				<div className="col-12 mt-5" data-aos="fade-up">
					<div className="specials-badge">
						<span>
							<i className="bi bi-award"></i> Chef's Specials
						</span>
					</div>
					<div className="specials-container">
						<div className="row g-4">
							{specials.map((special, i) => (
								<div key={i} className="col-md-6">
									<div className="menu-item special-item">
										<div className="menu-item-img">
											<img
												src={special.img}
												alt="Special Dish"
												className="img-fluid"
											/>
											<div className="menu-item-badges">
												{special.badges.map((badge, j) => (
													<span
														key={j}
														className={`badge-${badge.toLowerCase()}`}
													>
														{badge}
													</span>
												))}
											</div>
										</div>
										<div className="menu-item-content">
											<h4>{special.title}</h4>
											<p>{special.desc}</p>
											<div className="menu-item-price">
												{special.price}
											</div>
										</div>
									</div>
								</div>
							))}
						</div>
					</div>
				</div>
			</div>
		</section>
	);
};

export default Menu;