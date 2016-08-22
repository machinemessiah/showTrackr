angular.module('MyApp').controller('AddCtrl', ['$scope', '$alert', 'Show', function(){

	$scope.addShow = function() {
		Show.save(
			{ showName: $scope.showName },
			// callback on success
			function() {
				// reset form and show user alert
				$scope.showName = '';
				// form will be $dirty since the user has entered data, we need to reset it to $pristine
				$scope.addForm.$setPristine();
				// $alert is part of AngularStrap
				$alert({
					content: 'TV show has been added.',
		            placement: 'top-right',
		            type: 'success',
		            duration: 3
				});
			},
			// error
			function(response) {
				// reset form and show user alert
				$scope.showName = '';
				// form will be $dirty since the user has entered data, we need to reset it to $pristine
				$scope.addForm.$setPristine();
				// $alert is part of AngularStrap
				$alert({
					content: response.data.message,
					placement: 'top-right',
					type: 'danger',
					duration: 3
				});
			}
		);
	}

}]);