// Minimal Simple REST API Handler (in memory)
// Author: Yaron Biton misterBIT.co.il

var express = require('express'),
	cors = require('cors'),
  	http = require('http'),
  	utils = require('./lib/utils.js');


// Main Cache object, entities are lazily loaded and saved here for in memory CRUD
var cache = {};
function getObjList(objType) {
	if (!cache[objType]) {
		cache[objType] = require('./data/'+objType+'/list.json');
	}
	return cache[objType];
}

var app = express()
app.use(cors());
app.use(express.bodyParser())



app.all('/', function(req, res, next) {
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Headers", "X-Requested-With");
	next();
});

app.get('/data/:objType', function  (req, res) {
	var objs = getObjList(req.params.objType);
	cl("Returning list of " + objs.length + " " + req.params.objType + "s");
	res.json(objs);
});

app.get('/data/:objType/:id', function  (req, res) {
	cl("GET for single " + req.params.objType);
	var objs = getObjList(req.params.objType);
	var index = findIndexForId(objs, req.params.id);
	res.json(objs[index]);
});

app.put('/data/:objType/:id', function  (req, res) {
	cl("PUT for " + req.params.objType);
	var objs = getObjList(req.params.objType);
	var obj = req.body;
	obj.id = parseInt(req.params.id);
	var success = updateObj(objs, obj);
	if (success) res.json(obj);
	else res.json(404, {error: 'not found'})
});

app.post('/data/:objType', function  (req, res) {
	cl("POST for " + req.params.objType);
	var objs = getObjList(req.params.objType);
	var obj = req.body;
	obj.id = findNextId(objs);
	addObj(objs, obj);
	res.json(obj);
});

app.delete('/data/:objType/:id', function  (req, res) {
	var objs = getObjList(req.params.objType);
	deleteObj(objs, req.params.id);
    res.json({});
});

http.createServer(app).listen(3003, function () {
  console.log("misterREST server is ready at http://localhost:3003");
});

