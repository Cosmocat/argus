'use strict';

var app = angular.module('sliderApp', ['ngAnimate', 'toggleSideBar', 'galleryViewApp', 'ngDragDrop']);

app.controller('sliderCtrl', function ($scope, $http, $controller) {
	$controller('galleryCtrl', { $scope: $scope });
	$scope.initGallery(1);
	$scope.slidesLoaded = false;
	$scope.slidethumbs = [];

	$scope.initSlider = function () {
		$http.get('/admin/slider/getslides/')
		.then(function (res) {
			$scope.slides = [];
			$scope.slidethumbs = res.data.slice();
			res.data.forEach(function (slide) {
				if (slide.filename !== 'none') {
					$scope.slides.push(slide);
				}
			});
			$scope.slides.reverse();
			$scope.slidesLoaded = true;
		});
	};

	$scope.remove = function (orderId) {
		$http.post('/admin/slider_dragdrop/removeslide', { orderId: orderId })
			.then(function () {
				$scope.initSlider();
			});
	};

	$scope.thumbDropped = function (index) {
		var orderId = Number(index.target.getAttribute('id').slice(-1));
		$scope.slidethumbs[5 - orderId].filename = $scope.slidethumbs[6].filename;
		$scope.slidethumbs.pop();
		$http.post('/admin/slider_dragdrop/setslide',
			{ orderId: orderId, filename: $scope.slidethumbs[5 - orderId].filename })
			.then(
				$scope.initSlider()
			);
	};
});

app.directive('slider', function ($timeout) {
	return {
		restrict: 'E',
		replace: true,
		scope: {
			slides: '='
		},
		link: function (scope, elem, attrs) {
			scope.currentIndex = 0;

			scope.next = function () {
			scope.currentIndex < scope.slides.length - 1 ? scope.currentIndex++ : scope.currentIndex = 0;
		};

			scope.prev = function () {
			scope.currentIndex > 0 ? scope.currentIndex-- : scope.currentIndex = scope.slides.length - 1;
		};

			scope.$watch('currentIndex', function () {
			scope.slides.forEach(function (slide) {
				slide.visible = false;
			});
			scope.slides[scope.currentIndex].visible = true;
		});

		/* Start: For Automatic slideshow*/

			var timer;

			var sliderFunc = function () {
			timer = $timeout(function () {
				scope.next();
				timer = $timeout(sliderFunc, 3000);
			}, 3000);
		};

			sliderFunc();

			scope.$on('$destroy', function () {
			$timeout.cancel(timer);
		});

		/* End : For Automatic slideshow*/
		},
		templateUrl: 'templates/slider_template.html'
	};
});

app.directive('slidethumbNail', function () {
	return {
		restrict: 'A',
		replace: 'true',
		templateUrl: 'templates/slidethumbnail_dragdrop.html',
		controller: 'thumbCtrl'
	};
});
