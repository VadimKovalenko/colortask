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
var mycollections = db.collection('colortask_1');

app.get('/', function(req, res){
	res.render('home');
})

app.use('/public', express.static('public'));
app.use(bodyParser.json());

//Для просмотра отправленных данных можно заглянуть в директорию http://localhost:5000/colortask_1
app.post('/colortask_1', function (req, res) {
	console.log(req.body);
	//doc - item that we parsed
	mycollections.insert(req.body, function(err, docs) {
		//Send back data to the controller
		res.json(docs);
	});
});


//Добавление в БД Тестировка №2
app.put('/colortask_1/:id', function (req, res) {
	var id = req.params.id;
	//console.log("This is id from server: " + id);
	//console.log("This is request body: " + JSON.stringify(req.body));
	console.log("Current id of a color is - " + req.body.color_id)
	mycollections.findAndModify({query: {_id: mongojs.ObjectId(id)},
				update: {$push: 
					 {colors: {
					 	 color_id: req.body.color_id,	
					 	 data: req.body.data,
						 title: req.body.title,
						 descr: req.body.descr}}},
						 new: true},
	 function(err, docs) {
		//Send back data to the controller
		res.json(docs);
	});
	});

//Создание нового проекта
app.post('/new', function (req, res) {
	console.log("Message from the server.js: " + req.query('token'));
	res.json(req.body);
	//console.log(res.json(req.body));
	db.createCollection("NewCollection");
});

//Вывод всех данных с базы в консоль
app.get('/colortask_1', function (req, res) {
	console.log("I received a GET request");
	mycollections.find(function(err, docs) {
		console.log(docs);
		//Data back to the controller
		res.json(docs);
	});
});

//Получение данных с контроллера 
app.get('/colortask_1/:id/edit_color/:e', function (req, res) {
	var id = req.params.id;
	console.log("Current element from server - " + id);
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

/*
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
});*/


var port = Number(process.env.PORT || 5000);
app.listen(port);