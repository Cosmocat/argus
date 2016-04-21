'use strict';

var app = angular.module('newsApp', []);

app.controller('pullNews', function ($scope, $http, $sce) {
	$scope.loadData = function () {
		$http.get('/pullnews')
			.then(function (res) {
				$scope.news = res.data;
				$scope.news.forEach(function (item) {
					item.body = $sce.trustAsHtml(item.body);
				});
			});
	};

	$scope.loadData();
});