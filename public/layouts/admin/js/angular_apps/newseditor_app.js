'use strict';

var app = angular.module('newsEditorApp', ['ui.tinymce']);

app.controller('tinymceInit', function ($scope) {
	$scope.tinymceOptions = {
		inline: false,
		height: 300,
		plugins: [
		'advlist autolink lists link image imagetools charmap print preview anchor',
		'searchreplace visualblocks code fullscreen',
		'insertdatetime media table contextmenu paste code save'
		],
		toolbar:'insertfile undo redo | fontselect fontsizeselect | bold italic | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | link image',
		font_formats: 'Arial=arial,helvetica,sans-serif;Courier New=courier new,courier,monospace;AkrutiKndPadmini=Akpdmi-n',
		fontsize_formats: '8pt 10pt 12pt 14pt 18pt 24pt 36pt',
		save_enablewhendirty: false
	};
	$scope.ctrl.date = new Date();
});

app.controller('savenshareCtrl', function ($scope, $http) {
	$scope.save = function () {
		var data = { articleHeader: $scope.ctrl.articleHeader,
									articleBody: $scope.ctrl.tinymce,
									articleDate:  $scope.ctrl.date,
									articleId: $scope.ctrl.articleId };
		$http.post('/save', data)
			.then(function (res) {
				$scope.loadData($scope.page);
			});
	};

	$scope.savenshare = function () {
		tinymce.get('ui-tinymce-0').save();
		var data = { articleHeader: $scope.ctrl.articleHeader,
									articleBody: $scope.ctrl.tinymce,
									articleDate:  $scope.ctrl.date,
									articleId: $scope.ctrl.articleId,
									published: true };
		$http.post('/save', data)
			.then(function (res) {
				$scope.loadData($scope.page);
			});
	};
 });

app.controller('tinymceHtmlCtrl', function ($sce) {
	var ctrl = this;

	this.updateHtml = function () {
		ctrl.tinymceHtml = $sce.trustAsHtml(ctrl.tinymce);
	};
});

app.controller('getArticles', function ($scope, $http) {
	$scope.page = $scope.page || 1;
	$scope.loadData = function (pagenumber) {
		$http.get('/admin/newseditor/getarticles/' + pagenumber)
			.then(function (res) {
				var length = res.data.length;
				if (length < 10) {
					for (var i = 0; i < 10 - length; i++) {
						res.data.push({});
					}
				}

				$scope.articles = res.data;
			});
	};

	$scope.countArticles = function () {
		$http.get('/admin/newseditor/countarticles')
			.then(function (res) {
				$scope.maxpages = Math.floor(res.data.count / 10) + 1;
			});
	};

	$scope.increment = function () {
		if ($scope.page <  $scope.maxpages) {
			$scope.page = $scope.page + 1;
			$scope.loadData($scope.page);
		}
	};

	$scope.decrement = function () {
		if ($scope.page >  1) {
			$scope.page = $scope.page - 1;
			$scope.loadData($scope.page);
		}
	};

	$scope.firstpage = function () {
		$scope.page = 1;
		$scope.loadData($scope.page);
	};

	$scope.lastpage = function () {
		$scope.page = $scope.maxpages;
		$scope.loadData($scope.page);
	};

	$scope.init = function (pagenumber) {
		$scope.loadData(pagenumber);
		$scope.countArticles();
	};
});

app.controller('articleChange', function ($scope, $http) {
	$scope.pullArticle = function (articleId) {
		$http.get('/admin/newseditor/edit/' + articleId)
			.then(function (res) {
				$scope.ctrl.tinymce = res.data.body;
				$scope.ctrl.articleHeader = res.data.header;
				$scope.ctrl.updateHtml();
				$scope.ctrl.date = res.data.date;
				$scope.ctrl.articleId = res.data._id;
			});
	};

	$scope.publishArticle = function (articleId) {
		$http.post('/admin/newseditor/publish/' + articleId)
			.then(function () {
				$scope.loadData($scope.page);
			});
	};

	$scope.unpublishArticle = function (articleId) {
		$http.post('/admin/newseditor/unpublish/' + articleId)
			.then(function () {
				$scope.loadData($scope.page);
			});
	};

	$scope.deleteArticle = function (articleId) {
		$http.post('/admin/newseditor/delete/' + articleId)
			.then(function () {
				$scope.loadData($scope.page);
			});
	};
});