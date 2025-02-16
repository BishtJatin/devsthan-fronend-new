import React, { useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import styles from '../../pages/package/openHour/tour.module.css';
import { apiCall } from '../../utils/common';
import Loader from '../loader/loader';

const CustomizedQuery = ({ handleClose }) => {
  const [isLoadingCustomize, setIsLoadingCustomize] = useState(false);
  const [formData, setFormData] = useState({
    destination: '', // Added destination field
    name: '',
    email: '',
    mobileNumber: '',
    query: '',
    noOfAdult: '',
    noOfChild: '',
  });

  const [isFormSubmitted, setIsFormSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoadingCustomize(true);
    try {
      const response = await apiCall({
        endpoint: `/api/customizedQuery`,
        method: 'POST',
        body: formData,
      });

      if (response.success === true) {
        toast.success('Query submitted successfully!');
        setIsFormSubmitted(true);
      } else {
        toast.error('Failed to submit the form. Please try again.');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      toast.error('An error occurred. Please try again.');
    } finally {
      setIsLoadingCustomize(false);
    }
  };

  return (
    <>
      <ToastContainer position="top-right" autoClose={3000} />
      <div className={styles["dialog-overlay"]}>
        <div className={styles['customize-dialog-right']}>
          <button
            className={styles['close-button']}
            onClick={handleClose}
            aria-label="Close dialog"
          >
            &times;
          </button>
          {!isFormSubmitted ? (
            <form className={styles['customize-dialog-form']} onSubmit={handleSubmit}>
              <h2 className={styles['customize-dialog-title']}>Where Do You Want To Go?</h2>
              <div className={styles['form-group']}>
                <input
                  type="text"
                  name="destination" // Destination field
                  value={formData.destination}
                  placeholder="Enter Destination"
                  onChange={handleChange}
                  required
                />
              </div>
              <div className={styles['form-group']}>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  placeholder="Enter your name"
                  onChange={handleChange}
                  required
                />
              </div>
              <div className={styles['form-group']}>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  placeholder="Your Email ID"
                  onChange={handleChange}
                  required
                />
              </div>
              <div className={styles['form-group']}>
                <input
                  type="text"
                  name="mobileNumber"
                  value={formData.mobileNumber}
                  placeholder="Mobile Number"
                  onChange={handleChange}
                  required
                />
              </div>
              <div className={styles['form-group']}>
                <input
                  type="text"
                  name="query"
                  value={formData.query}
                  placeholder="Place To Visit/Query"
                  onChange={handleChange}
                  required
                />
              </div>
              <div className={styles['form-group']}>
                <input
                  type="number"
                  name="noOfAdult"
                  value={formData.noOfAdult}
                  placeholder="No of Adults"
                  onChange={handleChange}
                  required
                />
              </div>
              <div className={styles['form-group']}>
                <input
                  type="number"
                  name="noOfChild"
                  value={formData.noOfChild}
                  placeholder="No of Children"
                  onChange={handleChange}
                  required
                />
              </div>
              {isLoadingCustomize ? (
                <Loader />
              ) : (
                <button type="submit" className={styles['customize-dialog-button']}>
                  Submit
                </button>
              )}
              <div className={styles['approval-section']}>
                <p>
                  Call us For Details: 86-83-81-8381 <br />
                  Whatsapp Number: 86-83-81-8381 <br />
                  info@devsthanexpert.com
                </p>
              </div>
            </form>
          ) : (
            <div className={styles['success-message']}>
              <h3>Thank you for submitting your query!</h3>
              <p>Our team will contact you shortly.</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default CustomizedQuery;
