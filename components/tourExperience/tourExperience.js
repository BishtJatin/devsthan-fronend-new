"use client"
import { useEffect, useRef, useState } from 'react';
import styles from '../tourExperience/tourExperience.module.css';
import ToursList from '../toursList/toursList';

export default function TourExperience({tourData,subtitle,title}) {
  const [selectedTab, setSelectedTab] = useState('tour');

  const sectionRef = useRef(null); // Ref for this specific instance

  useEffect(() => {
    const section = sectionRef.current;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add(styles.animate);
          }
        });
      },
      { threshold: 0.2 } // Trigger when 20% of the element is visible
    );

    if (section) observer.observe(section);

    return () => {
      if (section) observer.unobserve(section);
    };
  }, []);

  return (
    <div ref={sectionRef} className={styles['tour-experience']}>
        <div className={styles['header']}>
        <p className={styles['subtitle']}>{subtitle}</p>
    
        <h2 className={styles['title']}>{title}</h2>
      </div>

      {/* <h2>Holy Pilgrimage Packages</h2> */}
      <div className={styles['tabs']}>
        {/* <span onClick={() => setSelectedTab('tour')} className={selectedTab === 'tour' ? styles['active'] : ''}>Tour Package</span> */}
        {/* <span onClick={() => setSelectedTab('hotel')} className={selectedTab === 'hotel' ? styles['active'] : ''}>Hotel</span>
        <span onClick={() => setSelectedTab('transports')} className={selectedTab === 'transports' ? styles['active'] : ''}>Transports</span> */}
      </div>
      {selectedTab == "tour" &&   <div className={styles['tour-cards']}> <ToursList tourData={tourData}/></div>   }
      {selectedTab == "hotel" &&  <p>wsec</p> }
     
      
    </div>
  );
}
