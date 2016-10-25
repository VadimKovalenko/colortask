var Colortask1 = angular.module('Colortask1', []);
Colortask1.controller('Colortask1Ctrl', ['$scope', '$http', function($scope, $http) {     
	console.log("Hello World from controller");

	//Получение доступа к данным через запрос get
	var refresh = function() {
		$http.get('/colortask_1').success(function(response) {
			console.log("I got the data I requested");
			$scope.colortask_1 = response;
   		//$scope.proj = "";
   		$scope.activeMenu = $scope.colortask_1[0];
		});
	}

	refresh();

	$scope.setActive = function(proj_item) {
		$scope.activeMenu = proj_item;
		//console.log($scope.activeMenu.data);
	};

	//Добавление в БД данных
	$scope.addData = function() {
			//console.log($scope.proj);
			//$scope.proj._id="";
			$http.post('/colortask_1', $scope.proj).success(function(response) {
			console.log(response);
			refresh();
		});
	}; 

}]);

Colortask1.config(function($interpolateProvider) {
  $interpolateProvider.startSymbol('{[{');
  $interpolateProvider.endSymbol('}]}');
});