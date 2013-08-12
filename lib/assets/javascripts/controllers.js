'use strict';

/* Controllers */
angular.module('gApp.controllers', []).
  controller('indexCtrl', [function() {

  }])
  .controller('biographyCtrl', ['$scope', 'bioMichaelService', function($scope, bioMichaelService) { 
  	bioMichaelService.getBio(api_token, function(data){
  		$scope.bioByMichael = data;
  	});
  	
  }])
  .controller('worksCtrl', [function() {

  }])
  .controller('archiveCtrl', [function() {

  }])
  .controller('linksCtrl', [function() {

  }]);