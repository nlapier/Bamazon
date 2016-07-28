var mysql = require("mysql");
var prompt = require("prompt");

var connection = mysql.createConnection({
	user: "root", 
	password: "",
	host: "localhost",
	port: 3306,
	database: "Bamazon"
})

connection.connect(function(error){
	if (error){throw error}
	console.log("successfully connected!")
})

function displayAll(){
	connection.query("SELECT * FROM Products", function(error, results){
		if(error){throw error};
		console.log(results)
	})
}

prompt.start();
prompt.get(["Product ID", "Quantity"], function(error, result){
	console.log(result["Product ID"]);
	console.log(result.Quantity);
})