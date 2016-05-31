// Minimal Simple REST API Handler (in memory)
// Author: Yaron Biton misterBIT.co.il

"use strict";
const express = require('express'),
	cors = require('cors'),
	utils = require('./lib/utils.js');


// Main Cache object, entities are lazily loaded and saved here for in memory CRUD
const cache = {};
function getObjList(objType) {
	if (!cache[objType]) {
		try {
			cache[objType] = require('./data/' + objType + '/list.json');
		} catch (e) {
			//case initial file is undefined
			cache[objType] = [];
		}
	}
	return cache[objType];
}

const app = express();
app.use(cors());
app.use(express.bodyParser());


app.all('/', function (req, res, next) {
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Headers", "X-Requested-With");
	next();
});

app.get('/data/:objType', function (req, res) {
	const objs = getObjList(req.params.objType);
	cl("Returning list of " + objs.length + " " + req.params.objType + "s");
	res.json(objs);
});

app.get('/data/:objType/:id', function (req, res) {
	cl("GET for single " + req.params.objType);
	const objs = getObjList(req.params.objType);
	const index = utils.findIndexForId(objs, req.params.id);
	res.json(objs[index]);
});

app.put('/data/:objType/:id', function (req, res) {
	cl("PUT for " + req.params.objType);
	const objs = getObjList(req.params.objType);
	const obj = req.body;
	obj.id = parseInt(req.params.id);
	const success = utils.updateObj(objs, obj);
	if (success) res.json(obj);
	else res.json(404, {error: 'not found'})
});

app.post('/data/:objType', function (req, res) {
	cl("POST for " + req.params.objType);
	const objs = getObjList(req.params.objType);
	const obj = req.body;
	cl(obj);
	obj.id = utils.findNextId(objs);
	utils.addObj(objs, obj);
	res.json(obj);
});

app.delete('/data/:objType/:id', function (req, res) {
	const objs = getObjList(req.params.objType);
	utils.deleteObj(objs, req.params.id);
	res.json({});
});

app.listen(3003, function () {
	console.log("misterREST server is ready at http://localhost:3003");
});

