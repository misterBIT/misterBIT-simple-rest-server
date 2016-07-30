// Minimal Simple REST API Handler (With MongoDB and Socket.io)
// This is just a step in the way for supporting file upload, 
// here we first save the document, then upload the file
// Author: Yaron Biton misterBIT.co.il

"use strict";
const 	express = require('express'),
		bodyParser 		= require('body-parser'),
		cors = require('cors'),
		mongodb = require('mongodb'),
        multiparty = require('multiparty'),
        util = require('util')


const multer  = require('multer')

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // cl('MULTER DEST', __dirname + '/uploads');  
    cb(null, __dirname + '/uploads');
  },
  filename: function (req, file, cb) {
      cl('req', req);
    // cb(null, file.fieldname)
    const ext = file.originalname.substr(file.originalname.lastIndexOf('.'));
    // const destFile = __dirname + '/uploads/' + req.entityId + ext;
    const destFile = req.entityId + ext;
    cl('MULTER is saving file', destFile);
    cb(null, destFile)
  }
})
 
const upload = multer({ storage: storage })

// const upload = multer({ dest: 'uploads/' })
	
const app = express();

var corsOptions = {
  origin: 'http://localhost:3000',
  credentials: true
};


app.use(cors(corsOptions));
app.use(bodyParser.json());

const http 	= require('http').Server(app);
const io 	= require('socket.io')(http);


function dbConnect() {

	return new Promise((resolve, reject) => {
		// Connection URL
		var url = 'mongodb://localhost:27017/seed';
		// Use connect method to connect to the Server
		mongodb.MongoClient.connect(url, function (err, db) {
			if (err) {
				cl('Cannot connect to DB', err)
				reject(err);
			}
			else {
				//cl("Connected to DB");
				resolve(db);
			}
		});
	});
}



io.on('connection', function(socket){
  console.log('a user connected');
  socket.on('disconnect', function(){
    console.log('user disconnected');
  });
  socket.on('chat message', function(msg){
      // console.log('message: ' + msg);
      io.emit('chat message', msg);
  });  
    
});

cl('WebSocket is Ready');

// Just for basic testing the socket
// app.get('/', function(req, res){
//   res.sendFile(__dirname + '/test-socket.html');
// });


// app.post('/profile', upload.single('file'), function (req, res, next) {
//   console.log('req.file', req.file);
//   console.log('req.body', req.body);

//   res.end('Goote');
    
//   // req.file is the `avatar` file
//   // req.body will hold the text fields, if there were any
// })


// GETs a list
app.get('/data/:objType', function (req, res) {
	const objType = req.params.objType;
	dbConnect().then((db) => {
		const collection = db.collection(objType);

		collection.find({}).toArray((err, objs) => {
			if (err) {
				cl('Cannot get you a list of ', err)
				res.json(404, { error: 'not found' })
			} else {
				cl("Returning list of " + objs.length + " " + objType + "s");
				res.json(objs);
			}
			db.close();
		});
	});
});

// GETs a single
app.get('/data/:objType/:id', function (req, res) {
	const objType = req.params.objType;
	const objId = req.params.id;
	cl(`Getting you an ${objType} with id: ${objId}`);
	dbConnect().then((db) => {
		const collection = db.collection(objType);

		collection.findOne({_id: new mongodb.ObjectID(objId)}, (err, obj) => {
			if (err) {
				cl('Cannot get you that ', err)
				res.json(404, { error: 'not found' })
			} else {
				cl("Returning a single"+ objType);
				res.json(obj);
			}
			db.close();
		});
	});
});

// DELETE
app.delete('/data/:objType/:id', function (req, res) {
	const objType = req.params.objType;
	const objId = req.params.id;
	cl(`Requested to DELETE the ${objType} with id: ${objId}`);
	dbConnect().then((db) => {
		const collection = db.collection(objType);
		collection.deleteOne({ _id:  new mongodb.ObjectID(objId)}, (err, result) => {
			if (err) {
				cl('Cannot Delete', err)
				res.json(500, { error: 'Delete failed' })
			} else {
				cl("Deleted", result);
				res.json({});
			}
			db.close();
		});

	});



});

// POST - adds 
app.post('/data/:objType', function (req, res, next) {

    // console.log('req.file', req.file);
    // console.log('req.body', req.body);
    const objType = req.params.objType;
    cl("POST for " + objType);

    var form = new multiparty.Form();
	
    form.parse(req, function(err, fields, files) {
       
        const obj = jsonFromMultipartyFields(fields);
        // console.log('******* obj', obj);
        
        dbConnect().then((db) => {
		const collection = db.collection(objType);

		collection.insert(obj, (err, result) => {
			if (err) {
				cl(`Couldnt insert a new ${objType}`, err)
				res.json(500, { error: 'Failed to add' })
			} else {
				cl(objType + " added");

                cl('MONGO result', result);
                req.entityId = result.insertedIds[0].toString();
                req.file = files[0];

				res.json(obj);
			}
			db.close();
            next()

		});
	});
    
    });

}, upload.single('file'));

// PUT - updates
app.put('/data/:objType/:id', function (req, res) {
	const objType 	= req.params.objType;
	const objId 	= req.params.id;
	const newObj 	= req.body;
	cl(`Requested to UPDATE the ${objType} with id: ${objId}`);
	dbConnect().then((db) => {
		const collection = db.collection(objType);
		collection.updateOne({ _id:  new mongodb.ObjectID(objId)}, newObj,
		 (err, result) => {
			if (err) {
				cl('Cannot Update', err)
				res.json(500, { error: 'Update failed' })
			} else {
				cl("Updated", result);
				res.json(newObj);
			}
			db.close();
		});

	});

});


// Kickup our server 
const baseUrl = 'http://localhost:3003/data';
// Note: app.listen will not work with cors and the socket
// app.listen(3003, function () {
http.listen(3003, function () {
	console.log(`misterREST server is ready at ${baseUrl}`);
	console.log(`GET (list): \t\t ${baseUrl}/{entity}`);
	console.log(`GET (single): \t\t ${baseUrl}/{entity}/{id}`);
	console.log(`DELETE: \t\t ${baseUrl}/{entity}/{id}`);
	console.log(`PUT (update): \t\t ${baseUrl}/{entity}/{id}`);
	console.log(`POST (add): \t\t ${baseUrl}/{entity}`);

});

// Some small time utility functions
function cl(...params) {
	console.log.apply(console, params);
}

function jsonFromMultipartyFields(fields) {
    const obj = {}
    for (var property in fields) {
        if (fields.hasOwnProperty(property)) {
            obj[property] = fields[property][0]
        }
    }    
    //cl('obj is: ', obj);
    return obj;
}