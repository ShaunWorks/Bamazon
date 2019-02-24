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
  console.log("connected as id " + connection.threadId);
});

connection.query('SELECT * FROM products', function (err, res) {
  if (err) throw err;
  display(res);
});

function display(data) {
  console.log(chalk.cyan("Products:"));
  for (i = 0; i < data.length; i++) {
    console.log(`${chalk.green(data[i].product_name)}, Price: ${chalk.keyword('orange')("$" + data[i].price)}, id: ${chalk.yellow(data[i].id)}`)
  }

  inquirer.prompt([
    {
      name: "inquirerID",
      message: "What is the id of the product you would like to buy?",
      type: "input",
      validate: function (input) {
        if (input > 0 && input <= data.length)
          return true;
      }
    },
    {
      name: "inquirerAmount",
      message: "How many would you like to buy?",
      type: "input",
      validate: function (input) {
        if (input > 0)
          return true;
      }
    }
  ])
    .then(function (res) {
      connection.query('SELECT * FROM products WHERE id = ?', [res.inquirerID], function (err, data) {
        if (err) throw err;
        let amountInStock = data[0].quantity;
        let amountWanted = res.inquirerAmount;
        let itemName = data[0].product_name;
        let itemPrice = data[0].price;

        if (amountWanted <= amountInStock) {
          connection.query('UPDATE products SET quantity = ? WHERE id = ?', [amountInStock - amountWanted, res.inquirerID], function (err, data) {
            if (err) throw err;
            console.log(`You purchased ${amountWanted} ${chalk.green(itemName + "(s)")}. The cost comes up to ${chalk.keyword('orange')("$" + itemPrice * amountWanted)}.`);
          })
        }
        else {
          console.log(chalk.red("Insufficent quantity."));
        }

        connection.end();
      });
    })
    .catch(function (err) {
      connection.end();
      throw err;
    })
}