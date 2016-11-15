var express = require('express');
var app = express();
var exphbs = require('express3-handlebars');
var bodyParser = require('body-parser');

app.engine('handlebars',
	exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

var mongojs = require('mongojs');
//Connerct to other database collection
var db = mongojs('colortask_1');
//var mycollections_arr = [];
var mycollections = db.collection('colortask_1', 'colortask_2');


/////////получение списка коллекций/////////////
db.getCollectionNames(function(err, colNames) {
  if (err) return  console.log(err);
  colNames.forEach(function(name) {
    console.log(name);
  });
});
/////////////////


app.get('/', function(req, res){
	res.render('home');
})

app.use('/public', express.static('public'));
app.use(bodyParser.json());
//app.use(bodyParser.text());


	//Для просмотра отправленных данных можно заглянуть в директорию http://localhost:5000/colortask_1
	app.post('/colortask_1', function (req, res) {
		console.log(req.body);
		//doc - item that we parsed
		mycollections.insert(req.body, function(err, docs) {
			//Send back data to the controller
			res.json(docs);
		});
	});

	//Создание нового проекта
	app.post('/new', function (req, res) {
		console.log("Message from the server.js: " + req.query('token'));
		//res.json(req.body);
		//console.log(res.json(req.body));
		//db.createCollection("NewCollection");
	});

	//Пытаемся вывести название или список коллекций
	app.get('/new', function (req, res) {
		console.log("Message from the server.js: collection name is " + mycollections);
	});


	app.get('/colortask_1', function (req, res) {
		console.log("I received a GET request");
		mycollections.find(function(err, docs) {
			console.log(docs);
			//Data back to the controller
			res.json(docs);
		});
	});

	app.get('/colortask_1/:id', function (req, res) {
		var id = req.params.id;
		console.log(id);
		mycollections.findOne({_id: mongojs.ObjectId(id)}, function (err, doc) {
	    res.json(doc);
	  	});
	});

	app.delete('/colortask_1/:id', function (req, res) {
	  var id = req.params.id;
	  console.log(id);
	  mycollections.remove({_id: mongojs.ObjectId(id)}, function (err, doc) {
	    res.json(doc);
	  });
	});

	app.put('/colortask_1/:id', function (req, res) {
		var id = req.params.id;
		//console.log("Update " + req.body.data);
		mycollections.findAndModify({query: {_id: mongojs.ObjectId(id)},
			update: {$set: {data: req.body.data,
								 title: req.body.title,
								 descr: req.body.descr}},
			new: true}, function(err, doc) {
				res.json(doc);
			});
	});

var port = Number(process.env.PORT || 5000);
app.listen(port);