var express = require('express');
var app = express();
var exphbs = require('express3-handlebars');
var bodyParser = require('body-parser');
app.engine('handlebars',
	exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

var mongojs = require('mongojs');
//Connerct to other database collection
var db = mongojs('colortask_1', ['colortask_1']);

app.get('/', function(req, res){
	res.render('home');
})

app.use('/public', express.static('public'));
app.use(bodyParser.json());

//Для просмотра отправленных данных можно заглянуть в директорию http://localhost:5000/colortask_1
app.post('/colortask_1', function (req, res) {
	console.log(req.body);
	//doc - item that we parsed
	db.colortask_1.insert(req.body, function(err, docs) {
		//Send back data to the controller
		res.json(docs);
	});
});

app.get('/colortask_1', function (req, res) {
	console.log("I received a GET request");
	db.colortask_1.find(function(err, docs) {
		console.log(docs);
		//Data back to the controller
		res.json(docs);
	});
});

app.get('/colortask_1/:id', function (req, res) {
	var id = req.params.id;
	console.log(id);
	db.colortask_1.findOne({_id: mongojs.ObjectId(id)}, function (err, doc) {
    res.json(doc);
  	});
});

var port = Number(process.env.PORT || 5000);
app.listen(port);