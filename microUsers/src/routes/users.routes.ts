import { Router } from "express";
import {
	getUsersController,
	getUserByIdController,
	loginUserController,
	createUserController, 
	updateUserController,
	deleteUserByIdController,
} from "../controllers/users.controller.js";

const userRouter = Router();

userRouter.get("/", getUsersController);
userRouter.get("/:id", getUserByIdController);
userRouter.post("/login", loginUserController);
userRouter.post("/", createUserController);
userRouter.put("/:id", updateUserController);
userRouter.delete("/:id", deleteUserByIdController);

export { userRouter };
