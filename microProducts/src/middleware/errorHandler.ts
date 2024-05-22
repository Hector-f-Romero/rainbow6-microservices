import { Request, Response, NextFunction } from "express";
import { ApiError } from "../utils/customError.js";

export function errorHandler(error: any, req: Request, res: Response, next: NextFunction) {
	console.error(error); // Log del error

	// Handle custom errors
	if (error instanceof ApiError) {
		res.status(error.statusCode).json({ msg: error.message });
	}

	if (error instanceof Error) {
		res.status(500).json({ message: error.message });
	}
	res.status(500).json({ message: "Error del servidor" });
}
