import React, { useEffect, useRef, useState } from 'react';
import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';
import styles from './blogs.module.css';
import BlogCard from '../blog-card/blogCard';

const Blogs = ({ blogs }) => {
  const [isMobile, setIsMobile] = useState(false);
  const blogsContainerRef = useRef(null); 

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    handleResize(); // Check on mount
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  

  // Responsive breakpoints for Carousel
  const responsive = {
    mobile: {
      breakpoint: { max: 768, min: 0 },
      items: 1, // Number of cards to show on mobile
    },
  };

  useEffect(() => {
    const blogsContainer = blogsContainerRef.current;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add(styles.animate); // Add 'animate' class when visible
          }
        });
      },
      { threshold: 0.2 } // Trigger when 20% of the element is visible
    );

    if (blogsContainer) observer.observe(blogsContainer);

    return () => {
      if (blogsContainer) observer.unobserve(blogsContainer); // Cleanup
    };
  }, []);

  // Carousel responsive settings
 

  return (
    <>
      <div className={styles['header']}>
        <p className={styles['subtitle']}>Your Travel Inspiration</p>
        <h2 className={styles['title']}>Blogs</h2>
      </div>
      <div ref={blogsContainerRef} className={styles.blogsContainer}>
        {isMobile ? (
          <Carousel
            responsive={responsive}
            infinite={true}
            autoPlay={isMobile} // Auto-play only on mobile
            autoPlaySpeed={3000}
            arrows={false}
          >
            {blogs.slice(0, 6).map((blog) => (
              <div key={blog.id}>
                <BlogCard blogs={blog} />
              </div>
            ))}
          </Carousel>
        ) : (
          blogs.slice(0, 6).map((blog) => (
            <BlogCard key={blog.id} blogs={blog} />
          ))
        )}
      </div>
    </>
  );
};

export default Blogs;
