import { useEffect, useRef, useState } from 'react';
import Isotope from 'isotope-layout';
import imagesLoaded from 'imagesloaded';

export default function Gallery({ items }) {
  const gridRef = useRef(null);
  const isoRef = useRef(null);
  const [filter, setFilter] = useState('*');

  // init Isotope after images load
  useEffect(() => {
    const grid = gridRef.current;
    if (!grid) return;

    const il = imagesLoaded(grid, () => {
      isoRef.current = new Isotope(grid, {
        itemSelector: '.iso-item',
        layoutMode: 'masonry',
      });
    });

    return () => {
      il?.off?.('done');
      isoRef.current?.destroy();
    };
  }, []);

  useEffect(() => {
    isoRef.current?.arrange({ filter });
  }, [filter]);

  return (
    <section className="container py-5">
      <ul className="nav gap-3 mb-4">
        <li role="button" onClick={() => setFilter('*')}>All</li>
        <li role="button" onClick={() => setFilter('.starters')}>Starters</li>
        <li role="button" onClick={() => setFilter('.mains')}>Mains</li>
      </ul>

      <div className="row g-4" ref={gridRef}>
        {items.map((it) => (
          <div key={it.id} className={`col-md-4 iso-item ${it.category}`}>
            <div className="card h-100">
              <img src={it.src} alt={it.title} className="card-img-top" loading="lazy" />
              <div className="card-body">
                <h5 className="card-title">{it.title}</h5>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
