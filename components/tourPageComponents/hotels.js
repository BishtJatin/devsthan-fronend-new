import React from "react";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import styles from "../../components/itinery/itinery.module.css";
import Image from "next/image";

import styled from "styled-components";

const BannerInner = styled(Carousel)`
  .react-multiple-carousel__arrow{
    background : transparent;
  }

  `;

const ItineraryDetails = ({ itinerary }) => {
  const { hotel, meals } = itinerary || {};
  const { breakfast, lunch, dinner } = meals || {};
  const hotelImages = hotel?.hotelImages || [];
  const roomImages = hotel?.roomImages || [];

  const responsive = {
    desktop: { breakpoint: { max: 3000, min: 1024 }, items: 1 },
    tablet: { breakpoint: { max: 1024, min: 464 }, items: 1 },
    mobile: { breakpoint: { max: 464, min: 0 }, items: 1 },
  };

  const renderCarousel = (images, altPrefix) =>
    images.length > 0 ? (
      <BannerInner
        responsive={responsive}
        infinite
        autoPlay={images.length > 1}
        autoPlaySpeed={5000}
        arrows={false}
      >
        {images.map((image, idx) => (
          <div key={idx} className={styles["carousel-item"]}>
            <Image src={image} alt={`${altPrefix} Image ${idx + 1}`} width={300} height={300} />
          </div>
        ))}
      </BannerInner>
    ) : (
      <p>No images available</p>
    );

  const renderMealCarousel = (meal, mealName) =>
    meal?.isAvailable && (
      <div className={styles["section"]}>
        <h3>{mealName}</h3>
        <div className={styles["hotel-details"]}>
          <div>
            <p><strong>{meal.name}</strong></p>
          </div>
          {renderCarousel(meal.photos, mealName)}
        </div>
      </div>
    );

  return (
    <div className={styles["day-details-Outer"]}>
      <div className={styles["day-details-heading"]}>
        <div className={styles["day-details-inner"]}>
          <p className={styles["day-details-dayheading"]}>Day {itinerary.day}</p>
          <p>{itinerary.title}</p>
        </div>
      </div>

      {/* Hotel Section */}
      {hotel?.isIncluded ? (
        <div className={styles["section"]}>
          <h3>Hotel</h3>
          <div className={styles["hotel-details"]}>
            <div>
              <p><strong>{hotel.name}</strong></p>
              <p>
                <a href={hotel.url} target="_blank" rel="noopener noreferrer">
                  {hotel.url}
                </a>
              </p>
              <div className="details">
                <strong>Category:</strong>
                {hotel.hotelCategory.map((category, idx) => (
                  <span key={idx}> {category} </span>
                ))}
              </div>
              <p><strong>Location:</strong> {hotel.location}</p>
            </div>
            <div className={styles["photos"]}>
              {renderCarousel(hotelImages, "Hotel")}
            </div>
          </div>

          <h3>Rooms</h3>
          <p><strong>Room Category:</strong> {hotel.roomCategory}</p>
          <div className={styles["photos"]}>
            {renderCarousel(roomImages, "Room")}
          </div>
        </div>
      ) : (
        <div className={styles["no-hotel"]}>
          <p>No hotel included for this day</p>
        </div>
      )}

      {/* Meals Section */}
      {(breakfast?.isAvailable || lunch?.isAvailable || dinner?.isAvailable) ? (
        <>
          <h3 className={styles["meals-heading"]}>Meals</h3>
          {renderMealCarousel(breakfast, "Breakfast")}
          {renderMealCarousel(lunch, "Lunch")}
          {renderMealCarousel(dinner, "Dinner")}
        </>
      ) : (
        <div className={styles["no-meals"]}>
          <p>No meals available for this day.</p>
        </div>
      )}
    </div>
  );
};

export default ItineraryDetails;
