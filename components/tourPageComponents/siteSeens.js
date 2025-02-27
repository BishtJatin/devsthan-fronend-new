import React, { useEffect, useState } from "react";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import styles from "../../components/itinery/itinery.module.css";
import Image from "next/image";
import styled from "styled-components";

const BannerInner = styled(Carousel)`
  .react-multiple-carousel__arrow {
    background: transparent;
  }
`;

const Meals = ({ itinerary }) => {
  const [isClient, setIsClient] = useState(false);




  useEffect(() => {
    setIsClient(true);
  }, []);

  const responsive = {
    desktop: {
      breakpoint: { max: 3000, min: 1024 },
      items: 1,
    },
    tablet: {
      breakpoint: { max: 1024, min: 464 },
      items: 1,
    },
    mobile: {
      breakpoint: { max: 464, min: 0 },
      items: 1,
    },
  };




  return (
    <div className={styles["day-details-outer"]}>
      {/* Heading Section */}
      <div className={styles["day-details-heading"]}>
        <div className={styles["day-details-inner"]}>
          <p className={styles["day-details-dayheading"]}>Day {itinerary.day} :</p>
          <p>{itinerary.title}</p>
        </div>
      </div>

      {/* Iterate Over SiteSeen */}
      {itinerary?.siteSeen?.length > 0 ? (
  itinerary.siteSeen.map((site, index) => (
    <div key={index} className={styles["day-details"]}>
      <div className={styles["content"]}>
        {/* Render Site Name */}
        <h3>{site.name}</h3>

        {/* Photos Carousel */}
        {site.photos?.length > 0 ? (
          <BannerInner
            responsive={responsive}
            infinite
            autoPlay={site.photos.length > 1}
            autoPlaySpeed={5000}
            arrows={false}
          >
            {site.photos.map((photo, idx) => (
              <div key={idx} className={styles["carousel-item"]}>
                <Image
                  src={photo}
                  width={300}
                  height={300}
                  alt={`Day ${itinerary.day} - Site ${index} - Image ${idx}`}
                />
              </div>
            ))}
          </BannerInner>
        ) : (
          
          <p className={styles["no-hotel"]}>No photos available</p>
        )}

        {/* Render Description */}
        {isClient && site.description && (
          <p
            className={styles["blog-card-description"]}
            dangerouslySetInnerHTML={{
              __html: site.description,
            }}
          />
        )}
      </div>
    </div>
  ))
) : (
  // Fallback if No SiteSeen Exists
  <div className={styles["no-hotel"]}>
    <p>No site seen included for this day</p>
  </div>
)}
    </div>
  );
};

export default Meals;
