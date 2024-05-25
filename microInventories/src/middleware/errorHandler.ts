import { Request, Response, NextFunction } from "express";
import { ApiError } from "../utils/customError.js";

export function errorHandler(error: any, req: Request, res: Response, next: NextFunction) {
	// console.error(error); // Log del error

	// Handle custom errors
	if (error instanceof ApiError) {
		return res.status(error.statusCode).json({ msg: error.message });
	}

	if (error instanceof Error) {
		return res.status(500).json({ message: error.message });
	}
	return res.status(500).json({ message: "Error del servidor" });
}
