var mysql = require("mysql");
var prompt = require("prompt");
var Table = require("cli-table");


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

		var inventory = new Table({ head: ["ID", "Product Name", "Department", "Price", "Quantity in stock"]});
		results.forEach(function(value, index, array){
			//Store each item's properties into variables
			var idNum = value.id.toString();
			var product = value.ProductName;
			var dept = value.DepartmentName;
			var price = value.Price;
			var stock = value.StockQuantity;

			//Push these properties into a new object, then into the cli-table constructor
			var newLine = {};
			newLine[idNum] = [product, dept, price, stock]
			inventory.push(newLine);
		})
		console.log(inventory.toString());
	})
}
// displayAll();
//Products (ProductName, DepartmentName, Price, StockQuantity)



// var inventory = new Table({ head: ["ID", "Product Name", "Department", "Price", "Quantity in stock"] });
 
// results.forEach(function(value, index, array){

// 	var idNumber = 
// 	inventory.push(array[index].

// })

// inventory.push(
  //   { '1': ['Value Row 1 Col 1', 'Value Row 1 Col 2'] }
  // , { '2': ['Value Row 2 Col 1', 'Value Row 2 Col 2'] }
// );


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

		// var itemID = Number(results.ID);
		// var printItem = getItem(itemID);
		// console.log("printItem: " + printItem);

		//Store the selected product in an object
		var itemID = Number(results.ID);
		var selectedItem = getItem(itemID);
		console.log(selectedItem);
		
		//Get the current StockQuantity of the specified item
		var currentQuantity = selectedItem.StockQuantity;

		//Store the item's name and price for later use
		var itemName = selectedItem.ProductName;
		var totalPrice = selectedItem.Price * results.Quantity;

		//Switches the requested purchase amount to negative, for use in the changeInventory function
		var changeQuantity = results.Quantity * -1

		//If there's enough in stock, complete the purchase via changeInventory
		if (currentQuantity >= results.Quantity){
			changeInventory(itemID, currentQuantity, changeQuantity);

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
purchase();
// setTimeout(function(){purchase()}, 4000);
