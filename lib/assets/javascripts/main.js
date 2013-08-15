//jQuery
$(document).ready(function(){

	// $.ajax({
	//   type: "GET",
	//   url: "http://localhost:8080/locomotive/api/content_types/life_events/entries/5201568298b399000200002e.json",
	//   data: { 
	//   	auth_token : api_token
	//   }
	// }).done(function( res ) {
	// 	var response = $.parseJSON(res);
	// 	var formattedDate = response.formatted_date;
	// 	var geo = response.geo[0];
	// 	var notable = response.notable[0];
	//   $.ajax({
	// 	  type: "GET",
	// 	  url: "http://localhost:8080/locomotive/api/content_types/archive_items/entries.json",
	// 	  data: { 
	// 	  	auth_token : api_token,
	// 	  	timeline_photo : true,
	// 	  	tldate : formattedDate,
	// 	  	tlgeo : geo,
	// 	  	tlnotable : notable
	// 	  }
	// 	}).done(function( res ) {
	// 	  var urlToUse = $.parseJSON(res).file_slash_image;
	// 	  console.log(urlToUse);
	// 	});
	// });
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