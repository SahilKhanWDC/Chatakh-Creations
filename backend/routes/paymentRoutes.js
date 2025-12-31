import express from "express";
import {
  createRazorpayOrder,
  verifyRazorpayPayment
} from "../controllers/paymentController.js";

// import { protect } from "../middlewares/authMiddleware.js";
import { requireAuth, adminOnly } from "../middlewares/clerkAuth.js";

const router = express.Router();

router.post("/create", requireAuth, createRazorpayOrder); 
router.post("/verify", requireAuth, verifyRazorpayPayment); 

export default router;
