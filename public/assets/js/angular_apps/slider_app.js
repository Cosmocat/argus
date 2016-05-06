'use strict';

var app = angular.module('sliderApp', ['ngAnimate']);

app.controller('sliderCtrl', function ($scope, $http) {
	$scope.slidesLoaded = false;
	$scope.initSlider = function () {
		$http.get('/admin/slider/getslides/')
		.then(function (res) {
			$scope.slides = res.data;
			$scope.slidesLoaded = true;
			$scope.slides.reverse();
		});
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
