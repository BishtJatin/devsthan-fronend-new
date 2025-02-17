import { useState, useEffect } from "react";
import styles from "./enquiry.module.css";
import { BASE_URL } from "../../utils/headers";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function EnquiryPopup() {
  const [showPopup, setShowPopup] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    city: "",
    adults: "",
    date: "",
    message: "",
  });

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowPopup(true);
    }, 10000); // Show after 10 seconds

    return () => clearTimeout(timer);
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(`${BASE_URL}/api/createAssistanceQuery`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        toast.success("Inquiry submitted successfully!");
        setShowPopup(false);
      } else {
        toast.error("Failed to submit the inquiry. Please try again.");
      }
    } catch (error) {
      console.error("Error submitting inquiry:", error);
      toast.error("An error occurred. Please try again later.");
    }
  };

  return (
    <>
      <ToastContainer position="top-right" autoClose={5000} />
      {showPopup && (
        <div className={styles["popup-overlay"]}>
          <div className={styles["popup-container"]}>
            <button
              className={styles["close-button"]}
              onClick={() => setShowPopup(false)}
            >
              &times;
            </button>
            <h2 className={styles["header-text"]}>Enquire Now</h2>
            <p className={styles["description"]}>
              Do you have any questions before you book? Our expert team will
              get back to you shortly.
            </p>
            <form onSubmit={handleSubmit}>
              <div className={styles["input-group"]}>
                <input
                  type="text"
                  name="name"
                  placeholder="Your Name *"
                  className={styles["input-box"]}
                  onChange={handleChange}
                  required
                />
                <input
                  type="email"
                  name="email"
                  placeholder="Email Address *"
                  className={styles["input-box"]}
                  onChange={handleChange}
                  required
                />
                <input
                  type="text"
                  name="phone"
                  placeholder="Phone Number *"
                  className={styles["input-box"]}
                  onChange={handleChange}
                  required
                />
                <input
                  type="text"
                  name="city"
                  placeholder="Current City *"
                  className={styles["input-box"]}
                  onChange={handleChange}
                  required
                />
                <input
                  type="number"
                  name="adults"
                  placeholder="No of Adults *"
                  className={styles["input-box"]}
                  onChange={handleChange}
                  required
                />
                <label className={styles["date-label"]}>
                Travel Date *
                <input
                  type="date"
                  name="date"
                  className={styles["input-box"]}
                  onChange={handleChange}
                  required
                />
                </label>
              </div>
              
              <textarea
                name="message"
                placeholder="Please write your queries. *"
                className={styles["textarea"]}
                onChange={handleChange}
                required
              ></textarea>
              <button type="submit" className={styles["submit-button"]}>
                Send Inquiry
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
