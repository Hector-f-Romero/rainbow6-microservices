import { Router } from "express";
import multer from "multer";

import {
	createProductController,
	deleteProductByIdController,
	getProductByIdController,
	getProductsAvailableController,
	getProductsController,
	updateProductController,
} from "../controllers/products.controller.js";

// Configure file uploads
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const productRouter = Router();

productRouter.get("/", getProductsController);
productRouter.get("/available/:username", getProductsAvailableController);
productRouter.get("/:id", getProductByIdController);
productRouter.post("/", upload.single("image"), createProductController);
productRouter.put("/:id", updateProductController);
productRouter.delete("/:id", deleteProductByIdController);

export { productRouter };
