//jQuery
$(document).ready(function(){

$.ajax({
  type: "GET",
  url: "http://localhost:8080/locomotive/api/content_types/published_work/entries.json",
  data: { 
  	auth_token : api_token,
  	work_type : "book"
  }
}).done(function( res ) {
  $("body").append(res);
});
});