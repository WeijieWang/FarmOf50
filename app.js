
/**
 * Module dependencies.
 */

var express = require('express');
var routes = require('./routes');
var http = require('http');
var path = require('path');

var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(express.favicon(__dirname + '/public/images/favicon.ico'));
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

//mongoDB setup
var mongodb = require('mongodb');
var MongoClient = require('mongodb').MongoClient;
var mongoUri = process.env.MONGOLAB_URI ||
	process.env.MONGOHQ_URL ||
	'mongodb://localhost/mydb';

MongoClient.connect(mongoUri, function(err, db) {
	if (err) throw err;
	db.collection('product').ensureIndex("Commodity", function(err) {
		if (err) throw err;
		http.createServer(app).listen(app.get('port'), function() {
			console.log('Express server listening on port ' + app.get('port'));
			console.log('Express server is on ' + app.get('env') + ' mode');

			//import CSV file if needed
			//var importFile = require('utils/importCSV');
			//var file = __dirname + '/input5.csv';
			//importFile.importCSV(db, file);

			//Routing
			app.get('/', routes.index);
			app.post('/', routes.search(db));
			app.post('/commodity', routes.pull(db));
			app.post('/item', routes.year(db));
			app.get('/list', routes.list(db));
		});
	});
});
