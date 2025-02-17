import React, { useEffect, useRef, useState } from 'react';
import styles from '../whyChoose/whyChoose.module.css';
import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';
import styled from 'styled-components';



const WhyChoose = ({ whyChoose }) => {
  const [isMobile, setIsMobile] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const sectionRef = useRef(null);
  

  useEffect(() => {
    setIsClient(true); // This will ensure the component renders only on the client side
    // Update `isMobile` based on the window width
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 767); // Mobile view for width <= 767px
    };

    // Add resize event listener and run it once on load
    window.addEventListener('resize', handleResize);
    handleResize();

    // Cleanup event listener on unmount
    return () => window.removeEventListener('resize', handleResize);
  }, []);


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

  // Carousel responsive settings
  const responsive = {
    mobile: {
      breakpoint: { max: 767, min: 0 },
      items: 1,
    },
  };
  const CustomDots = styled(Carousel)`
  .react-multi-carousel-dot-list {
    position: absolute;
    bottom: 0; /* Adjust this to control the bottom position */
    left: 50%;
    transform: translateX(-50%);
    margin: 0;
    res dots appear above other elements */
  }
`;






if (!whyChoose || whyChoose.length === 0) {
  return <p>No data available</p>;
}
  return (
    <section ref={sectionRef} className={styles['about-us-section']}>
       <div className={styles['header']}>
  <p className={styles['subtitle']}>Your Trusted Travel Partner</p>
  <h1 className={styles['title']}>Why Choose Us</h1>
</div>

     
      {isMobile ? (
        // Show carousel only on mobile
        <CustomDots
          responsive={responsive}
          infinite={true}
          autoPlay={true}
          autoPlaySpeed={3000}
          swipeable={true}
          draggable={true}
          showDots = {true}
          arrows={false}
          containerClass={styles['carousel-container']}
        >
          {whyChoose?.data?.slice(0, 4).map((card) => (
            <div key={card.id} className={styles['about-card']}>
              <div className={styles['image-wrapper']}>
                <img src={card.bannerImage} alt={card.title} />
              </div>
              <div className={styles['card-content']}>
                <h3 className={styles['card-title']}>{card.title}</h3>
                {isClient && (

                  <p
                    className={styles['card-description']}
                    dangerouslySetInnerHTML={{
                      __html: card.description && card.description,
                    }}
                  ></p>
                )}
              </div>
            </div>
          ))}
        </CustomDots>
      ) : (
        // Show grid on larger screens
        <div className={styles['cards-container']}>
          {whyChoose.data.slice(0, 4).map((card) => (
            <div key={card.id} className={styles['about-card']}>
              <div className={styles['image-wrapper']}>
                <img src={card.bannerImage} alt={card.title} />
              </div>
              <div className={styles['card-content']}>
                <h3 className={styles['card-title']}>{card.title}</h3>
                {isClient && (

                  <p
                    className={styles['card-description']}
                    dangerouslySetInnerHTML={{
                      __html: card.description && card.description,
                    }}
                  ></p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
       {/* <div className={styles.imageContainer}>
      <img
        src="https://res.cloudinary.com/drsexfijb/image/upload/v1738238021/download_it_on_Google_play_Store_xu7ln9.png" // Replace with your image URL
        alt="Full Width"
        className={styles.backgroundImage}
      />
      <a
        href="https://play.google.com" // Replace with the actual Play Store link
        target="_blank"
        rel="noopener noreferrer"
        className={styles.playstoreLink}
      >
        <img
          src="https://upload.wikimedia.org/wikipedia/commons/7/78/Google_Play_Store_badge_EN.svg" // Replace with the Play Store icon URL
          alt="Get it on Google Play"
          className={styles.playstoreIcon}
        />
      </a>
    </div> */}
    </section>
  );
};

export default WhyChoose;
