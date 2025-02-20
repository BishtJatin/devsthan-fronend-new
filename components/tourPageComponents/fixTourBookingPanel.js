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
import { FaWhatsapp } from "react-icons/fa";
import { FaPhoneAlt } from "react-icons/fa";
import { MdMail } from "react-icons/md";

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

const FixTourBookingPanel = ({ tourAllData }) => {
  console.log("Function called");
  console.log(tourAllData);

  const [storedUUID, setStoredUUID] = useState();
  const [isLoadingBook, setIsLoadingBook] = useState(false);
  const [loadingSubmit, setLoadingSubmit] = useState(false);
  const [showDialouge, setShowDialouge] = useState(false);
  const [bookbutton, setBookButton] = useState(null);
  const [date, setDate] = useState();
  const [selectedPrices, setSelectedPrices] = useState({});

 

  const [selectedPayment, setSelectedPayment] = useState("default");
  const [isLargeScreen, setIsLargeScreen] = useState(false);
    const [selectedDate, setSelectedDate] = useState(new Date());
  
    // Sync with localStorage on component mount
    useEffect(() => {
      const storedDate = localStorage.getItem("departureDate");
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
      const handleStorageChange = (event) => {
        if (event.key === "departureDate" && event.newValue) {
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
      const formattedDate = `${date.getDate().toString().padStart(2, "0")}-${(date.getMonth() + 1)
        .toString()
        .padStart(2, "0")}-${date.getFullYear()}`; // Format as dd-MM-yyyy
      localStorage.setItem("departureDate", formattedDate);
    };

  const uuid = tourAllData[0].uuid;

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

  const handlePaymentChange = (method) => {
    setSelectedPayment(method); // Update the selected payment method

    // Recalculate the total based on the selected payment method
    setBookButton((prev) => {
      let newTotal =
        prev.adults * prev.price + prev.children * (prev.price * 0.5); // Calculate base total

      if (method === "partial" && tourAllData[0]?.partialPayment?.amount) {
        const discountPercentage = tourAllData[0].partialPayment.amount / 100; // Convert amount to percentage
        newTotal *= 1 - discountPercentage;
        // Apply the discount
      }

      return {
        ...prev,
        total: newTotal > 0 ? newTotal : prev.price,
        // Ensure total price never goes below price per person
      };
    });
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
    setDate(localStorage.getItem("departureDate"));
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

  const [selectedPaymentOption, setSelectedPaymentOption] = useState("default");

  const handleBookNow = async () => {
    setIsLoadingBook(true);
    const departureDate = localStorage.getItem("departureDate"); // Assuming the key is 'departureDate'
    if (!departureDate) {
      toast.error("Please select a departure date before proceeding.");
      setIsLoadingBook(false);
      return; // Stop execution if departure date is not available
    }

    const token = localStorage.getItem("token");
    const userTempId = token ? null : uuidv4();

    const userSelected = {
      category: "standardDetails",
      adults: bookbutton.adults,
      childern: bookbutton.children,
      tourId: tourAllData[0].uuid,
      batchId: bookbutton.seasonId,
      tourType: "fixedTour",
      priceCategory:
        selectedPrices[bookbutton.seasonId] || "doubleSharingPrice", // Default to "doubleSharingPrice"
      ...(token ? { token } : { userTempId }),
    };
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
          category: "standardDetails",
          adults: bookbutton.adults,
          childern: bookbutton.children,
          tourId: tourAllData[0].uuid,
          batchId: bookbutton.seasonId,
          tourType: "fixedTour",
          ...(selectedPayment === "partial" && {
            partialPayment: tourAllData[0]?.partialPayment?.amount,
          }),
          priceCategory:
            selectedPrices[bookbutton.seasonId] || "doubleSharingPrice", // Default to "doubleSharingPrice"
          ...(token ? { token } : { userTempId }),
        },
      });

      if (response.success) {
        toast.success("Added to cart successfully!");

        // Store userTempId in local storage if token doesn't exist
        if (!token && userTempId) {
          localStorage.setItem("userTempId", userTempId);
        }

        const queryParams = {
          date: date,
          batchId: bookbutton.seasonId,
          tourType: "fixedTour",
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
          date: date,
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoadingSubmit(true);
      const createInquiry = await apiCall({
        endpoint: "/api/createInquiry",
        method: "POST",

        body: formData,
      });
      if (createInquiry.success == true) {
        toast.success("Inquiry submitted successfully!");
      } else {
        toast.error("Error submitting inquiry. Please try again later.");
      }
      // setFormData({ fullName: '', phone: '', email: '', message: '' });
    } catch (error) {
      console.error("Error submitting inquiry:", error);
    } finally {
      setLoadingSubmit(false);
    }
  };

  const callbutton = (index, seasonId, selectedCurrentPrice) => {
    // Set initial state for booking
    setBookButton({
      price: selectedCurrentPrice, // Set price per person
      total: selectedCurrentPrice, // Initially, total price equals price per person
      adults: 1, // Default 1 adult
      children: 0,
      seasonId: seasonId, // Default no children
    });

    // Show the dialogue
    setShowDialouge(true);
  };

  const handleAdultsChange = (action) => {
    setBookButton((prev) => {
      const newAdults =
        action === "increment" ? prev.adults + 1 : Math.max(prev.adults - 1, 1); // Ensure adults never go below 1
      let newTotal =
        newAdults * prev.price + prev.children * (prev.price * 0.5); // Calculate the base total

      // Apply discount if selectedPayment is "partial" and partialpayment.amount is available
      if (
        selectedPayment === "partial" &&
        tourAllData &&
        tourAllData[0]?.partialPayment?.amount
      ) {
        const discountPercentage = tourAllData[0].partialPayment.amount / 100; // Convert the amount to a percentage
        newTotal = newTotal * (1 - discountPercentage); // Apply the discount to the total
      }

      return {
        ...prev,
        adults: newAdults,
        total: newTotal > 0 ? newTotal : prev.price, // Ensure total price never goes below price per person
      };
    });
  };

  const handleChildrenChange = (action) => {
    setBookButton((prev) => {
      const newChildren =
        action === "increment"
          ? prev.children + 1
          : Math.max(prev.children - 1, 0); // Children can go down to 0
      let newTotal =
        prev.adults * prev.price + newChildren * (prev.price * 0.5); // Calculate the base total

      // Apply discount if selectedPayment is "partial" and partialPayment.amount is available
      if (
        selectedPayment === "partial" &&
        tourAllData &&
        tourAllData[0]?.partialPayment?.amount
      ) {
        const discountPercentage = tourAllData[0].partialPayment.amount / 100; // Convert amount to a percentage
        newTotal *= 1 - discountPercentage; // Apply the discount to the total
      }

      return {
        ...prev,
        children: newChildren,
        total: newTotal > 0 ? newTotal : prev.price, // Ensure total price never goes below price per person
      };
    });
  };

  const handlePriceChange = (seasonId, priceType) => {
    // Update selectedPrices with the new selection for the specific seasonId
    setSelectedPrices((prev) => ({
      ...prev,
      [seasonId]: priceType, // Store the selected price type for the given season
    }));
  };

  console.log(selectedPrices);

  const [selectedMonth, setSelectedMonth] = useState("All");

  // Extract batches from tourAllData
  const batches = tourAllData[0]?.batch || [];

  // Get unique months from the data
  const uniqueMonths = Array.from(
    new Set(
      batches.map((batch) => new Date(batch.tourStartDate).getMonth() + 1)
    )
  ).sort((a, b) => a - b); // Sort months for better UX

  // Filter data based on the selected month
  const filteredBatches = batches.filter((batch) => {
    if (selectedMonth === "All") return true;
    const startMonth = new Date(batch.tourStartDate).getMonth() + 1;
    return startMonth === parseInt(selectedMonth, 10);
  });

  return (
    <>
      <div className={styles["tour-booking-panel-outer"]}>
        <div className={styles["tour-seasonsCardfix"]}>
          <h1 className={styles["tour-seasonsCard-headingfix"]}>Choose Best Season & Price</h1>

          {/* Month Buttons */}
          <div className={styles["filter-buttons"]}>
            <button
              className={`${styles["filter-button"]} ${
                selectedMonth === "All" ? styles["active-button"] : ""
              }`}
              onClick={() => setSelectedMonth("All")}
            >
              All
            </button>
            {uniqueMonths.map((month) => (
              <button
                key={month}
                className={`${styles["filter-button"]} ${
                  selectedMonth === month.toString()
                    ? styles["active-button"]
                    : ""
                }`}
                onClick={() => setSelectedMonth(month.toString())}
              >
                {new Date(0, month - 1).toLocaleString("default", {
                  month: "short",
                })}
              </button>
            ))}
          </div>

          <div className={styles["seasonsCardfix"]}>
  {filteredBatches.map((season, index) => {
    const selectedPrice =
      selectedPrices[season._id] || "doubleSharingPrice";

    return (
      <div key={season._id} className={styles["seasonsCard-itemfix"]}>
        <div className={styles["seasonsCard-itfix"]}>
          <p className={styles["seasonsCard-datefix"]}>
            <strong>
              <IoLocationOutline style={{ color: "green" }} /> Starts{" "}
              {formatDay(season.tourStartDate)}
            </strong>
            <span>{formatDate(season.tourStartDate)}</span>
          </p>
          <p className={styles["seasonsCard-datefix"]}>
            <strong>
              <IoLocationOutline style={{ color: "red" }} /> Ends{" "}
              {formatDay(season.tourEndDate)}
            </strong>
            <span>{formatDate(season.tourEndDate)}</span>
          </p>
        </div>

        <div className={styles["seasonsCard-itsfix"]}>
          <div className={styles["sharing-optionsfix"]}>
            <label>
              <input
                type="radio"
                name={`sharing-${season._id}`}
                value="doubleSharingPrice"
                checked={selectedPrice === "doubleSharingPrice"}
                onChange={() =>
                  handlePriceChange(season._id, "doubleSharingPrice")
                }
                style={{ marginRight: "8px" }}
              />
              Double Sharing
            </label>
            <label>
              <input
                type="radio"
                name={`sharing-${season._id}`}
                value="trippleSharingPrice"
                checked={selectedPrice === "trippleSharingPrice"}
                onChange={() =>
                  handlePriceChange(season._id, "trippleSharingPrice")
                }
                style={{ marginRight: "8px" }}
              />
              Triple Sharing
            </label>
            <label>
              <input
                type="radio"
                name={`sharing-${season._id}`}
                value="quadSharingPrice"
                checked={selectedPrice === "quadSharingPrice"}
                onChange={() =>
                  handlePriceChange(season._id, "quadSharingPrice")
                }
                style={{ marginRight: "8px" }}
              />
              Quad Sharing
            </label>
          </div>

          <div className={styles["Selected-Pricefix"]}>
            <div>
              <p>
                <strong>Selected Price:</strong> ₹
                {season[selectedPrice] || "N/A"}
              </p>
              <p className={styles["Selected-Pricefix1"]}>
                <strong>Group Size:</strong> {season.groupSize}
              </p>
            </div>
            <div>
              <p>
                <strong>Seats Booked:</strong> {season.seatBooked}
              </p>
              <div className={styles["Selected-icons"]}>
                <FaWhatsapp />
                <MdMail />
                <FaPhoneAlt />
              </div>
            </div>
          </div>
        </div>
        <button
          className={styles["tour-booking-button-fix"]}
          onClick={() =>
            callbutton(index, season._id, season[selectedPrice])
          }
        >
          Book Now
        </button>
      </div>
    );
  })}
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
                  <h2>{tourAllData[0].name}</h2>
                  <h4>Total Price: <span>₹{bookbutton.total}</span></h4>
                  <h4>
                    ₹{" "}
                    <span>{selectedPayment === "partial" &&
                    tourAllData[0]?.partialPayment?.amount
                      ? bookbutton.price *
                        (1 - tourAllData[0].partialPayment.amount / 100) // Apply discount if partial
                      : bookbutton.price}</span>{" "}
                    /per person
                  </h4>

                  <div className={styles["dialog-row"]}></div>
                </div>

                {/* <div>
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
                </div> */}

                <ToastContainer position="top-right" autoClose={3000} />
              </div>
              <div className={styles["payment-options"]}>
                <label>
                  <input
                    type="radio"
                    name="payment"
                    value="default"
                    checked={selectedPayment === "default"}
                    onChange={() => handlePaymentChange("default")}
                  />
                  Default Payment
                </label>

                {tourAllData[0].partialPayment.enabled ? (
                  <label>
                    <input
                      type="radio"
                      name="payment"
                      value="partial"
                      checked={selectedPayment === "partial"}
                      onChange={() => handlePaymentChange("partial")}
                    />
                    Partial Payment
                  </label>
                ) : null}
              </div>
              <div className={styles["dialog-content"]}>
              <div className={styles["button-fix"]}> 
              <div className={styles["search-options-destination"]}>
               <DatePicker
                                  selected={selectedDate}
                                  onChange={handleDateChange}
                                  dateFormat="dd/MM/yyyy"
                                  minDate={new Date()} // Disables all dates before today
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
                  <div className={styles["dialog-row"]}>
                    <label>Adult</label>
                    <div className={styles["dialog-counter"]}>
                      <button onClick={() => handleAdultsChange("decrement")}>
                        -
                      </button>
                      <span>{bookbutton?.adults || 0}</span>{" "}
                      {/* Display current number of adults */}
                      <button onClick={() => handleAdultsChange("increment")}>
                        +
                      </button>
                    </div>
                  </div>

                  <div className={styles["dialog-row"]}>
                    <label>Children</label>
                    <div className={styles["dialog-counter"]}>
                      <button onClick={() => handleChildrenChange("decrement")}>
                        -
                      </button>
                      <span>{bookbutton?.children || 0}</span>{" "}
                      {/* Display current number of children */}
                      <button onClick={() => handleChildrenChange("increment")}>
                        +
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        {showCustomizeDialog && (
          <CustomizedQuery uuid={uuid} handleClose={close} />
        )}
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

export default FixTourBookingPanel;
