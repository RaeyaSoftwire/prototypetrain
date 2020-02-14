export const formatPrice = price => {
  if (price) {
    const absPrice = Math.abs(price);
    const absString = `£${(absPrice / 100).toFixed(0)}.${(absPrice % 100).toFixed(0).padStart(2, '0')}`;
    return price < 0 ? `-${absString}` : absString;
  }
  return null;
};
