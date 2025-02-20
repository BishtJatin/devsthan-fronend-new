
import React, { useEffect, useState } from 'react';
import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css'; // Import carousel styles

import styles from '../../components/itinery/itinery.module.css';
import Image from 'next/image';
import styled from "styled-components";

const BannerInner = styled(Carousel)`
  .react-multiple-carousel__arrow{
    background : transparent;
  }

  `;

const Transfers = ({ itinerary }) => {

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

    const renderCarousel = (photos) => (
        <BannerInner
        responsive={responsive}
        infinite
        autoPlay={photos.length > 1}
        autoPlaySpeed={5000}
        arrows={false}
    >
        {photos.map((photo, idx) => (
            <div key={idx} className={styles['carousel-item']}>
                <Image src={photo} alt="Transportation photo" width={300} height={300} />
            </div>
        ))}
      </BannerInner>
    
    );

    return (
        <div className={styles['Transfers-details']}>

            <div className={styles['day-details-heading']}>
                <div className={styles['day-details-inner']}>
                    <p className={styles["day-details-dayheading"]}>Day {itinerary.day}</p>
                    <p>{itinerary.title}</p>
                </div>
            </div>

            {itinerary.transportation.flight?.isIncluded && (
                <div className={styles['section']}>

                    <h3 style={{ marginLeft: '10px' }}>Flight</h3>
                    <div className={styles['content']}>
                        {renderCarousel(itinerary.transportation.flight.photos)}

                        <p>
                            <strong>{itinerary.transportation.flight.name}</strong>
                            <br />
                            <strong>Departure Time: </strong> {itinerary.transportation.flight.departureTime}
                            <br />
                            <strong>Category: </strong> {itinerary.transportation.flight.category}
                            <br />
                            {itinerary.transportation.flight.description}
                        </p>
                    </div>
                </div>
            )}

            {itinerary.transportation.car?.isIncluded && (
                <div className={styles['section']}>

                    <h3  style={{ marginLeft: '10px' }}>Car</h3>
                    <div className={styles['content']}>
                        {renderCarousel(itinerary.transportation.car.photos)}

                        <p>
                            <strong>{itinerary.transportation.car.name}</strong>
                            <br />
                            <strong>Departure From: </strong> {itinerary.transportation.car.departureFrom}
                            <br />
                            <strong>Arrival To: </strong> {itinerary.transportation.car.arrivalTo}

                            <br />
                            <strong>Departure Time: </strong> {itinerary.transportation.car.departureTime}
                            <br />
                            <strong>Category: </strong> {itinerary.transportation.car.category}
                            <br />
                            <strong>Maximum capacity: </strong> {itinerary.transportation.car.maxPeople} People
                            <br />

                            <strong>Price: </strong> {itinerary.transportation.car.price}

                            <br />
                            {itinerary.transportation.car.description}
                        </p>
                    </div>
                </div>
            )}

            {itinerary.transportation.bus?.isIncluded && (
                <div className={styles['section']}>

                    <h3 style={{ marginLeft: '10px' }}>Bus</h3>
                    <div className={styles['content']}>
                        {renderCarousel(itinerary.transportation.bus.photos)}
                        <p>
                            <strong>{itinerary.transportation.bus.name}</strong>
                            <br />
                            <strong>Departure Time: </strong> {itinerary.transportation.bus.departureTime}
                            <br />
                            <strong>Category: </strong> {itinerary.transportation.bus.category}
                            <br />
                            {itinerary.transportation.bus.description}
                        </p>

                    </div>
                </div>
            )}

            {itinerary.transportation.train?.isIncluded && (
                <div className={styles['section']}>

                    <h3 style={{ marginLeft: '10px' }}>Train</h3>
                    <div className={styles['content']}>
                        {renderCarousel(itinerary.transportation.train.photos)}
                        <p>
                            <strong>{itinerary.transportation.train.name}</strong>
                            <br />
                            <strong>Departure Time: </strong> {itinerary.transportation.train.departureTime}
                            <br />
                            <strong>Category: </strong> {itinerary.transportation.train.category}
                            <br />
                            {itinerary.transportation.train.description}
                        </p>

                    </div>
                </div>
            )}


            {!itinerary.transportation.flight?.isIncluded &&
                !itinerary.transportation.car?.isIncluded &&
                !itinerary.transportation.bus?.isIncluded &&
                !itinerary.transportation.train?.isIncluded && (
                    <div className={styles['no-transportation']}>
                        <p>No transportation for this day</p>
                    </div>
                )}

        </div>
    );
};

export default Transfers;
