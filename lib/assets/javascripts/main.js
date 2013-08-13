//jQuery
$(document).ready(function(){

$.ajax({
  type: "GET",
  url: "http://localhost:8080/locomotive/api/content_types/archive_items/entries.json",
  data: { 
  	auth_token : api_token,
  	archive_index: true
  }
}).done(function( res ) {
  $("body").append(res);
});
});