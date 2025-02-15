import React, { useState, useEffect } from "react";
import LoginForm from "../../components/loginForm/loginForm";
import SignupForm from "../../components/signupForm/signupForm";
import styles from "./bookingDetails.module.css";
import { useRouter } from "next/router";
import { apiCall } from "../../utils/common.js";
import Script from "next/script.js";
import Loader from "../../components/loader/loader.js";
import { toast } from "react-hot-toast";
import "react-toastify/dist/ReactToastify.css";
import FullScreenLoader from "../../components/fullScreenLoader/fullScreenLoader.js";

import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import ForgotPasswordForm from "../../components/forgetForm/forgot.js";

export default function TravellerDetails() {
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(false);
  const [fullLoading, setFullLoading] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showSignup, setShowSignup] = useState(false);
  const [cartData, setCartData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [rooms, setRooms] = useState([]);
  const [address, setAddress] = useState("");
  const [tourInfo, setTourInfo] = useState("");
  const [mobile, setMobile] = useState("");
  const [email, setEmail] = useState("");
  const [tourid, setTourid] = useState("");
  const [username, setUsername] = useState("");
  const [date, setDate] = useState("");

  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [code, setCouponCode] = useState(""); // State for coupon code
  const [couponStatus, setCouponStatus] = useState(null);
  const [responsedata, setResponseData] = useState(null);
  const [gst, SetGst] = useState("");
  // State for API response

  const [paymentAmount, setPaymentAmount] = useState(null);

  const handleApplyCoupon = async () => {
    if (!isLoggedIn) {
      toast.error("Please log in to apply a coupon.");
      return;
    }

    if (!code.trim()) {
      toast.error("Please enter a coupon code.");
      return;
    }

    try {
      setIsLoading(true); // Show loading indicator

      // Retrieve additional required values from localStorage
      const token = localStorage.getItem("token");
      const userId = localStorage.getItem("userId");
      const tourId = tourid; // Use state value for tourId

      if (!token || !userId || !tourId) {
        toast.error("Missing required data for applying coupon.");
        return;
      }

      // Prepare the request body
      const requestBody = {
        code, // Coupon code entered by the user
        userId, // User ID
        token, // Auth token
        tourId, // Tour ID
        seasonId: cartData?.seasonId,
        tourType: cartData?.tourType,
        batchId: cartData?.batchId,
        // Conditionally add seasonId or batchId
      };

      // API call
      const response = await apiCall({
        endpoint: `/api/validateCoupon`,
        method: "POST",
        body: requestBody,
      });

      // Handle API response
      if (response.success) {
        toast.success("Coupon applied successfully!");
        setCouponStatus(response.message || "Coupon valid.");
        setResponseData(response);
        SetGst(response.gst);
      } else {
        toast.error("Invalid coupon code.");
        setCouponStatus("Invalid coupon.");
      }
    } catch (error) {
      console.error("Error applying coupon:", error);
      toast.error("An error occurred while applying the coupon.");
    } finally {
      setIsLoading(false); // Hide loading indicator
    }
  };

  const [selectedDate, setSelectedDate] = useState(new Date()); // Default to today's date
  const [startDate, setStartDate] = useState(new Date()); // State for start date
  const formatDate = (date) => {
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = String(date.getFullYear()).slice(2); // Get the last two digits of the year
    return `${day}/${month}/${year}`;
  };

  const handleDateChange = (date) => {
    if (date) {
      const formattedDate = formatDate(date);
      setStartDate(date);
      setSelectedDate(date);
      setDate(formattedDate);
      localStorage.setItem("departureDate", formattedDate); // Ensure this is logged correctly
      console.log("Saved to LocalStorage:", formattedDate);
    }
  };

  const handleBookingDateChange = (date) => {
    if (date) {
      const formattedDate = formatDate(date); // Use the same formatDate function as in Itinerary
      localStorage.setItem("departureDate", formattedDate);
    }
  };

  // Custom Input Component for Date Picker
  const CustomInput = React.forwardRef(({ value, onClick }, ref) => (
    <input
      className={styles["datepicker-input"]}
      value={value}
      onClick={onClick}
      readOnly
      ref={ref}
      placeholder="Select Date"
    />
  ));
  CustomInput.displayName = "CustomInput";

  useEffect(() => {
    const departureDate = localStorage.getItem("departureDate");
    if (departureDate) {
      try {
        const [day, month, year] = departureDate.split("/").map(Number);
        const parsedDate = new Date(year + 2000, month - 1, day); // Adjust year if needed
        setSelectedDate(parsedDate);
        setStartDate(parsedDate);
        setDate(departureDate);
      } catch (error) {
        console.error("Error parsing date:", error);
      }
    }
  }, []);

  // useEffect to handle data updates whenever selectedDate changes
  useEffect(() => {
    const token =
      localStorage.getItem("token") || sessionStorage.getItem("token");
    const userId =
      localStorage.getItem("userId") || sessionStorage.getItem("userId");
    const departureDate = localStorage.getItem("departureDate");
    const username = localStorage.getItem("username");
    const userTempId = localStorage.getItem("userTempId");

    setUsername(username);

    // Process departure date if available
    if (departureDate) {
      try {
        // Parse the date in "DD-MM-YYYY" format
        const [day, month, year] = departureDate.split("-").map(Number);
        const parsedDate = new Date(year, month - 1, day); // Month is 0-indexed

        if (!isNaN(parsedDate.getTime())) {
          // Format date to "DD//MM//YY"
          const formattedDate = `${String(day).padStart(2, "0")}//${String(
            month
          ).padStart(2, "0")}//${String(year).slice(-2)}`;

          // Only update states if the date has changed
          if (selectedDate?.getTime() !== parsedDate.getTime()) {
            setStartDate(parsedDate); // Set parsed date object
            setSelectedDate(parsedDate); // Update selected date
            setDate(formattedDate); // Display formatted date
          }
        } else {
          console.error("Invalid date format in localStorage.");
        }
      } catch (error) {
        console.error("Error parsing date from localStorage:", error);
      }
    }

    if (token && userId) {
      setIsLoggedIn(true);
    }
  }, [selectedDate]); // Runs only when 'selectedDate' changes

  const adjustedDate =
    selectedDate && new Date(selectedDate.getTime() - 24 * 60 * 60 * 1000);

  useEffect(() => {
    const token =
      localStorage.getItem("token") || sessionStorage.getItem("token");
    const userId =
      localStorage.getItem("userId") || sessionStorage.getItem("userId");
    const userTempId = localStorage.getItem("userTempId");
    const userData = { token, userId, userTempId };

    const fetchCartData = async () => {
      try {
        setLoading(true); // Start loading
        const response = await apiCall({
          endpoint: `/api/getCart`,
          method: "POST",
          body: userData,
        });

        // Handle response
        setTourInfo(response.tour);
        distributePersons(response.cart.adults, response.cart.children);
        setCartData(response?.cart);
        setTourid(response.cart.tourId);
        SetGst(response.cart.gst);

        if (!response.ok) {
          throw new Error("Failed to fetch cart data");
        }
      } catch (err) {
        setError(err.message); // Handle error
      } finally {
        setLoading(false); // Stop loading
      }
    };

    // Fetch data whenever 'selectedDate' changes
    fetchCartData();
  }, []);
  const distributePersons = (adults, children) => {
    const totalPersons = adults + children;
    const roomArr = [];
    let remainingPersons = totalPersons;

    for (let i = 0; remainingPersons > 0; i++) {
      const personsInRoom = Math.min(remainingPersons, 3);
      roomArr.push({
        room: i + 1,
        adults: Math.min(adults, personsInRoom),
        children: personsInRoom - Math.min(adults, personsInRoom),
        details: Array.from({ length: personsInRoom }, () => ({
          firstName: "",
          lastName: "",
        })),
      });
      adults -= personsInRoom;
      remainingPersons -= personsInRoom;
    }

    setRooms(roomArr);
  };

  console.log(cartData?.partialPayment?.amount);

  const handleInputChange = (roomIndex, personIndex, key, value) => {
    const updatedRooms = [...rooms];
    updatedRooms[roomIndex].details[personIndex][key] = value;
    setRooms(updatedRooms);
  };

  const toggleForgotPasswordMode = () => {
    setShowForgotPassword((prev) => !prev); // Toggle the forgot password view
  };

  const hidePanel = () => {
    setIsLoggedIn(true);
  };
  const toggleRegisterMode = () => {
    setShowSignup((prev) => !prev);
  };
  const handleRazorpay = async () => {
    setIsLoading(true);

    const token = localStorage.getItem("token");

    if (!token) {
      toast.error("User not logged in!");
      setIsLoading(false);
      return;
    }

    try {
      const userId = localStorage.getItem("userId");

      const paymentResponse = await apiCall({
        endpoint: "/paymentCalculate",
        method: "POST",
        body: {
          tourId: tourid,
          userId,
          seasonId: cartData?.seasonId,
          tourType: cartData?.tourType,
          batchId: cartData?.batchId,
          priceCategory: cartData?.priceCategory,
          // priceCategory:
          category: cartData.category,
          ...(responsedata?.success && { code: code }),
          ...(cartData?.partialPayment?.enabled && {
            partialPayment: cartData?.partialPayment?.percentage,
          }),
        },
      });

      if (!paymentResponse.success || !paymentResponse.order) {
        throw new Error("Order creation failed: Invalid response");
      }

      const options = {
        key: "rzp_test_sIXFzBSqAXJpVK",

        amount: paymentResponse.order.amount,
        currency: paymentResponse.order.currency,
        name: "Devsthan Expert",
        description: "Devsthan Expert Pvt. Ltd. is a premier travel company...",
        image:
          "https://res.cloudinary.com/dmyzudtut/image/upload/v1731261401/Untitled_design_11_dlpmou.jpg",
        order_id: paymentResponse.order.id,
        handler: async (paymentResponse) => {
          toast.success("Payment successful, processing order...");

          try {
            const verifyResponse = await apiCall({
              endpoint: "/verify-payment",
              method: "POST",
              body: {
                razorpay_payment_id: paymentResponse.razorpay_payment_id,
                razorpay_order_id: paymentResponse.razorpay_order_id,
                razorpay_signature: paymentResponse.razorpay_signature,
              },
            });

            console.log("Verify Payment Response:", verifyResponse);

            if (verifyResponse.success) {
              setFullLoading(true);

              // Step 3: Create Order
              const orderResponse = await retryApiCall({
                endpoint: "/create-order",
                method: "POST",
                body: {
                  tourId: tourid,
                  userId,
                  seasonId: cartData?.seasonId,
                  tourType: cartData?.tourType,
                  batchId: cartData?.batchId,
                  priceCategory: cartData?.priceCategory,
                  // priceCategory:
                  category: cartData.category,
                  ...(responsedata?.success && { code: code }),
                  ...(cartData?.partialPayment?.enabled && {
                    partialPayment: cartData?.partialPayment?.percentage,
                  }),
                  address: address || "",
                  mobile: mobile || "",
                  email: email || "",
                  rooms: rooms || 0,
                  username: username || "",
                  date: date || "",
                },
              });

              console.log("Order Response:", orderResponse);
              try {
                if (orderResponse?.success) {  // Ensure orderResponse exists before checking success
                  const queryParams = {
                    tourName: tourInfo?.name || "N/A",
                    totalPrice: orderResponse.order?.finalPrice || 0,  // Ensure finalPrice exists
                    adults: cartData?.adults || 0,
                    children: cartData?.childern || 0,
                    date: date || "N/A",
                  };
              
                  router.push({
                    pathname: "/booked-tour",
                    query: queryParams,
                  });
                } else {
                  toast.error("Order creation failed. Please try again.");
                }
                
                setFullLoading(false);
              } catch (verifyError) {
                console.error("Verification Error:", verifyError); // Log the error for debugging
                toast.error("Error verifying payment. Please try again.");
              }
            } else {
              toast.error("Payment verification failed.");
            }
          } catch (verifyError) {
            toast.error("Error verifying payment.");
          }
        },

        prefill: {
          /* Prefill data */
        },
        notes: { address: "Razorpay Corporate Office" },

        theme: { color: "#3399cc" },
      };

      const rzp1 = new window.Razorpay(options);

      rzp1.on("payment.failed", function (response) {
        console.error("Payment failed:", response.error);
        toast.error(`Payment failed: ${response.error.description}`);
      });

      rzp1.open();
    } catch (error) {
      console.error("Error initiating Razorpay:", error.message);
      toast.error("An error occurred while processing the payment.");
    } finally {
      setIsLoading(false);
    }
  };

  // Retry API Call Function
  const retryApiCall = async (config, retries = 3) => {
    let success = false;

    for (let i = 0; i < retries; i++) {
      if (success) break; // Stop further retries if already successful
      try {
        const response = await apiCall(config);
        if (response.success) {
          success = true; // Mark as successful
          return response;
        }
      } catch (error) {
        if (i === retries - 1) throw error; // Rethrow the last error
      }
    }
  };

  // Button to trigger Razorpay
  <button id="rzp-button1" onClick={handleRazorpay}>
    Pay Now
  </button>;

  return (
    <>
      <Script src="https://checkout.razorpay.com/v1/checkout.js"></Script>
      <div className={styles["container"]}>
        <div className={styles["form-section"]}>
          {!isLoggedIn ? (
            showSignup ? (
              <SignupForm
                isComponent={true}
                toggleToSignup={toggleRegisterMode}
               
                toggleToHide={hidePanel}
              />
            ) : showForgotPassword ? (
              <ForgotPasswordForm
                isComponent={true}
                toggleToForgotPassword={toggleForgotPasswordMode}
                toggleToHide={hidePanel}
              />
            ) : (
              <div>
                <LoginForm
                  isComponent={true}
                  toggleToLogin={toggleRegisterMode}
                  toggleToHide={hidePanel}
                  toggleToForgotPassword={toggleForgotPasswordMode}
                />
                <a
                  href="#"
                  className={styles["forget-password-link"]}
                  onClick={toggleForgotPasswordMode}
                >
                  Forgot Password?
                </a>
              </div>
            )
          ) : (
            <h2>Welcome Back!</h2>
          )}

          <h2>Please Enter Traveller(s) Details</h2>
          <form
            onSubmit={(e) => {
              if (!e.target.checkValidity()) {
                e.preventDefault();
                return;
              }

              e.preventDefault();
              handleRazorpay();
            }}
          >
            {rooms.map((room, roomIndex) => (
              <div key={roomIndex} className={styles["form-container"]}>
                <h3>Room {room.room}</h3>
                {room.details.map((person, personIndex) => {
                  const isAdult = personIndex < room.adults; // Assuming `room.adults` indicates the count of adults
                  const label = isAdult
                    ? `Adult ${personIndex + 1}`
                    : `Child ${personIndex + 1 - room.adults}`;
                  return (
                    <div key={personIndex} className={styles["traveller-row"]}>
                      <h4>{label}</h4>
                      <div className={styles["traveller-row-merge"]}>
                        <label>
                          First Name:
                          <input
                            type="text"
                            required
                            value={person.firstName}
                            onChange={(e) =>
                              handleInputChange(
                                roomIndex,
                                personIndex,
                                "firstName",
                                e.target.value
                              )
                            }
                          />
                        </label>
                        <label>
                          Last Name:
                          <input
                            type="text"
                            required
                            value={person.lastName}
                            onChange={(e) =>
                              handleInputChange(
                                roomIndex,
                                personIndex,
                                "lastName",
                                e.target.value
                              )
                            }
                          />
                        </label>
                      </div>
                    </div>
                  );
                })}
              </div>
            ))}
            <div className={styles["input-group"]}>
              <label>
                Address:
                <textarea
                  value={address}
                  required
                  onChange={(e) => setAddress(e.target.value)}
                />
              </label>
            </div>
            <div className={styles["input-group"]}>
              <label>
                Mobile:
                <input
                  type="text"
                  value={mobile}
                  required
                  onChange={(e) => setMobile(e.target.value)}
                />
              </label>
            </div>
            <div className={styles["input-group"]}>
              <label>
                Email:
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </label>
            </div>
            {isLoading ? (
              <Loader />
            ) : (
              <button type="submit" className={styles["button"]}>
                Pay Now
              </button>
            )}
          </form>
        </div>
        <div className={styles["package-details-box"]}>
          <h3 className={styles["section-title"]}>Package Details</h3>
          <div className={styles["package-info"]}>
            <img
              src={tourInfo?.bannerImage} // You can replace with dynamic image URL if needed
              alt="Tour Package Image"
              className={styles["package-image"]}
            />
            <div>
              <p>{tourInfo?.name || "Tour Package"}</p>
              <a
                href={`/tour/${cartData?.tourId}`}
                className={styles["view-detail-link"]}
              >
                View Detail
              </a>
            </div>
          </div>

          <div className={styles["package-summary"]}>
            <div>
              <span>Travel Date:</span> <strong>{date}</strong>
              <div className={styles["search-options-destination"]}>
                <DatePicker
                  selected={selectedDate}
                  onChange={handleDateChange}
                  dateFormat="dd/MM/yyyy"
                  minDate={new Date()}
                  className={styles["custom-datepicker-input"]} // Use custom input
                />
              </div>
            </div>

            {/* Coupon Code Section */}
            {paymentAmount === null && (
              <div className={styles["coupon-section"]}>
                <label htmlFor="couponCode">Apply Coupon Code:</label>
                <div className={styles["coupon-input-container"]}>
                  <input
                    type="text"
                    id="couponCode"
                    value={code}
                    onChange={(e) =>
                      setCouponCode(e.target.value.toUpperCase())
                    } // Convert to uppercase
                    placeholder="Enter coupon code"
                    className={styles["coupon-input"]}
                  />
                  <button
                    type="button"
                    onClick={handleApplyCoupon}
                    className={styles["apply-coupon-button"]}
                  >
                    Apply
                  </button>
                </div>
                {couponStatus && (
                  <p className={styles["coupon-status"]}>{couponStatus}</p>
                )}
              </div>
            )}

            <p>
              <span>No. of Rooms:</span>{" "}
              <strong>{cartData?.selectedRooms}</strong>
            </p>
            <p>
              <span>No. of Adults</span> <strong>{cartData?.adults}</strong>
            </p>
            <p>
              <span>No. of Child</span> <strong>{cartData?.children}</strong>
            </p>
            <p>
              <span>Amount</span>{" "}
              <strong>
                ₹
                {responsedata?.success ? (
                  <span style={{ textDecoration: "line-through" }}>
                    {cartData?.basePrice.toFixed(2)}
                  </span>
                ) : (
                  cartData?.basePrice.toFixed(2)
                )}
              </strong>
            </p>
            {responsedata?.success && (
              <p>
                <span>Discounted Amount</span>{" "}
                <strong>₹{responsedata.discountedPrice.toFixed(2)}</strong>
              </p>
            )}
{console.log(cartData)}
            <p>
              <span>Gst</span> <strong>₹{gst}</strong>
            </p>

            <p className={styles["total-amount"]}>
              <span>Total Amount: </span>{" "}
              <strong
                style={{
                  textDecoration: cartData?.partialPayment?.enabled
                    ? "line-through"
                    : "none",
                }}
              >
                ₹
                {responsedata?.success
                  ? responsedata.finalPrice?.toFixed(2)
                  : cartData?.totalPrice?.toFixed(2)}
              </strong>
            </p>
            {cartData?.partialPayment?.enabled === true && (
              <p className={styles["total-amount"]}>
                <span>Partial Amount: </span>{" "}
                <strong>
                  ₹{" "}
                  {responsedata?.success
                    ? responsedata.partialPaymentAmount.toFixed(2)
                    : cartData?.partialPayment?.amount.toFixed(2)}
                </strong>
              </p>
            )}

            <p className={styles["taxes"]}>
              Taxes are included in the total amount.
            </p>
          </div>
          {cartData?.partialPayment?.enabled === true && (
            <div className={styles["payment-note"]}>
              <h2>Note</h2>
              <p>
                <span className={styles["lable"]}>Partial Amount:</span> ₹{" "}
                {responsedata?.success
                  ? responsedata.partialPaymentAmount.toFixed(2)
                  : cartData?.partialPayment?.amount.toFixed(2)}
              </p>
              <p>
                <span className={styles["label"]}>Full Amount:</span> ₹{" "}
                {(
                  (responsedata?.success
                    ? parseFloat(responsedata.finalPrice ?? 0)
                    : parseFloat(cartData?.totalPrice ?? 0)) -
                  (responsedata?.success
                    ? parseFloat(responsedata.partialPaymentAmount ?? 0)
                    : parseFloat(cartData?.partialPayment?.amount ?? 0))
                ).toFixed(2)}{" "}
                due after{" "}
                {selectedDate
                  ? adjustedDate?.toLocaleDateString("en-GB") // Format as dd/mm/yyyy
                  : "a selected date"}
                .
              </p>

              <p className={styles["note"]}>
                Kindly ensure the full payment is made before the due date to
                avoid any inconvenience.
              </p>
            </div>
          )}

          <div className={styles["transaction-safe"]}>
            {/* <img
            src="/path/to/google-play-image.jpg" // You can replace with dynamic image URL if needed
            alt="Google Play"
            className={styles['transaction-image']} /> */}
            <div>
              <strong>Your transaction is safe because:</strong>
              <ul>
                <li>
                  Your transaction is backed by major commercial banks and your
                  personal information is protected and kept private.
                </li>
                <li>
                  Devsthan-Expert.com guarantees conformity to international
                  credit card payment standards.
                </li>
              </ul>
            </div>
          </div>
        </div>
        {fullLoading ? <FullScreenLoader /> : null}
      </div>
    </>
  );
}
