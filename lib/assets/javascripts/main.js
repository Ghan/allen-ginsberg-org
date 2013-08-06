//jQuery
$(document).ready(function(){

$.ajax({
  type: "GET",
  url: "http://localhost:8080/locomotive/api/content_types/link_categories/entries.json",
  data: { auth_token : api_token }
}).done(function( res ) {
  $("body").append(res);
});
});