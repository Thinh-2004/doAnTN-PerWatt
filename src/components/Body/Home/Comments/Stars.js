import "./StarsStyle.css";
import { useState, useEffect } from "react";

const DEFAULT_COUNT = 5;
const DEFAULT_ICON = "★";
const DEFAULT_UNSELECTED_COLOR = "grey";
const DEFAULT_COLOR = "yellow";

export default function Stars({
  count,
  defaultRating,
  icon,
  color,
  iconSize,
  onRatingChange,
  readOnly = false,
}) {
  const [rating, setRating] = useState(defaultRating);
  useEffect(() => {
    setRating(defaultRating); // Cập nhật khi defaultRating thay đổi
  }, [defaultRating]);
  const [temporaryRating, setTemporaryRating] = useState(0);

  let stars = Array(count || DEFAULT_COUNT).fill(icon || DEFAULT_ICON);

  const handleClick = (rating) => {
    setRating(rating);

    if (onRatingChange) {
      onRatingChange(rating);
    }
  };

  return (
    <div className="starsContainer">
      {stars.map((item, index) => {
        const isActiveColor =
          (rating || temporaryRating) &&
          (index < rating || index < temporaryRating);

        let elementColor = "";

        if (isActiveColor) {
          elementColor = color || DEFAULT_COLOR;
        } else {
          elementColor = DEFAULT_UNSELECTED_COLOR;
        }

        return (
          <div
            className={`star ${!readOnly ? "star-hover" : ""}`}
            key={index}
            style={{
              fontSize: iconSize ? `${iconSize}px` : "14px",
              color: elementColor,
              filter: `${isActiveColor ? "grayscale(0%)" : "grayscale(100%)"}`,
              cursor: readOnly ? "default" : "pointer",
            }}
            onMouseEnter={() => !readOnly && setTemporaryRating(index + 1)}
            onMouseLeave={() => !readOnly && setTemporaryRating(0)}
            onClick={() => !readOnly && handleClick(index + 1)}
          >
            {icon ? icon : DEFAULT_ICON}
          </div>
        );
      })}
    </div>
  );
}
