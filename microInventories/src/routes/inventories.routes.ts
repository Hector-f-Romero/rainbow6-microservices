import { Router } from "express";
import {
	createInventoryController,
	getInventoriesController,
	getInventoryByIdController,
	getInventoryByUsernameController
} from "../controllers/inventories.controller.js";

const inventoryRouter = Router();

inventoryRouter.get("/", getInventoriesController);
inventoryRouter.get("/:id", getInventoryByIdController);
inventoryRouter.get("/users/",getInventoryByUsernameController)
inventoryRouter.post("/", createInventoryController);
// inventoryRouter.put("/:id", updateUserController);
// inventoryRouter.delete("/:id", deleteUserByIdController);

export { inventoryRouter };
