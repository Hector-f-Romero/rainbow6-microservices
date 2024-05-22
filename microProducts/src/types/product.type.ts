import { RarityProduct } from "./rarity.type.js";

export interface Product {
	product_id: number;
	description: string;
	name: string;
	image: string;
	price: number;
	rarity: RarityProduct;
	created_at: string;
	updated_at: string;
}
