'use strict';

var app = angular.module('navbarApp', ['ui.bootstrap']);

// Side menubar toggle
app.controller('toggleCtrl', function ($scope) {
	$scope.toggle = function () {
		$scope.toggler = !$scope.toggler;
	};
});

app.controller('getMenus', function ($scope, $http) {
	$scope.getMenus = function () {
		$http.get('/admin/navbar/getmenus')
			.then(function (res) {
					$scope.menus = res.data;
				});
	};

	$scope.getChildren = function (menulink) {
		var children = [];
		var menus = $scope.menus;
		for (var i = 0; i < menus.length; i++) {
			if (menus[i].parent == menulink._id) {
				children.push(menus[i]);
			}
		}

		return children;
	};

	$scope.$on('menuAdded', function (event, menu) {
		if (menu.parent != 'top') {
			var index = $scope.menus.map(function (e) { return e._id; }).indexOf(menu.parent);
			$scope.menus[index].hasChildren += 1;
		}

		$scope.menus.push({	_id: menu._id,
												body: menu.menuName,
												parent: menu.parent,
												hasChildren: 0 });
	});

	$scope.$on('menuDeleted', function (event, menu) {
		var index;

		if (menu.parent != 'top') {
			index = $scope.menus.map(function (e) { return e._id; }).indexOf(menu.parent);
			$scope.menus[index].hasChildren -= 1;
		}

		index = $scope.menus.map(function (e) { return e._id; }).indexOf(menu._id);
		$scope.menus.splice(index, 1);
	});
});

app.controller('addModalCtrl', function ($scope, $modal, $http) {
	$scope.menuLink = { body: '' };

	$scope.open = function () {
		var modalInstance = $modal.open({
			templateUrl: 'templates/addmenulink_modal.html',
			controller: 'addMenuLink',
			resolve: {
				menuLink: function () {
					return $scope.menuLink;
				}
			}
		});

		modalInstance.result.then(function () {
			if (!$scope.menulink) {
				$http.post('/admin/navbar/addmenu', { menuName: $scope.menuLink.body })
					.then(function (res) {
						$scope.$emit('menuAdded', { menuName: $scope.menuLink.body,
																				_id: res.data._id });
						$scope.menuLink.body = '';
					});
			} else {
				$http.post('/admin/navbar/addmenu', { menuName: $scope.menuLink.body,
																							parentId: $scope.menulink._id })
					.then(function (res) {
						$scope.$emit('menuAdded', { menuName: $scope.menuLink.body,
																				_id: res.data._id,
																				parent: res.data.parent });
						$scope.menuLink.body = '';
					});
			}
		}, function () {
			//$log.info('Modal dismissed at: ' + new Date());
		});
	};
});

app.controller('addMenuLink', function ($scope, $modalInstance, menuLink) {
	$scope.menuLink = menuLink;

	$scope.save = function () {
		$modalInstance.close();
	};

	$scope.cancel = function () {
		$modalInstance.dismiss();
	};
});

app.controller('delModalCtrl', function ($scope, $modal, $http) {
	$scope.open = function () {
		var modalInstance = $modal.open({
			templateUrl: 'templates/delmenulink_modal.html',
			controller: 'delMenuLink'
		});

		modalInstance.result.then(function () {
			$http.post('/admin/navbar/delmenu', { menuId: $scope.$parent.menulink._id,
																						menuParent: $scope.$parent.menulink.parent })
				.then(function () {
					$scope.$emit('menuDeleted', $scope.$parent.menulink);
				});
		}, function () {
			//$log.info('Modal dismissed at: ' + new Date());
		});
	};
});

app.controller('delMenuLink', function ($scope, $modalInstance) {
	$scope.del = function () {
		$modalInstance.close();
	};

	$scope.cancel = function () {
		$modalInstance.dismiss();
	};
});

app.controller('editModalCtrl', function ($scope, $modal, $http) {
	$scope.open = function () {
		var modalInstance = $modal.open({
			templateUrl: 'templates/editmenulink_modal.html',
			controller: 'editMenuLink',
			resolve: {
				menuLink: function () {
					return $scope.menuLink = $scope.$parent.menulink;
				}
			}
		});

		modalInstance.result.then(function () {
			$http.post('/admin/navbar/editmenu', { menuId: $scope.menuLink._id,
																						 menuName: $scope.menuLink.body })
				.then(function () {
					//$scope.$emit('menuEdited', { _id: $scope.$parent.menulink._id });
				});
		}, function () {
			//$log.info('Modal dismissed at: ' + new Date());
		});
	};
});

app.controller('editMenuLink', function ($scope, $modalInstance, menuLink) {
	$scope.menuLink = menuLink;
	$scope.save = function () {
		$modalInstance.close();
	};

	$scope.cancel = function () {
		$modalInstance.dismiss();
	};
});

/*app.directive('contenteditable', function () {
	return {
		require: 'ngModel',
		link: function (scope, elm, attrs, ctrl) {
		// view -> model
			elm.bind('blur', function () {
				scope.$apply(function () {
					ctrl.$setViewValue(elm.html());
				});
			});

			// model -> view
			ctrl.render = function (value) {
				elm.html(value);
			};

			// load init value from DOM
			ctrl.$setViewValue(elm.html());

			elm.bind('keydown', function (event) {
				console.log('keydown ' + event.which);
				var esc = event.which == 27,
				el = event.target;

				if (esc) {
					console.log('esc');
					ctrl.$setViewValue(elm.html());
					el.blur();
					event.preventDefault();
				}
			});
		}
	};
});*/