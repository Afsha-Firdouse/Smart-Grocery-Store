import express from 'express';
import { placeOrder, getUserOrders, getAllOrders, createRazorpayOrder, verifyPayment } from '../controllers/orderController.js';
import authUser from '../middlewares/authUser.js';
import authSeller from '../middlewares/authSeller.js';





const orderRouter = express.Router();

orderRouter.post('/cod',authUser, placeOrder)
orderRouter.post('/razorpay', authUser, createRazorpayOrder)
orderRouter.post('/verify', authUser, verifyPayment)
orderRouter.get('/user',authUser, getUserOrders)
orderRouter.get('/seller',authSeller, getAllOrders)


export default orderRouter;