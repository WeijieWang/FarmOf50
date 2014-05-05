exports.index = function(req, res) {
	var docs = [];
	for (var i=1; i<=56; i++) {
		docs.push({"Value" : ""+Math.floor(1000000*Math.random()), "State ANSI": ""+i});
	}
	res.render('index', { title: "Farm of 50", data: docs });
};

exports.search = function(db) {
	return function(req, res) {
		var commodity = req.body.commodity.toUpperCase();
		var item = req.body.item;
		var year = req.body.year;

		if (!(commodity && item && year)) {
			res.render('index', {title: "Farm of 50", msg: 'Error, incomplete input!'});
		}

		var collection = db.collection('product');
		var query = {Commodity: commodity, Year: year, "Data Item": item};
		var fields = ["Value", "State ANSI", "State"]; 
		collection.find(query, fields).toArray(function(err, documents) {
			res.render('index', {title: "Farm of 50", data: documents, 
				content: item + ", Year " + year});
		});
	};
};

exports.pull = function(db) {
	return function(req, res) {
		var collection = db.collection('product');
		var filter = {Commodity: req.body.commodity};

		collection.distinct("Data Item", filter, function(err, documents) {
			res.send(documents);
		});
	};
};

exports.year = function(db) {
	return function(req, res) {
		var collection = db.collection('product');
		var filter = {Commodity: req.body.commodity, "Data Item": req.body.item};

		collection.distinct("Year", filter, function(err, documents) {
			res.send(documents);
		});
	};
};

exports.list = function(db) {
	return function(req, res) {
		var collection = db.collection('product');
		collection.distinct("Commodity", function(err, documents) {
			if (err) {
				res.send("Error in querying the list");
			} else {
				res.render('list', {docs: documents});
			}
		});
	};
};
