const express = require("express");
const multer = require("multer");
const cors = require("cors");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Directory to store uploaded files
const UPLOAD_DIR = path.join(__dirname, "uploads");
if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR); // Create the uploads folder if it doesn't exist
}

// Multer configuration for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, UPLOAD_DIR); // Ensure this points to the correct uploads directory
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`); // Save files with a timestamp
  },
});
const upload = multer({ storage });

// In-memory file metadata storage
let filesMetadata = [];

// Function to rebuild metadata from the uploads folder
const rebuildMetadata = () => {
  const files = fs.readdirSync(UPLOAD_DIR); // Read all files in the uploads folder
  filesMetadata = files.map((file) => {
    const filePath = path.join(UPLOAD_DIR, file);
    const stats = fs.statSync(filePath); // Get file stats

    return {
      id: file, // Use the file name as a unique ID
      name: file,
      size: stats.size,
      type: path.extname(file), // Get the file extension as the type
      path: filePath,
      lastModified: stats.mtimeMs, // Use the last modified time
    };
  });

  console.log("Rebuilt metadata from uploads folder:", filesMetadata);
};

// Rebuild metadata on server startup
rebuildMetadata();

const METADATA_FILE = path.join(UPLOAD_DIR, "metadata.json");

// Load metadata from file
const loadMetadata = () => {
  if (fs.existsSync(METADATA_FILE)) {
    filesMetadata = JSON.parse(fs.readFileSync(METADATA_FILE, "utf-8"));
  } else {
    filesMetadata = [];
  }
};

// Save metadata to file
const saveMetadata = () => {
  fs.writeFileSync(METADATA_FILE, JSON.stringify(filesMetadata, null, 2));
};

// On server start
loadMetadata();

// API to upload files
app.post("/upload", upload.array("files"), (req, res) => {
  const projectId = req.body.projectId; // Get projectId from form data
  if (!req.files || req.files.length === 0) {
    return res.status(400).json({ message: "No files uploaded" });
  }

  const uploadedFiles = req.files.map((file) => ({
    id: file.filename,
    name: file.originalname,
    size: file.size,
    type: file.mimetype,
    url: `http://localhost:5000/uploads/${file.filename}`,
    lastModified: Date.now(),
    projectId, // Associate file with projectId
  }));

  // After uploading files
  filesMetadata = [...filesMetadata, ...uploadedFiles];
  saveMetadata();

  res.status(200).json({ message: "Files uploaded successfully", files: uploadedFiles });
});

// API to fetch uploaded files
app.get("/files", (req, res) => {
  const { projectId } = req.query;
  if (projectId) {
    const filtered = filesMetadata.filter(f => f.projectId === projectId);
    return res.status(200).json(filtered);
  }
  res.status(200).json(filesMetadata);
});

// API to delete a file
app.delete("/files/:id", (req, res) => {
  const fileId = req.params.id;
  const fileIndex = filesMetadata.findIndex((file) => file.id === fileId);

  if (fileIndex !== -1) {
    const [file] = filesMetadata.splice(fileIndex, 1);
    fs.unlinkSync(file.path); // Delete the file from the filesystem

    // After deleting a file
    filesMetadata.splice(fileIndex, 1);
    saveMetadata();

    res.status(200).json({ message: "File deleted successfully" });
  } else {
    res.status(404).json({ message: "File not found" });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});