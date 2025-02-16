// components/Footer.js
import Link from "next/link";
import styles from "../footer/footer.module.css";
import {
  FaFacebookF,
  FaInstagram,
  FaWhatsapp,
  FaYoutube,
} from "react-icons/fa";
import TestButton from "../testbutton/TestButton";
import { useEffect, useState } from "react";

export default function Footer() {
  const [isMobileView, setIsMobileView] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      // Check if the screen width is 1040px or smaller
      setIsMobileView(window.innerWidth <= 949);
    };

    // Add event listener on component mount
    window.addEventListener('resize', handleResize);

    // Call once to set initial state
    handleResize();

    // Cleanup event listener on component unmount
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);


  const whatsappNumber = "+918683818381"; // Replace with your WhatsApp number
  const message = "Hello, I want to book a tour";
  return (
    <footer className={styles["footer"]}>
      <div className={styles["footer-content"]}>
        <div className={styles["promo-section"]}>
          <div>
          <h2 className={styles["promo-title"]}>Want To Take Tour Packages?</h2>
          <Link href="/packages/openhourtour/uttarakhand">
            {" "}
            <button className={styles["promo-button"]}>Book A Tour</button>
         
          </Link>
          </div>
          <div className={styles["social-links"]}>
            <Link
              href="https://www.facebook.com/DevsthanExpert/"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaFacebookF className={styles["social-icon"]} />
            </Link>
            <Link
              href="https://www.instagram.com/devsthan_expert/"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaInstagram className={styles["social-icon"]} />
            </Link>
            <Link
              href="https://www.youtube.com/@DevsthanExpert"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaYoutube className={styles["social-icon"]} />
            </Link>
          </div>
          <div className={styles['app-download']}>
      <h2 className={styles['title']}>Download Our App!</h2>
      <div className={styles['buttons']}>
        <a href="https://play.google.com" target="_blank" rel="noopener noreferrer">
          <img
            src="https://cdn.shopify.com/s/files/1/0623/9010/8391/files/google-play-store-icon.jpg?v=1722921856"
            alt="Download on Google Play"
            className={styles['store-button']}
          />
        </a>
        <a href="https://www.apple.com/app-store/" target="_blank" rel="noopener noreferrer">
          <img
            src="https://cdn.shopify.com/s/files/1/0623/9010/8391/files/app-store-icon.jpg?v=1717044385"
            alt="Download on App Store"
            className={styles['store-button']}
          />
        </a>
      </div>
    </div>
        </div>
      {  isMobileView &&<div className={styles['app-download1']}>
      <h2 className={styles['title1']}>Download Our App!</h2>
      <div className={styles['buttons1']}>
        <a href="https://play.google.com" target="_blank" rel="noopener noreferrer">
          <img
            src="https://cdn.shopify.com/s/files/1/0623/9010/8391/files/google-play-store-icon.jpg?v=1722921856"
            alt="Download on Google Play"
            className={styles['store-button1']}
          />
        </a>
        <a href="https://www.apple.com/app-store/" target="_blank" rel="noopener noreferrer">
          <img
            src="https://cdn.shopify.com/s/files/1/0623/9010/8391/files/app-store-icon.jpg?v=1717044385"
            alt="Download on App Store"
            className={styles['store-button1']}
          />
        </a>
      </div>
    </div>}
        <div className={styles["footer-links"]}>
          
          <div className={styles["quick-links"]}>
            <h3>Quick Link</h3>
            <ul>
              <Link href={"/about"} className={styles["li"]}>
                <li>About Us</li>
              </Link>
              <Link href={"/destinations"} className={styles["li"]}>
                <li>Destinations</li>
              </Link>
              <Link href={"/blogs"} className={styles["li"]}>
                <li>Blogs</li>
              </Link>
              <Link href={"/cancellation-policy"} className={styles["li"]}>
                <li>Cancellation & Refund</li>
              </Link>
              <Link href={"/terms-and-conditions"} className={styles["li"]}>
                <li>Terms & Conditions</li>
              </Link>
              <Link href={"/contact"} className={styles["li"]}>
                <li>Contact Us</li>
              </Link>
            </ul>
          </div>
          <div className={styles["more-inquiry"]}>
            <h3>More Inquiry</h3>
            <p>+91 8683818381</p>
            <p>info@devsthanexpert.com </p>
            <p>
              street-7# Gayatri Vihar, Shanti Kunj Ashram Gate-4, Bhupatwala,
              Haridwar - 249401
            </p>
          </div>
          <div className={styles["about-section"]}>
            <h3>Your Trusted Travel Partner</h3>
            <p>
              From your first step to your last, we’re committed to creating
              moments you’ll cherish forever. Wherever your journey takes you,
              we’ll be here to make it extraordinary.
            </p>
          </div>
          {/* <div className={styles['payment-partner']}>
            <h3>Payment Partner</h3>
            <div className={styles['payment-icons']}>
              <span>VISA</span>
              <span>Stripe</span>
              <span>PayPal</span>
              <span>WOO</span>
              <span>Skrill</span>
            </div>
          </div> */}
        </div>
      </div>

      <div className={styles["footer-bottom"]}>
        <p>©Copyright 2024 Devsthan Expert </p>
        

        <div className={styles["footer-bottom-pages"]}>
          <Link href={"/privacy-policy"}>
            <p>Privacy Policy</p>
          </Link>{" "}
          •{" "}
          <Link href={"/terms-and-conditions"}>
            <p>Terms & Condition</p>
          </Link>
        </div>
      </div>
    </footer>
  );
}
