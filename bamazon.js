var mysql = require("mysql");
var prompt = require("prompt");
var table = require("cli-table");


var connection = mysql.createConnection({
	user: "root", 
	password: "",
	host: "localhost",
	port: 3306,
	database: "Bamazon"
})

// connection.connect(function(error){
// 	if (error){throw error}
// 	console.log("successfully connected!")
// })

function displayAll(){
	connection.query("SELECT * FROM Products", function(error, results){
		if(error){throw error};
		console.log(results);
	})
}
// displayAll();
//Products (ProductName, DepartmentName, Price, StockQuantity)

//Returns an object for the specified item
function getItem(id){
	var readText = "SELECT * FROM Products WHERE id = ?";
	connection.query(readText, [id], function(error, results){
		if(error){throw error};
		return results[0];
	})
}

//Changes inventory levels, either adding to or subtracting from StockQuantity for the desired id#
function changeInventory(id, currentQuantity, changeQuantity){
	var newQuantity = currentQuantity + changeQuantity;
	var updateText = "UPDATE Products\
		SET StockQuantity = ?\
		WHERE id = ?";
	connection.query(updateText, [newQuantity, id], function(error, results){
		if(error){throw error};
	})
}

//Function to handle purchases
function purchase(){
	//Prompt the user to make a purchase
	prompt.start();
	console.log("To purchase a product, please enter the ID number of the product, and quantity you would like to purchase.")
	prompt.get(["ID", "Quantity"], function(error, results){
		if(error){throw error};

		//Get the current StockQuantity of the specified item
		var selectedItem = getItem(results.ID);
		var currentQuantity = selectedItem.StockQuantity;
		//Store the item's name and price for later use
		var itemName = selectedItem.ProductName;
		var totalPrice = selectedItem.Price * results.Quantity;

		//Switches the requested purchase amount to negative, for use in the changeInventory function
		var changeQuantity = results.Quantity * -1

		//If there's enough in stock, complete the purchase via changeInventory
		if (currentQuantity >= results.Quantity){
			changeInventory(results.ID, currentQuantity, changeQuantity);

			//Print the results of the transaction
			console.log("Your purchase: " + itemName);
			console.log("Quantity: " + results.Quantity);
			console.log("Total price: $" + totalPrice);
		}
	});
}

// function morePlease(){
// 	prompt.start();
// 	console.log("Would you like to make another purchase?")
// 	prompt.get(["ID", "Quantity"], function(error, results){
// 		if(error){throw error};
// }


//****************
console.log("Welcome to Bamazon!  Here is our product catalog:");
displayAll();
setTimeout(function(){purchase()}, 4000);
