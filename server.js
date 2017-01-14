var express = require('express');
var path = require('path');
var exphbs = require('express-handlebars');
var bodyParser = require('body-parser');
//Modules for autorization
var cookieParser = require('cookie-parser');
var expressValidator = require('express-validator');
var flash = require('connect-flash');
var session = require('express-session');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
//var mongo = require('mongodb');
var mongoose = require('mongoose');
mongoose.Promise = global.Promise;
var db = mongoose.connection;

var app = express();

//Connect to models from models folder
var Proj = require('./models/Proj.model');

// подключение к БД через mongoose
mongoose.connect('mongodb://localhost/colortask_1');

// Express Validator
app.use(expressValidator({
  errorFormatter: function(param, msg, value) {
      var namespace = param.split('.')
      , root    = namespace.shift()
      , formParam = root;

    while(namespace.length) {
      formParam += '[' + namespace.shift() + ']';
    }
    return {
      param : formParam,
      msg   : msg,
      value : value
    };
  }
}));

app.use(cookieParser());

// Express Session
app.use(session({
  secret: 'secret',
  saveUninitialized: true,
  resave: true
}));

/*app.engine('handlebars',
	exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');*/


//View Engine
app.set('views', path.join(__dirname, 'views'));
app.engine('handlebars', exphbs({defaultLayout:'main'}));
app.set('view engine', 'handlebars');

//Подключаем/отключаем mongojs
//var mongojs = require('mongojs');


//Connerct to other database collection

/*var db = mongojs('colortask_1');
var mycollections = db.collection('colortask_1');*/

//var ObjectId = require('mongojs').ObjectID;


// Connect Flash
app.use(flash());

//Закомментировано, чтобы перехватить данные регистрации пользователя
app.use(bodyParser.json());
//

//Обработка urlencoded data а не JSON для получения данных регистрации пользователя
app.use(bodyParser.urlencoded({ extended: true }));
//

// Passport init
app.use(passport.initialize());
app.use(passport.session());





//Users routes
var routes = require('./routes/index');
var users = require('./routes/users');



// Global Vars
app.use(function (req, res, next) {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  res.locals.user = req.user || null;
  next();
});

app.use('/users', users);
app.use('/', routes);
//Add my route (Если хотим, чтобы его видел авторизированный пользователь, задаем его после глобальных переменных)
var my_route = require('./routes/my_route');
app.use('/', my_route);

app.use('/public', express.static('public'));


/*app.get('/', function(req, res){
	res.render('home');
});*/



//Вывод всех данных с базы MONGOJS
/*app.get('/colortask_1', function (req, res) {
	//console.log("I received a GET request");
	mycollections.find(function(err, docs) {
		//console.log(docs);
		//Data back to the controller
		res.json(docs);
	});
});*/

//Вывод всех данных с базы MONGOOSE
app.get('/colortask_1', function (req, res) {
  //console.log("I received a GET request");
  var user = req.user.username;
  //console.log('Current user is ' + user);
  Proj
  .find({ username: user })
  .populate('_creator')
  .exec(function(err, projects) {
      if(err) {
          res.send('error has occured');
      }else{
          //console.log(projects);
          res.json(projects);
      }
  });
});

//Для просмотра отправленных данных можно заглянуть в директорию http://localhost:5000/colortask_1
//Добаление нового проекта с помощью MONGOJS
/*app.post('/colortask_1', function (req, res) {
	//console.log(req.body);
	//doc - item that we parsed
	mycollections.insert(req.body, function(err, docs) {
		//Send back data to the controller
		res.json(docs);
	});
});*/

//Добаление нового проекта с помощью MONGOOSE
app.post('/colortask_1', function (req, res) {
  var newProj = new Proj();
  newProj.name = req.body.name;
  newProj.username = req.user.username;
  newProj.save(function(err, project) {
      if (err) return console.error(err);
      //console.dir(project);
      res.send(project);        
      console.log('Request from server to add project controller is ' + project);
  });
});


//Добавление в БД цвета с помощью MONGOJS
/*app.put('/colortask_1/:id', function (req, res) {
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
});*/

//Добавление в БД цвета с помощью MONGOOSE
app.put('/colortask_1/:id', function (req, res) {
  Proj.findByIdAndUpdate(
    {_id: req.body._id},
    {$push: {colors : 
      {
        color_id: req.body.color_id,
        data : req.body.data,
        title : req.body.title,
        descr : req.body.descr
      }
    }},
    {safe: true, upsert: true, new : true},
    function(err, model) {
        res.json(model);
        console.log(err);
      }
    )
});

//Создание нового проекта (НЕ УЧАСТВУЕТ В ПРОЕКТЕ)
/*app.post('/new', function (req, res) {
	console.log("Message from the server.js: " + req.query('token'));
	res.json(req.body);
	//console.log(res.json(req.body));
	db.createCollection("NewCollection");
});*/

//Редактирование имени проекта с помощью MongoJS
/*app.put('/colortask_1/edit_name/:id/:name', function (req, res) {
	var id = req.params.id;
	//console.log(id);
	//console.log("Name of project is " + JSON.stringify(req.body));
	mycollections.findAndModify({query: {_id: mongojs.ObjectId(id)},
					update: {
						$set: {
							name: req.body.name,
						}
					}},			
			function (err, doc) {
				res.json(doc);
				//console.log("Doc from edit project name middleware - " + JSON.stringify(doc));
			});
});*/

//Редактирование имени проекта с помощью MONGOOSE
app.put('/colortask_1/edit_name/:id/:name', function (req, res) {
  var id = req.params.id;
  //console.log(id);
  //console.log("Name of project is " + JSON.stringify(req.body));
  Proj.findOneAndUpdate({_id: id},
          {name: req.body.name},     
      function (err, doc) {
        res.json(doc);
        //console.log("Doc from edit project name middleware - " + JSON.stringify(doc));
      });
});


//Получение данных конкретного цвета с контроллера для занесения в форму заполнения 
/*app.get('/colortask_1/:id/edit_color/:color_id', function (req, res) {
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
});*/


/*Подтреврждение редактирования цвета в массиве colors*/
/*app.put('/colortask_1/:id/update_color/:color_id', function (req, res) {
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
});*/

//Удаление цвета из проекта с помощью MongoJS
/*app.delete('/colortask_1/delete_color/:id/:color_id', function (req, res) {
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
});*/

//Удаление цвета из проекта с помощью MONGOOSE
app.delete('/colortask_1/delete_color/:id/:color_id', function (req, res) {
  var id = req.params.id;
  //console.log("Params Delete color " + req.params.color_id + " from project " + id);
  //console.log("Body Delete color " + req.params.color_id + " from project " + id);
  var color_id = Number(req.params.color_id);
  console.log(color_id);
  Proj.findByIdAndUpdate(
          id,
          {$pull: {"colors" : {"color_id" : color_id}}},
  function (err, doc) {
    res.json(doc);
    console.log("Doc from remove color middleware - " + JSON.stringify(doc));
  });
});


//Удаление проекта с помощью MongoJS
/*app.delete('/colortask_1/:id', function (req, res) {
  var id = req.params.id;
  //console.log(id);
  mycollections.remove({_id: mongojs.ObjectId(id)}, function (err, doc) {
    res.json(doc);
  });
});*/


//Удаление проекта с помощью MONGOOSE
app.delete('/colortask_1/:id', function (req, res) {
  var id = req.params.id;
  //console.log(id);
  Proj.remove({ _id: id }, function (err, doc) {
    res.json(doc);
  });
});

//Тестировка модели проекта
/*var first_prj = new Proj({ 
  name: 'Loremru proj',
  username: 'Loremru',
  hasCreditCookie: true,
  colors: [
  {
    color_id: '1',
    data: 'yellow',
    title: 'yellow title',
    descr: 'yellow descr'
  },
  {
    color_id: '2',
    data: 'pink',
    title: 'pink',
    descr: 'pink descr'
  }
  ] 
});

first_prj.save(function (err, first_prj) {
  if (err) return console.error(err);
});
console.log(first_prj);*/



var port = Number(process.env.PORT || 5000);
app.listen(port);