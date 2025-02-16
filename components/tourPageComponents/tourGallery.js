import React, { useEffect, useState } from 'react';
import styles from "../../pages/package/openHour/tour.module.css";
import { IoLocationOutline } from "react-icons/io5";
import Image from 'next/image';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

const CustomPrevArrow = ({ onClick }) => (
  <button className={styles.prevArrow} onClick={onClick}>
    &#8592;
  </button>
);

const CustomNextArrow = ({ onClick }) => (
  <button className={styles.nextArrow} onClick={onClick}>
    &#8594;
  </button>
);

const TourGallery = ({ images, name, state, city, location, duration,tourBanner }) => {

  const [viewport, setViewport] = useState("desktop");

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
      return tourBanner?.data?.bannerUrls?.mobile[0] || [];
    case "tablet":
      return tourBanner?.data?.bannerUrls?.tablet[0] || [];
    case "desktop":
    default:
      return tourBanner?.data?.bannerUrls?.desktop[0] || [];
  }
};

const bannerImages = getBannerImages();


  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    prevArrow: <CustomPrevArrow />,
    nextArrow: <CustomNextArrow />,
  };

  return (
    <div className={styles['gallery-container']}>
      {/* Title Section */}
      <div className={styles['header']}>
        <h1>{name}</h1>
        <div className={styles['sub-header']}>
          <span className={styles['duration']}>{`${duration} Days / ${duration-1} Nights`}</span>
          <span className={styles['location']}>{location}</span>
        </div>
      </div>

      {/* Carousel Section */}
      <div className={styles['carousel-container']}>
        
            <div className={styles['carousel-item']}>
              <Image src={ bannerImages}  layout="fill" className={styles['carousel-img']}/>
            </div>
         
      </div>
    </div>
  );
};

export default TourGallery;
