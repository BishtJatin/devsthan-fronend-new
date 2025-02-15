
import Image from "next/image";
import React from 'react';
import About from '../components/about/about';
import HomeBanner from "../components/homeBanner/HomeBanner";
import VacationSpots from "../components/vacationsSpots/vacationSpots";
import TourExperience from "../components/tourExperience/tourExperience";
import WhyChoose from "../components/whyChoose/whyChoose";
import Blogs from "../components/blogs/blogs";
import Head from 'next/head';
// import TourActivities from "../components/tourActivities/tourActivities";
// import Testimonials from "../components/testimonials/testimonials";
import { apiCall } from "../utils/common";
import EnquiryPopup from "../components/enquiryPopup";

export default function Home({ tourData, destinations,locations,whyChoose,blogs,homebanner ,tourFixData}) {

  console.log(tourFixData);
  
  return (
    <> <Head>
    <title>Travel and Explore - Home</title>
    <meta name="description" content="Discover the best tours, hotels, buses, and flights for your next adventure." />
    <meta name="keywords" content="tours, hotels, travel, buses, flights, explore" />
    <link rel="canonical" href="https://devsthanexpert.com/" />
    <meta name="robots" content="index, follow" />
    <meta property="og:title" content="Travel and Explore - Home" />
    <meta property="og:description" content="Discover the best tours, hotels, buses, and flights for your next adventure." />
    <meta property="og:url" content="https://devsthanexpert.com/" />
    <meta property="og:type" content="website" />
    <meta name="twitter:title" content="Travel and Explore - Home" />
    <meta name="twitter:description" content="Discover the best tours, hotels, buses, and flights for your next adventure." />
  </Head>
      <HomeBanner locations={locations} homebanner={homebanner} />
      <About />
      <VacationSpots destinations={destinations} />
      <TourExperience tourData={tourData}  subtitle={"Holy Pilgrimage"} title={"Tour Packages"}/>
      <TourExperience tourData={tourFixData}  subtitle={"Fix tour"} title={"Tour Packages"} />
      <WhyChoose whyChoose={whyChoose} />
      <Blogs blogs={blogs.data}/>
      <EnquiryPopup/>
      {/* <TourActivities /> */}
      {/* <Testimonials /> */}
    </>
  );
}

export async function getStaticProps() {
  const tourData = await apiCall({ 
    endpoint: '/api/allTours',
  method: 'POST',
  body: {
    fixedTour:false
  }
  });
  const locations = await apiCall({
    endpoint: '/api/getAllLocations',
    method: 'GET',
  });

  const destinations = await apiCall({
    endpoint: '/api/getAllDestinations',
    method: 'GET',
  });
  const whyChoose = await apiCall({
    endpoint: '/api/getAllWhyChoose',
    method: 'GET',
  });
  const blogs = await apiCall({
    endpoint: `/api/getAllBlogs`,
    method: 'GET',

});
const homebanner = await apiCall({
  endpoint: `/api/getBanner?page=homeBanner`,
  method: 'GET',

});
const tourFixData = await apiCall({ 
  endpoint: '/api/allTours',
  method: 'POST',
  body: {
    fixedTour:true
  }
});

  return {
    props: {
      tourData,
      destinations,
      locations,
      whyChoose,
      blogs,
      homebanner,
      tourFixData
    },
    revalidate: 600,
  };

}
