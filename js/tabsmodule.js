var tabsModule = angular.module('tabsmodule', []);

// tab = {'name':string,'content':string,'createts':date,'selected':boolean}
tabsModule.factory('tabservice', function() {
	var tabs = [];
	var tabServiceImpl = {};
	var serviceError = 'Error occurred in tabsmodule:tabservice:';
	
	tabServiceImpl.add = function(tab) {
		try {
			tabs.push(tab);
			return {error: false, message: ''};
		} catch (err) {
			return {error: true, message: serviceError + 'add'};
		}
	}
	
	tabServiceImpl.update = function(tab) {
		try {
			angular.forEach(tabs, function(i) {
				if (i.createts === tab.createts) {
					i.name = tab.name;
					i.content = tab.content;
				}
			});
			return {error: false, message: ''};
		} catch (err) {
			return {error: true, message: serviceError + 'update'};
		}
	}
	
	tabServiceImpl.remove = function(tab) {
		try {
			tabs.splice(tabs[tab], 1);
		} catch (err) {
			return {error: true, message: serviceError + 'remove'};
		}
	}
	
	tabServiceImpl.list = function() {
		return tabs;
	}
	
	return tabServiceImpl;
});