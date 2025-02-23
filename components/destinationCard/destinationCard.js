import React from 'react'
import styles from './destinationCard.module.css'
import Image from 'next/image'
const destinationCard = ({ destination }) => {
   
    return (
        <>
            <Image src={destination.bannerImage} alt="Sweden" width={400} height={200} className={styles['grid-item-img']} />
            <div className={styles.overlay}>
               {destination.tourCount <= 0  && !destination.tourCount? null : <span className={styles.tourBadge}>{destination.tourCount} Tour</span>} 
                <div className={styles.textContainer}>
                    <span>Travel To</span>
                    <h3>{destination?.title}</h3>
                </div>

            </div>
        </>
    )
}

export default destinationCard
