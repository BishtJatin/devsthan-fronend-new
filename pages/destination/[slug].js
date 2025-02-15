"use client";
import { useState } from "react";
import React, { useEffect } from "react";

import Head from 'next/head'; // Import Head for meta tags
import SlickSlider from "react-slick"; 
import styles from "./destination.module.css";
import { apiCall } from "../../utils/common";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import styled from "styled-components";
import Loader from "../../components/loader/loader";
import ToursList from "../../components/toursList/toursList";

import {
  MdOutlineKeyboardArrowDown,
  MdOutlineArrowForwardIos,
  MdOutlineArrowBackIos,
} from "react-icons/md";

import TourCard from "../../components/tourCard/tourCard";

const NextArrow = ({ onClick }) => (
  <div
    className={`${styles["custom-arrow"]} ${styles["next-arrow"]}`}
    onClick={onClick}
  >
    <MdOutlineArrowForwardIos />
  </div>
);

const PrevArrow = ({ onClick }) => (
  <div
    className={`${styles["custom-arrow"]} ${styles["prev-arrow"]}`}
    onClick={onClick}
  >
    <MdOutlineArrowBackIos />
  </div>
);
var settings = {
  infinite: true,
  slidesToShow: 1,
  slidesToScroll: 1,
  nextArrow: <NextArrow />,
  prevArrow: <PrevArrow />,
};
const responsive = {
  superLargeDesktop: {
    breakpoint: { max: 4000, min: 1024 },
    items: 3,
  },
  desktop: {
    breakpoint: { max: 1024, min: 600 },
    items: 2,
  },
  tablet: {
    breakpoint: { max: 600, min: 464 },
    items: 1,
  },
  mobile: {
    breakpoint: { max: 464, min: 0 },
    items: 1,
  },
};

const SubDestinationCarousel = styled(Slider)``;
const TourCarousel = styled(Carousel)`
  .react-multi-carousel-item > div {
    margin-right: 15px;
  }
`;

const Destination = ({ destinationData, destinationBanner }) => {
  const [viewport, setViewport] = useState("desktop");
  const [tours, setTours] = useState();

  const [loading, setLoading] = useState(true); // Track loading state
  const [error, setError] = useState(null); // Track error state
  const [fixtours, setFixTours] = useState();
  console.log(destinationBanner);

  const slickSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3, // Default for desktop
    slidesToScroll: 1,
    responsive: [
      {
        breakpoint: 1024, // For tablets
        settings: {
          slidesToShow: 2, // Show 2 cards on tablets
          slidesToScroll: 1,
          infinite: true,
          dots: true,
        },
      },
      {
        breakpoint: 768, // For mobile devices
        settings: {
          slidesToShow: 1, // Show 1 card on mobile
          slidesToScroll: 1,
        },
      },
    ],
  };
  

  useEffect(() => {
    const fetchToursByCategories = async () => {
      try {
        setLoading(true);
        const response = await apiCall({
          endpoint: `/api/allTours`,
          method: "POST",
          body: {
            fixedTour: false,
            location:destinationData?.state?.label,
          }
        });
        const response2 = await apiCall({
          endpoint: `/api/allTours`,
          method: "POST",
          body: {
            fixedTour: true,
            location:destinationData?.state?.label,
          }
        });
        setTours(response);
        setFixTours(response2);

        // setTours1(data);
      } catch (error) {
        console.error("Error fetching tours:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchToursByCategories();
  }, []);


  // useEffect(() => {
  //   const fetchTours = async () => {
  //     try {
  //       setLoading(true); // Start loading
  //       setError(null); // Reset error on new request
  //       const tourData = await apiCall({
  //         endpoint: `/api/tours/${destinationData?.state?.label}`,
  //         method: "POST",
  //       });
  //       setTours(tourData);
  //     } catch (error) {
  //       console.error("Error fetching tours:", error);
  //       setError("Failed to fetch tour data");
  //     } finally {
  //       setLoading(false); // Stop loading
  //     }
  //   };

  //   fetchTours();
  // }, [destinationData?.state?.label]);

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
        return destinationBanner?.data?.bannerUrls?.mobile[0] || [];
      case "tablet":
        return destinationBanner?.data?.bannerUrls?.tablet[0] || [];
      case "desktop":
      default:
        return destinationBanner?.data?.bannerUrls?.desktop[0] || [];
    }
  };

  const handleScrollParallax = () => {
    const parallaxImage = document.querySelector(
      `.${styles["parallax-image"]}`
    );
    if (parallaxImage) {
      const scrollPosition = window.scrollY;
      parallaxImage.style.transform = `translateY(${scrollPosition * 0.5}px)`; // Adjust speed factor
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScrollParallax);
    return () => window.removeEventListener("scroll", handleScrollParallax);
  }, []);

  const [isExpanded, setIsExpanded] = useState(false);
  const [isExpanded2, setIsExpanded2] = useState(false);

  const toggleReadMore = () => {
    setIsExpanded(!isExpanded);
  };

  const toggleReadMore2 = () => {
    setIsExpanded2(!isExpanded2);
  };

  const bannerImages = getBannerImages();

  // if(destinationData && destinationData.state == null){
  //   return;
  // }

  return (
    <>

      <Head>
        <title>{destinationData?.metaTitle || 'Devsthan Expert - Destination'}</title>
        <meta
          name="description"
          content={
            destinationData?.metaDescription ||
            'Explore sacred destinations and spiritual journeys with Devsthan Expert.'
          }
        />
        <link rel="canonical" href="https://www.example.com/" />
        <meta
          name="keywords"
          content="travel, tours, vacations, pilgrimage, holiday packages, travel deals"
        />
        <meta
          property="og:title"
          content={destinationData?.openGraph?.title || ""}
        />
        <meta
          property="og:description"
          content={destinationData?.openGraph?.description || ""}
        />

        <meta property="og:url" content={destinationData?.openGraph?.url || ""} />
        <meta property="og:type" content={destinationData?.openGraph?.type || ""} />

        <meta
          name="twitter:title"
          content={destinationData?.twitter?.title || ""}
        />
        <meta
          name="twitter:description"
          content={destinationData?.twitter?.description || ""} />
      </Head>
      <header className={styles.header}>
        <div className={styles["parallax-container"]}>
          <img
            src={bannerImages}
            alt="Destination Banner"
            className={styles["parallax-image"]}
          />
        </div>
        <div className={styles.header_content}>
          {/* <h1 className={styles.title}>Destination</h1>
          <nav>Home ➔ Destination</nav> */}
        </div>
      </header>
      <div className={styles.container}>
        <section className={styles.mainContent}>
          <h1>Welcome To {destinationData.location}</h1>
          <p>
            {destinationData.description}
          </p>

          <div className={styles.imageGrid}>
            {destinationData?.images.slice(0, 4)?.map((img, index) => (
              <div key={index} className={styles.imageCard}>
                <img
                  src={`${img}`}
                  alt={`image ${index + 1}`}
                  className={styles.image}
                />
              </div>
            ))}
          </div>

          <div className={styles["carousel-container"]}>
            <SubDestinationCarousel {...settings}>
              {destinationData?.subDestinations?.map((dest, index) => (
                <div key={index} className={styles["carousel-item"]}>
                  <h2>{dest.name}</h2>
                  <p>
                    {dest.description}
                  </p>
                  <div className={styles["image-grid"]}>
                    {dest.photos.slice(0, 4)?.map((photo, photoIndex) => (
                      <img
                        key={photoIndex}
                        src={photo}
                        alt={`Photo ${photoIndex + 1}`}
                      />
                    ))}
                  </div>
                </div>
              ))}
            </SubDestinationCarousel>
          </div>

          {/* <DestinationHighlighs highlights={destinationData.highlights} /> */}
        </section>

        {/* <aside className={styles.sidebar}>
        <div className={styles.detailsBox}>
          <h3>Destination</h3>
          <p><strong>{destinationData.state.label}</strong></p>
          <p><strong>Population:</strong> {destinationData.population}</p>
          <p><strong>Capital City:</strong> {destinationData.capitalCity}</p>
          <p><strong>Language:</strong> {destinationData.languages}</p>

        </div>
        <div className={styles.offerBox}>
          <h4>Savings worldwide</h4>
          <p>50% Off</p>
          <button className={styles.offerButton}>View All Package</button>
        </div>
      </aside> */}
      </div>
      <div className={styles['header-text']}>
        <p className={styles['header-text-subtitle']}>Holy Destinations</p>

        <h2 className={styles['header-text-title']}>Explore sacred places that offer peace and spiritual reflection</h2>
        <h3 className={styles['header-text-title1']}>Open Hour Tour</h3>
      </div>
      <div className={styles["carousel-tour"]}>
        {loading ? (
          <div className={styles["loader"]}>
            <Loader /> {/* Your loader component */}
          </div>
        ) : tours?.length > 0 ? (
          <div>
          {/* Slider for Tours */}
          <div className={styles["tourcardsslide"]}>
            
            <SlickSlider {...slickSettings}>
              {tours?.map((tour, index) => (
                <div key={index} className={styles["card-wrapper"]}>
                  <ToursList tourData={[tour]} />
                </div>
              ))}
            </SlickSlider>
          </div>
    
          {/* Slider for Fixed Tours */}
          <div className={styles["tourcardsslide"]}>
          <div className={styles['header-text']}>
        <p className={styles['header-text-subtitle']}>Holy Destinations</p>

        <h2 className={styles['header-text-title']}>Explore sacred places that offer peace and spiritual reflection</h2>
        <h3 className={styles['header-text-title1']}>Fixed Tour</h3>
      </div>

            <SlickSlider {...slickSettings}>
              {fixtours?.map((tour, index) => (
                <div key={index} className={styles["card-wrapper"]}>
                  <ToursList tourData={[tour]} />
                </div>
              ))}
            </SlickSlider>
          </div>
        </div>

          // <TourCarousel
          //   responsive={responsive}
          //   infinite={true}
          //   autoPlay={false}
          //   autoPlaySpeed={3000}
          // >
          //   {tours?.map((data) => (
          //     <div key={data?.uuid}>
          //       <TourCard
          //         data={data}
          //         duration={data.duration}
          //         location={data.location}
          //         uuid={data.uuid}
          //         imageUrl={data.bannerImage}
          //         title={data.name}
          //         startingPrice={`Rs.${
          //           data?.standardDetails?.pricing[0]?.price || "N/A"
          //         }`}
          //       />
          //     </div>
          //   ))}
          // </TourCarousel>
        ) : error ? (
          <div className={styles['loading-text']}>
            <p>Error: {error}</p> {/* Show error message if there's an issue */}
          </div>
        ) : (
          <div className={styles['loading-text']}>
            <p>No related tour found</p> {/* Show no tours message */}
          </div>
        )}
      </div>
    </>
  );
};
export default Destination;
export async function getStaticPaths() {
  const destinations = await apiCall({
    endpoint: "/api/getAllDestinations",
    method: "GET",
  });

  const paths = destinations.map((dest) => ({
    params: {
      slug: dest.location.replace(/\s+/g, "-").toLowerCase()
    },
  }));

  return {
    paths,
    fallback: "blocking", // Enable ISR for new destinations
  };
}

export async function getStaticProps({ params }) {
  try {
    console.log("Received params:", params); // Debug log

    const { slug } = params;

    // Fetch all destinations
    const allDestinations = await apiCall({
      endpoint: "/api/getAllDestinations",
      method: "GET",
    });

    console.log("Fetched all destinations:", allDestinations); // Debug log

    // Find the destination that matches the slug
    const destination = allDestinations.find(
      (dest) => dest.location.replace(/\s+/g, "-").toLowerCase() === slug
    );

    if (!destination) {
      console.error("Destination not found for slug:", slug);
      return { notFound: true };
    }

    console.log("Matched destination:", destination); // Debug log

    // Fetch destination details
    const destinationData = await apiCall({
      endpoint: `/api/getDestinationById/${destination.uuid}`,
      method: "POST",
    });

    console.log("Fetched destinationData:", destinationData); // Debug log

    // Fetch banner
    const destinationBanner = await apiCall({
      endpoint: `/api/getBanner?page=destinationBanner`,
      method: "GET",
    });

    return {
      props: {
        destinationData,
        destinationBanner,
      },
      revalidate: 600,
    };
  } catch (error) {
    console.error("Error fetching destination:", error);
    return {
      props: {
        destinationData: null,
        destinationBanner: null,
      },
      notFound: true,
    };
  }
}
