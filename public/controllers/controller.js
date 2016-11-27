var Colortask1 = angular.module('Colortask1', []);
Colortask1.controller('Colortask1Ctrl', ['$scope', '$http', function($scope, $http) {     
	console.log("Hello World from controller");

	//Получение доступа к данным через запрос get
	var refresh = function() {
		$http.get('/colortask_1').success(function(response) {
			console.log("I got the data I requested");
			$scope.colortask_1 = response;
   		//Установка по умолчанию
   		//$scope.activeItem = $scope.colortask_1[0];
   		$scope.proj = "";
		});
	}

	refresh();

	/*$scope.setActive = function(proj_item) {
		$scope.activeItem = proj_item;
		//console.log($scope.activeMenu.data);
	};*/

	//Добавление в БД данных (сейчас вылавливаем айди проекта)
	$scope.addData = function() {
			
			console.log($scope.proj._id);
			//console.log(id);
			//$scope.proj._id="";
			$http.post('/colortask_1/current/', $scope.proj).success(function(response) {
			//console.log($scope.proj._id);
			console.log(response);
			//refresh();
		});
	};

	//////////////
	//Теситировка 2 Добавление в БД данных (сейчас вылавливаем айди проекта)
	$scope.addData2 = function(proj) {
			console.log(proj._id);
			console.log(proj.data);
			console.log(proj.title);
			console.log(proj.descr);
			//console.log(id);
			//$scope.proj._id="";
			$http.put('/colortask_1/' + proj._id, proj).success(function(response) {	
			//console.log($scope.proj._id);
			console.log("This is response form controller from server to current project -- " + JSON.stringify(response) + "-- end of response");
			refresh();
		});
	};

	//Эта функция может отловить данные со скоупа
	$scope.checkScope = function(proj) {
			alert(proj._id + " " + proj.data + " " + proj.title + " " + proj.descr);
	};
	//////////////


	//Удаление из БД
	/*$scope.remove = function(id) {
	  console.log(id);
	  		$http.delete('/colortask_1/' + id).success(function(response) {
	    	refresh();
	  });
	}; 

	//Редактирование
	$scope.edit = function(id) {
		console.log("Edit " + id);
		$http.get('/colortask_1/' + id).success(function(response) {
			//Bring data to the input form 
	   	$scope.proj = response;
	  });
	};


	$scope.update = function() {
	console.log("Update " + $scope.proj._id);
	$http.put('/colortask_1/' + $scope.proj._id, $scope.proj).success(function(response) {
		refresh();
		});
	};*/

	$scope.addNewProject = function() {
		/*console.log("HELLO, " + $scope.name);
		$http.post('/new', $scope.name).success(function(response) {
			$scope.name = response;
			console.log("Hi from post-controller");*/
			/*$http.get('/new', $scope.name).success(function(response) {
				console.log(response);
			});*/

			$http.post('/colortask_1', $scope.proj).success(function(response) {
			console.log(response);
			refresh();	
			});	
		};


	console.log($scope.$$watchers);	
}]);

Colortask1.config(function($interpolateProvider) {
  $interpolateProvider.startSymbol('{[{');
  $interpolateProvider.endSymbol('}]}');
});