'use strict';

var app = angular.module('sliderApp', ['ngAnimate', 'toggleSideBar', 'galleryViewApp', 'ngDragDrop']);

app.factory('slideCounter', function () {
	return {
		noneCounter: function (slides) {
			var noneCounter = 0;
			slides.forEach(function (slide) {
				if (slide.filename == 'none') { noneCounter++; }
			});
			if (noneCounter < 6) { return true; } else { return false; }
		}
	};
});

app.controller('sliderCtrl', function (slideCounter, $scope, $http, $controller) {
	$controller('galleryCtrl', { $scope: $scope });
	$scope.initGallery(1);
	$scope.slidesLoaded = false;
	$scope.initSlider = function () {
		$http.get('/admin/slider/getslides/')
		.then(function (res) {
			$scope.slides = res.data;
			$scope.slides.reverse();
			$scope.slidesLoaded = true;
			$scope.noneCounter = slideCounter.noneCounter($scope.slides);
		});
	};

	$scope.remove = function (orderId) {
		$http.post('/admin/slider_dragdrop/removeslide', { orderId: orderId })
			.then(function () {
				$scope.slides[orderId].filename = 'none';
				console.log($scope.currentIndex);
				$scope.noneCounter = slideCounter.noneCounter($scope.slides);
			});
	};

	$scope.thumbDropped = function (index) {
		var orderId = Number(index.target.getAttribute('id').slice(-1));
		$scope.slides[orderId].filename = $scope.slides[6].filename;
		$scope.slides.pop();
		$scope.noneCounter = slideCounter.noneCounter($scope.slides);
		$http.post('/admin/slider_dragdrop/setslide',
			{ orderId: orderId, filename: $scope.slides[orderId].filename });
	};
});

app.directive('slider', function ($timeout, slideCounter) {
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
			if (scope.slides[scope.currentIndex].filename == 'none') { scope.next(); }
		};

			scope.prev = function () {
			scope.currentIndex > 0 ? scope.currentIndex-- : scope.currentIndex = scope.slides.length - 1;
			if (scope.slides[scope.currentIndex].filename == 'none') {scope.prev(); }
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
