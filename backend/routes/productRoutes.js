import express from "express";
import {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct
} from "../controllers/productController.js";

// import { protect, adminOnly } from "../middlewares/authMiddleware.js";
import { requireAuth, adminOnly } from "../middlewares/clerkAuth.js";
import upload from "../middlewares/uploadMiddleware.js";

const router = express.Router();

router.post(
  "/upload",
  requireAuth,
  adminOnly,
  upload.array("images", 8),
  (req, res) => {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: "No files uploaded" });
    }
    
    const imageUrls = req.files.map(file => `/uploads/${file.filename}`);
    
    res.json({
      imageUrls: imageUrls,
    });
  },
  (err, req, res, next) => {
    // Error handler for multer
    if (err) {
      return res.status(400).json({ message: err.message });
    }
    next();
  }
);
router.get("/", getProducts);
router.get("/:id", getProductById);

router.post("/", requireAuth, adminOnly, createProduct);
router.put("/:id", requireAuth, adminOnly, updateProduct);
router.delete("/:id", requireAuth, adminOnly, deleteProduct);

export default router;
