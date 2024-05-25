import { NextFunction, Request, Response } from "express";
import axios from "axios";

import {
	createInventoryDB,
	deleteInventoryByIdDB,
	getInventoriesDB,
	getInventoryByIdDB,
	getInventoryByUserIdDB,
} from "../db/inventories.db.js";
import { ApiError } from "../utils/customError.js";

import { User } from "../types/users.type.js";
import { Product } from "../types/product.type.js";
import { Inventory } from "../types/inventories.type.js";

const getInventoriesController = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const { username = null } = req.query;

		if (username !== null) {
			// 1. Verify that user exists in the USER microservice
			const resUser = await axios.get(`${process.env.USERS_URI_MIRCROSERVICE}/users?username=${username}`);
			const user: User = resUser.data;

			// 2. Get the inventories by username
			const rawUserInventary = await getInventoryByUserIdDB(user.user_id);

			if (rawUserInventary?.length === 0 || rawUserInventary === null) {
				return res.status(200).json({ msg: "Inventario vacío." });
			}

			// 3. Save the userInventory formatted.
			const userInventory: Inventory[] = [];

			// 4. GET THE INFORMATION FROM ALL PRODUCTS THAT USER HAS IN HIS/HER INVENTORY

			for (const item of rawUserInventary) {
				const resProduct = await axios.get(
					`${process.env.PRODUCTS_URI_MIRCROSERVICE}/products/${item.product_id}`
				);

				const product: Product = resProduct.data;

				userInventory.push({
					inventory_id: item.inventory_id,
					user_id: user.user_id,
					product_id: product.product_id,
					product_name: product.name,
					product_image: product.image,
					rarity_id: product.rarity_id,
					rarity_name: product.rarity,
					created_at: item.created_at,
					updated_at: item.updated_at,
				});
			}
			return res.status(200).json(userInventory);
		}

		const inventories = await getInventoriesDB();
		return res.status(200).json(inventories);
	} catch (error) {
		next(error);
	}
};

const getInventoryByIdController = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const { id } = req.params;
		const product = await getInventoryByIdDB(Number(id));

		if (!product) {
			throw new ApiError(`No existe inventario con id ${id}`, 404);
		}
		return res.status(200).json(product);
	} catch (error) {
		next(error);
	}
};

const createInventoryController = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const { user_id = null, product_id = null } = req.body;

		// 1. Verify that user exists in the USER microservice
		const resUser = await axios.get(`${process.env.USERS_URI_MIRCROSERVICE}/users/${user_id}`);
		const user: User = resUser.data;

		// 2. Verificar que exista el product_id.
		const resProduct = await axios.get(`${process.env.PRODUCTS_URI_MIRCROSERVICE}/products/${product_id}`);
		const product: Product = resProduct.data;

		// 3. Crear inventario en BD
		const newInventory = await createInventoryDB(user_id, product_id);

		const userInventory: Inventory = {
			inventory_id: newInventory.inventory_id,
			user_id: user.user_id,
			product_id: product.product_id,
			product_name: product.name,
			product_image: product.image,
			rarity_id: product.rarity_id,
			rarity_name: product.rarity,
			created_at: newInventory.created_at,
			updated_at: newInventory.updated_at,
		};

		// 4. Formatear el inventario para el usuario.
		return res.status(201).json(userInventory);
	} catch (error) {
		next(error);
	}
};

// const updateUserController = async (req: Request, res: Response, next: NextFunction) => {
// 	try {
// 		const { username = null, password = null, email = null, customer_rank = null, money = null } = req.body;
// 		const { id } = req.params;

// 		// If exist password, hash a new password
// 		if (password) {
// 			const salt = await bcrypt.genSalt(10);
// 			const hashedPassword = await bcrypt.hash(password, salt);

// 			// Update the product info with new information
// 			const updatedUser = await updatedUserDB(Number(id), username, hashedPassword, email, customer_rank, money);
// 			return res.status(200).json(updatedUser);
// 		}

// 		// Update the product info with new information
// 		const updatedUser = await updatedUserDB(Number(id), username, password, email, customer_rank, money);
// 		return res.status(200).json(updatedUser);
// 	} catch (error) {
// 		next(error);
// 	}
// };

const deleteIventoryByIdController = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const { id } = req.params;

		const deletedInventory = await deleteInventoryByIdDB(Number(id));

		if (!deletedInventory) {
			throw new ApiError(`No existe el registro de inventario a eliminar con id ${id}`, 404);
		}

		return res.status(204).json({ msg: "Mensaje eliminado con éxito" });
	} catch (error) {
		next(error);
	}
};

export {
	getInventoriesController,
	createInventoryController,
	getInventoryByIdController,
	deleteIventoryByIdController,
};
