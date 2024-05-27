--------------------------- USERS ----------------------
CREATE DATABASE microUsers;

CREATE TABLE IF NOT EXISTS customer_ranks(
    rank_id SMALLSERIAL NOT NULL,
    name VARCHAR(15) NOT NULL,
    created_at timestamp without time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone,
	CONSTRAINT customer_ranl_idkey PRIMARY KEY(rank_id) 
);

CREATE TABLE IF NOT EXISTS users (
    user_id SMALLSERIAL NOT NULL,
    username VARCHAR(15) NOT NULL,
    password VARCHAR(60) NOT NULL,
    email VARCHAR(60) NOT NULL,
    customer_rank SMALLSERIAL NOT NULL,
    money INT NOT NULL DEFAULT(100),
    type_user VARCHAR(10) CHECK(type_user IN ('ADMIN','USER')) DEFAULT('USER') NOT NULL,
    created_at timestamp without time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone,
    PRIMARY KEY(user_id),
    FOREIGN KEY(customer_rank) REFERENCES customer_ranks(rank_id) ON DELETE SET NULL
);

select * from customer_ranks;
select * from users;

insert into customer_ranks values(default,'Recluta',default,default);
insert into customer_ranks values(default,'Operativo',default,default);
insert into customer_ranks values(default,'Élite',default,default);

-- drop table customer_ranks;
-- drop table users;

--------------------------- PRODUCTS -------------------------
CREATE DATABASE microProducts;

CREATE TABLE IF NOT EXISTS rarities(
    rarity_id SMALLSERIAL NOT NULL,
    name VARCHAR(15) NOT NULL,
    created_at timestamp without time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone,
	PRIMARY KEY(rarity_id) 
);

CREATE TABLE IF NOT EXISTS products(
    product_id SMALLSERIAL NOT NULL,
	name VARCHAR(25) UNIQUE NOT NULL,
    description VARCHAR(100) NOT NULL,
    image VARCHAR(200) NOT NULL,
    price INT NOT NULL,
    rarity SMALLSERIAL NOT NULL,
	created_at timestamp without time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone,
    PRIMARY KEY(product_id),
    FOREIGN KEY(rarity) REFERENCES rarities(rarity_id) ON DELETE SET NULL
);

select * from products;
select * from rarities;

insert into rarities values(default,'Común',default,default);
insert into rarities values(default,'Raro',default,default);
insert into rarities values(default,'Épico',default,default);
insert into rarities values(default,'Legendario',default,default);

-- drop table products cascade;
-- drop table rarities cascade;

--------------------------- INVENTORIES -------------------------
CREATE DATABASE microInventories;

CREATE TABLE IF NOT EXISTS inventories(
    inventory_id SMALLSERIAL NOT NULL,
    user_id SMALLSERIAL NOT NULL,
    product_id SMALLSERIAL NOT NULL,
    created_at timestamp without time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone,
    PRIMARY KEY(inventory_id)
);

select * from inventories;