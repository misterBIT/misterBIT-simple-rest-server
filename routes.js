// Place for custom routes that are
// not covered by the generic API

module.exports = (app) => {

    // Just for basic testing the socket
    app.get('/', function(req, res){
        // res.end(__dirname);
        res.sendFile(__dirname + '/test-socket.html');
    });

}





// Sample of adding a custom action (can be avoided by just PUT a user)
// app.post('/data/:userId/liked/:carId', function (req, res) {
// 	const userId = new mongodb.ObjectID( req.params.userId );
// 	const carId = new mongodb.ObjectID( req.params.carId );

// 	dbConnect().then((db) => {
// 		db.collection('user').findOne({_id: userId}, (err, user)=>{
// 			if (!user.likedCarIds) user.likedCarIds = [];
// 			// TODO: support toggle by checking if car already exist
// 			user.likedCarIds.push(carId);
// 			db.collection('user').updateOne({ _id: userId }, user, (err, data)=>{
// 				if (err) {
// 					cl(`Couldnt ADD LIKE`, err)
// 					res.json(500, { error: 'Failed to add' })
// 				} else {
// 					cl('Like added');
// 					res.end()
// 				}
// 				db.close();
// 			})
// 		})
// 	});
// });