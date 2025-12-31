import Order from "../models/Order.js";
import { getAuth } from "@clerk/express";

export const createOrder = async (req, res) => {
  try {
    const { userId } = getAuth(req);
    
    if (!userId) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    const order = await Order.create({
      ...req.body,
      userId
    });

    res.status(201).json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getOrders = async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getMyOrders = async (req, res) => {
  try {
    const { userId } = getAuth(req);
    
    // console.log("GET MY ORDERS - userId:", userId);
    
    if (!userId) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    const orders = await Order.find({ userId })
      .sort({ createdAt: -1 });

    console.log("ORDERS FOUND:", orders.length, orders);

    res.json(orders);
  } catch (error) {
    console.error("GET MY ORDERS ERROR:", error.message);
    res.status(500).json({ message: error.message });
  }
};

export const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;

    if (!["Placed", "Shipped", "Delivered"].includes(status)) {
      return res.status(400).json({ message: "Invalid order status" });
    }

    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { orderStatus: status },
      { new: true }
    );

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const cancelOrder = async (req, res) => {
  try {
    const { userId } = getAuth(req);
    const { orderId } = req.params;

    if (!userId) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // Only user who created the order can cancel it
    if (order.userId !== userId) {
      return res.status(403).json({ message: "Not authorized" });
    }

    // Can only cancel if order is in "Placed" status (not shipped or delivered)
    if (order.orderStatus !== "Placed") {
      return res.status(400).json({ message: "Cannot cancel order that has already been shipped or delivered" });
    }

    // Mark as Cancelled
    order.orderStatus = "Cancelled";
    await order.save();

    console.log("ORDER CANCELLED:", orderId, "by user:", userId);

    res.json({ message: "Order cancelled successfully", order });
  } catch (error) {
    console.error("CANCEL ORDER ERROR:", error.message);
    res.status(500).json({ message: error.message });
  }
};

export const requestReturn = async (req, res) => {
  try {
    const { userId } = getAuth(req);
    const { orderId } = req.params;
    const { reason, description } = req.body;

    console.log("REQUEST RETURN - userId:", userId);
    console.log("REQUEST RETURN - orderId:", orderId);
    console.log("REQUEST RETURN - reason:", reason);
    console.log("REQUEST RETURN - description:", description);

    if (!userId) {
      console.log("NOT AUTHENTICATED");
      return res.status(401).json({ message: "Not authenticated" });
    }

    if (!reason || !description) {
      console.log("MISSING FIELDS");
      return res.status(400).json({ message: "Reason and description are required" });
    }

    console.log("LOOKING FOR ORDER:", orderId);
    const order = await Order.findById(orderId);
    console.log("FOUND ORDER:", order ? "YES" : "NO");

    if (!order) {
      console.log("ORDER NOT FOUND in DB");
      return res.status(404).json({ message: "Order not found" });
    }

    // Only user who created the order can request return
    if (order.userId !== userId) {
      return res.status(403).json({ message: "Not authorized" });
    }

    // Can only request return if order is Delivered
    if (order.orderStatus !== "Delivered") {
      return res.status(400).json({ message: "Return can only be requested for delivered orders" });
    }

    // Check if already has a return request
    if (order.returnRequest && order.returnRequest.status !== "None") {
      return res.status(400).json({ message: "Return request already exists for this order" });
    }

    // Create return request
    order.returnRequest = {
      status: "Requested",
      reason,
      description,
      requestedAt: new Date(),
      refundAmount: order.totalAmount,
      refundStatus: "Pending"
    };

    await order.save();

    console.log("RETURN REQUESTED:", orderId, "by user:", userId);

    res.json({ message: "Return request submitted successfully", order });
  } catch (error) {
    console.error("RETURN REQUEST ERROR:", error.message);
    res.status(500).json({ message: error.message });
  }
};

export const approveReturn = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { refundStatus } = req.body;

    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    if (!order.returnRequest || order.returnRequest.status !== "Requested") {
      return res.status(400).json({ message: "No pending return request" });
    }

    order.returnRequest.status = "Approved";
    order.returnRequest.approvedAt = new Date();
    
    if (refundStatus) {
      order.returnRequest.refundStatus = refundStatus;
    }

    await order.save();

    res.json({ message: "Return request approved", order });
  } catch (error) {
    console.error("APPROVE RETURN ERROR:", error.message);
    res.status(500).json({ message: error.message });
  }
};

export const rejectReturn = async (req, res) => {
  try {
    const { orderId } = req.params;

    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    if (!order.returnRequest || order.returnRequest.status !== "Requested") {
      return res.status(400).json({ message: "No pending return request" });
    }

    order.returnRequest.status = "Rejected";
    order.returnRequest.refundStatus = "Failed";

    await order.save();

    console.log("RETURN REJECTED:", orderId);

    res.json({ message: "Return request rejected", order });
  } catch (error) {
    console.error("REJECT RETURN ERROR:", error.message);
    res.status(500).json({ message: error.message });
  }
};


