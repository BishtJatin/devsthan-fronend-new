
import React from 'react'
import { FaPhoneAlt } from "react-icons/fa";

const TestButton = () => {


    const handleClick = () => {
        window.location.href = 'tel:86-8381-8381';
    };

    


  return (
    <div>
      <div
       onClick={handleClick}
       >
      <FaPhoneAlt />
      </div>
    </div>
  )
}

export default TestButton