import { NextFunction, Request, Response } from "express";
import bcrypt from "bcrypt";

import {
	createUserDB,
	deleteProductByIdDB,
	updatedUserDB,
	getUsersDB,
	getUserByIdDB,
	getUserLoginBD,
	getUserByUsernameDB,
} from "../db/users.db.js";
import { ApiError } from "../utils/customError.js";

const getUsersController = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const { username = null } = req.query;

		if (username) {
			const user = await getUserByUsernameDB(username as string);
			return res.status(200).json(user);
		}

		const users = await getUsersDB();
		return res.status(200).json(users);
	} catch (error) {
		next(error);
	}
};

const getUserByIdController = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const { id } = req.params;
		const product = await getUserByIdDB(Number(id));

		if (!product) {
			throw new ApiError(`No existe usuario con id ${id}`, 404);
		}
		return res.status(200).json(product);
	} catch (error) {
		next(error);
	}
};

const loginUserController = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const { username, password } = req.body;

		if (!username || !password) {
			throw new ApiError("Usuario y contraseña requerido", 400);
		}

		const userDB = await getUserLoginBD(username);

		if (!userDB) {
			throw new ApiError(`No existe un usuario con el username '${username}'`, 404);
		}

		const comparePassword = await bcrypt.compare(password, userDB.password);

		if (!comparePassword) {
			throw new ApiError(`Contraseña incorrecta. Vuelve a intentarlo`, 400);
		}

		return res.status(200).json({ message: "Login Correcto", user: userDB });
	} catch (error) {
		next(error);
	}
};

const createUserController = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const { username = null, password = null, email = null, customer_rank = null, money = null } = req.body;

		const salt = await bcrypt.genSalt(10);
		const hashedPassword = await bcrypt.hash(password, salt);

		const newProduct = await createUserDB(username, hashedPassword, email, customer_rank, money);

		return res.status(201).json(newProduct);
	} catch (error) {
		next(error);
	}
};

const updateUserController = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const { username = null, password = null, email = null, customer_rank = null, money = null } = req.body;
		const { id } = req.params;

		// If exist password, hash a new password
		if (password) {
			const salt = await bcrypt.genSalt(10);
			const hashedPassword = await bcrypt.hash(password, salt);

			// Update the product info with new information
			const updatedUser = await updatedUserDB(Number(id), username, hashedPassword, email, customer_rank, money);
			return res.status(200).json(updatedUser);
		}

		// Update the product info with new information
		const updatedUser = await updatedUserDB(Number(id), username, password, email, customer_rank, money);
		return res.status(200).json(updatedUser);
	} catch (error) {
		next(error);
	}
};

const deleteUserByIdController = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const { id } = req.params;

		const deletedProduct = await deleteProductByIdDB(Number(id));

		if (!deletedProduct) {
			throw new ApiError(`No existe el usuario a eliminar con id ${id}`, 404);
		}

		return res.status(204).json({ msg: "Eliminado con éxito" });
	} catch (error) {
		next(error);
	}
};

export {
	getUsersController,
	getUserByIdController,
	loginUserController,
	createUserController,
	updateUserController,
	deleteUserByIdController,
};
