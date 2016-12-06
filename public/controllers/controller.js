var Colortask1 = angular.module('Colortask1', []);
Colortask1.controller('Colortask1Ctrl', ['$scope', '$http', function($scope, $http) {     
	//console.log("Hello World from controller");

	//Получение доступа к данным через запрос get
	var refresh = function() {
		$http.get('/colortask_1').success(function(response) {
			console.log("I got the data I requested");
			$scope.colortask_1 = response;
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


	//Удаление проекта из БД
	$scope.remove = function(id) {
	  console.log(id);
	  		$http.delete('/colortask_1/' + id).success(function(response) {
	    	refresh();
	  });
	}; 

	//Редактирование
	/*$scope.edit = function(id) {
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
			$http.post('/colortask_1', $scope.proj).success(function(response) {
			console.log(response);
			refresh();	
			});	
		};

}]);


//Controller of current project
Colortask1.controller('ProjCtrl', ['$scope', '$http', function($scope, $http) { 

	$scope.setActive = function(proj_item) {
		$scope.activeItem = proj_item;
	};

	//Set default item
	if ($scope.proj.colors) {
		$scope.activeItem = $scope.proj.colors[0];
	}

	//Save to LoacalStorage open accordion window
	$scope.saveOpenProjId = function(id) {
		var el = "#" + "proj_" + id + " .collapse";
	      if (typeof(Storage) !== "undefined") {
			   // Code for localStorage/sessionStorage.
			   localStorage.setItem(id, el);
			} else {
			    // Sorry! No Web Storage support..
			    console.log("Web Storage does not support");
			}
	};


}]);

//Директива для получения идентификатора и изменения его стилей в ng-repeat. Элемент просчитвает кол-во елементов в локальном хранилище повторно, в зависимости от того сколько элементов генерирует ng-repeat
Colortask1.directive('myMainDirective', function() {
 	return function(scope, element, attrs) {
 		angular.element(document).ready(function () {
 			for (var i = 0, len = localStorage.length; i < len; ++i) {
 				var element = $(localStorage.getItem(localStorage.key(i)));
 				if(element.length > 0) { 
			 		element.addClass("in");
			 		console.log(element);
		 		};
	 		};
 		});
	};//End of return statement	
});


Colortask1.config(function($interpolateProvider) {
  $interpolateProvider.startSymbol('{[{');
  $interpolateProvider.endSymbol('}]}');
});