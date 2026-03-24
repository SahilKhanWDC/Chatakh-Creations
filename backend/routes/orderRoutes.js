import express from "express";
import {
  createOrder,
  getOrders,
  getMyOrders,
  updateOrderStatus,
  cancelOrder,
  requestReturn,
  approveReturn,
  rejectReturn,
  deleteOrder,
} from "../controllers/orderController.js";

import { requireAuth, adminOnly } from "../middlewares/clerkAuth.js";

const router = express.Router();

// Create order
router.post("/", requireAuth, createOrder);

// Get logged-in user's orders
router.get("/my-orders", requireAuth, getMyOrders);


// Get all orders
router.get("/", requireAuth, adminOnly, getOrders);

// Delete an order (admin only)
router.delete("/:id", requireAuth, adminOnly, deleteOrder);

// Update order status
router.put("/:id/status", requireAuth, adminOnly, updateOrderStatus);

// Cancel order (user can cancel their own Placed orders)
router.put("/:orderId/cancel", requireAuth, cancelOrder);

// Request return (user can request return for their Delivered orders)
router.put("/:orderId/return-request", requireAuth, requestReturn);

// Approve return (admin only)
router.put("/:orderId/approve-return", requireAuth, adminOnly, approveReturn);

// Reject return (admin only)
router.put("/:orderId/reject-return", requireAuth, adminOnly, rejectReturn);

export default router;
