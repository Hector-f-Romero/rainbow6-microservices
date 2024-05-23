import { Router } from "express";
import {
	getUserController,
	getUserByIdController,
	loginUserController,
	createUserController, 
	updateUserController,
	deleteUserByIdController,
} from "../controllers/users.controller.js";

const userRouter = Router();

userRouter.get("/", getUserController);
userRouter.get("/:id", getUserByIdController);
userRouter.post("/login", loginUserController);
userRouter.post("/", createUserController);
userRouter.put("/:id", updateUserController);
userRouter.delete("/:id", deleteUserByIdController);

export { userRouter };
