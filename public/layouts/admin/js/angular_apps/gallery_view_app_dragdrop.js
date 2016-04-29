'use strict';

var app = angular.module('galleryViewApp', ['ui.bootstrap'], function () {});

app.controller('galleryCtrl', function ($scope, $http) {
	$scope.page = $scope.page || 1;

	$scope.getImages = function (pagenumber) {
		$http.get('/admin/gallery/getimages/' + pagenumber)
			.then(function (res) {
				$scope.images = res.data;
			});
	};

	$scope.countImages = function () {
		$http.get('/admin/gallery/countimages')
			.then(function (res) {
				$scope.totalImages = res.data.count;
				res.data.count > 18 ? $scope.maxpages = Math.floor(res.data.count / 18) + 1 : $scope.maxpages = 1;
			});
	};

	$scope.increment = function () {
		if ($scope.page <  $scope.maxpages) {
			$scope.page = $scope.page + 1;
			$scope.getImages($scope.page);
		}
	};

	$scope.decrement = function () {
		if ($scope.page >  1) {
			$scope.page = $scope.page - 1;
			$scope.getImages($scope.page);
		}
	};

	$scope.firstpage = function () {
		$scope.page = 1;
		$scope.getImages($scope.page);
	};

	$scope.lastpage = function () {
		$scope.page = $scope.maxpages;
		$scope.getImages($scope.page);
	};

	$scope.initGallery = function (pagenumber) {
		$scope.countImages();
		$scope.getImages(pagenumber);
	};
});

app.controller('thumbCtrl', function ($scope, $http) {
	$scope.setIndex = function (index) {
		$scope.localIndex = index;
	};

	$scope.rotate = function (img) {
		if (!$scope.promises) {
			$scope.promises = {};
		}

		$scope.promises[img] =
			$http.post('/admin/gallery/imgrotate/' + img)
				.then(function () {
					var index = $scope.images.map(function (e) { return e.filename; }).indexOf(img);
					$scope.images[index].filename =
						$scope.images[index].filename + '?' + new Date().getTime();
				});
	};
});

app.controller('fullImgModalCtrl', function ($scope, $modal) {
	$scope.open = function (index) {
		var modalInstance = $modal.open({
			templateUrl: 'templates/fullimage_modal.html',
			controller: 'fullImgViewCtrl',
			windowClass: 'auto-modal',
			resolve: {
				image: function () {
					return $scope.images[index];
				}
			}
		});

		modalInstance.result.then(function () {
		}, function () {
			//$log.info('Modal dismissed at: ' + new Date());
		});
	};
});

app.controller('fullImgViewCtrl', function ($scope, $modalInstance, $http, image) {
	$scope.image = image;
	$http.get('/admin/gallery/getimages')
			.then(function (res) {
				$scope.images = res.data;
				$scope.index =
					$scope.images.map(function (e) { return e.filename; })
						.indexOf(image.filename.substring(0, 36));
				$scope.total = $scope.images.length;
			});

	$scope.prev = function () {
		$scope.index--;
		if ($scope.index == -1) {
			$scope.image = $scope.images[$scope.total - 1];
			$scope.index = $scope.total - 1;
		} else { $scope.image = $scope.images[$scope.index]; }
	};

	$scope.next = function () {
		$scope.index++;
		if ($scope.index == $scope.total) {
			$scope.image = $scope.images[0];
			$scope.index = 0;
		} else { $scope.image = $scope.images[$scope.index]; }
	};

	$scope.close = function () {
		$modalInstance.dismiss();
	};
});

app.directive('thumbNail', function () {
	return {
		restrict: 'A',
		replace: 'true',
		templateUrl: 'templates/thumbnail_dragdrop.html',
		controller: 'thumbCtrl'
	};
});