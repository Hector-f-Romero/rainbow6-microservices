import { QueryResult } from "pg";

import { connectToDB } from "./config.js";
import { Inventory,InventoryRaw } from "../types/inventories.type.js";

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

	console.log(rows)

	return rows.length > 0 ? rows : null;
}

export async function createInventoryDB(
	user_id: number,
	product_id: number
) {
	const con = await connectToDB();
	const result = await con.query<InventoryRaw>(
		`INSERT INTO inventories VALUES (default,$1,$2,default,default) RETURNING *`,
		[user_id, product_id]
	);
	return result.rows[0];
}

// export async function updatedUserDB(
// 	userId: number,
// 	username: string,
// 	password: string,
// 	email: string,
// 	customer_rank: number,
// 	money: string
// ) {
// 	const con = await connectToDB();
// 	const result = await con.query<User>(
// 		`WITH inserted AS(UPDATE users SET username = COALESCE($1, username), password = COALESCE($2, password), email = COALESCE($3, email), customer_rank = COALESCE($4, customer_rank), money = COALESCE($5, money) WHERE user_id = $6 RETURNING *)
// 		SELECT i.user_id, i.username, i.password, i.email, i.customer_rank, r.rank_id, r.name as rank, i.created_at, i.updated_at FROM 
//     inserted i JOIN customer_ranks r ON i.customer_rank = r.rank_id;`,
// 		[username, password, email, customer_rank, money, userId]
// 	);
// 	return result.rows[0];
// }

// export async function deleteProductByIdDB(userId: number) {
// 	const con = await connectToDB();
// 	const { rowCount } = await con.query<User>("DELETE FROM users WHERE user_id = $1", [userId]);
// 	return rowCount === 1 ? true : false;
// }
