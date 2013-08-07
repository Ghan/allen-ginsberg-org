//jQuery
$(document).ready(function(){

$.ajax({
  type: "GET",
  url: "http://localhost:8080/locomotive/api/content_types/life_events/entries.json",
  data: { 
  	auth_token : api_token
  }
}).done(function( res ) {
  $("body").append(res);
});
});