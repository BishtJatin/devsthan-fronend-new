import React, { useEffect } from "react";
import Head from "next/head"; // Import Head for meta tags

import styles from "./blog.module.css";
import { apiCall } from "../../utils/common";
import { format } from "date-fns";
import parse from "html-react-parser";

export default function Blog({ blogs, blogBanner }) {
   
  console.log(blogs);

  const handleScrollParallax = () => {
    const parallaxImage = document.querySelector(
      `.${styles["parallax-image"]}`
    );
    if (parallaxImage) {
      const scrollPosition = window.scrollY;
      parallaxImage.style.transform = `translateY(${scrollPosition * 0.5}px)`; // Adjust speed factor
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScrollParallax);
    return () => window.removeEventListener("scroll", handleScrollParallax);
  }, []);

  return (
    <>
      {/* Meta tags */}
      <Head>
        <title>{blogs?.data?.metaTitle || "Blog"}</title>
        <meta name="description" content={blogs?.data?.metaDescription || ""} />


        <link rel="canonical" href={blogs?.data?.canonicalUrl || ""}/>
        <meta
          name="keywords"
          content="travel, tours, vacations, pilgrimage, holiday packages, travel deals"
        />
        <meta
          property="og:title"
          content={blogs?.data?.openGraph?.title || ""}
        />
        <meta
          property="og:description"
          content={blogs?.data?.openGraph?.description || ""}
        />

        <meta property="og:url" content={blogs?.data?.openGraph?.url || ""} />
        <meta property="og:type" content={blogs?.data?.openGraph?.type || ""}  />

        <meta
          name="twitter:title"
          content={blogs?.data?.twitter?.title || ""}
        />
        <meta
          name="twitter:description"
          content={blogs?.data?.twitter?.description || ""} /> 
      </Head>

      {/* Blog Content */}
      <div className={styles["blog-container"]}>
        <div className={styles["blog-image-container"]}>
          <img
            src={blogs?.data?.bannerImage}
            alt={blogs?.data?.title}
            className={styles["blog-image"]}
          />
        </div>
        <h1 className={styles["blog-title"]}>{blogs?.data?.title}</h1>

        <p className={styles["blog-date"]}>
          Published on:{" "}
          {blogs?.data?.createdAt
            ? format(new Date(blogs.data.createdAt), "MMMM d, yyyy")
            : "Unknown Date"}
        </p>

        <div className={styles["blog-description"]}>
          {blogs?.data?.description
            ? parse(blogs.data.description)
            : "No description available"}
        </div>
      </div>
    </>
  );
}

export async function getStaticProps({ params }) {
  try {
    const { title } = params;

    // Fetch all blogs to find the UUID by title
    const allBlogs = await apiCall({
      endpoint: `/api/getAllBlogs`,
      method: "GET",
    });

    // Find the blog that matches the given title (slugified)
    const blog = allBlogs.data.find(
      (b) => b.title.replace(/\s+/g, '-').toLowerCase() === title
    );

    if (!blog) {
      return { notFound: true };
    }

    // Fetch full blog details using the extracted UUID
    const blogs = await apiCall({
      endpoint: `/api/getBlogById/${blog.uuid}`,
      method: "GET",
    });

    const blogBanner = await apiCall({
      endpoint: `/api/getBanner?page=blogBanner`,
      method: "GET",
    });

    return {
      props: { blogs, blogBanner },
    };
  } catch (error) {
    console.error("Error fetching blog data:", error);
    return {
      props: { blogs: null, blogBanner: null },
      notFound: true,
    };
  }
}

export async function getStaticPaths() {
  try {
    const blogData = await apiCall({
      endpoint: `/api/getAllBlogs`,
      method: "GET",
    });

    const paths = blogData.data.map((blog) => ({
      params: { title: blog.title.replace(/\s+/g, '-').toLowerCase() }, 
    }));

    return {
      paths,
      fallback: "blocking",
    };
  } catch (error) {
    console.error("Error fetching blog paths:", error);
    return {
      paths: [],
      fallback: false,
    };
  }
}
