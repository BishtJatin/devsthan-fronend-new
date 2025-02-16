import React, { useEffect, useState } from "react";
import styles from "../../pages/login/login.module.css"; // Import your CSS module
import Loader from "../../components/loader/loader"; // Assuming you have a Loader component
import { toast } from "react-hot-toast";
import Link from "next/link";
import { useRouter } from "next/router";
import { apiCall } from "../../utils/common";
import { IoEyeOutline } from "react-icons/io5";
import { IoEyeOffOutline } from "react-icons/io5";

const LoginForm = ({ isComponent, toggleToLogin, toggleToHide ,toggleForgotPasswordMode}) => {
  const validateEmail = (email) => { 
    const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return regex.test(email);
  };

  const router = useRouter();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    accountType: "user",
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false); // Flag for OTP form visibility
  const [otp, setOtp] = useState(null);
  const [otpError, setOtpError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  // Handle input changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handlePasswordToggle = () => {
    setShowPassword((prev) => !prev);
  };

  const submitDataToApi = async (formData) => {
    try {
      setLoading(true);
      const response = await apiCall({
        endpoint: `/api/user/login`,
        method: "POST",

        body: formData,
      });
      if (response.success) {
        setOtpSent(true);
        toast.success("Please verify OTP to Login ");
      } else {
        setErrors({ general: "Login failed. Please try again." });
        toast.error(response.error);
      }
    } catch (error) {
      console.error("API call error:", error);
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };
  // Handle form submission to signup
  const handleSubmit = async (e) => {
    e.preventDefault();
    const { email } = formData;

    // Validate email
    if (!email || !validateEmail(email)) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        email: "Please enter a valid email address.",
      }));
      return; // Stop submission if email is invalid
    }

    setErrors({}); // Clear any previous errors
    try {
      const response = await submitDataToApi(formData);
    } catch (err) {
      setLoading(false);
      setErrors({ general: "Error occurred. Please try again." });
    }
  };

  const verifyOtpdApi = async (data) => {
    try {
      const response = await apiCall({
        endpoint: `/api/user/verify-otp`,
        method: "POST",

        body: data,
      });

      if (response.success) {
        setLoading(false);
        setOtpSent(true);
        toast.success("Otp Verified seccessfully ");

        localStorage.setItem("token", response.token);
        localStorage.setItem("username", response.user.name);
        localStorage.setItem("phone", response.user.phone);
        localStorage.setItem("userId", response.user.id);
        localStorage.setItem("email", response.user.email);

        if (isComponent != true) {
          window.location.href = "/";
        } else toggleToHide();
      } else {
        setLoading(false);
        setErrors({ general: "Signup failed. Please try again." });
        toast.error("Invalid Otp");
      }
    } catch (error) {
      console.error("API call error:", error);
      return { success: false, error: error.message };
    }
  };

  // Handle OTP verification
  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const userTempId = localStorage.getItem("userTempId");
      // Call the API to verify OTP
      const response = await verifyOtpdApi({
        email: formData.email,
        otp,
        userTempId,
      });
    } catch (err) {
      setLoading(false);

      // Handle API errors
      setOtpError(
        err.response?.data?.error || "Error occurred. Please try again."
      );
    }
  };

  useEffect(() => {}, []);
  return (
    <>
      <h2 className={styles["card-title"]}>Login</h2>

      {/* Show loader when loading */}
      {loading ? (
        <div className={styles["loader-container"]}>
          <Loader />
        </div>
      ) : otpSent ? (
        // OTP verification form
        <form onSubmit={handleOtpSubmit} className={styles["form"]}>
          <div className={styles["form-group"]}>
            <label className={styles["form-label"]} htmlFor="otp">
              OTP<span className={styles["required"]}>*</span>
            </label>
            <input
              type="number"
              id="otp"
              name="otp"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className={styles["form-input"]}
              placeholder="Enter OTP"
            />
            {otpError && <span className={styles["error"]}>{otpError}</span>}
          </div>
          {loading ? (
            <Loader />
          ) : (
            <button type="submit" className={styles["submit-button"]}>
              Verify OTP
            </button>
          )}
        </form>
      ) : (
        // Signup form
        <form onSubmit={handleSubmit} className={styles["form"]}>
          <div className={styles["form-group"]}>
            <label className={styles["form-label"]} htmlFor="email">
              E-Mail<span className={styles["required"]}>*</span>
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={styles["form-input"]}
              placeholder="Enter e-mail"
            />
            {errors.email && (
              <span className={styles["error"]}>{errors.email}</span>
            )}
            <label className={styles["form-label"]} htmlFor="email">
              Password<span className={styles["required"]}>*</span>
            </label>
            <div className={styles["password-container"]}>
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className={styles["form-input"]}
                placeholder="Enter Password"
              />
               <button
                type="button"
                onClick={handlePasswordToggle}
                className={styles["password-toggle"]}
              > 
                {showPassword ? <IoEyeOffOutline  size={20}/> : <IoEyeOutline  size={20}/>}
              </button>
            </div>
            {errors.password && (
              <span className={styles["error"]}>{errors.password}</span>
            )}
          </div>
          {loading ? (
            <Loader />
          ) : (
            <button type="submit" className={styles["submit-button"]}>
              Login
            </button>
          )}
        </form>
      )}

      <div className={styles["login-text"]}>
        Want to create an account?{" "}
        {isComponent == true ? (
          <p className={styles["link"]} onClick={toggleToLogin}>
            Register
          </p>
        ) : (
          <Link href="/sign-up" className={styles["link"]}>
            Register
          </Link>
        )}
      </div>
      <div className={styles["login-text"]}>
      {isComponent == true ? (
          <p className={styles["link"]} onClick={toggleForgotPasswordMode}>
          </p>
        ) : (
        
          <Link href="/forgot" className={styles["link"]}>
           Forgot Password
          </Link>
        )}
      </div>
    </>
  );
};

export default LoginForm;
