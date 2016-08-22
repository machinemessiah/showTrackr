angular.module('MyApp', ['ngCookies', 'ngResource', 'ngMessages', 'ngRoute', 'mgcrea.ngStrap'])
  .config(['$locationProvider', '$routeProvider', function($locationProvider, $routeProvider) {
  	// injects the locationprovider service used for configuring application linking paths
  	$locationProvider.html5Mode(true);

  	// routing
  	$routeProvider
  		.when('/', {
			templateUrl: 'views/home.html',
			controller: 'MainCtrl'
	  	})
	  	.when('/shows/:id', {
	    	templateUrl: 'views/detail.html',
	    	controller: 'DetailCtrl'
	  	})
	  	.when('/login', {
	    	templateUrl: 'views/login.html',
	    	controller: 'LoginCtrl'
	  	})
	  	.when('/signup', {
	    	templateUrl: 'views/signup.html',
	    	controller: 'SignupCtrl'
	  	})
	  	.when('/add', {
	    	templateUrl: 'views/add.html',
	    	controller: 'AddCtrl'
	  	})
	  	.otherwise({
	    	redirectTo: '/'
	  	});
}]);