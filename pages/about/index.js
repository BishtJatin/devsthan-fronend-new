

import React, { useEffect } from "react";
import styles from "./about.module.css";
import Head from "next/head"; 
export default function AboutUs() {

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
 
  return (
    <>
    <Head>
      {/* Meta Tags for SEO */}
      <title>About Us - Devsthan Expert Travel Pvt. Ltd.</title>
      <meta
        name="description"
        content="Learn about Devsthan Expert Travel Pvt. Ltd., your trusted partner for religious tours, hotel bookings, and cab services across Uttarakhand. Explore our vision and mission."
      />
      <meta
        name="keywords"
        content="Devsthan, religious tours, Uttarakhand travel, hotel bookings, cab services, spiritual travel, pilgrimage"
      />

      {/* Canonical URL */}
      <link rel="canonical" href="https://yourwebsite.com/about-us" />

      {/* Robots Tag */}
      <meta name="robots" content="index, follow" />

      {/* Open Graph Meta Tags for Social Sharing */}
      <meta property="og:title" content="About Us - Devsthan Expert Travel Pvt. Ltd." />
      <meta
        property="og:description"
        content="Discover Devsthan Expert Travel Pvt. Ltd., offering seamless religious travel services. Explore our mission to make your spiritual journeys memorable."
      />
      <meta
        property="og:image"
        content="https://res.cloudinary.com/dmyzudtut/image/upload/v1735376268/images/uxs5pgmanov5vyntgom4.webp"
      />
      <meta property="og:url" content="https://yourwebsite.com/about-us" />
      <meta property="og:type" content="website" />

      {/* Twitter Meta Tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content="About Us - Devsthan Expert Travel Pvt. Ltd." />
      <meta
        name="twitter:description"
        content="Explore the vision and mission of Devsthan Expert Travel Pvt. Ltd., a trusted name in religious tours and personalized travel solutions."
      />
      <meta
        name="twitter:image"
        content="https://res.cloudinary.com/dmyzudtut/image/upload/v1735376268/images/uxs5pgmanov5vyntgom4.webp"
      />
    </Head>

    <section className={styles.aboutUs}>
      {/* Header Image */}
      <div className={styles["parallax-container"]}>
        <img
          src="https://res.cloudinary.com/dmyzudtut/image/upload/v1735203362/images/ign7uyvptmpzf5wua8qr.png"
          className={styles["parallax-image"]}
          alt="About Us Banner"
        />
      </div>

      {/* Content Section */}
      <div className={styles.content}>
        {/* Intro Section */}
        <div className={styles.intro}>
         

          {/* Vision and Mission Section */}
          <div className={styles.visionMission}>
           <div>
            <div>
            <h1 className={styles.heading}>About Us</h1>
             <p className={styles.description}>
            Welcome to Devsthan Expert Travel Pvt. Ltd., your trusted partner
            for religious tours, hotel bookings, and cab bookings across
            Uttarakhand. With our head office located in Khubru, Sonipat,
            Haryana, and our operational office at Haridwar, Uttarakhand, we are
            strategically positioned to serve your travel needs with ease and
            efficiency.
          </p>
            </div>
             
            <div className={styles.Visioncard}>
              <div className={styles.card}>
                <h3>Our Vision</h3>
                <ul>
                  <li>Provide exceptional religious travel services.</li>
                  <li>Ensure memorable experiences.</li>
                  <li>Customer-focused solutions.</li>
                </ul>
              </div>
              <div className={styles.card}>
                <h3>Our Mission</h3>
                <ul>
                  <li>Offer seamless and personalized travel services.</li>
                  <li>Meet spiritual and logistical needs.</li>
                  <li>Uplift your travel experience.</li>
                </ul>
              </div>
            </div>
            
            </div> 
            
            <div className={styles.visioncardimage}>
              <img
                src="https://res.cloudinary.com/dmyzudtut/image/upload/v1735376268/images/uxs5pgmanov5vyntgom4.webp"
                alt="VisionImage"
              />
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <div className={styles.stats}>
          <div className={styles.statsimage}>
            <img
              src="https://res.cloudinary.com/dmyzudtut/image/upload/v1735376406/about2_yy6k9x.jpg"
              alt="VisionImage"
            />
          </div>
          <div className={styles.statsmain}>
            <div className={styles.statsContent}>
              <h3>4+ Years Of Experience</h3>
              <p>
                Our main goal is to uplift your spiritual travel experience.
              </p>
            </div>

            <div className={styles.statsContentus}>
              <h3>Why Choose Us?</h3>
              <ul>
                <li>With years of experience in the travel industry, we have the expertise to organize flawless religious tours. Our knowledgeable team is well-versed in the unique requirements of spiritual travel.</li>
                <li>We understand that every traveler has unique needs. Our services are tailored to provide personalized attention, ensuring that your journey is as per your expectations.</li>
                {/* <li>From tour planning and hotel bookings to cab arrangements, we offer comprehensive solutions for all your travel needs, making your pilgrimage hassle-free.</li>
                <li>Our priority is your satisfaction. We are committed to providing high-quality services and ensuring that your travel experience is memorable and fulfilling.</li> */}
              </ul>
            </div>
          </div>
        </div>

        {/* Services Section */}
        <div className={styles.services}>
          <div className={styles.servicesGrid}>
            <div className={styles.service}>
              <img src="https://res.cloudinary.com/dmyzudtut/image/upload/v1734601458/images/zfe2kby8obipjc8jnfj0.png" alt="Qualified Consultant" />
              <h3>Expertise and Experience</h3>
              <p>Expert advice to guide you seamlessly through your journey.</p>
            </div>
            <div className={styles.service}>
              <img src="https://res.cloudinary.com/dmyzudtut/image/upload/v1734601458/images/zfe2kby8obipjc8jnfj0.png" alt="Qualified Consultant" />
              <h3>Personalized Service</h3>
              <p> We understand that every traveler has unique needs.</p>
            </div>
            <div className={styles.service}>
              <img src="https://res.cloudinary.com/dmyzudtut/image/upload/v1734601458/images/zfe2kby8obipjc8jnfj0.png" alt="Qualified Consultant" />
              <h3>Comprehensive Solutions</h3>
              <p>From tour planning and hotel bookings to cab arrangements, we offer comprehensive solutions.</p>
            </div>
           
          </div>
        </div>
      </div>
    </section>
    </>
  );
}

