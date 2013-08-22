'use strict';

/* Filters */

angular.module('gApp.filters', []).
  filter('interpolate', ['version', function(version) {
    return function(text) {
      return String(text).replace(/\%VERSION\%/mg, version);
    }
  }]).
  filter('formatDate', ['date', function(date){
  	var m_names = new Array("January", "February", "March", 
							"April", "May", "June", "July", "August", "September", 
							"October", "November", "December");
		var d = new Date(date);
		d.setDate(d.getDate() + 1);
		var curr_date = d.getDate();
		var curr_month = d.getMonth();
		var curr_year = d.getFullYear();
		return (curr_date == 1 && curr_month == 0) ? curr_year : m_names[curr_month] + " " + curr_date + ", " + curr_year;

  }]);