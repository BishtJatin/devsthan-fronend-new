import React from 'react';

import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';

import styles from '../../components/itinery/itinery.module.css';
import Image from 'next/image';

const Meals = ({ itinerary }) => {
    const { breakfast, lunch, dinner } = itinerary.meals;


    const responsive = {
        desktop: {
            breakpoint: { max: 3000, min: 1024 },
            items: 1, // Show 1 item at a time
        },
        tablet: {
            breakpoint: { max: 1024, min: 464 },
            items: 1, // Show 1 item at a time
        },
        mobile: {
            breakpoint: { max: 464, min: 0 },
            items: 1, // Show 1 item at a time
        },
    };

    const renderMealCarousel = (meal, mealName) => (
        <div className={styles['section']}>
            <h3>{mealName}</h3>
            <div className={styles['hotel-details']}>
                <div>
                    <p><strong>{meal.name}</strong></p>
                </div>
                {meal.photos.length > 0 ? (
                    <Carousel
                        responsive={responsive}
                        infinite
                        autoPlay={meal.photos.length > 1}
                        autoPlaySpeed={5000}
                        arrows
                    >
                        {meal.photos.map((image, idx) => (
                            <div key={idx} className={styles['carousel-item']}>
                                <Image src={image} alt={`${mealName} Image`} width={300} height={300} />
                            </div>
                        ))}
                    </Carousel>
                ) : (
                    <p>No photos available</p>
                )}
            </div>
        </div>
    );

    return (
        <div className={styles['meals-details']}>
            <div className={styles['day-details-heading']}>
                <div className={styles['day-details-inner']}>
                    <p>Day {itinerary.day}</p>
                    <p>{itinerary.title}</p>
                </div>
            </div>
            {(breakfast?.isAvailable || lunch?.isAvailable || dinner?.isAvailable) ? (
                <>
                    {breakfast?.isAvailable && renderMealCarousel(breakfast, 'Breakfast')}
                    {lunch?.isAvailable && renderMealCarousel(lunch, 'Lunch')}
                    {dinner?.isAvailable && renderMealCarousel(dinner, 'Dinner')}

                </>
            ) : (
                <div className={styles['no-meals']}>
                    <p>No meals available for this day.</p>
                </div>
            )}
        </div>
    );
};

export default Meals;
