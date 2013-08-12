'use strict';


// Declare app level module which depends on filters, and services
var app = angular.module('gApp', ['ngSanitize', 'gApp.filters', 'gApp.services', 'gApp.directives', 'gApp.controllers']).
  config(['$routeProvider', function($routeProvider) {
    $routeProvider.when('/', {templateUrl: 'partials/index.html', controller: 'indexCtrl'});
    $routeProvider.when('/announcements', {templateUrl: 'partials/announcements.html', controller: 'announcementsCtrl'});
    $routeProvider.when('/biography', {templateUrl: 'partials/biography.html', controller: 'biographyCtrl'});
    $routeProvider.when('/works', {templateUrl: 'partials/works.html', controller: 'worksCtrl'});
    $routeProvider.when('/archive', {templateUrl: 'partials/archive.html', controller: 'archiveCtrl'});
    $routeProvider.when('/links', {templateUrl: 'partials/links.html', controller: 'linksCtrl'});
    $routeProvider.otherwise({redirectTo: '/'});
  }]);