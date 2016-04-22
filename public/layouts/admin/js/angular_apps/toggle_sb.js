var app = angular.module('toggleSideBar', [], function () {});
// Side menubar toggle
app.controller('toggleCtrl', function ($scope) {
	$scope.toggle = function () {
		$scope.toggler = !$scope.toggler;
	};
});
