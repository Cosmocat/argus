'use strict';

var app = angular.module('galleryApp', ['cgBusy', 'toggleSideBar', 'galleryViewApp'], function () {});

angular.module('galleryApp').value('cgBusyDefaults', {
	message: '',
	backdrop: false,
	templateUrl: 'templates/img_busy.html'
});

app.factory('checkFile', function () {
	var allowedTypes = ['image/jpg',
											'image/jpeg',
											'image/gif',
											'image/png'];
	return {
		checkSize: function (file) {
			if (file.size > 1024 * 1024 * 10) return false; else return true;
		},
		checkType: function (file) {
			var index = allowedTypes.indexOf(file.type);
			if (index == -1) return false; else return true;
		}
	};
});

app.run(function ($rootScope, $timeout) {
	$rootScope.alerts = [];

	$rootScope.addAlert = function (alertObj, duration) {
		var newAlertObj = alertObj;
		newAlertObj.uid = Math.floor(Math.random() * 100000);
		var alertIndex;

		$rootScope.alerts.push(newAlertObj);

		if (duration !== 'stay') {
			$timeout(function () {
				for (var i = 0; i < $rootScope.alerts.length; i++) {
					if ($rootScope.alerts[i].uid === newAlertObj.uid) {
						alertIndex = i;
						break;
					}
				}

				$rootScope.alerts.splice(alertIndex, 1);
			}, duration || 2500);
		}
	};

	$rootScope.closeAlert = function (index) {
		$rootScope.alerts.splice(index, 1);
	};
});

fileUploadCtrl.$inject = ['$scope', '$rootScope', 'checkFile'];
function fileUploadCtrl(scope, rootScope, checkFile) {
		//============== DRAG & DROP =============
		// source for drag&drop: http://www.webappers.com/2011/09/28/drag-drop-file-upload-with-html5-javascript/
	var dropbox = document.getElementById('dropbox');
	scope.dropText = 'You can add 10 more files, drop files here or click this icon';

	// init event handlers
	function dragEnterLeave(evt) {
		evt.stopPropagation();
		evt.preventDefault();
		scope.$apply(function () {
			scope.dropText = scope.dropText || 'You can add 10 more files, drop files here or click this icon';
			scope.dropClass = '';
		});
	}

	dropbox.addEventListener('dragenter', dragEnterLeave, false);
	dropbox.addEventListener('dragleave', dragEnterLeave, false);
	dropbox.addEventListener('dragover', function (evt) {
		evt.stopPropagation();
		evt.preventDefault();
		var ok = evt.dataTransfer && evt.dataTransfer.types && evt.dataTransfer.types.indexOf('Files') >= 0;
		scope.$apply(function () {
			scope.dropText = ok ? scope.dropText : 'Only files are allowed!';
			scope.dropClass = ok ? 'over' : 'not-available';
		});
	}, false);
	dropbox.addEventListener('drop', function (evt) {
		//console.log('drop evt:', JSON.parse(JSON.stringify(evt.dataTransfer)));
		evt.stopPropagation();
		evt.preventDefault();
		scope.files = scope.files || [];
		scope.wrongfiles = 0;
		scope.extrafiles = 0;
		scope.filesaddedbefore = 0;
		var files = evt.dataTransfer.files;
		var filesLength;
		scope.extrafiles = files.length - (10 - scope.files.length);
		if (scope.files.length >= 10) {
			filesLength = -1;
		} else if (files.length > 10 || scope.files.length + files.length > 10) {
			filesLength = 10 - scope.files.length;
		} else { filesLength = files.length; }

		if (files.length > 0) {
			scope.$apply(function () {
				for (var i = 0; i < filesLength; i++) {
					if (checkFile.checkSize(files[i]) && checkFile.checkType(files[i])) {
						var index = scope.files.map(function (e) { return e.name; }).indexOf(files[i].name);
						if (index == -1) {
							scope.files.push(files[i]);
						} else {
							scope.filesaddedbefore += 1;
						}
					} else {
						scope.wrongfiles += 1;
					}
				}
			});
		}

		scope.$apply(function () {
			scope.addAlerts();
			scope.updateDropBox();
		});
	}, false);

	scope.updateDropBox = function () {
		var filesLeft = 10 - scope.files.length;
		if (filesLeft > 0) {
			scope.dropText = 'You can add ' + filesLeft +
				' more files, drop files here or click this icon';
			scope.dropClass = '';
		} else {
			scope.dropText = 'You have reached maximum amount of files. Upload selected files!';
			scope.dropClass = 'over';
		}
	};

	scope.addAlerts = function () {
		if (scope.extrafiles > 0) {
			rootScope.addAlert(
				{ type: 'info',
					msg: 'You tried to upload ' + scope.extrafiles + ' more files than you allowed at this time' },
					5000);
		}

		if (scope.filesaddedbefore > 0) {
			rootScope.addAlert(
				{ type: 'info',
					msg: 'You tried to upload ' +
					scope.filesaddedbefore +
					' files that already added to upload list' },
					5000);
		}

		if (scope.wrongfiles > 0) {
			rootScope.addAlert(
				{ type: 'info',
					msg: scope.wrongfiles + ' files did not meet rules and cannot be uploaded' },
					5000);
		}
	};
	//============== DRAG & DROP =============

	scope.setFiles = function (element) {
		scope.$apply(function (scope) {
			// Turn the FileList object into an Array
			scope.files = scope.files || [];
			scope.wrongfiles = 0;
			scope.extrafiles = 0;
			scope.filesaddedbefore = 0;
			var filesLength;
			scope.extrafiles = element.files.length - (10 - scope.files.length);
			if (scope.files.length >= 10) {
				filesLength = -1;
			} else if (element.files.length > 10 || scope.files.length + element.files.length > 10) {
				filesLength = 10 - scope.files.length;
			} else { filesLength = element.files.length; }

			for (var i = 0; i < filesLength; i++) {
				if (checkFile.checkSize(element.files[i]) && checkFile.checkType(element.files[i])) {
					var index = scope.files.map(function (e) { return e.name; }).indexOf(element.files[i].name);
					if (index == -1) {
						scope.files.push(element.files[i]);
					} else { scope.filesaddedbefore += 1; }
				} else { scope.wrongfiles += 1; }
			}

			scope.addAlerts();
			scope.updateDropBox();
			scope.progressVisible = false;
		});
	};

	scope.uploadFile = function () {
		var fd = new FormData();
		for (var i in scope.files) {
			fd.append('uploadedImages', scope.files[i]);
		}

		var xhr = new XMLHttpRequest();
		xhr.upload.addEventListener('progress', uploadProgress, false);
		xhr.addEventListener('load', uploadComplete, false);
		xhr.addEventListener('error', uploadFailed, false);
		xhr.addEventListener('abort', uploadCanceled, false);
		xhr.open('POST', '/admin/gallery/imgupload');
		scope.progressVisible = true;
		xhr.send(fd);
	};

	scope.removeFromList = function (filename) {
		var index = scope.files.map(function (e) { return e.name; }).indexOf(filename);
		if (index !== -1) {
			scope.files.splice(index, 1);
		}

		scope.updateDropBox();
	};

	function uploadProgress(evt) {
		scope.$apply(function () {
			if (evt.lengthComputable) {
				scope.progress = Math.round(evt.loaded * 100 / evt.total);
			} else {
				scope.progress = 'unable to compute';
			}
		});
	}

	function uploadComplete(evt) {
	/* This event is raised when the server send back a response */
		scope.$apply(function (scope) {
			scope.files = [];
			scope.progressVisible = false;
			scope.updateDropBox();
			scope.initGallery(1);
		});
	}

	function uploadFailed(evt) {
		console.log('There was an error attempting to upload the file.');
	}

	function uploadCanceled(evt) {
		scope.$apply(function () {
			scope.progressVisible = false;
		});
		alert('The upload has been canceled by the user or the browser dropped the connection.');
	}
}

app.controller('fileUploadCtrl', fileUploadCtrl);