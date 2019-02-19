const inquirer = require("inquirer");
const mysql = require("mysql");
const chalk = require("chalk");

var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "EatzaPizza420",
    database: "bamazon_db"
});

connection.connect(function (err) {
    if (err) throw err;
    console.log("connected as id " + connection.threadId);
});

function displayProducts() {
    connection.query('SELECT * FROM products', function (err, data) {
        if (err) throw err;
        console.log(chalk.cyan("Products:"));
        for (i = 0; i < data.length; i++) {
            console.log(`${chalk.green(data[i].product_name)}, Price: ${chalk.keyword('orange')("$" + data[i].price)}, id: ${chalk.yellow(data[i].id)}`)
        }
        connection.end();
    });
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
    console.log(res);
    connection.end();
})
//displayProducts();