import React, { useEffect, useState } from "react";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import styles from "../../components/itinery/itinery.module.css";
import Image from "next/image";

const Meals = ({ itinerary }) => {
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
      {itinerary?.activity?.length > 0 ? (
        <div className={styles["day-details"]}>
          {itinerary.activity.map((act, index) => (
            <div key={index} className={styles["activity-section"]}>
              <h3 className={styles["activity-title"]}>{act.title || `Activity ${index + 1}`}</h3>
              
              {/* Activity Photos */}
              {act?.photos?.length > 0 ? (
                <Carousel
                  responsive={responsive}
                  infinite
                  autoPlay={act.photos.length > 1}
                  autoPlaySpeed={5000}
                  arrows={false}
                >
                  {act.photos.map((photo, idx) => (
                    <div key={idx} className={styles["carousel-item"]}>
                      <Image
                        src={photo}
                        width={300}
                        height={300}
                        alt={`Day ${itinerary.day} - Activity ${index + 1} - Image ${idx}`}
                      />
                    </div>
                  ))}
                </Carousel>
              ) : (
                <p>No photos available for this activity</p>
              )}
              
              {/* Activity Description */}
              {isClient && act.description && (
                <p
                  className={styles["activity-description"]}
                  dangerouslySetInnerHTML={{
                    __html: act.description,
                  }}
                />
              )}
            </div>
          ))}
        </div>
      ) : (
        // Fallback for No Activities
        <div className={styles["no-activities"]}>
          <p>No activities available for this day</p>
        </div>
      )}
    </div>
  );
};

export default Meals;
