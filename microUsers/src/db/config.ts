import pg from "pg";

const { Pool } = pg;

const sslConfig = process.env.DB_SSL === "true" ? true : false;

export const connectToDB = async () => {
	try {
		const connection = new Pool({
			host: process.env.DB_HOST,
			user: process.env.DB_USER,
			password: process.env.DB_PASSWORD,
			database: process.env.DATABASE,
			port: 5432,
			ssl: sslConfig,
		});
		return connection;
	} catch (error) {
		console.log(error);
		throw new Error("DB FAILED");
	}
};
