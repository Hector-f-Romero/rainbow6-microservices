import { NextFunction, Request, Response } from "express";

import {
	createUserDB,
	deleteProductByIdDB,
	updatedUserDB,
	getUserDB,
	getUserByIdDB,
	getUserLoginBD,
} from "../db/users.db.js";
import { ApiError } from "../utils/customError.js";

const getUserController = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const users = await getUserDB();
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
            return res.status(400).json({ message: "Usuario y contraseña requerido" });
        }

        const user = await getUserLoginBD(username, password);

        if (!user) {
            return res.status(401).json({ message: "Usuario o contraseña incorrectos" });
        }

        return res.status(200).json({ message: "Login Correcto", user });
    } catch (error) {
        next(error);
    }
};

const createUserController = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const { username = null, password = null, email = null, customer_rank = null, money = null } = req.body;

		const newProduct = await createUserDB(username, password, email, customer_rank, money);

		return res.status(201).json(newProduct);
	} catch (error) {
		next(error);
	}
};

const updateUserController = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const { username = null, password = null, email = null, customer_rank = null, money = null } = req.body;
		const { id } = req.params;

		// Update the product info with new information
		await updatedUserDB(Number(id), username, password, email, customer_rank, money);

		// 3. Get the updated record
		const updatedProduct = await getUserByIdDB(Number(id));
		return res.status(200).json(updatedProduct);
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

		return res.status(204);
	} catch (error) {
		next(error);
	}
};

export {
	getUserController,
	getUserByIdController,
	loginUserController,
	createUserController, 
	updateUserController,
	deleteUserByIdController,
};
