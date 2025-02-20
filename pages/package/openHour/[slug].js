// This should be in a file like pages/tour/[uuid].js

import React, { useEffect, useState, useRef } from "react";
import Head from "next/head"; // Import Head for meta tags

import TourGallery from "../../../components/tourPageComponents/tourGallery";
import TourDetails from "../../../components/tourPageComponents/tourDetails";
import TourBookingPanel from "../../../components/tourPageComponents/tourBookingPanel";
import styles from "./tour.module.css";
import { apiCall } from "../../../utils/common";
import { useRouter } from "next/router";
import Itinerary from "../../../components/itinery/itinery";
import Loader from "../../../components/loader/loader";

import { PiArrowBendLeftDownBold } from "react-icons/pi";
import FAQ from "../../../components/faq/faq";

const TourPage = ({ tourAllData,faqData,tourBanner }) => {
  const [selectedCategory, setSelectedCategory] = useState("standardDetails");
  const [activeTab, setActiveTab] = useState("Itinerary");
   

  console.log(tourAllData);

  const [showTooltip, setShowTooltip] = useState(true);
  const [isSticky, setIsSticky] = useState(false);
  const [showDateTooltip, setShowDateTooltip] = useState(false);
  const [lastScrollPos, setLastScrollPos] = useState(0);
  const tabsRef = useRef(null);
  const [isClicked, setIsClicked] = useState(false);


  const itineraryRef = useRef(null);
  const policiesRef = useRef(null);
  const summaryRef = useRef(null);
  const dateSectionRef = useRef(null);
  const tooltipRef = useRef(null);

  const [isSmallScreen, setIsSmallScreen] = useState(false);

  // Detect screen width
  useEffect(() => {
    const checkScreenSize = () => {
      setIsSmallScreen(window.innerWidth < 990); // Set to true if screen width is smaller than 990px
    };

    checkScreenSize(); // Check initial size
    window.addEventListener("resize", checkScreenSize); // Update on window resize

    // Cleanup listener on unmount
    return () => {
      window.removeEventListener("resize", checkScreenSize);
    };
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollPos = window.pageYOffset;
      if (currentScrollPos < lastScrollPos) {
        setIsSticky(true);
      } else {
        setIsSticky(false);
      }
      setLastScrollPos(currentScrollPos);
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [lastScrollPos]);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    email: "",
    message: "",
  });
  const [loadingSubmit, setLoadingSubmit] = useState(false);

  // API call function
  const apiCall = async ({ endpoint, method, body }) => {
    const response = await fetch(endpoint, {
      method,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });
    const data = await response.json();
    return data;
  };

  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoadingSubmit(true);

      // API request to submit inquiry
      const createInquiry = await apiCall({
        endpoint: "/api/createInquiry", // Replace with your API endpoint
        method: "POST",
        body: formData, // Sending the form data
      });

      if (createInquiry.success) {
        toast.success("Inquiry submitted successfully!");
        setFormData({
          fullName: "",
          phone: "",
          email: "",
          message: "",
        });
      } else {
        toast.error("Error submitting inquiry. Please try again later.");
      }
    } catch (error) {
      console.error("Error submitting inquiry:", error);
      toast.error("An unexpected error occurred.");
    } finally {
      setLoadingSubmit(false);
    }
  };

  // Handle form field changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleTooltipDone = () => {
    setShowTooltip(false);
    setShowDateTooltip(true);
    // Hide the first tooltip
    // dateSectionRef.current?.scrollIntoView({ behavior: "smooth" }); // Scroll to the date section
  };

  // Scroll to the tooltip on load with offset
  useEffect(() => {
    if (showTooltip && tooltipRef.current) {
      const tooltipElement = tooltipRef.current;
      const elementPosition =
        tooltipElement.getBoundingClientRect().top + window.pageYOffset;
      const offset = 80; // Adjust this value for the desired space at the top

      window.scrollTo({
        top: elementPosition - offset,
        behavior: "smooth",
      });
    }
  }, [showTooltip]);

  // Close tooltip when clicking outside or on Done
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (tooltipRef.current && !tooltipRef.current.contains(event.target)) {
        setShowTooltip(false);
        setShowDateTooltip(true);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleDateTooltipDone = () => {
    setShowDateTooltip(false);
  };

  useEffect(() => {
    let targetElement;

    if (activeTab === "Policies") {
      targetElement = policiesRef.current;
    } else if (activeTab === "Summary") {
      targetElement = summaryRef.current;
    }

    if (targetElement) {
      const elementTop = targetElement.getBoundingClientRect().top; // Get the element's position relative to the viewport
      let scrollOffset;

      // Check if the device is mobile or desktop
      if (window.innerWidth <= 768) {
        // Mobile breakpoint (can adjust as needed)
        scrollOffset = 80; // Value for mobile
      } else {
        scrollOffset = 120; // Value for desktop
      }

      // Scroll to the element with a calculated offset
      window.scrollBy({
        top: elementTop - scrollOffset, // Adjust how much above you want the element to be
        behavior: "smooth",
      });
    }
  }, [activeTab]); // Runs this effect whenever activeTab changes

    

  const categoryDetails =
    selectedCategory === "standardDetails"
      ? tourAllData[0].standardDetails
      : selectedCategory === "deluxeDetails"
      ? tourAllData[0].deluxeDetails
      : selectedCategory === "premiumDetails"
      ? tourAllData[0].premiumDetails
      : null;

  return (
    <>
      <Head>
        <title>{tourAllData[0]?.metaTitle || "Tour"}</title>
        <meta
          name="description"
          content={tourAllData[0]?.metaDescription || ""}
        />
        <link rel="canonical" href="https://www.example.com/" />
        <meta
          name="keywords"
          content="travel, tours, vacations, pilgrimage, holiday packages, travel deals"
        />
        <meta
          property="og:title"
          content={tourAllData[0]?.openGraph?.title || ""}
        />
        <meta
          property="og:description"
          content={tourAllData[0]?.openGraph?.description || ""}
        />

        <meta
          property="og:url"
          content={tourAllData[0]?.openGraph?.url || ""}
        />
        <meta
          property="og:type"
          content={tourAllData[0]?.openGraph?.type || ""}
        />

        <meta
          name="twitter:title"
          content={tourAllData[0]?.twitter?.title || ""}
        />
        <meta
          name="twitter:description"
          content={tourAllData[0]?.twitter?.description || ""}
        />
      </Head>
      <div className={styles["gallery"]}>
        <TourGallery
          duration={tourAllData[0].duration}
          images={tourAllData[0].images}
          bannerImage={tourAllData[0].bannerImage}
          tourBanner={tourBanner}
          name={tourAllData[0].name}
          state={tourAllData[0].state}
          city={tourAllData[0].city}
          location={tourAllData[0].location}
        />
      </div>
      <div className={styles["tour-main"]}>
        {isSmallScreen == false && (
          <div
            className={`${styles["tabs"]} ${isSticky ? styles["sticky"] : ""}`}
            ref={tabsRef}
          >
            <button
              className={activeTab === "Itinerary" ? styles["tab-active"] : ""}
              onClick={() => handleTabChange("Itinerary")}
            >
              Itinerary
            </button>
            <button
              className={activeTab === "Policies" ? styles["tab-active"] : ""}
              onClick={() => handleTabChange("Policies")}
            >
              Policies
            </button>
            <button
              className={activeTab === "Summary" ? styles["tab-active"] : ""}
              onClick={() => handleTabChange("Summary")}
            >
              Summary
            </button>

            <div className={styles["category-selector"]}>
              {showTooltip && (
                <div className={styles["tooltip-overlay"]} ref={tooltipRef}>
                  <div className={styles["tooltip"]}>
                    <p>Select the package</p>
                    <button
                      className={styles["button-done"]}
                      onClick={handleTooltipDone}
                    >
                      Done
                    </button>
                  </div>
                  <div className={styles["arrow"]}>
                    <PiArrowBendLeftDownBold />
                  </div>
                </div>
              )}
              <select
                id="category-select"
                value={selectedCategory}
                className={`${styles["category-dropdown"]} ${
                  !isClicked && selectedCategory === ""
                    ? styles["inactive-select"]
                    : styles["active-select"]
                }`}
                onChange={(e) => {
                  setSelectedCategory(e.target.value);
                  setIsClicked(true); // Stop animation when the user interacts
                }}
                onClick={() => setIsClicked(true)} // Stop animation on click
              >
                {tourAllData[0].isStandard === true && (
                  <option value="standardDetails">Standard</option>
                )}
                {tourAllData[0].isDeluxe === true && (
                  <option value="deluxeDetails">Deluxe</option>
                )}
                {tourAllData[0].isPremium === true && (
                  <option value="premiumDetails">Premium</option>
                )}
              </select>
            </div>
          </div>
        )}

        {/* Tab Content */}
        <div className={styles["tab-panel"]}>
          <div className={styles["tab-content"]}>
            {isSmallScreen && (
              <div
                className={`${styles["tabs"]} ${
                  isSticky ? styles["sticky"] : ""
                }`}
                ref={tabsRef}
              >
                <button
                  className={
                    activeTab === "Itinerary" ? styles["tab-active"] : ""
                  }
                  onClick={() => handleTabChange("Itinerary")}
                >
                  Itinerary
                </button>
                <button
                  className={
                    activeTab === "Policies" ? styles["tab-active"] : ""
                  }
                  onClick={() => handleTabChange("Policies")}
                >
                  Policies
                </button>
                <button
                  className={
                    activeTab === "Summary" ? styles["tab-active"] : ""
                  }
                  onClick={() => handleTabChange("Summary")}
                >
                  Summary
                </button>

                <div className={styles["category-selector"]}>
                  {/* {showTooltip && (
                    <div className={styles["tooltip-overlay"]} ref={tooltipRef}>
                      <div className={styles["tooltip"]}>
                        <p>Select the package</p>
                        <button
                          className={styles["button-done"]}
                          onClick={handleTooltipDone}
                        >
                          Done
                        </button>
                      </div>
                      <div className={styles["arrow"]}>
                        <PiArrowBendLeftDownBold />
                      </div>
                    </div>
                  )} */}
                  
                  <select
                    id="category-select"
                    value={selectedCategory}
                    className={`${styles["category-dropdown"]} ${
                      !isClicked && selectedCategory === ""
                        ? styles["inactive-select"]
                        : styles["active-select"]
                    }`}
                    onChange={(e) => {
                      setSelectedCategory(e.target.value);
                      setIsClicked(true); // Stop animation when the user interacts
                    }}
                    onClick={() => setIsClicked(true)} // Stop animation on click
                  >
                    {tourAllData[0].isStandard === true && (
                      <option value="standardDetails">Standard</option>
                    )}
                    {tourAllData[0].isDeluxe === true && (
                      <option value="deluxeDetails">Deluxe</option>
                    )}
                    {tourAllData[0].isPremium === true && (
                      <option value="premiumDetails">Premium</option>
                    )}
                  </select>
               
                </div>
              </div>
             
            )}
            {activeTab === "Itinerary" && (
              <div ref={itineraryRef}>
                <Itinerary
                  categoryDetails={categoryDetails.itineraries}
                  tourAllData={tourAllData && tourAllData}
                  showDateTooltip={showDateTooltip}
                  handleDateTooltipDone={handleDateTooltipDone}
                />
              </div>
            )}

            {activeTab === "Policies" && (
              <div ref={policiesRef} className={styles["policies"]}>
                <h2>Cancellation Policies</h2>
                <p
                  style={{ paddingLeft: "18px", paddingRight: "18px" }}
                  dangerouslySetInnerHTML={{
                    __html:
                      categoryDetails.cancellationPolicy &&
                      categoryDetails.cancellationPolicy,
                  }}
                ></p>

                <h2>Know before you go</h2>

                <div>
                  {Array.isArray(tourAllData[0].knowBeforeYouGo) ? (
                    tourAllData[0].knowBeforeYouGo.map((text, index) => (
                      <p
                        key={index}
                        dangerouslySetInnerHTML={{
                          __html: text,
                        }}
                      ></p>
                    ))
                  ) : (
                    <p
                      dangerouslySetInnerHTML={{
                        __html:
                          tourAllData[0].knowBeforeYouGo ||
                          "No information available.",
                      }}
                    ></p>
                  )}
                </div>
              </div>
            )}

{activeTab === "Summary" && (
  <div ref={summaryRef} className={styles["summary"]}>
    <h2>Highlights</h2>
    {categoryDetails?.highlights ? (
      <ol className={styles["highlights"]}>
        <li
          dangerouslySetInnerHTML={{
            __html: categoryDetails.highlights || "No highlights available.",
          }}
        />
      </ol>
    ) : (
      <p>No highlights available.</p>
    )}

    <div className={styles["details-container"]}>
      <div className={styles["inclusions"]}>
        <h2>Inclusions</h2>
        {categoryDetails?.whatsIncluded ? (
          <ol>
            <li
              dangerouslySetInnerHTML={{
                __html:
                  categoryDetails.whatsIncluded || "No inclusions available.",
              }}
            />
          </ol>
        ) : (
          <p>No inclusions available.</p>
        )}
      </div>
      <div className={styles["exclusions"]}>
        <h2>Exclusions</h2>
        {categoryDetails?.whatsExcluded ? (
          <ol>
            <li
              dangerouslySetInnerHTML={{
                __html:
                  categoryDetails.whatsExcluded || "No exclusions available.",
              }}
            />
          </ol>
        ) : (
          <p>No exclusions available.</p>
        )}
      </div>
    </div>
  </div>
)}



<div className={styles["faq"]}><FAQ
        faqData={faqData}
        /></div>
            {isSmallScreen && (
              <div className={styles["tour-booking-panel"]}>
                <p className={styles["panel-heading"]}>Book Your Tour</p>
                <p className={styles["panel-des"]}>
                  Reserve your ideal trip early for a hassle-free trip; secure
                  comfort and convenience!
                </p>
                <form className={styles.inquiryForm} onSubmit={handleSubmit}>
                  <label>Full Name</label>
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    minLength="2"
                    required
                  />

                  <label>Phone</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                    pattern="\d{10}"
                    title="Phone must be a 10-digit number"
                  />

                  <label>Email</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />

                  <label>Message</label>
                  <input
                    type="text"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                  />

                  {loadingSubmit ? (
                    <Loader /> // Displaying the loader component while submitting
                  ) : (
                    <button type="submit">Submit</button>
                  )}
                </form>
              </div>
            )}
            
          </div>
          
          <TourBookingPanel
            duration={tourAllData[0].duration}
            category={selectedCategory}
            state={tourAllData[0].state}
            city={tourAllData[0].city}
            location={tourAllData[0].location}
            name={tourAllData[0].name}
            availability={tourAllData.availability}
            uuid={tourAllData[0].uuid}
            categoryDetails={categoryDetails}
            date={tourAllData[0].date}
            partialPayment={tourAllData[0].partialPayment}
            seasons={categoryDetails.seasons}
          />
        </div>
        
      </div>
    </>
  );
};

export default TourPage;

export async function getStaticPaths() {
  try {
    const tours = await apiCall({
      endpoint: "/api/allTours",
      method: "POST",
      body: { fixedTour: false },
    });

    const paths = tours.map((tour) => ({
      params: { slug: tour.name.replace(/\s+/g, "-").toLowerCase() }, // Slugified name
    }));

    console.log("Generated Paths:", paths); // ✅ Debugging

    return {
      paths,
      fallback: "blocking", // ISR enabled for new paths
    };
  } catch (error) {
    console.error("Error fetching tour paths:", error);
    return {
      paths: [],
      fallback: false,
    };
  }
}


export async function getStaticProps({ params }) {
  try {
    console.log("Received params:", params); // ✅ Debugging

    const { slug } = params;
    console.log("Extracted slug:", slug); // ✅ Check if slug exists

    // Fetch all tours to find the matching UUID
    const allTours = await apiCall({
      endpoint: "/api/allTours",
      method: "POST",
      body: { fixedTour: false },
    });

    const tour = allTours.find(
      (t) => t.name.replace(/\s+/g, "-").toLowerCase() === slug
    );

    if (!tour) {
      console.log("Tour not found for slug:", slug);
      return { notFound: true };
    }

    console.log("Found tour:", tour); // ✅ Check if the tour is found

    const tourAllData = await apiCall({
      endpoint: `/api/getTour/${tour.uuid}`,
      method: "GET",
    });

    const faqData = await apiCall({
      endpoint: `/api/getFaqs/${tour.uuid}`,
      method: "GET",
    });

    const tourBanner = await apiCall({
      endpoint: `/api/getBanner?page=toursBanner`,
      method: "GET",
    });

    return {
      props: { tourAllData, faqData,tourBanner },
      revalidate: 600,
    };
  } catch (error) {
    console.error("Error fetching tour data:", error);
    return {
      props: { tourAllData: null, faqData: null, tourBanner:null },
      notFound: true,
    };
  }
}
