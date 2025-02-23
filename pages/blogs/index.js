

import React, { useEffect, useState } from 'react';

import BlogCard from '../../components/blog-card/blogCard';
import styles from './blogs.module.css';
import { apiCall } from '../../utils/common';

const Index = ({ blogs, blogsBanner }) => {


     const [viewport, setViewport] = useState("desktop");

    const handleScrollParallax = () => {
        const parallaxImage = document.querySelector(`.${styles['parallax-image']}`);
        if (parallaxImage) {
            const scrollPosition = window.scrollY;
            parallaxImage.style.transform = `translateY(${scrollPosition * 0.5}px)`; // Adjust speed factor
        }
    };

    useEffect(() => {
        window.addEventListener('scroll', handleScrollParallax);
        return () => window.removeEventListener('scroll', handleScrollParallax);
    }, []);


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
              return blogsBanner?.data?.bannerUrls?.mobile || [];
            case "tablet":
              return blogsBanner?.data?.bannerUrls?.tablet || [];
            case "desktop":
            default:
              return blogsBanner?.data?.bannerUrls?.desktop || [];
          }
        };
    
        const bannerImages = getBannerImages();


    return (
        <div>
            <header className={styles.header}>
                <div className={styles['parallax-container']}>

                    <img src={bannerImages} alt="Destination Banner" className={styles['parallax-image']} />

                </div>
                <div className={styles.header_content}>
                    {/* <h1 className={styles.title}>Blogs</h1>
                    <nav>Home ➔ Blogs</nav> */}
                </div>
            </header>
            <div className={styles["header-text"]}>
        <p className={styles["header-text-subtitle"]}> Special Blogs  for You</p>

        <h2 className={styles["header-text-title"]}>Discover Special Blogs for You</h2>
      </div>
            <div className={styles['blog-grid']}>
                {blogs.data.map((blog) => (
                    <BlogCard key={blog.id} blogs={blog} />
                ))}
            </div>
        </div>
    );
};

export default Index;

export async function getStaticProps() {
    const blogs = await apiCall({
        endpoint: `/api/getAllBlogs`,
        method: 'GET',
    });
    const blogsBanner = await apiCall({
        endpoint: `/api/getBanner?page=blogsBanner`,
        method: 'GET',
    });

    return {
        props: {
            blogs,
            blogsBanner,
        },
        revalidate: 600,

    };
}

