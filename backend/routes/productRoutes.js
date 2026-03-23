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
  (req, res, next) => {
    upload.array("images", 8)(req, res, (err) => {
      if (err) {
        console.error("MULTER ERROR:", err);
        return res.status(400).json({ 
          message: err.message || "File upload failed" 
        });
      }
      next();
    });
  },
  (req, res) => {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: "No files uploaded" });
    }
    
    const imageUrls = req.files.map(file => file.path);
    
    res.json({
      imageUrls: imageUrls,
    });
  }
);
router.get("/", getProducts);
router.get("/:id", getProductById);

router.post("/", requireAuth, adminOnly, createProduct);
router.put("/:id", requireAuth, adminOnly, updateProduct);
router.delete("/:id", requireAuth, adminOnly, deleteProduct);

export default router;
