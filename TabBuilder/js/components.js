var app = angular.module('components', []);

app.controller('tabCtrl', function($scope) {
	var tabs = $scope.tabsCollection = [];
	
	$scope.addTab = function() {
		var addingName = $scope.name;
		if (!addingName) {
			$scope.error = true;
			$('#tabNameGroup').addClass('has-error');
		} else {
			tabs.push({name: $scope.name, content: $scope.content});
			$scope.error = false;
			$scope.name = '';
			$scope.content = '';
			$('#tabNameGroup').removeClass('has-error');
			$('#newTabModal').modal('toggle');
		}
	};
	
	$scope.clearForm = function() {
		$scope.error = false;
		$scope.name = '';
		$scope.content = '';
		$('#tabNameGroup').removeClass('has-error');
	};
	
	$scope.saveEdit = function() {
		$('.editor').find('textarea').attr('disabled', 'disabled');
		$('.editor').addClass('hide');
		$('.display').removeClass('hide');
	};
	
	$scope.deleteTab = function(tab) {
		tabs.splice(tabs[tab], 1)
	};
	
});

app.controller('paneCtrl', function($scope, $element) {
	var panes = $scope.panes = [];
	var tabs = $scope.tabsCollection;

	$scope.select = function(pane) {
		angular.forEach(panes, function(pane) {
			pane.selected = false;
		});
		pane.selected = true;
	};
	
	this.addPane = function(pane) {
		if (pane.title == '') return;
		if (panes.length == 0) $scope.select(pane);
		panes.push(pane);
		$scope.select(pane);
	};
	
	$scope.deletePane = function(pane) {
		panes.splice(panes[pane], 1)
	};
});

app.directive('tabs', function() {
	return {
		require: 'paneCtrl',
		restrict: 'E',
		transclude: true,
		scope: {},
		controller: 'paneCtrl',
		template:
			'<div class="tabbable">' +
				'<ul class="nav nav-tabs">' +
					'<li ng-repeat="pane in panes" ng-class="{active:pane.selected}">'+
						'<a href="#" ng-click="select(pane)">{{pane.title}}</a>' +
					'</li>' +
					'<li><a href="#newTabModal" role="button" data-toggle="modal">New Tab &#43;</a></li>' +
				'</ul>' +
				'<div class="tab-content" ng-transclude></div>' +
			'</div>',
		replace: true
	};
});

app.directive('pane', function() {
	return {
		require: '^tabs',
		restrict: 'E',
		transclude: true,
		scope: { title: '@' },
		link: function(scope, element, attrs, tabsCtrl) {
			tabsCtrl.addPane(scope);
			element.on('dblclick', function() {
				$(this).children('.display').addClass('hide');
				$(this).children('.editor').removeClass('hide');
				$(this).children('.editor').find('textarea').removeAttr('disabled');
			});
		},
		template:
			'<div class="tab-pane" style="padding:10px" ng-class="{active: selected}" ng-transclude></div>',
		replace: true
	};
});