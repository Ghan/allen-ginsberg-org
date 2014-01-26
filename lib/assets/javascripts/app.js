'use strict';


// Declare app level module which depends on filters, and services
var app = angular.module('gApp', ['ngRoute','uiSlider', 'ngSanitize', 'gApp.filters', 'gApp.services', 'gApp.directives', 'gApp.controllers', 'angular-google-analytics']).
  config(['$routeProvider', '$locationProvider', 'AnalyticsProvider', function($routeProvider, $locationProvider, AnalyticsProvider) {
    // initial configuration
    AnalyticsProvider.setAccount('UA-47495641-1');

    // track all routes (or not)
    AnalyticsProvider.trackPages(true);

    //Optional set domain (Use 'none' for testing on localhost)
    //AnalyticsProvider.setDomainName('XXX');

    // url prefix (default is empty)
    // - for example: when an app doesn't run in the root directory
    AnalyticsProvider.trackPrefix('my-app');

    // Use analytics.js instead of ga.js
    AnalyticsProvider.useAnalytics(true);

    // Ignore first page view... helpful when using hashes and whenever your bounce rate looks obscenely low.
    AnalyticsProvider.ignoreFirstPageLoad(true);

    //Enabled eCommerce module for analytics.js
    AnalyticsProvider.useECommerce(true);

    //Enable enhanced link attribution
    AnalyticsProvider.useEnhancedLinkAttribution(true);

    //Enable analytics.js experiments
    AnalyticsProvider.setExperimentId('12345');

    //Set custom cookie parameters for analytics.js
    AnalyticsProvider.setCookieConfig({
      cookieDomain: 'allenginsberg.org',
      cookieName: 'AllenGinsbergWebsite',
      cookieExpires: 20000
    });

    // change page event name
    AnalyticsProvider.setPageEvent('$stateChangeSuccess');

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