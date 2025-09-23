import { JSX } from "react";
import { IoStar, IoStarHalf, IoStarOutline } from "react-icons/io5";

export function getStar(index: number, rating: number, size: number): JSX.Element {
  const starClass = `#FACC15`;

  if (index <= Math.floor(rating)) {
    return <IoStar style={{ fontSize : size, color: starClass}} />;
  } else if (index === Math.floor(rating) + 1 && rating % 1 >= 0.5) {
    return <IoStarHalf style={{ fontSize : size, color: starClass}} />;
  } else {
    return <IoStarOutline style={{ fontSize : size, color: starClass}} />;
  }
}