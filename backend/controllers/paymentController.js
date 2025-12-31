import razorpay from "../config/razorpay.js";
import crypto from "crypto";
import { getAuth } from "@clerk/express";
import Order from "../models/Order.js";

export const createRazorpayOrder = async (req, res) => {
  const { amount } = req.body;

  const order = await razorpay.orders.create({
    amount: amount * 100,
    currency: "INR"
  });

  res.json(order);
};


export const verifyRazorpayPayment = async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      cart,
      totalAmount,
      paymentMethod
    } = req.body;

    console.log("VERIFY REQUEST:", { razorpay_order_id, cart, totalAmount, paymentMethod });

    if (
      !razorpay_order_id ||
      !razorpay_payment_id ||
      !razorpay_signature
    ) {
      return res.status(400).json({ success: false, message: "Missing payment data" });
    }

    if (!Array.isArray(cart) || cart.length === 0) {
      return res.status(400).json({ success: false, message: "Cart is empty" });
    }

    const sign = razorpay_order_id + "|" + razorpay_payment_id;

    const expectedSign = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(sign)
      .digest("hex");

    if (expectedSign !== razorpay_signature) {
      return res.status(400).json({ success: false, message: "Invalid signature" });
    }

    const { userId } = getAuth(req);
    
    console.log("AUTH EXTRACTED userId:", userId);
    
    if (!userId) {
      return res.status(401).json({ success: false, message: "Not authenticated" });
    }

    const order = await Order.create({
      userId,
      items: cart.map(item => ({
        productId: item._id,
        name: item.name,
        price: item.price,
        quantity: item.qty || 1,
        size: item.size,
      })),
      totalAmount,
      paymentInfo: {
        razorpay_order_id,
        razorpay_payment_id,
        paymentMethod: paymentMethod || "Unknown"
      },
      paymentStatus: "Paid",
      orderStatus: "Placed",
      shippingAddress: req.body.shippingAddress,
    });

    console.log("ORDER CREATED:", order);

    res.json({ success: true, order });
  } catch (error) {
    console.error("VERIFY ERROR:", error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};

