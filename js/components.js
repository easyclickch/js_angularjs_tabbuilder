var app = angular.module('components', ['tabsmodule']);

app.controller('tabcontroller', function($scope, tabservice) {
	var tabs = $scope.tabs = [];
	
	$scope.addTab = function() {
		var addingName = this.name;
		if (!addingName) {
			$scope.error = true;
			$('#tabNameGroup').addClass('has-error');
		} else {
			var tab = {name: this.name, content: this.content, createts: new Date()};
			tabservice.add(tab);
			$scope.select(tab);
			$scope.error = false;
			$scope.name = '';
			$scope.content = '';
			$scope.tabs = tabservice.list();
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
	
	$scope.select = function(tab) {
		angular.forEach(tabs, function(tab) {
			tab.selected = false;
		});
		tab.selected = true;
		tabservice.update(tab);
		$scope.tabs = tabservice.list();
	};
	
	$scope.saveEdit = function(tab) {
		tabservice.update(tab);
		$scope.tabs = tabservice.list();
		$('.editor').find('textarea').attr('disabled', 'disabled');
		$('.editor').addClass('hide');
		$('.display').removeClass('hide');
	};
	
	$scope.deleteTab = function(tab) {
		tabservice.remove(tab);
		$scope.tabs = tabservice.list();
	};
	
});

app.controller('panecontroller', function($scope, $element) {
	var panes = $scope.panes = [];

	$scope.select = function(pane) {
		angular.forEach(panes, function(pane) {
			pane.selected = false;
		});
		pane.selected = true;
	};
	
	this.addPane = function(pane) {
		if (pane.title == '') return;
		if (panes.length == 0) $scope.select(pane);
		$scope.panes.push(pane);
		$scope.select(pane);
	};
	
	this.deletePane = function(pane) {
		$scope.panes.splice($scope.panes[pane], 1);
	};
	
});

app.directive('tabs', function() {
	return {
		require: 'panecontroller',
		restrict: 'E',
		transclude: true,
		scope: {},
		controller: 'panecontroller',
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
		link: function(scope, element, attrs, panecontroller) {
			panecontroller.addPane(scope);
			element.on('dblclick', function(e) {
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

app.directive('modal', function() {
	return {
		restrict: 'E',
		transclude: true,
		// scope: {eid: '@'},
		template: 
			'<div class="modal fade" role="dialog">' +
				'<div class="modal-dialog">' +
					'<div class="modal-content">' +
						'<div class="modal-header">' +
							'<button type="button" class="close" data-dismiss="modal" ng-click="clearForm()" aria-hidden="true">&times;</button>' +
							'<h3 id="myModalHeader" class="modal-title">Add a New Tab</h3>' +
						'</div>' +
						'<div ng-transclude></div>' +
					'</div>' +
				'</div>' +
			'</div>',
		link: function(scope, element, attrs, panecontroller) {
		
		},
		replace: true
	};
});