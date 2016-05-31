cl = function(m) {console.log(m);}

findIndexForId = function(objs, id) {
		for (var i=0; i<objs.length; i++) {
			if (objs[i].id == id) return i;
		}
};

findNextId = function(objs) {
	var nextId = 0;
	for (var i=0; i<objs.length; i++) {
		if (objs[i].id > nextId) nextId = objs[i].id;
	}
	return nextId+1;
};


addObj = function(objs, obj) {
			objs.push(obj);
};

updateObj = function(objs, obj) {
	var index = findIndexForId(objs, obj.id)
	cl("Found index for: '" + obj.id + "': " + index);

    if (index in objs) {
        objs[index] = obj;
		cl('Obj Updates');
        return true;
    }

    return false;
};

deleteObj = function(objs, id) {
	var index = findIndexForId(objs, id);

    if (index in objs){
        objs.splice(index, 1);
        return true;
    }
    return false;
};
