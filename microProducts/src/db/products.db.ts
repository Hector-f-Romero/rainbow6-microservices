import { QueryResult } from "pg";

import { connectToDB } from "./config.js";
import { Product } from "../types/product.type.js";

export async function getProductsDB(): Promise<Product[] | null> {
	const con = await connectToDB();
	const { rows }: QueryResult<Product> = await con.query("SELECT * FROM products;");
	return rows.length > 0 ? rows : null;
}

export async function getProductByIdDB(productId: number): Promise<Product | null> {
	const con = await connectToDB();
	const { rows }: QueryResult<Product> = await con.query<Product>("SELECT * FROM products WHERE product_id = $1", [
		productId,
	]);

	return rows.length > 0 ? rows[0] : null;
}

export async function createProductDB(name: string, description: string, image: string, price: number, rarity: string) {
	const con = await connectToDB();
	const result = await con.query<Product>(
		`INSERT INTO products VALUES (default,$1,$2,$3,$4,$5,default,default) RETURNING *;`,
		[name, description, image, price, rarity]
	);
	return result.rows[0];
}

export async function updatedProductDB(
	productId: number,
	name: string,
	description: string,
	image: string,
	price: number,
	rarity: string
) {
	const con = await connectToDB();
	const result = await con.query<Product>(
		`UPDATE products SET name = COALESCE($1, name), description = COALESCE($2, description), image = COALESCE($3, image), price = COALESCE($4, price), rarity = COALESCE($5, rarity) WHERE product_id = $6;`,
		[name, description, image, price, rarity, productId]
	);
	return result.rows[0];
}

export async function deleteProductByIdDB(productId: number) {
	const con = await connectToDB();
	const { rowCount } = await con.query<Product>("DELETE FROM products WHERE product_id = $1", [productId]);
	return rowCount === 1 ? true : false;
}
