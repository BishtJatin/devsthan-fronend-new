import React, { useEffect, useState } from 'react';
import Head from "next/head";
import styles from './destinations.module.css';
import { apiCall } from '../../utils/common';
import Link from 'next/link';
import DestinationCard from '../../components/destinationCard/destinationCard';

const Destinations = ({ destinations,destinationsBanner }) => {

  const [viewport, setViewport] = useState("desktop");

  const handleScrollParallax = () => {
    const parallaxImage = document.querySelector(`.${styles['parallax-image']}`);
    if (parallaxImage) {
      const scrollPosition = window.scrollY;
      parallaxImage.style.transform = `translateY(${scrollPosition * 0.5}px)`; // Adjust speed factor
    }
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScrollParallax);
    return () => window.removeEventListener('scroll', handleScrollParallax);
  }, []);
 

   useEffect(() => {
      const updateViewport = () => {
        if (window.matchMedia("(max-width: 768px)").matches) {
          setViewport("mobile");
        } else if (window.matchMedia("(max-width: 1024px)").matches) {
          setViewport("tablet");
        } else {
          setViewport("desktop");
        }
      };
  
      // Initial check
      updateViewport();
  
      // Listen for changes
      window.addEventListener("resize", updateViewport);
      return () => window.removeEventListener("resize", updateViewport);
    }, []);
  
  
    const getBannerImages = () => {
      switch (viewport) {
        case "mobile":
          return destinationsBanner?.data?.bannerUrls?.mobile[0] || [];
        case "tablet":
          return destinationsBanner?.data?.bannerUrls?.tablet || [];
        case "desktop":
        default:
          return destinationsBanner?.data?.bannerUrls?.desktop || [];
      }
    };

    const bannerImages = getBannerImages();


  return (
    <>
      <Head>
        {/* Meta Tags for SEO */}
        <title>Sacred Journeys: Explore the World&apos;s Holiest Destinations</title>

        <meta
          name="description"
          content="Discover and explore the world's holiest destinations with our curated sacred journeys. Perfect for spiritual seekers and travelers."
        />
        <meta
          name="keywords"
          content="sacred journeys, holy destinations, spiritual travel, pilgrimage, religious tours"
        />
        
        {/* Canonical URL */}
        <link rel="canonical" href="https://yourwebsite.com/destinations" />

        {/* Robots Tag */}
        <meta name="robots" content="index, follow" />

        {/* Open Graph Meta Tags for Social Sharing */}
        <meta property="og:title" content="Sacred Journeys: Explore the World's Holiest Destinations" />
        <meta
          property="og:description"
          content="Embark on spiritual journeys to the most revered destinations around the globe."
        />
        <meta property="og:image" content="/path-to-your-thumbnail-image.jpg" />
        <meta property="og:url" content="https://yourwebsite.com/destinations" />
        <meta property="og:type" content="website" />

        {/* Twitter Meta Tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Sacred Journeys: Explore the World's Holiest Destinations" />
        <meta
          name="twitter:description"
          content="Explore spiritual journeys to the world's holiest places."
        />
        <meta name="twitter:image" content="/path-to-your-thumbnail-image.jpg" />
      </Head>
    <div className={styles.container}>
     <header className={styles.header}>
        <div className={styles['parallax-container']}>

          <img src={bannerImages} alt="Destination Banner" className={styles['parallax-image']} />

        </div>
        <div className={styles.header_content}>
          {/* <h1 className={styles.title}>Destinations</h1>
          <nav>Home ➔ Destinations</nav> */}
        </div>
      </header>
      <div className={styles['header-text']}>
                <h1 className={styles['header-text-subtitle']}> Sacred Journeys</h1>
                <h2 className={styles['header-text-title']}>Exploring the Worlds Holiest Destinations</h2>
      </div>
      <div className={styles.grid}>
        {destinations.map((destination, index) => (
     <Link 
     href={`/destination/${destination.location.replace(/\s+/g, "-").toLowerCase()}`} 
     key={index} 
     passHref
   >
     <div className={styles.card}>
       <DestinationCard destination={destination} />
     </div>
   </Link>
   

        ))}
      </div>
      {/* <div className={styles.pagination}>
        <span>01</span>
        <span>02</span>
        <button className={styles.nextButton}>&#10095;</button>
      </div> */}
    </div>
    </>
  );
};

export default Destinations;
export async function getStaticProps() {

  const destinations = await apiCall({
    endpoint: '/api/getAllDestinations',
    method: 'GET',

  });
  const destinationsBanner = await apiCall({
    endpoint: `/api/getBanner?page=destinationsBanner`,
    method: 'GET',

  });
  return {
    props: {

      destinations,
      destinationsBanner
    },
    revalidate: 600,

  };
}

