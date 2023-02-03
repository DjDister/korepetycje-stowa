import React, { useState } from "react";
import styles from "./StarsRating.module.css";
export default function StarsRating({
  handleDataFromChild,
  value = 0,
}: {
  handleDataFromChild?: (data: number) => void;
  value?: number;
}) {
  const [rating, setRating] = useState(value || 0);
  const [hover, setHover] = useState(0);
  const handleClick = (index: number) => {
    setRating(index);
    if (handleDataFromChild) handleDataFromChild(index);
  };
  return (
    <div>
      {[...Array(5)].map((star, index) => {
        index += 1;
        return (
          <button
            type="button"
            key={index}
            className={index <= (hover || rating) ? styles.on : styles.off}
            onClick={() => handleClick(index)}
            onMouseEnter={() => setHover(index)}
            onMouseLeave={() => setHover(rating)}
          >
            <span>&#9733;</span>
          </button>
        );
      })}
    </div>
  );
}
