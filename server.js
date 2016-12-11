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

var ObjectId = require('mongojs').ObjectID;

app.get('/', function(req, res){
	res.render('home');
})

app.use('/public', express.static('public'));
app.use(bodyParser.json());

//Вывод всех данных с базы
app.get('/colortask_1', function (req, res) {
	//console.log("I received a GET request");
	mycollections.find(function(err, docs) {
		//console.log(docs);
		//Data back to the controller
		res.json(docs);
	});
});

//Для просмотра отправленных данных можно заглянуть в директорию http://localhost:5000/colortask_1
app.post('/colortask_1', function (req, res) {
	//console.log(req.body);
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
	//console.log("Current id of a color is - " + req.body.color_id)
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

//Редактирование имени проекта
app.put('/colortask_1/edit_name/:id/:name', function (req, res) {
	var id = req.params.id;
	console.log(id);
	console.log("Name of project is " + JSON.stringify(req.body));
	mycollections.findAndModify({query: {_id: mongojs.ObjectId(id)},
					update: {
						$set: {
							name: req.body.name,
						}
					}},			
			function (err, doc) {
				res.json(doc);
				console.log("Doc from edit project name middleware - " + JSON.stringify(doc));
			});
});


//Получение данных конкретного цвета с контроллера для занесения в форму заполнения 
app.get('/colortask_1/:id/edit_color/:color_id', function (req, res) {
	var id = req.params.id;
	//Идентификатор нужно преобразовать в число
	var color_id = Number(req.params.color_id);
	//По id проекта и id цвета находим нужный цыет в массиве colors
	mycollections.findOne(
			{"_id" : ObjectId(id)},
    		{"colors": {$elemMatch: {"color_id" : color_id}}},
			function (err, doc) {
				res.json(doc);
				//console.log("Doc from edit middleware - " + JSON.stringify(doc));
			});
});


/*Подтреврждение редактирования цвета в массиве colors*/
app.put('/colortask_1/:id/update_color/:color_id', function (req, res) {
	var id = req.params.id;
	var color_id = Number(req.params.color_id);
	console.log("Update color from controller " + color_id);
	mycollections.findAndModify({query:
					{_id: mongojs.ObjectId(id),
					"colors": {$elemMatch: {"color_id" : color_id}}},

					update: {
						$set: {
							"colors.$.data": req.body.data,
							"colors.$.title": req.body.title,
							"colors.$.descr": req.body.descr
						}
					}},
				function(err, doc, lastErrorObject) {
					res.json(doc);
					console.log("Doc from update middleware - " + JSON.stringify(doc));
				});
});

//Удаление цвета из проекта
app.delete('/colortask_1/delete_color/:id/:color_id', function (req, res) {
  var id = req.params.id;
  //console.log("Params Delete color " + req.params.color_id + " from project " + id);
  //console.log("Body Delete color " + req.params.color_id + " from project " + id);
  var color_id = Number(req.params.color_id);
  mycollections.findAndModify({query:
					{_id: mongojs.ObjectId(id)},

					update: {
						$pull: {
							colors: {"color_id" : color_id} 
						}
					},
    				},
	function (err, doc) {
		res.json(doc);
		console.log("Doc from remove color middleware - " + JSON.stringify(doc));
	});
});


//Удаление проекта
app.delete('/colortask_1/:id', function (req, res) {
  var id = req.params.id;
  //console.log(id);
  mycollections.remove({_id: mongojs.ObjectId(id)}, function (err, doc) {
    res.json(doc);
  });
});


var port = Number(process.env.PORT || 5000);
app.listen(port);