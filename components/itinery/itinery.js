import React, { useState, useEffect, forwardRef, useRef } from "react";
import Meals from "../tourPageComponents/meals";
import styles from "./itinery.module.css";
import Transfers from "../tourPageComponents/transfers";
import Hotels from "../tourPageComponents/hotels";
import Activities from "../tourPageComponents/activities";
import SiteSeens from "../tourPageComponents/siteSeens";
import DayPlan from "../tourPageComponents/dayPlan";
import Slider from "react-slick";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import { PiArrowBendUpLeftBold } from "react-icons/pi";
import { PiArrowBendLeftUpBold } from "react-icons/pi";

const Itinerary = ({
  categoryDetails,
  tourAllData,
  showDateTooltip,
  handleDateTooltipDone,
}) => {
  const tabsRef = useRef(null);
  const dayRefs = useRef([]); // Array of refs for each day
  const parentRef = useRef(null); // Ref for the parent container
  const [selectedDate, setSelectedDate] = useState(new Date()); // Default to today's date
  const [startDate, setStartDate] = useState(new Date()); // State for start date
  const [isSticky, setIsSticky] = useState(false); // State for sticky tabs
  const [lastScrollPos, setLastScrollPos] = useState(0); // Track the last scroll position
  const [activeTab, setActiveTab] = useState("day-plan");
  const tooltipRef = useRef(null);

  useEffect(() => {
    const storedDate = localStorage.getItem("departureDate");
    if (storedDate) {
      const [day, month, year] = storedDate.split("-").map(Number);
      const parsedDate = new Date(year, month - 1, day);
      if (!isNaN(parsedDate)) {
        setStartDate(parsedDate);
        setSelectedDate(parsedDate);
      }
    }
  }, []);

  // Scroll to tooltip on load with offset
  useEffect(() => {
    if (showDateTooltip && tooltipRef.current) {
      const tooltipElement = tooltipRef.current;
      const elementPosition =
        tooltipElement.getBoundingClientRect().top + window.pageYOffset;
      const offset = 140; // Space at the top
      setTimeout(() => {
        window.scrollTo({
          top: elementPosition - offset,
          behavior: "smooth",
        });
      }, 0); // Allow time for DOM updates
    }
  }, [showDateTooltip]);

  // Close tooltip when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (tooltipRef.current && !tooltipRef.current.contains(event.target)) {
        handleDateTooltipDone(); // Ensure this toggles showDateTooltip correctly
      }
    };

    if (showDateTooltip) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showDateTooltip, handleDateTooltipDone]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = dayRefs.current.indexOf(entry.target);
            if (index !== -1) {
              setSelectedDay(index);
            }
          }
        });
      },
      {
        root: null,
        threshold: 0.5, // Trigger when 50% of the section is visible
      }
    );

    // Observe elements based on the active tab
    dayRefs.current.forEach((ref) => ref && observer.observe(ref));

    return () => {
      dayRefs.current.forEach((ref) => ref && observer.unobserve(ref));
    };
  }, [activeTab]); // Re-run the observer whenever the activeTab changes

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollPos = window.pageYOffset;
      if (currentScrollPos < lastScrollPos) {
        // Scrolling up
        setIsSticky(true);
      } else {
        // Scrolling down
        setIsSticky(false);
      }
      setLastScrollPos(currentScrollPos);
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [lastScrollPos]);

  const CustomInput = React.forwardRef(({ value, onClick }, ref) => (
    <input
      className={styles["datepicker-input"]}
      value={value}
      onClick={onClick}
      readOnly // Prevent keyboard from opening
      ref={ref}
      placeholder="Select Date"
    />
  ));
  CustomInput.displayName = "CustomInput";

  const formatDate = (date) => {
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

  const handleDateChange = (date) => {
    setSelectedDate(date);
    setStartDate(date);

    if (date) {
      const formattedDate = formatDate(date);
      localStorage.setItem("departureDate", formattedDate);
    }
  };

  useEffect(() => {
    const handleStorageChange = () => {
      const storedDate = localStorage.getItem("departureDate");
      if (storedDate) {
        const [day, month, year] = storedDate.split("-").map(Number);
        const parsedDate = new Date(year, month - 1, day);
        if (!isNaN(parsedDate)) {
          setStartDate(parsedDate); // Update state with new date
          setSelectedDate(parsedDate); // Ensure the itinerary date picker is updated
        }
      }
    };

    // Listen for changes to localStorage
    window.addEventListener("storage", handleStorageChange);

    // Call the handler initially to set the date on load
    handleStorageChange();

    return () => {
      window.removeEventListener("storage", handleStorageChange); // Clean up listener
    };
  }, []);

  const [selectedDay, setSelectedDay] = useState(0);

  const handleDayClick = (index) => {
    setSelectedDay(index);

    const element = dayRefs.current[index];
    const offset = window.innerWidth <= 768 ? 100 : 180;

    if (element) {
      const topPosition =
        element.getBoundingClientRect().top + window.pageYOffset - offset;
      window.scrollTo({ top: topPosition, behavior: "smooth" });
    }
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);

    // Scroll to the top of the parent container

    parentRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    const departureDetails = localStorage.getItem("departureDate");
    if (departureDetails) {
      // Parse the custom date format (e.g., "19-12-2024")
      const [day, month, year] = departureDetails.split("-").map(Number);
      const parsedDate = new Date(year, month - 1, day); // Month is 0-indexed
      if (!isNaN(parsedDate)) {
        setStartDate(parsedDate); // Set it as a Date object
        setSelectedDate(parsedDate); // Update selected date as well
      } else {
        console.error("Invalid date format in localStorage.");
      }
    }
  }, []);
  return (
    <div className={styles["itinerary"]} ref={parentRef}>
      {/* Tabs */}
      <div
        className={`${styles["tabs"]} ${isSticky ? styles["sticky"] : ""}`}
        ref={tabsRef}
      >
        <button
          className={activeTab === "day-plan" ? styles["active-tab"] : ""}
          onClick={() => handleTabChange("day-plan")}
        >
          <p>{`${categoryDetails.length} Day Plan`}</p>
        </button>

        {tourAllData[0]?.hotel && (
          <button
            className={activeTab === "hotel" ? styles["active-tab"] : ""}
            onClick={() => handleTabChange("hotel")}
          >
            <p>Hotel/Meals</p>
          </button>
        )}
        {tourAllData[0]?.transportation && (
          <button
            className={activeTab === "transfer" ? styles["active-tab"] : ""}
            onClick={() => handleTabChange("transfer")}
          >
            <p>Transportation</p>
          </button>
        )}
        {tourAllData[0]?.siteSeen && (
          <button
            className={activeTab === "siteSeen" ? styles["active-tab"] : ""}
            onClick={() => handleTabChange("siteSeen")}
          >
            <p>Site Seens</p>
          </button>
        )}
        {tourAllData[0]?.activities && (
          <button
            className={activeTab === "activities" ? styles["active-tab"] : ""}
            onClick={() => handleTabChange("activities")}
          >
            <p>Activities</p>
          </button>
        )}
      </div>

      {/* Content */}
      <div className={styles["content-dayplan"]}>
        {/* Day Plan Sidebar */}
        <div
          className={`${styles["day-plan-sidebar"]} ${
            isSticky ? styles["sticky"] : ""
          }`}
          ref={tabsRef}
        >
          <div className={styles["day-plan-sidebar-days"]}>
            <div className={styles["date-container"]}>
              <div className={styles["search-options-destination"]}>
                {showDateTooltip && (
                  <div className={styles["tooltip-overlay"]} ref={tooltipRef}>
                    {window.innerWidth < 470 ? (
                      <div className={styles["arrow"]}>
                        <PiArrowBendLeftUpBold />
                      </div> // New arrow for small screens
                    ) : (
                      <div className={styles["arrow"]}>
                        <PiArrowBendUpLeftBold />
                      </div>
                    )}
                    <div className={styles["tooltip"]}>
                      <p>Select the date</p>
                      <button
                        className={styles["done-button"]}
                        onClick={handleDateTooltipDone}
                      >
                        Done
                      </button>
                    </div>
                  </div>
                )}

                <div
                 style={{
                  display: "inline-block", // Space around the DatePicker
                  border: "3px solid transparent",
                  borderRadius: "8px",
                  background:
                    "linear-gradient(white, white) padding-box, linear-gradient(45deg,  #6bff92, #6b92ff) border-box",
                  animation: "borderAnimation 4s linear infinite",
                }}
                className="animated-border"
                >
                  <DatePicker
                    selected={selectedDate}
                    onChange={handleDateChange}
                    dateFormat="dd/MM/yyyy"
                    customInput={<CustomInput />}
                    minDate={new Date()} // Disables all dates before today
                    popperPlacement="bottom"
                    popperProps={{
                      modifiers: [
                        {
                          name: "offset",
                          options: { offset: [0, 10] },
                        },
                        {
                          name: "preventOverflow",
                          options: { boundary: "viewport" },
                        },
                        {
                          name: "zIndex",
                          enabled: true,
                          phase: "write",
                          fn: ({ state }) => {
                            state.styles.popper.zIndex = 5550; // Dynamically set z-index
                          },
                        },
                      ],
                    }}
                  />
                </div>
              </div>
              {categoryDetails.map((_, index) => {
                const currentDate = new Date(startDate);
                currentDate.setDate(startDate.getDate() + index); // Increment date by index

                const dayName = currentDate.toLocaleString("en-US", {
                  weekday: "short",
                });
                const monthName = currentDate.toLocaleString("en-US", {
                  month: "short",
                });

                const dateNumber = currentDate.getDate();

                return (
                  <div
                    key={index}
                    className={`${styles["day-item"]} ${
                      selectedDay === index ? styles["active-day"] : ""
                    }`}
                    onClick={() => handleDayClick(index)}
                  >
                    <div className={styles["month-name"]}>
                      {monthName.toUpperCase()}
                    </div>
                    <div className={styles["date-number"]}>{dateNumber}</div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div>
          {activeTab === "day-plan" &&
            categoryDetails.map((itinerary, index) => (
              <div key={index} ref={(el) => (dayRefs.current[index] = el)}>
                <DayPlan itinerary={itinerary} />
              </div>
            ))}
        </div>

        <div>
          {activeTab === "transfer" &&
            categoryDetails.map((itinerary, index) => (
              <div key={index} ref={(el) => (dayRefs.current[index] = el)}>
                <Transfers itinerary={itinerary} />
              </div>
            ))}
        </div>
        <div>
          {activeTab === "siteSeen" &&
            categoryDetails.map((itinerary, index) => (
              <div key={index} ref={(el) => (dayRefs.current[index] = el)}>
                <SiteSeens itinerary={itinerary} />
              </div>
            ))}
        </div>

        <div>
          {activeTab === "hotel" &&
            categoryDetails.map((itinerary, index) => (
              <div key={index} ref={(el) => (dayRefs.current[index] = el)}>
                <Hotels itinerary={itinerary} />
              </div>
            ))}
        </div>

        <div>
          {activeTab === "activities" &&
            categoryDetails.map((itinerary, index) => (
              <div key={index} ref={(el) => (dayRefs.current[index] = el)}>
                <Activities key={index} itinerary={itinerary} />
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default Itinerary;
