DROP DATABASE IF EXISTS bamazon_db;

CREATE DATABASE bamazon_db;

USE bamazon_db;

CREATE TABLE products (
    id INT NOT NULL AUTO_INCREMENT,
    product_name VARCHAR(255) NULL,
    department VARCHAR(255) NULL,
    price DECIMAL (10,2) NULL,
    quantity INT (10) NULL,
    PRIMARY KEY (id)
);

INSERT INTO products (product_name, department, price, quantity) VALUES 
("Bicycle", "Sporting Equipment", 150, 70), 
("Ice Cream Maker", "Cookware", 70, 120), 
("White T-Shirt", "Clothing", 10, 325),
("Diamond Ring", "Jewelry", 10000, 15),
("Basketball Hoop", "Sporting Equipment", 100, 35),
("Black Dress", "Clothing", 60, 120),
("Spice Rack", "Cookware", 25, 200),
("MacBook Pro", "Computers", 2000, 100),
("Google Pixel 3", "Mobile Phone", 800, 200),
("Resident Evil 2", "Video Games", 60, 300),
("Bandages", "Healthcare", 5, 250);