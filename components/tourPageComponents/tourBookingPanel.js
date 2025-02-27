import React, { useEffect, useState } from "react";
import styles from "../../pages/package/openHour/tour.module.css";
import { apiCall } from "../../utils/common";
import "react-toastify/dist/ReactToastify.css";
import { toast, ToastContainer } from "react-toastify";
import { SiOnstar } from "react-icons/si";
import { useRouter } from "next/router";
import Loader from "../loader/loader";
import CustomizedQuery from "./customizedQuery";
import { v4 as uuidv4 } from "uuid";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import styled from "styled-components";
import { IoLocationOutline } from "react-icons/io5";

const formatDate = (dateString) => {
  const date = new Date(dateString);
  const dayOptions = { weekday: "long" };
  const dateOptions = { year: "numeric", month: "long", day: "numeric" };

  const fullDate = date.toLocaleDateString("en-US", dateOptions); // e.g., "January 1, 2025"

  return `${fullDate} `; // Combining both
};

const formatDay = (dateString) => {
  const date = new Date(dateString);
  const dayOptions = { weekday: "long" };
  const dateOptions = { year: "numeric", month: "long", day: "numeric" };

  const dayOfWeek = date.toLocaleDateString("en-US", dayOptions); // e.g., "Monday"

  return `${dayOfWeek} `; // Combining both
};

const TourBookingPanel = ({
  uuid,
  categoryDetails,
  name,
  duration,
  category,
  partialPayment,
  seasons,
  minPeople,
}) => {
  const [storedUUID, setStoredUUID] = useState();
  const [isLoadingBook, setIsLoadingBook] = useState(false);
  const [loadingSubmit, setLoadingSubmit] = useState(false);
  const [showDialouge, setShowDialouge] = useState(false);
  const [bookbutton, setBookButton] = useState(null);
  const [maxbutton, setMaxButton] = useState(null);
  const [date, setDate] = useState();
  const [selectedSeason, setSelectedSeason] = useState();
  const [paymentOption, setPaymentOption] = useState("default");
  const [isLargeScreen, setIsLargeScreen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());



  useEffect(() => {
    // Check if the dates are already in localStorage
    const existingDepartureDates = localStorage.getItem("departureDates");
    const existingEndDate = localStorage.getItem("endDate");

    // Proceed only if dates are not already set
    if (!existingDepartureDates || !existingEndDate) {
      if (seasons && seasons.length > 0) {
        const sortedSeasons = [...seasons].sort(
          (a, b) => new Date(a.startDate) - new Date(b.startDate)
        );

        const firstSeason = sortedSeasons[0]; // Get the first season

        if (firstSeason) {
          localStorage.setItem("departureDates", firstSeason.startDate);
          localStorage.setItem("endDate", firstSeason.endDate);

        }
      }
    } else {
      console.log("LocalStorage already has the dates. No action needed.");
    }
  }, [seasons]);

  // Sync with localStorage on component mount



  useEffect(() => {
    const storedDate = localStorage.getItem("departureDates");
    if (storedDate) {
      const [day, month, year] = storedDate.split("-").map(Number);
      const parsedDate = new Date(year, month - 1, day); // Parse from dd-MM-yyyy
      if (!isNaN(parsedDate)) {
        setSelectedDate(parsedDate);
      }
    }
  }, []);

  // Listen for storage events to sync date changes

  useEffect(() => {
    const mediaQuery = window.matchMedia("(min-width: 990px)");
    setIsLargeScreen(mediaQuery.matches);

    const handleResize = (e) => {
      setIsLargeScreen(e.matches);
    };

    mediaQuery.addEventListener("change", handleResize);

    return () => {
      mediaQuery.removeEventListener("change", handleResize);
    };
  }, []);

  const handlePaymentChangePartial = (event) => {
    setPaymentOption(event.target.value);
  };
  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    email: "",
    message: "",
    uuid: "",
  });
  const CustomInputWrapper = styled(DatePicker)`
    cursor: pointer;
  `;
  // Set storedUUID when uuid prop changes
  useEffect(() => {
    setDate(localStorage.getItem("departureDates"));
    if (uuid) {
      setStoredUUID(uuid);
    }
  }, [uuid]);

  // Synchronize formData.uuid with storedUUID
  useEffect(() => {
    setFormData((prevData) => ({
      ...prevData,
      uuid: storedUUID,
    }));
  }, [storedUUID]);
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // const [selectedDate, setSelectedDate] = useState(null);

  const close = () => {
    setShowCustomizeDialog(false);
  };
  const [pricePerPerson, setPricePerPerson] = useState();
  const [roomsCount, setRoomsCount] = useState(1);
  const [loading, setLoading] = useState(false);
  const [showCustomizeDialog, setShowCustomizeDialog] = React.useState(false);

  const router = useRouter();
  const [totalPrice, setTotalPrice] = useState();
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
  // useEffect(() => {
  //   if (!categoryDetails || !categoryDetails.pricing) return;

  //   const totalPersons = rooms.adults + rooms.children;

  //   // Function to find pricing with fallback logic
  //   const findPricingWithFallback = (persons) => {
  //     const validPricing = categoryDetails.pricing.find(
  //       (p) => p.person === persons && p.price > 0
  //     );
  //     if (validPricing) return validPricing; // Return valid pricing if found

  //     // Fallback to 3 persons, then 1 person if no valid pricing found
  //     return (
  //       categoryDetails.pricing.find((p) => p.person === 3 && p.price > 0) ||
  //       categoryDetails.pricing.find((p) => p.person === 1 && p.price > 0) ||
  //       null
  //     );
  //   };

  //   // Find pricing for total persons or fallback
  //   const pricing = findPricingWithFallback(totalPersons);

  //   if (pricing) {
  //     const fallbackPersonCount = pricing.person; // Use the fallback person count from pricing
  //     const priceForTotalPersons = pricing.price;
  //     const perPersonPrice =
  //       fallbackPersonCount > 0
  //         ? priceForTotalPersons / fallbackPersonCount
  //         : 0;
  //     const childPrice = perPersonPrice / 2;
  //     const extraBedCost = rooms.extraBeds * 2000;

  //     // Calculate the total price
  //     const computedTotalPrice =
  //       rooms.adults * perPersonPrice +
  //       rooms.children * childPrice +
  //       extraBedCost;

  //     // Update state
  //     setTotalPrice(Math.round(computedTotalPrice));
  //     setPricePerPerson(Math.round(perPersonPrice));
  //     setRoomsCount(pricing.rooms); // Update roomsCount based on pricing
  //   } else {
  //     // Reset the total price, price per person, and rooms count if no matching pricing is found
  //     setTotalPrice(0);
  //     setPricePerPerson(0);
  //     setRoomsCount(1); // Default room count
  //   }
  // }, [categoryDetails, rooms]);

  const [selectedPaymentOption, setSelectedPaymentOption] = useState("default");

  const handleBookNow = async () => {
    setIsLoadingBook(true);
    const departureDate = localStorage.getItem("departureDates"); // Assuming the key is 'departureDate'
    if (!departureDate) {
      toast.error("Please select a departure date before proceeding.");
      setIsLoadingBook(false);
      return; // Stop execution if departure date is not available
    }

    const userSelected = {
      category: category,
      adults: bookbutton.adults,
      children: bookbutton.children,
      tourId: uuid,
      departureDate,
    };
    const token = localStorage.getItem("token");
    const userTempId = token ? null : uuidv4();
    const requestBody = {
      ...userSelected,
      ...(token ? { token } : { userTempId }),
      ...(selectedPaymentOption === "partial" && {
        partialPayment: partialPayment?.amount,
      }),
    };

    try {
      // Make API call to add to cart
      const response = await apiCall({
        endpoint: "/api/addToCart",
        method: "POST",
        body: {
          category: category,
          adults: bookbutton.adults,
          childern: bookbutton.children, // Fixed typo: "childern" -> "children"
          tourId: uuid,
          seasonId: bookbutton.seasonId,
          ...(paymentOption === "partial" && {
            partialPayment: partialPayment.amount,
          }),
          ...(token ? { token } : { userTempId }),
          tourType: "openHours",
        },
      });

      if (response.success) {
        toast.success("Added to cart successfully!");

        // Store userTempId in local storage if token doesn't exist
        if (!token && userTempId) {
          localStorage.setItem("userTempId", userTempId);
        }

        const queryParams = {
          date: bookbutton?.startDate,
          tourType: "openHours",
          category: category,
        };

        if (selectedPaymentOption === "partial") {
          queryParams.amount = partialPayment?.amount;
        }

        router.push({
          pathname: "/bookingDetails",
          query: queryParams,
        });
      } else {
        toast.error("Session expired? Please login again.");
        localStorage.clear();
        localStorage.setItem("userTempId", userTempId);

        const queryParams = {
          date: bookbutton?.startDate,
        };

        if (selectedPaymentOption === "partial") {
          queryParams.amount = partialPayment?.amount;
        }

        router.push({
          pathname: "/bookingDetails",
          query: queryParams,
        });
      }
    } catch (error) {
      console.error("Error adding to cart:", error);
      toast.error("An error occurred. Please try again.");
    } finally {
      setIsLoadingBook(false);
    }
  };
  
  const handlePersonChange = (type, operation) => {
    setBookButton((prev) => {
      let newAdults = prev.adults;
      let newChildren = prev.children;
  
      const selectedS = seasons.find((season) => season._id === selectedSeason);
      if (!selectedS) return prev;
  
      const maxPerson = Math.max(...selectedS.pricing.map((p) => p.person || 0));
      const minPeoples = minPeople || { enabled: false, people: 0 };
  
      let totalPersons = newAdults + newChildren; // Current total persons
  
      if (type === "adults") {
        if (operation === "increase" && totalPersons < maxPerson) {
          newAdults += 1;
        } else if (
          operation === "decrease" &&
          newAdults > 1 &&
          (!minPeoples.enabled || newAdults - 1 + newChildren >= minPeoples.people)
        ) {
          newAdults -= 1;
        }
      } else if (type === "children") {
        if (operation === "increase" && totalPersons < maxPerson) {
          newChildren += 1;
        } else if (
          operation === "decrease" &&
          newChildren > 0 &&
          (!minPeoples.enabled || newAdults + newChildren - 1 >= minPeoples.people)
        ) {
          newChildren -= 1;
        }
      }
  
      totalPersons = newAdults + newChildren; // Update total count
  
      // ✅ Prevent exceeding maxPerson limit
      if (totalPersons > maxPerson) {
        return prev;
      }
  
      // ✅ Match the correct pricing tier for adults
      let matchedPricing =
        selectedS.pricing.find((p) => p.person === newAdults) ||
        prev.matchedPricing ||
        {};
  
      return calculateUpdatedPrice(
        {
          ...prev,
          adults: newAdults,
          children: newChildren,
        },
        matchedPricing,
        paymentOption,
        selectedS
      );
    });
  };
  
  const handlePaymentChange = (option) => {
    setPaymentOption(option);

    setBookButton((prev) => {
        const totalPersons = prev.adults;
        const selectedS = seasons.find((season) => season._id === selectedSeason);
        const matchedPricing =
            selectedS?.pricing.find((p) => p.person === totalPersons) ||
            prev.matchedPricing ||
            {};

        return calculateUpdatedPrice(prev, matchedPricing, option);
    });
};
  
const calculateUpdatedPrice = (prev, matchedPricing, newPaymentOption) => {
  if (!matchedPricing) return prev;

  const numAdults = prev.adults || 1;
  const numChildren = prev.children || 0;

  // ✅ Always fetch the correct base price dynamically
  let basePrice = matchedPricing.price || prev.originalPrice || 0;
  let pricePerAdult = basePrice / numAdults;
  let pricePerChild = pricePerAdult * 0.5;

  let totalAdultPrice = numAdults * pricePerAdult;
  let totalChildPrice = numChildren * pricePerChild;

  let totalPrice = totalAdultPrice + totalChildPrice;
  let finalPrice = totalPrice;
  let pendingAmount = 0;
  let discountFactor = 1; // Default to full payment

  

  // ✅ Apply Partial Payment Correctly
  if (newPaymentOption === "partial" && partialPayment?.amount) {
      discountFactor = partialPayment.amount / 100; // Example: 50% = 0.5
      pendingAmount = totalPrice * (1 - discountFactor);
      finalPrice = totalPrice * discountFactor;

      // ✅ Reduce price per adult & child accordingly
      pricePerAdult *= discountFactor;
      pricePerChild *= discountFactor;

  }

  return {
      ...prev,
      totalPrice: totalPrice, // ✅ Keep total price dynamic
      price: finalPrice, // ✅ Show the amount to be paid in partial payment
      pendingAmount: pendingAmount.toFixed(2), // ✅ Show pending amount if partial payment is selected
      pricePerAdult: pricePerAdult.toFixed(2), // ✅ Now updates after partial payment
      pricePerChild: pricePerChild.toFixed(2), // ✅ Now updates after partial payment
      originalPrice: prev.originalPrice || basePrice,
      room: matchedPricing.rooms || prev.room,
  };
};

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoadingSubmit(true);
      const createInquiry = await apiCall({
        endpoint: "/api/createInquiry",
        method: "POST",
        body: formData,
      });

      if (createInquiry.success) {
        toast.success("Inquiry submitted successfully!");
        // Clear the form data
        setFormData({ fullName: "", phone: "", email: "", message: "" });
      } else {
        toast.error("Error submitting inquiry. Please try again later.");
      }
    } catch (error) {
      console.error("Error submitting inquiry:", error);
      toast.error("Error submitting inquiry. Please try again later.");
    } finally {
      setLoadingSubmit(false);
    }
  };

  const processedSeasons = seasons.map((season) => {
    // Find the max price in the pricing array
    const maxPricing = season.pricing.reduce(
      (max, current) => {
        // Calculate price per person and handle null values
        const pricePerPerson =
          current.person !== null && current.person > 0
            ? current.price / current.person
            : current.price; // If person is null or 0, use price directly

        // Compare and pick the maximum price
        if (current.price > max.price) {
          return { ...current, pricePerPerson: pricePerPerson.toFixed(2) }; // Format to two decimal places
        }
        return max;
      },
      { price: 0, pricePerPerson: "0.00" } // Initial value with default formatting
    );

    return {
      ...season,
      maxRoom: {
        room: maxPricing.rooms,
        price: maxPricing.price,
        pricePerPerson: maxPricing.pricePerPerson,
        maxP: maxPricing.person,
        // Already formatted
      },
    };
  });

  const callbutton = (index, seasonId, startDate,endDate) => {
    localStorage.setItem("departureDates", startDate);
    localStorage.setItem("endDate", endDate);
    // Extract the selected season's pricing array
    const pricingArray = seasons[index]?.pricing;
    setSelectedSeason(seasonId);

    // Find the max price in the pricing array
    const maxPricing = pricingArray.reduce(
      (max, current) => (current.price > max.price ? current : max),
      { price: 0 }
    );

    // Ensure at least 1 adult if no value is available
    const initialAdults = maxPricing.person > 0 ? maxPricing.person : 1;
    const initialChildren = 0;

    // ✅ Set correct price per adult
    const pricePerAdult = (maxPricing.price / initialAdults).toFixed(2);

    setMaxButton({
      adults: initialAdults,
    });

    setBookButton({
      room: maxPricing.rooms,
      price: maxPricing.price,
      pricePerAdult, // ✅ Correctly setting price per adult
      totalPersons: initialAdults + initialChildren,
      adults: initialAdults,
      children: initialChildren,
      seasonId,
      maxPricing,
      pricingArray,
      startDate,
      endDate,
    });

    setShowDialouge(true);
  };

  // Button click handlers to increment/decrement adults and children

  const [selectedMonth, setSelectedMonth] = useState("All");

  // Function to handle month button click
  const handleMonthClick = (month) => {
    setSelectedMonth(month);
  };

  // Get unique months from the data
  const uniqueMonths = Array.from(
    new Set(
      processedSeasons.map(
        (season) => new Date(season.startDate).getMonth() + 1
      )
    )
  );

  // Sort the unique months for better UX
  uniqueMonths.sort((a, b) => a - b);

  // Filter seasons based on selected month
  const filteredSeasons = processedSeasons.filter((season) => {
    if (selectedMonth === "All") return true;

    const seasonStartMonth = new Date(season.startDate).getMonth() + 1; // Months are 0-indexed
    return seasonStartMonth === parseInt(selectedMonth, 10);
  });

  useEffect(() => {
    const handleStorageChange = (event) => {
      if (event.key === "departureDates" && event.newValue) {
        const [day, month, year] = event.newValue.split("-").map(Number);
        const parsedDate = new Date(year, month - 1, day); // Parse from dd-MM-yyyy
        if (!isNaN(parsedDate)) {
          setSelectedDate(parsedDate);
        }
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  // Handle date selection and update localStorage
  const handleDateChange = (date) => {
    setSelectedDate(date);
    localStorage.setItem("departureDate", bookbutton?.startDate); // Store startDate directly
  };



  return (
    <>
      <div className={styles["tour-booking-panel-outer"]}>
        <div className={styles["tour-seasonsCard-main"]}>
          <h1 className={styles["tour-seasonsCard-heading"]}>
            <span>Choose Best Season & Price </span>{" "}
          </h1>

          {/* Buttons for filtering by month */}
          <div className={styles["filter-buttons"]}>
            <button
              className={`${styles["filter-button"]} ${
                selectedMonth === "All"
                  ? styles["active-button"]
                  : styles["inactive-button"]
              }`}
              onClick={() => handleMonthClick("All")}
            >
              All
            </button>
            {uniqueMonths.map((month) => (
              <button
                key={month}
                className={`${styles["filter-button"]} ${
                  selectedMonth === month.toString()
                    ? styles["active-button"]
                    : styles["inactive-button"]
                }`}
                onClick={() => handleMonthClick(month.toString())}
              >
                {new Date(0, month - 1).toLocaleString("default", {
                  month: "short",
                })}
              </button>
            ))}
          </div>
          <div className={styles["tour-seasonsCard"]}>
            <div className={styles["seasonsCard"]}>
              {filteredSeasons.map((season, index) => (
                <div key={season._id} className={styles["seasonsCard-item"]}>
                  <h3 className={styles["seasonsCard-item-heading"]}>
                    {season.seasonName}
                  </h3>
                  <hr className={styles["seasonsCard-line"]} />
                  <div className={styles["seasonsCard-it"]}>
                    <p className={styles["seasonsCard-date"]}>
                      <strong>
                        <span>
                          {" "}
                          <IoLocationOutline style={{ color: "green" }} />{" "}
                        </span>
                        Season Start{" "}
                      </strong>
                      <span>{formatDay(season.startDate)}</span>
                      <span>{formatDate(season.startDate)}</span>
                    </p>
                    <p className={styles["seasonsCard-date"]}>
                      <strong>
                        <span>
                          {" "}
                          <IoLocationOutline style={{ color: "red" }} />{" "}
                        </span>
                        Season Ends{" "}
                      </strong>
                      <span>{formatDay(season.endDate)}</span>
                      <span>{formatDate(season.endDate)}</span>
                    </p>
                  </div>
                  <hr className={styles["seasonsCard-line"]} />
                  <div className={styles["seasonsCard-its"]}>
                    <p>
                      <strong>₹{season.maxRoom.pricePerPerson}</strong> /per p.p
                    </p>
                    <p>
                      <strong>Room:</strong> {season.maxRoom.room}
                    </p>
                  </div>
                  <hr className={styles["seasonsCard-line"]} />
                  <div className={styles["seasonsCard-itss"]}>
                    <p>
                      Total price for {season.maxRoom.maxP} pack is:{" "}
                      <strong>{season.maxRoom.price}/₹</strong>
                    </p>
                  </div>
                  <hr className={styles["seasonsCard-line"]} />
                  <button
                    className={
                      season.isAvailable
                        ? styles["tour-booking-button-normal"]
                        : styles["tour-booking-button-disabled"]
                    }
                    onClick={() =>
                      season.isAvailable &&
                      callbutton(index, season._id, season.startDate,season.endDate)
                    }
                    disabled={!season.isAvailable} // Prevent click if not available
                  >
                    {season.isAvailable ? "Book Now" : "Sold Out"}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
        {showDialouge && (
          <div className={styles["dialog-overlay"]}>
            <div className={styles["dialog-box"]}>
              <button
                className={styles["dialog-close"]}
                onClick={() => setShowDialouge(false)}
              >
                &times;
              </button>
              <div className={styles["dialog-header"]}>
                <div>
                  <h3>{name}</h3>

                  <h4>
                    <span>₹{bookbutton.pricePerAdult}</span> / per adult
                    <strong> x {bookbutton?.adults || 1}</strong>
                  </h4>
                  {bookbutton.children > 0 && (
                    <h4>
                      <span>₹{bookbutton.pricePerChild}</span> / per child
                      <strong> x {bookbutton?.children}</strong>
                    </h4>
                  )}
                  <h4>
                    Total Price: <span>₹{bookbutton.price.toFixed(2)}</span>
                  </h4>
                  <div className={styles["dialog"]}>
                    <label>Number of Rooms : </label>
                    <span>{bookbutton.room}</span>
                    <div className={styles["dialog-counter"]}>
                   
                    </div>
                  </div>
                </div>

                <ToastContainer position="top-right" autoClose={3000} />
              </div>

              <div className={styles["note"]}>
                <p>
                  <span className={styles["note-label"]}>Note:</span> To book
                  this tour, a minimum of
                  <strong>
                    {" "}
                    {minPeople.enabled ? minPeople.people : 1}
                  </strong>{" "}
                  people and a maximum of
                  <strong> {maxbutton?.adults}</strong> people are allowed
                  (including children).
                </p>
              </div>

              <div className={styles["payment-options"]}>
                <label>
                  <input
                    type="radio"
                    name="payment"
                    value="default"
                    checked={paymentOption === "default"}
                    onChange={() => handlePaymentChange("default")}
                  />
                  {" "} Full Payment (Pay 100% now)
                </label>

                {partialPayment.enabled && (
                  <label>
                    <input
                      type="radio"
                      name="payment"
                      value="partial"
                      checked={paymentOption === "partial"}
                      onChange={() => handlePaymentChange("partial")}
                    />
                    {" "}Partial Payment (Pay {partialPayment.amount}% now)
                  </label>
                )}
              </div>

              <div className={styles["dialog-content"]}>
                <div className={styles["button-fix"]}>
                  <div className={styles["search-options-destination"]}>
                    <DatePicker
                      selected={new Date(bookbutton?.startDate)} // Use the passed start date
                      onChange={handleDateChange}
                      dateFormat="dd/MM/yyyy"
                      minDate={new Date(bookbutton?.startDate)} // Ensure earliest selectable date
                      maxDate={new Date(bookbutton?.endDate || new Date())} // Optional: limit to season end date
                      className={styles["custom-datepicker-input"]}
                    />
                  </div>
                  <div>
                    {isLoadingBook ? (
                      <Loader />
                    ) : (
                      <button
                        className={styles["dialog-button-primary"]}
                        onClick={handleBookNow}
                      >
                        Book Now
                      </button>
                    )}
                  </div>
                </div>

                <div className={styles["dialog-room-section"]}>
                  {/* Adults Counter */}
                  <div className={styles["dialog-row"]}>
                    <label>Adults</label>
                    <div className={styles["dialog-counter"]}>
                      <button
                        onClick={() => handlePersonChange("adults", "decrease")}
                      >
                        -
                      </button>
                      <span>{bookbutton?.adults || 1}</span>
                      <button
                        onClick={() => handlePersonChange("adults", "increase")}
                      >
                        +
                      </button>
                    </div>
                  </div>

                  {/* Children Counter */}
                  <div className={styles["dialog-row"]}>
                    <label>Children</label>
                    <div className={styles["dialog-counter"]}>
                      <button
                        onClick={() =>
                          handlePersonChange("children", "decrease")
                        }
                      >
                        -
                      </button>
                      <span>{bookbutton?.children || 0}</span>
                      <button
                        onClick={() =>
                          handlePersonChange("children", "increase")
                        }
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
     {/* {showCustomizeDialog && (
          <CustomizedQuery uuid={uuid} handleClose={close} />
        )} */}
        <ToastContainer />
        {isLargeScreen && (
          <div className={styles["tour-booking-panel"]}>
            <p className={styles["panel-heading"]}>Book Your Tour</p>
            <p className={styles["panel-des"]}>
              Reserve your ideal trip early for a hassle-free trip; secure
              comfort and convenience!
            </p>
            <form className={styles["inquiryForm"]} onSubmit={handleSubmit}>
              <label>Full Name</label>
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                minLength="2"
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
                <Loader />
              ) : (
                <button type="submit">Submit</button>
              )}
            </form>
          </div>
        )}
      </div>
    </>
  );
};

export default TourBookingPanel;