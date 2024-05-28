import { Router } from "express";
import { getRaritiesController } from "../controllers/rarities.controller.js";

const raritiesRouter = Router();

raritiesRouter.get("/", getRaritiesController);
// productRouter.get("/:id", getProductByIdController);
// productRouter.post("/", createProductController);
// productRouter.put("/:id", updateProductController);
// productRouter.delete("/:id", deleteProductByIdController);

export { raritiesRouter };
