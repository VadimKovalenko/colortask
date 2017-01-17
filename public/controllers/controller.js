var Colortask1 = angular.module('Colortask1', []);
Colortask1.controller('Colortask1Ctrl', ['$scope', '$http', function($scope, $http) {     
	//console.log("Hello World from controller");

	//Получение доступа к данным через запрос get
	$scope.refresh = function() {
		$http.get('/colortask_1').success(function(response) {
			//console.log("I got the data I requested");
			$scope.colortask_1 = response;
   			$scope.proj = "";
   			//console.log($scope.colortask_1);
		});
	}

	$scope.refresh();

	//////////////
	//Добавление в БД данных для массива colors
	$scope.addData = function(proj) {
			//Установка уникального id для каждого цвета
			var d = new Date();
			color_id = d.getTime();
			proj.color_id = color_id;
			console.log(color_id);
			$http.put('/colortask_1/' + proj._id, proj).success(function(response) {	
			//console.log($scope.proj._id);
			console.log("This is response form controller from server to current project -- " + JSON.stringify(response) + "-- end of response");
			$scope.refresh();
		});
	};
	//////////////


	//Удаление проекта из БД
	$scope.remove = function(id) {
		if (confirm("Are you sure want to delete this project?")) {	
	  		console.log(id);
	  		$http.delete('/colortask_1/' + id).success(function(response) {
	    	$scope.refresh();
	  		});
	  	};
	}; 


	$scope.addNewProject = function() {
			$http.post('/colortask_1', $scope.proj).success(function(response) {
				//console.log(response);
				$scope.refresh();	
			});	
		};

	$scope.savePrjName = function(proj) {
		//Optimized data for put query
		var x = {
			id: proj._id,
			name: proj.name
		}
		$http.put('/colortask_1/edit_name/' + x.id + '/' + x.name, x).success(function(response) {
			$scope.refresh();
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

	//Редактирование цвета (отображение данных в поле ввода)
	$scope.edit = function(activeItem, id, color_id) {
		console.log("Edit " + activeItem.data + " in project " + id);
		//var e = activeItem.data.substr(1);
		//color_id = $scope.proj.color_id;
		console.log("Color id in controller is " + color_id);
		$http.get('/colortask_1/' + id + '/' + 'edit_color' + '/' + color_id).success(function(response) {
			//Bring data to the input form 
	   		$scope.proj.data = response.colors[0].data;
	   		$scope.proj.title = response.colors[0].title;
	   		$scope.proj.descr = response.colors[0].descr;
	   		//console.log(response.colors[0].data);
	  });
	};

	//подтверждение редактирования цвета
	$scope.updateColor = function(activeItem, id, proj) {
		if (confirm("Are you sure want to update this color?")) {	
			$http.put('/colortask_1/' + id + '/' + 'update_color' + '/' + activeItem.color_id, $scope.proj).success(function(response) {
					$scope.refresh();
				});
		};
	};

	$scope.removeColor = function(color_id, id) {
		console.log(id);
		console.log(color_id);
		if (confirm("Are you sure want to delete this color?")) {
		$http.delete('/colortask_1/delete_color/' + id + '/' +  color_id).success(function(response) {
			$scope.refresh();
		});
		}; 
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
			 		//console.log(element);
		 		};
	 		};
 		});
	};//End of return statement	
});


Colortask1.config(function($interpolateProvider) {
  $interpolateProvider.startSymbol('{[{');
  $interpolateProvider.endSymbol('}]}');
});