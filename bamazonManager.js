const inquirer = require("inquirer");
const mysql = require("mysql");
const chalk = require("chalk");

var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "",
    database: "bamazon_db"
});

connection.connect(function (err) {
    if (err) throw err;
    //console.log("connected as id " + connection.threadId);
});

function displayAllProducts() {
    connection.query('SELECT * FROM products', function (err, data) {
        if (err) throw err;
        console.log(chalk.cyan("Products:"));
        for (i = 0; i < data.length; i++) {
            console.log(`${chalk.green(data[i].product_name)}, Price: ${chalk.keyword('orange')("$" + data[i].price)}, id: ${chalk.yellow(data[i].id)}`)
        }
        connection.end();
    });
};

function displayLowProducts() {
    connection.query('SELECT * FROM products WHERE quantity < 50', function (err, data) {
        if (err) throw err;
        console.log(chalk.cyan("Products with Low Stock:"));
        for (i = 0; i < data.length; i++) {
            console.log(`${chalk.green(data[i].product_name)}, Quantity: ${chalk.keyword('magenta')(data[i].quantity)}`)
        }
        connection.end();
    });
};

function addToProducts(quantity, product) {
    connection.query('UPDATE products SET quantity = quantity + ? WHERE product_name = ?', [quantity, product], function (err, data) {
        if (err) throw err;
        console.log(`${product}'s quantity increased`);
    });
    connection.end();
};

function addNewProduct(product, department, price, quantity) {
    connection.query("INSERT INTO products (product_name, department, price, quantity) VALUES (?, ?, ?, ?)", [product, department, price, quantity], function (err, data) {
        if(err) throw err;
        console.log(`${product} added.`)
    });
    connection.end();
}

inquirer.prompt([{
    name: "choice",
    message: "Please select an option.",
    type: "list",
    choices: [
        "View Products for Sale",
        "View Low Inventory",
        "Add to Inventory",
        "Add New Product"
    ]
}])
    .then(function (res) {
        switch (res.choice) {
            case "View Products for Sale":
                displayAllProducts();
                break;
            case "View Low Inventory":
                displayLowProducts();
                break;
            case "Add to Inventory":
                connection.query('SELECT * FROM products', function (err, data) {
                    if (err) throw err;
                    let arr = [];
                    data.forEach(item => {
                        arr.push(item.product_name);
                    })
                    console.log(chalk.cyan("Products:"));
                    inquirer.prompt([{
                        name: "product",
                        message: "Select a Product:",
                        type: "list",
                        choices: arr
                    },
                    {
                        name: "amount",
                        message: "How many to add?",
                        type: "input",
                        validate: function (input) {
                            if (input > 0)
                                return true;
                        }
                    }])
                        .then(function (res) {
                            addToProducts(res.amount, res.product);
                        })
                });
                break;
            case "Add New Product":
                inquirer.prompt([{
                    name: "product",
                    message: "Name of product:",
                    type: "input"
                },
                {
                    name: "department",
                    message: "Department for product:",
                    type: "input"
                },
                {
                    name: "price",
                    message: "Price of product:",
                    type: "input",
                    validate: function (input) {
                        if (input > 0)
                            return true;
                    }
                },
                {
                    name: "quantity",
                    message: "Quantity of product:",
                    type: "input",
                    validate: function (input) {
                        if (input > 0)
                            return true;
                    }
                }
                ])
                    .then(function (res) {
                        addNewProduct(res.product, res.department, res.price, res.quantity);
                    })
                break;
        }
    })
//displayProducts();