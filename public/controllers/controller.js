var Colortask1 = angular.module('Colortask1', []);
Colortask1.controller('Colortask1Ctrl', ['$scope', '$http', function($scope, $http) {     
	console.log("Hello World from controller");

	//Получение доступа к данным через запрос get
	var refresh = function() {
		$http.get('/colortask_1').success(function(response) {
			console.log("I got the data I requested");
			$scope.colortask_1 = response;
   		//Установка по умолчанию
   		//$scope.activeItem = $scope.proj_item;
   		//$scope.activeItem = $scope.colortask_1[0];
   		$scope.proj = "";
		});
	}

	refresh();



	//////////////
	//Добавление в БД данных для массива colors
	$scope.addData = function(proj) {
			$http.put('/colortask_1/' + proj._id, proj).success(function(response) {	
			//console.log($scope.proj._id);
			console.log("This is response form controller from server to current project -- " + JSON.stringify(response) + "-- end of response");
			refresh();
		});
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
}]);

Colortask1.controller('ProjCtrl', ['$scope', '$http', function($scope, $http) { 

$scope.setActive = function(proj_item) {
		$scope.activeItem = proj_item;
		//console.log($scope.activeMenu.data);
	};

	//$scope.activeItem = $scope.colortask_1[0].colors[0];
	//console.log($scope.colortask_1[0].colors[0]);

	/*$scope.colortask_1.map(function() {
		$scope.activeItem = $scope.colortask_1[i].colors[0];
	});*/

	console.log($scope.colortask_1.length);
	console.log($scope.colortask_1[0].colors[0]);

	if ($scope.proj.colors) {
		$scope.activeItem = $scope.proj.colors[0];
	}

	/*for(i=0; i < $scope.colortask_1.length; ++i) {
		//Take a count of projects
		//console.log($scope.colortask_1.length);
		console.log("Hello");
		for (j=0; j < $scope.colortask_1[i].colors.length; ++j) {
			//Take a count of colors in each project
				console.log($scope.colortask_1[i].colors[0].data);
				return $scope.activeItem = $scope.colortask_1[j].colors[0];
		};
	};*/


}]);	

Colortask1.config(function($interpolateProvider) {
  $interpolateProvider.startSymbol('{[{');
  $interpolateProvider.endSymbol('}]}');
});