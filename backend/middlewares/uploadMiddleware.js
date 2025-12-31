import multer from "multer";
import path from "path";

const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, "uploads/");
  },
  filename(req, file, cb) {
    cb(
      null,
      `${Date.now()}-${file.originalname.replace(/\s+/g, "-")}`
    );
  },
});

const fileFilter = (req, file, cb) => {
  // Allowed MIME types
  const allowedMimes = ["image/jpeg", "image/png", "image/webp"];
  
  // Allowed extensions
  const allowedExts = [".jpg", ".jpeg", ".png", ".webp"];
  
  const ext = path.extname(file.originalname).toLowerCase();
  const mime = file.mimetype.toLowerCase();
  
  // Check both MIME type and extension
  if (allowedMimes.includes(mime) && allowedExts.includes(ext)) {
    cb(null, true);
  } else {
    cb(new Error("Only JPG, JPEG, PNG, and WebP images are allowed"), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit per file
  },
});

export default upload;
