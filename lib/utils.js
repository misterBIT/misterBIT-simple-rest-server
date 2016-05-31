cl = function (m) { //yes it global, I know ;-)
	console.log(m);
};

exports.findIndexForId = function findIndexForId(objs, id) {
	for (var i = 0; i < objs.length; i++) {
		if (objs[i].id == id) return i;
	}
};

exports.findNextId = function findNextId(objs) {
	var nextId = 0;
	for (var i = 0; i < objs.length; i++) {
		if (objs[i].id > nextId) nextId = objs[i].id;
	}
	return nextId + 1;
};


exports.addObj = function addObj(objs, obj) {
	objs.push(obj);
};

exports.updateObj = function updateObj(objs, obj) {
	var index = findIndexForId(objs, obj.id)
	cl("Found index for: '" + obj.id + "': " + index);

	if (index in objs) {
		objs[index] = obj;
		cl('Obj Updates');
		return true;
	}

	return false;
};

exports.deleteObj = function deleteObj(objs, id) {
	var index = findIndexForId(objs, id);

	if (index in objs) {
		objs.splice(index, 1);
		return true;
	}
	return false;
};
module.exports = exports;