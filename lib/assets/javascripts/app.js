'use strict';


// Declare app level module which depends on filters, and services
var app = angular.module('gApp', ['ngRoute','uiSlider', 'ngSanitize', 'gApp.filters', 'gApp.services', 'gApp.directives', 'gApp.controllers']).
  config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {
    $routeProvider.when('/', {templateUrl: 'partials/index.html', controller: 'indexCtrl'});
    $routeProvider.when('/blog', {templateUrl: 'partials/announcements.html', controller: 'blogCtrl'});
    $routeProvider.when('/blog/:id', {templateUrl: 'partials/blog-post.html', controller: 'blogPostCtrl'});
    $routeProvider.when('/biography', {templateUrl: 'partials/biography.html', controller: 'biographyCtrl'});
    $routeProvider.when('/works', {templateUrl: 'partials/works.html', controller: 'worksCtrl'});
    $routeProvider.when('/works/:type', {templateUrl: 'partials/works.html', controller: 'worksCtrl'});
    $routeProvider.when('/works/:type/:slug', {templateUrl: 'partials/works-detail.html', controller: 'worksDetailCtrl'});
    $routeProvider.when('/archive', {templateUrl: 'partials/archive.html', controller: 'archiveCtrl'});
    $routeProvider.when('/archive/:type', {templateUrl: 'partials/archive.html', controller: 'archiveCtrl'});
    $routeProvider.when('/archive/:type/:slug', {templateUrl: 'partials/archive-detail.html', controller: 'archiveDetailCtrl'});
    $routeProvider.when('/links', {templateUrl: 'partials/links.html', controller: 'linksCtrl'});
    $routeProvider.when('/contact', {templateUrl: 'partials/contact.html', controller: 'contactCtrl'});
    $routeProvider.when('/admin', {templateUrl: 'partials/admin.html', controller: 'adminCtrl'});
    $routeProvider.otherwise({redirectTo: '/'});
    $locationProvider.html5Mode(false);
    $locationProvider.hashPrefix('!');
  }]);