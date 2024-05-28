import { QueryResult } from "pg";

import { connectToDB } from "./config.js";
import { Product } from "../types/product.type.js";

export async function getRaritiesDB(): Promise<Product[] | null> {
	const con = await connectToDB();
	const { rows }: QueryResult<Product> = await con.query("SELECT * from rarities;");
	return rows.length > 0 ? rows : null;
}

export async function getProductByIdDB(productId: number): Promise<Product | null> {
	const con = await connectToDB();
	const { rows }: QueryResult<Product> = await con.query<Product>(
		"SELECT p.product_id,p.name,p.description,p.image,p.price,r.name as rarity,r.rarity_id,p.created_at,p.updated_at FROM products p INNER JOIN rarities r ON p.rarity = r.rarity_id WHERE product_id = $1",
		[productId]
	);

	return rows.length > 0 ? rows[0] : null;
}

export async function createProductDB(name: string, description: string, image: string, price: number, rarity: string) {
	const con = await connectToDB();
	const result = await con.query<Product>(
		`WITH inserted AS (INSERT INTO products VALUES (default,$1,$2,$3,$4,$5,default,default) RETURNING *)
		SELECT i.product_id, i.name, i.description, i.image, i.price, r.rarity_id, r.name as rarity, i.created_at, i.updated_at FROM 
    inserted i JOIN rarities r ON i.rarity = r.rarity_id;`,
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
		`WITH inserted AS(UPDATE products SET name = COALESCE($1, name), description = COALESCE($2, description), image = COALESCE($3, image), price = COALESCE($4, price), rarity = COALESCE($5, rarity) WHERE product_id = $6 RETURNING *)
		SELECT i.product_id, i.name, i.description, i.image, i.price, r.rarity_id, r.name as rarity, i.created_at, i.updated_at FROM 
    inserted i JOIN rarities r ON i.rarity = r.rarity_id;`,
		[name, description, image, price, rarity, productId]
	);
	return result.rows[0];
}

export async function deleteProductByIdDB(productId: number) {
	const con = await connectToDB();
	const { rowCount } = await con.query<Product>("DELETE FROM products WHERE product_id = $1", [productId]);
	return rowCount === 1 ? true : false;
}
