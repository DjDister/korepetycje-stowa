import { Rating } from "../types";

const calculateRating = (ratings: Rating[] | undefined) => {
  if (ratings?.length === 0 || !ratings) return 0;
  const total = ratings.reduce((acc, curr) => acc + curr.rating, 0);
  return total / ratings.length;
};

export default calculateRating;
