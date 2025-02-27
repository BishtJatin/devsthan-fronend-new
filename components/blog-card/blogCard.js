import { useState, useEffect } from 'react';
import { truncateText } from '../../utils/common';
import styles from './blogCard.module.css';
import Link from 'next/link';

export default function BlogCard({ blogs }) {
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true); // This will ensure the component renders only on the client side
    }, []);

    return (
        <div className={styles['blog-card']}>
            <div className={styles['blog-card-image']}>
                {blogs.bannerImage && (

                    <Link href={`/blog/${blogs.title.replace(/\s+/g, '-').toLowerCase()}`} passHref>

                        <img
                            src={blogs.bannerImage}
                            alt={blogs.title || 'Blog Image'}
                        />


                    </Link>


                )}
            </div>
            <div className={styles['blog-card-content']}>
                <h2 className={styles['blog-card-title']}>
                    {blogs.title}
                </h2>
                <div className={styles['blog-card-meta']}>
                    <span className={styles['author']}>By administrator</span>
                    <span className={styles['date']}>
                        {new Date(blogs.createdAt).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                        })}
                    </span>
                </div>

                <Link href={`/blog/${blogs.title.replace(/\s+/g, '-').toLowerCase()}`} passHref>
                    <p className={styles['read-more']}>Read More</p>
                </Link>
            </div>
        </div>
    );
}
