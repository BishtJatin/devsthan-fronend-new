
import React, { useState, useEffect, use } from 'react';
import { FaUser, FaMapMarkerAlt, FaHeart, FaSignOutAlt } from 'react-icons/fa';
import styles from './profile.module.css';
import { apiCall } from '../../utils/common';
import Modal from 'react-modal';

import { useRouter } from 'next/router';
import { toast } from 'react-hot-toast';
import { IoCallOutline } from "react-icons/io5";
import { MdOutlineMail } from "react-icons/md";
import { FaFacebookF, FaInstagram, FaYoutube } from 'react-icons/fa';
import Link from 'next/link';
const Profile = () => {
  const router = useRouter();
  const [selected, setSelected] = useState('My Profile');
  const [bookedTour, setBookedTour] = useState();
  const [userData, setUserData] = useState(null); // State to store fetched user data
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(null); // Error state

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({

    name: '',
    address: '',
    state: '',
    city: '',
    phone: '',
  });

  const handleUpdateProfile = async (e) => {
  e.preventDefault();

    try {
        const response = await apiCall({
        endpoint: '/api/updateUser',
        method: 'POST',
        body: formData,
      }

      );
      if (response.success) {
        toast.success('Profile updated successfully!');
        setIsModalOpen(false);
       
      }


    } catch (err) {
      toast.error('Failed to update profile.');
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleLogout = () => {
    // Remove both userId and token from localStorage
    localStorage.removeItem('userId');
    localStorage.removeItem('token');
    window.location.href = '/';
    toast.success("You are logged out")
  };
  const menuItems = [
    { name: 'My Profile', icon: <FaUser /> },
    { name: 'My Booked Tours', icon: <FaMapMarkerAlt /> },
    // { name: 'Wishlist', icon: <FaHeart /> },
    { name: 'Logout', icon: <FaSignOutAlt /> },
  ];
  const handleCancelTour = async (orderId) => {
    const isConfirmed = window.confirm('Are you sure you want to cancel this tour?');
  
    if (!isConfirmed) {
      return; // Exit if user cancels the confirmation
    }
  
    // Optimistically update the UI
    const updatedTours = bookedTour.map((tour) =>
      tour._id === orderId ? { ...tour, cancelStatus: true } : tour
    );
    setBookedTour(updatedTours); // Update state immediately
  
    try {
      const response = await apiCall({
        endpoint: `/api/cancelBooking/${orderId}`,
        method: 'POST',
        body: { cancelStatus: true },
      });
  
      if (response.success) {
        toast.success('Tour cancelled successfully');
      } else {
        toast.error('Failed to cancel the tour. Please try again.');
        // Revert the optimistic update if API fails
        const revertedTours = bookedTour.map((tour) =>
          tour._id === orderId ? { ...tour, cancelStatus: false } : tour
        );
        setBookedTour(revertedTours);
      }
    } catch (error) {
      console.error('Error cancelling tour:', error);
      toast.error('An error occurred. Please try again later.');
  
      // Revert the optimistic update in case of an error
      const revertedTours = bookedTour.map((tour) =>
        tour._id === orderId ? { ...tour, cancelStatus: false } : tour
      );
      setBookedTour(revertedTours);
    }
  };
  


  useEffect(() => {
    const fetchUserData = async () => {
      const userId = localStorage.getItem('userId'); // Retrieve userId from localStorage

      if (userId) {
        try {
          const response = await apiCall({
            endpoint: '/api/getUser',
            method: 'POST',
            body: { userId }, // Sending userId as part of the request body
          });
          const order = await apiCall({
            endpoint: `/api/getBookedToursbyUser/${userId}`,
            method: 'POST',


          });


          setBookedTour(order.bookedTours)
          setUserData(response); // Assuming response has a 'data' field
          setLoading(false); // Set loading to false once data is fetched
          setFormData({
            _id: response._id,
            name: response.name,
            email: response.email,

            phone: response.phone,
            address: response.address,

            city: response.city,
            state: response.state,

            postalCode: response.postalCode,



          });

        } catch (err) {
          setError(err.message); // Set error state
          setLoading(false);
        }
      } else {
        setError('User not logged in');
        setLoading(false);
      }
    };

    fetchUserData(); // Call the async function
  }, [isModalOpen]);

  return (
    <>
      <h1 style={{ textAlign: "center", marginTop: "30px" }}>My Account</h1>
      <div className={styles.container}>
        <aside className={styles.sidebar}>
          <ul className={styles.menuList}>
            {menuItems.map((item) => (
              <li
                key={item.name}
                className={
                  selected === item.name
                    ? `${styles.menuItem} ${styles.active}`
                    : styles.menuItem
                }
                onClick={() => setSelected(item.name)}
              >
                <span className={styles.icon}>{item.icon}</span>
                {item.name}
              </li>
            ))}
          </ul>
        </aside>
        <main className={styles.mainContent}>
          {loading && <p>Loading...</p>}
          {error && <p>Error: {error}</p>}


{selected === 'My Profile' && userData && (
  <div className={styles.profileCard}>
    {/* <div className={styles.avatar}></div> */}
    <div className={styles.userInfo}>
      <h2 className={styles.userName}>
        {userData.name} <span className={styles.verifiedIcon}>✔️</span>
      </h2>
      <p className={styles.userDetail}>
        <strong>Email:</strong> {userData.email}
      </p>
      {userData.phone && (
        <p className={styles.userDetail}>
          <strong>Mobile:</strong> {userData.phone}
        </p>
      )}
      {userData.address && (
        <p className={styles.userDetail}>
          <strong>Address:</strong> {userData.address}
        </p>
      )}
      {userData.city && (
        <p className={styles.userDetail}>
          <strong>City:</strong> {userData.city}
        </p>
      )}
      {userData.state && (
        <p className={styles.userDetail}>
          <strong>State:</strong> {userData.state}
        </p>
      )}
      {userData.postalCode && (
        <p className={styles.userDetail}>
          <strong>Postal Code:</strong> {userData.postalCode}
        </p>
      )}
    </div>
    <button className={styles.editButton} onClick={() => setIsModalOpen(true)}>Edit Profile</button>
  </div>
)}

          <Modal
            isOpen={isModalOpen}
            onRequestClose={() => setIsModalOpen(false)}
            className={styles.modal}
            overlayClassName={styles.overlay}
          >
            <h2 className={styles.header}>Edit Profile</h2>
            <form onSubmit={handleUpdateProfile}>
              <input
                type="text"
                name="name"
                value={formData.name}
                placeholder="Name"
                onChange={handleInputChange}
                className={styles.input}
                required
              />
              <input
                type="text"
                name="address"
                value={formData.address}
                placeholder="Address"
                onChange={handleInputChange}
                className={styles.input}
                required
              />
              <input
                type="text"
                name="city"
                value={formData.city}
                placeholder="City"
                onChange={handleInputChange}
                className={styles.input}
                required
              />
              <input
                type="text"
                name="state"
                value={formData.state}
                placeholder="State"
                onChange={handleInputChange}
                className={styles.input}
                required
              />
              <input
                type="number"
                name="postalCode"
                value={formData.postalCode}
                placeholder="Postal Code"
                onChange={handleInputChange}
                className={styles.input}
                required
              />
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                placeholder="Phone"
                onChange={handleInputChange}
                className={styles.input}
                pattern="^\+?[1-9]\d{1,14}$"  // International phone number validation
                required
              />
              <button
                type="submit"
                className={`${styles.button} ${styles.buttonSave}`}
              >
                Save Changes
              </button>
              <button
                type="button"
                className={`${styles.button} ${styles.buttonCancel}`}
                onClick={() => setIsModalOpen(false)}
              >
                Cancel
              </button>
            </form>
          </Modal>



         

          {selected === 'My Booked Tours' && (
            <div className={styles.bookedTours}>
              <h3>Your Booked Tours</h3>
              <ul>
                {bookedTour && bookedTour.length > 0 ? (
                  bookedTour.map((tour, index) => (
                    <li key={tour._id} className={styles.tourItem}>
                      <span className={styles.tourTitle}>Tour {index + 1}</span> - Date: {new Date(tour.createdAt).toLocaleDateString()}<br />
                      <span className={styles.tourDetail}>Address:</span> {tour.address}<br />
                      <span className={styles.tourDetail}>Category:</span> {tour.category}<br />
                      <span className={styles.tourDetail}>Total Price:</span> Rs {tour.totalPrice}<br />
                      <span className={styles.tourDetail}>Status:</span> {tour.status}<br />
                      <button
                        className={styles.cancelButton}
                        onClick={() => handleCancelTour(tour._id)}

                        disabled={tour.cancelStatus === true}

                      >
                        {tour.cancelStatus === true ? 'Cancelled' : 'Cancel Tour'}
                      </button>
                    </li>
                  ))
                ) : (
                  <li className={styles.noTours}>No tours booked yet.</li>
                )}
              </ul>
            </div>
          )}

          {selected === 'Wishlist' && (
            <div className={styles.wishlist}>
              <h3>Your Wishlist</h3>
              <ul>
                <li>Tour to Paris</li>
                <li>Tour to Tokyo</li>
                <li>Tour to New York</li>
              </ul>
            </div>
          )}

          {selected === 'Logout' && (
            <div className={`${styles.logout} ${selected === 'Logout' ? styles.visible : ''}`}>
              <h3>Are you sure you want to log out?</h3>
              <button className={styles.logoutButton} onClick={handleLogout}>
                Log Out
              </button>
            </div>
          )}
        </main>

      </div>
      <div className={styles["contact-container"]}>
        <div className={styles["header"]}>
          <span>Have Queries and Concerns?</span>
          <Link href='/contact'>


            <button className={styles["contact-button"]}>CONTACT US</button>
          </Link>

        </div>
        <div className={styles["content"]}>
          <div className={styles["form-group"]}>
            <h3>Contact Details</h3>
            <div className={styles["form-group-inner"]}>

              <div>

                <p className={styles["icons-outer"]} >
                  <span className={styles["icon"]}>

                    <IoCallOutline />
                  </span>
                  Phone: +91 8683818381 <br />
                  24/7 Available
                </p>
                <p className={styles["icons-outer"]}>
                  <span className={styles["icon"]}>
                    <MdOutlineMail />

                  </span>
                  Email: info@devsthanexpert.com
                </p>
              </div>
              <div className={styles["social-group"]}>

                <h3>Follow Us On Social Networks</h3>
                <div className={styles["social-icons"]}>
                  <div className={styles['social-links']}>
                    <Link href="https://www.facebook.com/DevsthanExpert/" target="_blank" rel="noopener noreferrer">
                      <FaFacebookF className={styles['social-icon']} />
                    </Link>
                    <Link href="https://www.instagram.com/devsthan_expert/" target="_blank" rel="noopener noreferrer">
                      <FaInstagram className={styles['social-icon']} />
                    </Link>
                    <Link href="https://www.youtube.com/@DevsthanExpert" target="_blank" rel="noopener noreferrer">
                      <FaYoutube className={styles['social-icon']} />
                    </Link>
                  </div>

                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </>
  );
};

export default Profile;
