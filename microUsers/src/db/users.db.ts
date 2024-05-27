import { QueryResult } from "pg";

import { connectToDB } from "./config.js";
import { User } from "../types/users.type.js";

export async function getUsersDB(): Promise<User[] | null> {
	const con = await connectToDB();
	const { rows }: QueryResult<User> = await con.query(
		"SELECT u.user_id,u.username,u.email,u.money,u.customer_rank,r.name as rank,r.rank_id,u.type_user,u.created_at,u.updated_at FROM users u INNER JOIN customer_ranks r ON u.customer_rank = r.rank_id"
	);
	return rows.length > 0 ? rows : null;
}

export async function getUserByIdDB(userid: number): Promise<User | null> {
	const con = await connectToDB();
	const { rows }: QueryResult<User> = await con.query<User>(
		"SELECT u.user_id,u.username,u.email,u.money,u.customer_rank as customer_rank_id ,r.name as customer_rank,r.rank_id,u.type_user,u.created_at,u.updated_at FROM users u INNER JOIN customer_ranks r ON u.customer_rank = r.rank_id WHERE u.user_id = $1",
		[userid]
	);

	return rows.length > 0 ? rows[0] : null;
}

export async function getUserByUsernameDB(username: string): Promise<User | null> {
	const con = await connectToDB();
	const { rows }: QueryResult<User> = await con.query<User>(
		"SELECT u.user_id,u.username,u.email,u.money,u.customer_rank as customer_rank_id ,r.name as customer_rank,r.rank_id,u.type_user, u.created_at,u.updated_at FROM users u INNER JOIN customer_ranks r ON u.customer_rank = r.rank_id WHERE u.username = $1",
		[username]
	);

	return rows.length > 0 ? rows[0] : null;
}

export async function getUserLoginBD(username: string): Promise<User | null> {
	const con = await connectToDB();
	const { rows }: QueryResult<User> = await con.query<User>("SELECT * FROM users WHERE username = $1", [username]);

	return rows.length > 0 ? rows[0] : null;
}

export async function createUserDB(
	username: string,
	password: string,
	email: string,
	customer_rank: number,
	money: number,
	typeUser: string
) {
	const con = await connectToDB();
	const result = await con.query<User>(
		`WITH inserted AS (INSERT INTO users VALUES (default,$1,$2,$3,$4,$5,$6,default,default) RETURNING *)
		SELECT i.user_id, i.username, i.password, i.email, r.name as rank, i.customer_rank as customer_rank_id, i.money, i.type_user, i.created_at, i.updated_at FROM 
    inserted i JOIN customer_ranks r ON i.customer_rank = r.rank_id;`,
		[username, password, email, customer_rank, money, typeUser]
	);
	return result.rows[0];
}

export async function updatedUserDB(
	userId: number,
	username: string,
	password: string,
	email: string,
	customer_rank: number,
	money: string,
	typeUser: string
) {
	const con = await connectToDB();
	const result = await con.query<User>(
		`WITH inserted AS(UPDATE users SET username = COALESCE($1, username), password = COALESCE($2, password), email = COALESCE($3, email), customer_rank = COALESCE($4, customer_rank), money = COALESCE($5, money), type_user = COALESCE($6,type_user) WHERE user_id = $7 RETURNING *)
		SELECT i.user_id, i.username, i.password, i.email, i.customer_rank, r.rank_id, r.name as rank, i.type_user i.created_at, i.updated_at FROM 
    inserted i JOIN customer_ranks r ON i.customer_rank = r.rank_id;`,
		[username, password, email, customer_rank, money, typeUser, userId]
	);
	return result.rows[0];
}

export async function deleteProductByIdDB(userId: number) {
	const con = await connectToDB();
	const { rowCount } = await con.query<User>("DELETE FROM users WHERE user_id = $1", [userId]);
	return rowCount === 1 ? true : false;
}
