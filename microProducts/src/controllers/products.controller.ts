import { NextFunction, Request, Response } from "express";
import axios from "axios";

import { v2 as cloudinary, UploadApiResponse, UploadStream } from "cloudinary";

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

cloudinary.config({
	cloud_name: "dpt05yawm",
	api_key: process.env.API_KEY_CLOUDINAY,
	api_secret: process.env.API_SECRET_CLOUDINAY,
});

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

		// The user never has bought
		if (resInventoryMicroservice.data.msg === "Inventario vacío.") {
			const products = await getProductsDB();
			return res.status(200).json(products);
		}
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

		const productImg = req.file;
		const uploadResult: UploadApiResponse = await new Promise((resolve, reject) => {
			cloudinary.uploader
				.upload_stream(
					{ folder: `redes-r6/products/` },
					(error, uploadResult: UploadApiResponse | undefined) => {
						if (error) {
							reject(error);
						} else if (uploadResult) {
							resolve(uploadResult);
						} else {
							reject(new ApiError("Failed to upload image.", 500));
						}
					}
				)
				.end(productImg?.buffer);
		});

		console.log(uploadResult);
		const newProduct = await createProductDB(name, description, uploadResult.secure_url, price, rarity);

		// return res.status(201).json({ msg: "WI" });
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

		// Delete product in inventory microservice
		const resInventoryMicroservice = await axios.delete(
			`${process.env.INVENTORIES_URI_MIRCROSERVICE}/inventories/products/${id}`
		);

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
