// angular stuff
var air = angular.module('air',['ngRoute']);

air.config(function($routeProvider){
	$routeProvider.
		when('/',{templateUrl:'partials/directory.html', controller: 'mainCtrl'}).
		when('/item/:id',{templateUrl:'/partials/view.html', controller: 'itemCtrl'}).
		when('/aboutus', {templateUrl: '/partials/aboutus.html'}).
		when('/rent/:id', {templateUrl: '/partials/checkout.html', controller: 'itemCtrl'}).
		otherwise({redirectTo:'/'})
});

air.factory('outfits', function($http){

	function getData(callback){
		$http({
			method: 'GET',
			url: 'data/data.json',
			cache: true
		}).success(callback);
	}

	return{
		list: getData,
		find: function(id, callback){
			getData(function(data) {
				var outfit = data.filter(function(entry){
					return entry.id === id;
				})[0];
				callback(outfit);
			});
		}
	};
});


air.controller('mainCtrl', function($scope, $filter, outfits){

	// for filter menu to display
	$scope.filterToggle = false;

	outfits.list(function(outfits){
		$scope.outfits = outfits;

		$scope.category = "";
		$scope.querySearch = function(inputBrand, inputSize){

			// trigger the filter menu to display
			$scope.filterToggle = true;


			for(var i=0; i<$scope.outfits.length; ++i){
				if($scope.outfits[i].brand == inputBrand && $scope.outfits[i].size == inputSize){
					$scope.category = $scope.outfits[i].category;
					break;
				}
			}	

			// can make a copy of the original listing
			$scope.outfits = $filter('filter')($scope.outfits, $scope.category);

			// clear the search field
			$scope.inputBrand = "";
			$scope.inputSize = "";


			// do the brand and type filter thing
			$scope.brandLeft = [];
			$scope.typeLeft = [];
			for(var i=0; i<$scope.outfits.length; ++i)
			{
				if($scope.brandLeft.indexOf($scope.outfits[i].brand) < 0)
					$scope.brandLeft.push($scope.outfits[i].brand);
				if($scope.typeLeft.indexOf($scope.outfits[i].type) < 0)
					$scope.typeLeft.push($scope.outfits[i].type);
			}
			$scope.brandLeft.sort();
			$scope.typeLeft.sort();
		}

		// for the brand Filter
		$scope.brandToggleBool = false;
		$scope.brandFilter = "";
		$scope.brandToggle = function(inputBrand){
			if(!$scope.brandToggleBool){
				$scope.brandToggleBool = true;
				$scope.brandFilter = inputBrand;
			}
			else{
				$scope.brandToggleBool = false;
				$scope.brandFilter = "";
			}
		}

		// for the type filter
		$scope.typeToggleBool = false;
		$scope.typeFilter = "";
		$scope.typeToggle = function(inputType){
			if(!$scope.typeToggleBool){
				$scope.typeToggleBool = true;
				$scope.typeFilter = inputType;
			}
			else{
				$scope.typeToggleBool = false;
				$scope.typeFilter = "";
			}
		}

	});	
	
});

air.controller('itemCtrl', function($scope, $routeParams, outfits){

	console.log($routeParams);
	outfits.list(function(data){
		$scope.outfit = data[$routeParams.id-1];
	})
});

// modal thing
