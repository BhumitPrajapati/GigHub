const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../config/cloudinary");

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: "listingImg", // Change folder name as needed
        params: {
            folder: "listings", // Folder name in Cloudinary
            allowed_formats: ["jpg", "jpeg", "png"],
          },
    },
});

const upload = multer({ storage });

module.exports = upload;
