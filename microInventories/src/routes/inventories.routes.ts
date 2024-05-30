import { Router } from "express";
import {
	createInventoryController,
	getInventoriesController,
	getInventoryByIdController,
	deleteIventoryByIdController,
	deleteIventoryWithProductIdController,
	deleteIventoryWithUserIdController,
} from "../controllers/inventories.controller.js";

const inventoryRouter = Router();

inventoryRouter.get("/", getInventoriesController);
inventoryRouter.get("/:id", getInventoryByIdController);
inventoryRouter.post("/", createInventoryController);
inventoryRouter.delete("/:id", deleteIventoryByIdController);
inventoryRouter.delete("/products/:id", deleteIventoryWithProductIdController);
inventoryRouter.delete("/users/:id", deleteIventoryWithUserIdController);

export { inventoryRouter };
