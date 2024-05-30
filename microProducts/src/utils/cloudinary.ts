// Require the cloudinary library
import { v2 as cloudinary } from "cloudinary";

// Return "https" URLs by setting secure: true
cloudinary.config({
	secure: true,
	api_key: process.env.API_KEY_CLOUDINAY,
	api_secret: process.env.API_SECRET_CLOUDINAY,
});

// Log the configuration
console.log(cloudinary.config());
