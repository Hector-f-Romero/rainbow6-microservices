import { QueryResult } from "pg";

import { connectToDB } from "./config.js";
import { Inventory, InventoryRaw } from "../types/inventories.type.js";

export async function getInventoriesDB(): Promise<InventoryRaw[] | null> {
	const con = await connectToDB();
	const { rows }: QueryResult<InventoryRaw> = await con.query("SELECT * from inventories;");
	return rows.length > 0 ? rows : null;
}

export async function getInventoryByIdDB(inventory_id: number): Promise<InventoryRaw | null> {
	const con = await connectToDB();
	const { rows }: QueryResult<InventoryRaw> = await con.query<InventoryRaw>(
		"SELECT * FROM inventories i WHERE i.inventory_id = $1",
		[inventory_id]
	);

	return rows.length > 0 ? rows[0] : null;
}

export async function getInventoryByUserIdDB(user_id: number): Promise<InventoryRaw[] | null> {
	const con = await connectToDB();
	const { rows }: QueryResult<InventoryRaw> = await con.query<InventoryRaw>(
		"SELECT * FROM inventories i WHERE i.user_id = $1",
		[user_id]
	);
	return rows.length > 0 ? rows : null;
}

export async function createInventoryDB(user_id: number, product_id: number) {
	const con = await connectToDB();
	const result = await con.query<InventoryRaw>(
		`INSERT INTO inventories VALUES (default,$1,$2,default,default) RETURNING *`,
		[user_id, product_id]
	);
	return result.rows[0];
}

export async function deleteInventoryByIdDB(inventoryId: number) {
	const con = await connectToDB();
	const { rowCount } = await con.query<InventoryRaw>("DELETE FROM inventories WHERE inventory_id = $1", [
		inventoryId,
	]);
	return rowCount === 1 ? true : false;
}
