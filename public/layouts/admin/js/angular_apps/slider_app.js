'use strict';

var app = angular.module('sliderApp', ['ngAnimate', 'toggleSideBar', ]);

app.controller('sliderCtrl', function ($scope, $http) {
	$scope.imagesLoaded = false;
	$http.get('/admin/slider/getimages/')
		.then(function (res) {
			$scope.images = res.data;
			$scope.imagesLoaded = true;
		});
	/*$scope.images = [{
		src: 'uploads/0dee3f0065ebb5cf492d62231c25f855.JPG',
		title: 'Pic 1'
	}, {
		src: 'uploads/0dee3f0065ebb5cf492d62231c25f855.JPG',
		title: 'Pic 2'
	}, {
		src: 'uploads/0dee3f0065ebb5cf492d62231c25f855.JPG',
		title: 'Pic 3'
	}, {
		src: 'uploads/0dee3f0065ebb5cf492d62231c25f855.JPG',
		title: 'Pic 4'
	}, {
		src: 'uploads/0dee3f0065ebb5cf492d62231c25f855.JPG',
		title: 'Pic 5'
	}];*/
});

app.directive('slider', function ($timeout) {
	return {
		restrict: 'E',
		replace: true,
		scope: {
			images: '='
		},
		link: function (scope, elem, attrs) {
			console.log(scope.images);
			scope.currentIndex = 0;

			scope.next = function () {
			scope.currentIndex < scope.images.length - 1 ? scope.currentIndex++ : scope.currentIndex = 0;
		};

			scope.prev = function () {
			scope.currentIndex > 0 ? scope.currentIndex-- : scope.currentIndex = scope.images.length - 1;
		};

			scope.$watch('currentIndex', function () {
			scope.images.forEach(function (image) {
				image.visible = false;
			});
			scope.images[scope.currentIndex].visible = true;
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
