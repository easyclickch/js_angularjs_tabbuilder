var panesModule = angular.module('panesmodule', []);

panesModule.factory('paneservice', function() {
	var panes = [];
	var paneserviceImpl = {};
	var serviceError = 'Error occurred in panesmodule:paneservice:';
	
	paneserviceImpl.add = function(pane) {
		try {
			panes.push(pane);
			return {error: false, message: ''};
		} catch (err) {
			return {error: true, message: serviceError + 'add'};
		}
	}
	
	paneserviceImpl.update = function(pane) {
		try {
			angular.forEach(panes, function(i) {
				if (i.createts === pane.createts) {
					i.name = pane.name;
					i.content = pane.content;
				}
			});
			return {error: false, message: ''};
		} catch (err) {
			return {error: true, message: serviceError + 'update'};
		}
	}
	
	paneserviceImpl.remove = function(pane) {
		try {
			panes.splice(panes[pane], 1);
		} catch (err) {
			return {error: true, message: serviceError + 'remove'};
		}
	}
	
	paneserviceImpl.list = function() {
		return panes;
	}
	
	return paneserviceImpl;
});