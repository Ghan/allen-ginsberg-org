'use strict';


// Declare app level module which depends on filters, and services
var app = angular.module('gApp', ['uiSlider', 'ngSanitize', 'gApp.filters', 'gApp.services', 'gApp.directives', 'gApp.controllers']).
  config(['$routeProvider', function($routeProvider) {
    $routeProvider.when('/', {templateUrl: 'partials/index.html', controller: 'indexCtrl'});
    $routeProvider.when('/announcements', {templateUrl: 'partials/announcements.html', controller: 'blogCtrl'});
    $routeProvider.when('/announcements/:id', {templateUrl: 'partials/blog-post.html', controller: 'blogPostCtrl'});
    $routeProvider.when('/biography', {templateUrl: 'partials/biography.html', controller: 'biographyCtrl'});
    $routeProvider.when('/works', {templateUrl: 'partials/works.html', controller: 'worksCtrl'});
    $routeProvider.when('/works/:type', {templateUrl: 'partials/works.html', controller: 'worksCtrl'});
    $routeProvider.when('/works/:type/:id/:slug', {templateUrl: 'partials/works-detail.html', controller: 'worksDetailCtrl'});
    $routeProvider.when('/archive', {templateUrl: 'partials/archive.html', controller: 'archiveCtrl'});
    $routeProvider.when('/archive/:type', {templateUrl: 'partials/archive-type.html', controller: 'archiveTypeCtrl'});
    $routeProvider.when('/archive/:type/:id', {templateUrl: 'partials/archive-detail.html', controller: 'archiveDetailCtrl'});
    $routeProvider.when('/links', {templateUrl: 'partials/links.html', controller: 'linksCtrl'});
    $routeProvider.otherwise({redirectTo: '/'});
  }]);