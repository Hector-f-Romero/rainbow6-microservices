import { Router } from "express";
import {
	createProductController,
	deleteProductByIdController,
	getProductByIdController,
	getProductsController,
	updateProductController,
} from "../controllers/products.controller.js";

const productRouter = Router();

productRouter.get("/", getProductsController);
productRouter.get("/:id", getProductByIdController);
productRouter.post("/", createProductController);
productRouter.put("/:id", updateProductController);
productRouter.delete("/:id", deleteProductByIdController);

export { productRouter };
