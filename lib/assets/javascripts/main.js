//jQuery
$(document).ready(function(){

	$.ajax({
	  type: "GET",
	  url: "http://localhost:8080/locomotive/api/content_types/life_events/entries.json",
	  data: { 
	  	auth_token : api_token
	  }
	}).done(function( res ) {
		console.log(res);
	});
});

// HELPER FUNCTIONS
function predicatBy(prop){
   return function(a,b){
      if( a[prop] > b[prop]){
          return 1;
      }else if( a[prop] < b[prop] ){
          return -1;
      }
      return 0;
   }
}

function formatDate(date){
	var m_names = new Array("January", "February", "March", 
							"April", "May", "June", "July", "August", "September", 
							"October", "November", "December");
	var d = new Date(date);
	d.setDate(d.getDate() + 1);
	var curr_date = d.getDate();
	var curr_month = d.getMonth();
	var curr_year = d.getFullYear();
	return (curr_date == 1 && curr_month == 0) ? curr_year : m_names[curr_month] + " " + curr_date + ", " + curr_year;
}