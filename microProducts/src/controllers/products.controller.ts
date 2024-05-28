import { NextFunction, Request, Response } from "express";
import axios from "axios";

import {
	createProductDB,
	deleteProductByIdDB,
	updatedProductDB,
	getProductsDB,
	getProductByIdDB,
	getAvailableProductsToBuyDB,
} from "../db/products.db.js";
import { ApiError } from "../utils/customError.js";
import { Inventory } from "../types/inventories.type.js";

const getProductsController = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const users = await getProductsDB();
		return res.status(200).json(users);
	} catch (error) {
		next(error);
	}
};

const getProductByIdController = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const { id } = req.params;
		const product = await getProductByIdDB(Number(id));

		if (!product) {
			throw new ApiError(`No existe producto con id ${id}`, 404);
		}
		return res.status(200).json(product);
	} catch (error) {
		next(error);
	}
};

const getProductsAvailableController = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const { username } = req.params;

		// 1. Get the user inventory to know which products he/sher has.
		const resInventoryMicroservice = await axios.get(
			`${process.env.INVENTORIES_URI_MIRCROSERVICE}/inventories?username=${username}`
		);

		const userInventory: Inventory[] = resInventoryMicroservice.data;
		// Save only the product ids that user already have
		const unavailableProductsIds = userInventory.map((item) => Number(item.product_id));

		// Filter the products that user can buy.
		const products = await getAvailableProductsToBuyDB(unavailableProductsIds);

		// const users = await getProductsDB();
		return res.status(200).json(products);
	} catch (error) {
		next(error);
	}
};

const createProductController = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const { name = null, description = null, image = null, price = null, rarity = null } = req.body;

		const newProduct = await createProductDB(name, description, image, price, rarity);

		return res.status(201).json(newProduct);
	} catch (error) {
		next(error);
	}
};

const updateProductController = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const { name = null, description = null, image = null, price = null, rarity = null } = req.body;
		const { id } = req.params;

		// Update the product info with new information
		await updatedProductDB(Number(id), name, description, image, price, rarity);

		// 3. Get the updated record
		const updatedProduct = await getProductByIdDB(Number(id));
		return res.status(200).json(updatedProduct);
	} catch (error) {
		next(error);
	}
};

const deleteProductByIdController = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const { id } = req.params;

		const deletedProduct = await deleteProductByIdDB(Number(id));

		if (!deletedProduct) {
			throw new ApiError(`No existe el producto a eliminar con id ${id}`, 404);
		}

		return res.status(204);
	} catch (error) {
		next(error);
	}
};

export {
	getProductsController,
	getProductByIdController,
	createProductController,
	getProductsAvailableController,
	updateProductController,
	deleteProductByIdController,
};
