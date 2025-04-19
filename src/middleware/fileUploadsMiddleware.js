import multer from "multer";
import path from "path";
import fs from "fs";

// Create uploads directory if it doesn't exist
const uploadDir = "uploads/";
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true }); // Ensure recursive creation
  console.log("Created uploads directory:", uploadDir); // Log the creation
}

// Set up multer for file upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir); // Local folder for temporary storage
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(
      null,
      file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname)
    );
  },
});

// File filter for PDF files
const fileFilter = (req, file, cb) => {
  const allowedTypes = /pdf|application\/pdf/; // Include MIME type check
  const extname =
    allowedTypes.test(path.extname(file.originalname).toLowerCase()) &&
    allowedTypes.test(file.mimetype);

  if (extname) {
    return cb(null, true);
  } else {
    cb(new Error("Only PDF files are allowed!"), false);
  }
};

// Multer instance
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB file limit
});

export { upload };
