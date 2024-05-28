import { NextFunction, Request, Response } from "express";

import { ApiError } from "../utils/customError.js";
import { getRaritiesDB } from "../db/rarities.db..js";

export async function getRaritiesController(req: Request, res: Response, next: NextFunction) {
	try {
		const rarities = await getRaritiesDB();
		return res.status(200).json(rarities);
	} catch (error) {
		next(error);
	}
}

// const getProductByIdController = async (req: Request, res: Response, next: NextFunction) => {
// 	try {
// 		const { id } = req.params;
// 		const product = await getProductByIdDB(Number(id));

// 		if (!product) {
// 			throw new ApiError(`No existe producto con id ${id}`, 404);
// 		}
// 		return res.status(200).json(product);
// 	} catch (error) {
// 		next(error);
// 	}
// };

// const createProductController = async (req: Request, res: Response, next: NextFunction) => {
// 	try {
// 		const { name = null, description = null, image = null, price = null, rarity = null } = req.body;

// 		const newProduct = await createProductDB(name, description, image, price, rarity);

// 		return res.status(201).json(newProduct);
// 	} catch (error) {
// 		next(error);
// 	}
// };

// const updateProductController = async (req: Request, res: Response, next: NextFunction) => {
// 	try {
// 		const { name = null, description = null, image = null, price = null, rarity = null } = req.body;
// 		const { id } = req.params;

// 		// Update the product info with new information
// 		await updatedProductDB(Number(id), name, description, image, price, rarity);

// 		// 3. Get the updated record
// 		const updatedProduct = await getProductByIdDB(Number(id));
// 		return res.status(200).json(updatedProduct);
// 	} catch (error) {
// 		next(error);
// 	}
// };

// const deleteProductByIdController = async (req: Request, res: Response, next: NextFunction) => {
// 	try {
// 		const { id } = req.params;

// 		const deletedProduct = await deleteProductByIdDB(Number(id));

// 		if (!deletedProduct) {
// 			throw new ApiError(`No existe el producto a eliminar con id ${id}`, 404);
// 		}

// 		return res.status(204);
// 	} catch (error) {
// 		next(error);
// 	}
// };

// export {
// 	getProductsController,
// 	getProductByIdController,
// 	createProductController,
// 	updateProductController,
// 	deleteProductByIdController,
// };
