
import React, { useState, useEffect } from "react";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css"; // Make sure to include Carousel styles
import styles from "../../components/itinery/itinery.module.css";
import Image from "next/image";
import styled from "styled-components";

const BannerInner = styled(Carousel)`
  .react-multiple-carousel__arrow{
    background : transparent;
  }

  `;

const DayPlan = ({ itinerary }) => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const responsive = {
    desktop: {
      breakpoint: { max: 3000, min: 1024 },
      items: 1, // Show one photo at a time
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

      {/* Day Details */}
      <div className={styles["day-details"]}>
        <div className={styles["content"]}>
          {itinerary.photos.length > 0 ? (
            <BannerInner
              responsive={responsive}
              infinite
              autoPlay={itinerary.photos.length > 1}
              autoPlaySpeed={5000}
              arrows
            >
              {itinerary.photos.map((photo, index) => (
                <div key={index} className={styles["carousel-item"]}>
                  <Image
                    src={photo}
                    width={300}
                    height={300}
                    alt={`Day ${itinerary.day} - Image ${index}`}
                  />
                </div>
              ))}
            </BannerInner>
          ) : (
            <p>No photos available</p>
          )}

          {isClient && (
            <p
              className={styles["blog-card-description"]}
              dangerouslySetInnerHTML={{
                __html: itinerary.description && itinerary.description,
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default DayPlan;
