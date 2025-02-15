
import '../styles/globals.css';
import "slick-carousel/slick/slick.css";
import Footer from "../components/footer/footer";
import "slick-carousel/slick/slick-theme.css";
import { Poppins } from 'next/font/google';
import Draggable  from 'react-draggable';
import Header from '../components/header/Header';
import { Toaster } from 'react-hot-toast';
import 'react-toastify/dist/ReactToastify.css';
import { FaWhatsapp } from 'react-icons/fa'; // Import WhatsApp icon from react-icons
import TestButton from '../components/testbutton/TestButton';
import { useEffect, useState } from 'react';
import { IoVideocamOutline } from "react-icons/io5";

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
  variable: '--font-poppins',
});

function MyApp({ Component, pageProps }) {
  const [windowHeight, setWindowHeight] = useState(0); // Initializing to 0 instead of null
  const [dragging, setDragging] = useState(true); 

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setWindowHeight(window.innerHeight);
    }
  }, []);
  

  

  

  // const handleMouseEnter = () => {
  //   setDragging(true);
  // };

  // // Handle mouse leave to disable dragging
  // const handleMouseLeave = () => {
  //   setDragging(false);
  // };

  const handleTouchStart = () => {
    setDragging(true);
  };

  // const handleTouchEnd = () => {
  //   setDragging(false);
  // };

  const whatsappNumber = "+918683818381"; // Replace with your WhatsApp number
  const message = "Hello, I want to book a tour"; // Customize your message

  return (
    <>
<script async src="https://www.googletagmanager.com/gtag/js?id=G-3JPZ5FGCXB"></script>
          <script
            dangerouslySetInnerHTML={{
              __html: `
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', 'G-3JPZ5FGCXB');
              `,
            }}
          ></script>
      <Toaster
        position="top-right" // You can change the position
        autoClose={5000} // Time in milliseconds to auto close
        

        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored" // Optionally choose theme
      />
      <Header />
      <Component {...pageProps} />
      <Footer />

      {/* WhatsApp Button */}
     
        <div className="quickbuttons-wrapper">
          {/* WhatsApp Button */}
          <a
            href={`https://calendly.com/devsthanexpert`}
            className="quickbuttons3"
            target="_blank"
            rel="noopener noreferrer"
            // onMouseEnter={handleMouseEnter} // Enable dragging when hovered
            // onMouseLeave={handleMouseLeave} // Disable dragging when mouse leaves
            // onTouchStart={handleTouchStart} // Enable dragging on touch start
            // onTouchEnd={handleTouchEnd} // Disable dragging on touch end
          >
            <IoVideocamOutline size={30}  />
          </a>

          <a
            href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`}
            className="quickbuttons1"
            target="_blank"
            rel="noopener noreferrer"
            // onMouseEnter={handleMouseEnter} // Enable dragging when hovered
            // onMouseLeave={handleMouseLeave} // Disable dragging when mouse leaves
            // onTouchStart={handleTouchStart} // Enable dragging on touch start
            // onTouchEnd={handleTouchEnd} // Disable dragging on touch end
          >
            <FaWhatsapp size={30} />
          </a>

          {/* TestButton */}
          <a
            className="quickbuttons2"
            // onMouseEnter={handleMouseEnter} // Enable dragging when hovered
            // onMouseLeave={handleMouseLeave} // Disable dragging when mouse leaves
            // onTouchStart={handleTouchStart} // Enable dragging on touch start
            // onTouchEnd={handleTouchEnd} // Disable dragging on touch end
          >
            <TestButton />
          </a>
        </div>
      


  


    </>
  );
}

export default MyApp;

