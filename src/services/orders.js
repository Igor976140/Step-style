import { database } from "./firebase";
import { ref, push } from "firebase/database";

export const addOrder = (cartItems, userData) => {
  const orderData = {
    items: cartItems,
    orderDate: new Date().toISOString(),
    totalPrice: cartItems.reduce((total, item) => total + item.price * item.quantity, 0),
    user: {
      fullName: userData.fullName,
      phone: userData.phone,
      email: userData.email,
      deliveryMethod: userData.deliveryMethod,
      country: userData.country,
      district: userData.district,
      city: userData.city,
      address: userData.address,
      comment: userData.comment || '',
    },
  };

  const ordersRef = ref(database, "orders");
  return push(ordersRef, orderData);
};

export const addReview = (text, rating, userName) => {
  const reviewData = {
    text: text,
    rating: rating,
    userName: userName,
    createdAt: new Date().toISOString(),
  };

  const reviewsRef = ref(database, "reviews");
  return push(reviewsRef, reviewData);
};