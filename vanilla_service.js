/***************************************************************************
vanilla_service.js

Web service that largely executes SQL queries to the database and returns
the JSON back to the client.

Created by: Mark Hardy
Last Updated: 4/24/2019
***************************************************************************/

"use strict";

const express = require("express");
const app = express();
//const fs = require('fs');
var http = require('http');
var pug = require('pug');

const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();
const mysql = require('mysql');

app.use(express.static('public'));

app.use(function(req, res, next) {
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Headers",
	"Origin, X-Requested-With, Content-Type, Accept");
	next();
});

console.log("web service started");

/***************************************************************************
*************************** MySQL Configuration ****************************
***************************************************************************/

const connection = mysql.createConnection({

  host     : '35.184.40.74',
  user     : 'root',
  password : 'A66056504',
  database : 'mangos0',
  debug    : "true"
});

connection.connect(function (err) {
	if (err) throw err;
	console.log("Connected!");

});

/**************************************************************************/

// Not used
app.get('/', function(req, res){
	res.header("Access-Control-Allow-Origin", "*");

	res.send('Hello');
});


/***************************************************************************
get/loot
Queries the database for information on a creature that drops and item
if applicable.
***************************************************************************/
app.get('/loot', function (req, res) {
	res.header("Access-Control-Allow-Origin", "*");
	const item_id = req.query.item_id;
	var json = {};
	var json_out = {};

	var sql_query = "SELECT c.Name, c.MinLevel, c.MaxLevel, l.ChanceOrQuestChance FROM creature_template c INNER JOIN creature_loot_template l WHERE l.item = '" + item_id + "' AND c.Entry = l.entry ORDER BY l.ChanceOrQuestChance ASC";

	var result = connection.query(sql_query, function(err, result, fields) {
		if (err) throw err;
		json["result"] = result;

		console.log("Sent JSON to client");
		res.send(JSON.stringify(json));
	});
})


/***************************************************************************
get/search
Searches the database for items the user may be looking for.
***************************************************************************/
app.get('/search', function (req, res) {
	res.header("Access-Control-Allow-Origin", "*");
	const search = req.query.search;
	var json = {};

	var sql_query = "SELECT * FROM item_template i WHERE i.name = '" + search + "' ORDER BY i.Quality DESC, i.name ASC";

	var result = connection.query(sql_query, function(err, result, fields) {
		if (err) throw err;
		json["result"] = result;
		console.log("Sent JSON to client");
		res.send(JSON.stringify(json));
	});
})


/***************************************************************************
get/item
Queries the database for information on a specific item.
***************************************************************************/
app.get('/item', function (req, res) {
	res.header("Access-Control-Allow-Origin", "*");
	const item_id = req.query.item_id;
	var json = {};

	var sql_query = "SELECT * FROM item_template i WHERE i.entry = '" + item_id + "'";

	var result = connection.query(sql_query, function(err, result, fields) {
		if (err) throw err;
		json["result"] = result;
		console.log("Sent JSON to client");
		res.send(JSON.stringify(json));
	});
})


// Not being used currently
app.post('/', jsonParser, function (req, res) {
	const name = req.body.name;				// req.body gets post request parameters, req.query gets get request
	res.send('Hello, ' + name);
});

app.listen(3000);
