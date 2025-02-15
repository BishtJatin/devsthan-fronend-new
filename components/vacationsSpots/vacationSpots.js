import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import styles from '../vacationsSpots/vacationSpots.module.css';
import DestinationCard from '../destinationCard/destinationCard';
import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';

const VacationSpots = ({ destinations }) => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    handleResize(); // Initial check
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const responsive = {
    desktop: {
      breakpoint: { max: 3000, min: 1025 },
      items: 1,
    },
    tablet: {
      breakpoint: { max: 1024, min: 768 },
      items: 1,
    },
    mobile: {
      breakpoint: { max: 767, min: 0 },
      items: 1,
    },
  };

  useEffect(() => {
    const section = document.querySelector(`.${styles['vacation-spots-section']}`);
    
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add(styles.animate);
          }
        });
      },
      { threshold: 0.2 }
    );
    
    if (section) observer.observe(section);

    return () => {
      if (section) observer.unobserve(section);
    };
  }, []);

  return (
    <section className={styles['vacation-spots-section']}>
      <div className={styles['header']}>
        <p className={styles['subtitle']}>  Explore the Essence of</p>
    
        <h2 className={styles['title']}>Holy Destinations</h2>
      </div>

      {isMobile ? (
        <Carousel 
          responsive={responsive} 
          infinite 
          autoPlay={true} 
          arrows 

        >
          {destinations.length>0 && destinations && destinations?.slice(0, 8).map((dest) => (
            <div key={dest.uuid} className={styles['carousel-item']}>
            <Link 
  href={`/destination/${dest.location.replace(/\s+/g, "-").toLowerCase()}`}
>
  <DestinationCard destination={dest} />
</Link>

            </div>
          ))}
        </Carousel>
      ) : (
        <div className={styles['grid']}>
          {destinations.length>0 && destinations && destinations?.slice(0, 4).map((dest) => (
            <div key={dest.uuid} className={styles['grid-item']}>
              <Link 
  href={`/destination/${dest.location.replace(/\s+/g, "-").toLowerCase()}`}
>
  <DestinationCard destination={dest} />
</Link>
            </div>
          ))}
        </div>
      )}

      <Link href={`/destinations`}>
        <button className={styles['promo-button']}>View All Destination</button>
      </Link>
    </section>
  );
};

export default VacationSpots;
