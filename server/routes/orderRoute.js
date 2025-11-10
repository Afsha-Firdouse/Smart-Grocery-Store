import express from 'express';
import {
  placeOrder,
  getUserOrders,
  getAllOrders,
  createRazorpayOrder,
  verifyPayment,
} from '../controllers/orderController.js';
import authUser from '../middlewares/authUser.js';
import authSeller from '../middlewares/authSeller.js';

const orderRouter = express.Router();

// User routes
orderRouter.post('/cod', authUser, placeOrder);
orderRouter.post('/razorpay', authUser, createRazorpayOrder);
orderRouter.post('/verify', authUser, verifyPayment);
orderRouter.get('/user', authUser, getUserOrders);

// Seller/admin route
orderRouter.get('/seller', authSeller, getAllOrders);

export default orderRouter;
