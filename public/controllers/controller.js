var Colortask1 = angular.module('Colortask1', []);
Colortask1.controller('Colortask1Ctrl', ['$scope', '$http', function($scope, $http) {     
	console.log("Hello World from controller");


	//Добавление в БД данных
	$scope.addData = function() {
			//console.log($scope.proj);
			//$scope.proj._id="";
			$http.post('/colortask_1', $scope.proj).success(function(response) {
			console.log(response);
			//refresh();
		});
	}; 

}]);

Colortask1.config(function($interpolateProvider) {
  $interpolateProvider.startSymbol('{[{');
  $interpolateProvider.endSymbol('}]}');
});	