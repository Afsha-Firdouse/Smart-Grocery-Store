import Order from '../models/order.js';
import Product from '../models/Product.js'; // ✅ fixed import path
import razorpay from '../configs/razorpay.js';
import crypto from 'crypto';

// Place Order COD: /api/order/cod
export const placeOrder = async (req, res) => {
  try {
    const { userId, items, address } = req.body;
    if (!address || items.length === 0) {
      return res.json({ success: false, message: 'Invalid data' });
    }

    // Calculate Amount Using Items
    let amount = 0;
    for (const item of items) {
      const product = await Product.findById(item.product);
      amount += product.offerPrice * item.quantity;
    }

    // Add Tax Charge (2%)
    amount += Math.floor(amount * 0.02);

    await Order.create({
      userId,
      items,
      amount,
      address,
      paymentType: 'COD',
    });

    return res.json({ success: true, message: 'Order Placed Successfully' });
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
};

// Get Orders by User Id: /api/order/user
export const getUserOrders = async (req, res) => {
  try {
    const userId = req.user.userId;
    const orders = await Order.find({
      userId,
      $or: [{ paymentType: 'COD' }, { isPaid: true }],
    })
      .populate('items.product address')
      .sort({ createdAt: -1 });

    return res.json({ success: true, orders });
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
};

// Get All Orders (for seller/admin): /api/order/seller
export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find({
      $or: [{ paymentType: 'COD' }, { isPaid: true }],
    }).populate('items.product address');

    return res.json({ success: true, orders });
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
};

// Create Razorpay Order: /api/order/razorpay
export const createRazorpayOrder = async (req, res) => {
  try {
    const { userId, items, address } = req.body;
    if (!address || items.length === 0) {
      return res.json({ success: false, message: 'Invalid data' });
    }

    // Calculate Amount Using Items
    let amount = 0;
    for (const item of items) {
      const product = await Product.findById(item.product);
      amount += product.offerPrice * item.quantity;
    }

    // Add Tax Charge (2%)
    amount += Math.floor(amount * 0.02);

    // Create Razorpay order
    const options = {
      amount: amount * 100, // Razorpay expects amount in paisa
      currency: 'INR',
      receipt: `receipt_${Date.now()}`,
    };

    const order = await razorpay.orders.create(options);

    // Save order in database with razorpay_order_id
    const dbOrder = await Order.create({
      userId,
      items,
      amount,
      address,
      paymentType: 'Online',
      razorpayOrderId: order.id,
      isPaid: false,
    });

    return res.json({
      success: true,
      order: {
        id: order.id,
        amount: order.amount,
        currency: order.currency,
        dbOrderId: dbOrder._id
      }
    });
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
};

// Verify Razorpay Payment: /api/order/verify
export const verifyPayment = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, orderId } = req.body;

    // Verify signature
    const sign = razorpay_order_id + '|' + razorpay_payment_id;
    const expectedSign = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(sign.toString())
      .digest('hex');

    if (razorpay_signature === expectedSign) {
      // Payment verified, update order status
      await Order.findByIdAndUpdate(orderId, {
        isPaid: true,
        razorpayPaymentId: razorpay_payment_id,
        status: 'Payment Completed'
      });

      return res.json({ success: true, message: 'Payment verified successfully' });
    } else {
      return res.json({ success: false, message: 'Payment verification failed' });
    }
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
};
