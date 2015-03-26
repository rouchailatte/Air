// angular stuff
var air = angular.module('air',['ngRoute']);

air.config(function($routeProvider){
	$routeProvider.
		// when('/',{templateUrl:"partials/intro.html"}).
		when('/',{templateUrl:'partials/directory.html', controller: 'mainCtrl'}).
		when('/item/:id',{templateUrl:'/partials/view.html', controller: 'itemCtrl'}).
		when('/aboutus', {templateUrl: '/partials/aboutus.html'}).
		when('/rent/:id', {templateUrl: '/partials/checkout.html', controller: 'itemCtrl'}).
		when('/howto', {templateUrl: '/partials/howto.html'}).
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

air.filter('startFrom', function() {
    return function(input, start) {
        start = +start; //parse to int
        return input.slice(start);
    }
});

air.controller('mainCtrl', function($scope, $filter, outfits){

	// for filter menu to display
	$scope.filterToggle = false;


	// animation for steps and got it button
	// $(document).ready(function(){
	// 	$(".mainNotification").hide();
	// 	$(".mainNotification").fadeIn(500);
	// });

	$(".mainNotificationButton").click(function(){
		$(".mainNotification").fadeOut(500);
		$(".mainNotificationButton").fadeOut(500);
	});

  // main data fetching part
	outfits.list(function(outfits){
		$scope.outfits = outfits;


		// for the autosuggest input bar - jQuery UI
		// both brand and input size

  		 $(function() {
					var availableBrands = [];
					var availableSizes = [];
					for(var i=0; i<$scope.outfits.length; ++i){
						if(availableBrands.indexOf($scope.outfits[i].brand) < 0)
							availableBrands.push($scope.outfits[i].brand);
						if(availableSizes.indexOf($scope.outfits[i].size.toString()) < 0)
							availableSizes.push($scope.outfits[i].size.toString());
					}
					availableBrands.sort();
					availableSizes.sort();
					$("#inputBrand").autocomplete({
						source: availableBrands
					});
					$("#inputSize").autocomplete({
						source: availableSizes
					});
				});

  		 $(".inputButton").click(function(){
  		 	$("#inputEffect").hide();
  		 	$("#inputEffect").fadeIn(500);
  		 });


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


		// for pagination after the change of the outfits
		$scope.currentPage = 0;
	  $scope.pageSize = 10;
	  $scope.data = [];

	  $scope.numberOfPages=function(){
	    return Math.ceil($scope.data.length/$scope.pageSize);                
	  }
	  for (var i=0; i<$scope.outfits.length; ++i) {
	    $scope.data.push("Item "+i);
	  }

	});	
	
});

air.controller('itemCtrl', function($scope, $routeParams, outfits){

	outfits.list(function(data){
		$scope.outfit = data[$routeParams.id-1];
		$scope.deliveryOption = "1";
	})

	// animation on the item page
	$(document).ready(function(){
		$(".itemPic").hide();
		$(".checkoutInput").hide();
		$(".checkoutCredit").hide();
		$(".checkoutSubmit").hide();
		$(".itemPic").fadeIn(500);
		$(".checkoutInput").fadeIn(400, function(){
			$(".checkoutCredit").fadeIn(400, function(){
				$(".checkoutSubmit").fadeIn(400);
			})
		});
	});
});

// modal thing
