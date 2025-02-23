import React, { useState } from 'react';
import styles from './mobileMenue.module.css';
import { FaRegUser, FaArrowRight } from "react-icons/fa6";

import Link from 'next/link';
import CustomizedQuery from '../tourPageComponents/customizedQuery';

const MobileMenu = ({ isOpen, toggleMenu, isLoggedIn }) => {
     const [isQueryFormVisible, setIsQueryFormVisible] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const toggleQueryForm = () => {
        setIsQueryFormVisible(!isQueryFormVisible);
      };

    const toggle = () => {
      setIsMenuOpen((prev) => !prev);
    };
    return (
        <div className={`${styles['mobile-menu']} ${isOpen ? styles['open'] : ''}`}>
            <div className={styles['menu-header']}>
                <div className={styles['logo-container']}>

                    <Link href="/">
                        <img src='https://res.cloudinary.com/dmyzudtut/image/upload/v1731261401/Untitled_design_11_dlpmou.jpg' alt="TripRex" className={styles['logo']} />
                    </Link>
                </div>
                <span onClick={toggleMenu} className={styles['close-button']}>×</span>
            </div>
            <ul className={styles['menu-list']}>

            <li onClick={toggle}>
            Tours
        </li>
        {isMenuOpen && (
          <div className={styles["tour-buttons"]}>
            <li onClick={toggleMenu} className={styles["tour-button"]}>
              <Link href="/packages/openhourtour/uttarakhand">Open Hour Tour  <FaArrowRight className={styles["arrow-icon"]} /></Link>
            </li>
            <li onClick={toggleMenu} className={styles["tour-button"]}>
              <Link href="/packages/fixedtour/uttarakhand">Fixed Tour  <FaArrowRight className={styles["arrow-icon"]} /></Link>
            </li>
          </div>)}
                <li onClick={toggleMenu}>
                    <Link href="/about">
                        About <FaArrowRight className={styles['arrow-icon']} />
                    </Link>

                </li>

                <li onClick={toggleMenu}>
                    <Link href="/destinations">
                        Destination <FaArrowRight className={styles['arrow-icon']} />
                    </Link>
                </li>
                <li onClick={toggleMenu}>
                    <Link href={`/blogs`}>
                        Blogs <FaArrowRight className={styles['arrow-icon']} />
                    </Link>
                </li>
                <li onClick={toggleMenu}>
                    <Link href="/contact">
                        Contact Us <FaArrowRight className={styles['arrow-icon']} />
                    </Link>
                </li>
                <li onClick={toggleMenu}>
                    {isLoggedIn ? (
                        <Link href="/profile">
                            <p className={styles['profile-link']}>
                                <FaRegUser className={styles['profile-icon']} /> Profile <FaArrowRight className={styles['arrow-icon']} />
                            </p>
                        </Link>
                    ) : (
                        <div className={styles['auth-links-mobile']}>
                            <Link className={styles['login-link']} href="/login">
                                <p>Login</p> 
                            </Link>
                            <span>/</span>
                            <Link className={styles['login-link']} href="/sign-up">
                                <p>Sign up</p>
                            </Link>
                        </div>
                    )}
                   
                </li>
            <button className={styles["customized-query-button"]} onClick={toggleQueryForm}>
            Customize Tour
          </button>
            </ul>

            {isQueryFormVisible && (
        <CustomizedQuery handleClose={toggleQueryForm} />
      )}

            <div className={styles['menu-footer']}>
                <div className={styles['contact-info']}>
                    <FaRegUser className={styles['contact-icon']} />
                    <a href="tel:+990737621432">+91 86-8381-8381</a>
                </div>
            </div>
        </div>
    );
};

export default MobileMenu;
