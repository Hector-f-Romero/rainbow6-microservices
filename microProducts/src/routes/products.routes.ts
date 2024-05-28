import { Router } from "express";
import {
	createProductController,
	deleteProductByIdController,
	getProductByIdController,
	getProductsAvailableController,
	getProductsController,
	updateProductController,
} from "../controllers/products.controller.js";

const productRouter = Router();

productRouter.get("/", getProductsController);
productRouter.get("/available/:username", getProductsAvailableController);
productRouter.get("/:id", getProductByIdController);
productRouter.post("/", createProductController);
productRouter.put("/:id", updateProductController);
productRouter.delete("/:id", deleteProductByIdController);

export { productRouter };
