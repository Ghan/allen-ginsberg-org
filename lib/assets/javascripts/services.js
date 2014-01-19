'use strict';

/* Services */


// Demonstrate how to register services
// In this case it is a simple value service.
angular.module('gApp.services', []).
  factory('Blog', [function() {
    var Blog = {};
    return Blog;
  }]).
  factory('Links', [function() {
    var Links = {};
    return Links;
  }]).
  factory('Timeline', [function() {
    var Timeline = {};
    return Timeline;
  }]).
  factory('Works', [function() {
    var Works = {};
    return Works;
  }]).
  factory('Archive', [function() {
    var Archive = {};
    return Archive;
  }]).
  factory('homepageService', ['$http', function($http) {
    return{
      name: 'Homepage Service',
      getData: function(token, callback){
        $http.get(appPath+'locomotive/api/pages/5227470b8d174f927b000007.json?auth_token='+token, {cache: true}).success(function(data) {
          callback(data.raw_template);
        });
      }
    }
  }]).
  factory('blogService', ['$http', function($http) {
    return{
      name: 'Blog Service',
      getItems: function(token, pageToken, direction, callback){
        var pageTokenString = "";
        if(pageToken){
          pageTokenString = "&pageToken="+pageToken;
        }
        $http.get('https://www.googleapis.com/blogger/v3/blogs/646811856861412164/posts?key='+token+pageTokenString+'&maxResults=12', {cache: true}).success(function(data) {
          var newData = [data, direction ]
          callback(newData);
        });
      }
    }
  }]).
  factory('blogPostService', ['$http', function($http) {
    return{
      name: 'Blog Post Service',
      getPost: function(token, page, callback){
        $http.get('https://www.googleapis.com/blogger/v3/blogs/646811856861412164/posts/'+page+'?key='+token, {cache: true}).success(function(data) {
          callback(data);
        });
      }
    }
  }]).
  factory('contactService', ['$http', function($http) {
    return{
      name: 'Contact Page Service',
      getBio: function(token, callback){
        $http.get(appPath+'locomotive/api/pages/52320c2d4b84c67c6200002d.json?auth_token='+token, {cache: true}).success(function(data) {
          callback(data.raw_template);
        });
      }
    }
  }]).
	factory('bioMichaelService', ['$http', function($http) {
    return{
      name: 'Bio Michael Service',
      getBio: function(token, callback){
        $http.get(appPath+'locomotive/api/pages/5202e463228ae5000200000d.json?auth_token='+token, {cache: true}).success(function(data) {
          callback(data.raw_template);
        });
      }
    }
	}]).
	factory('timelineService', ['$http', function($http) {
    return{
      name: 'Timeline Service',
      getData: function(token, callback){
        $http.get(appPath+'locomotive/api/content_types/life_events/entries.json?timeline=true&auth_token='+token, {cache: true}).success(function(data) {
          // prepare data here
          data.data.sort(predicatBy("date"));
          callback(data.data);
        });
      }
    }
	}]).
  factory('timelinePhotoService', ['$http', function($http) {
    return{
      name: 'Timeline Photo Service',
      getData: function(token, currentTime, id, callback){
        $http.get(appPath+'locomotive/api/content_types/life_events/entries/'+id+'.json?auth_token='+token, {cache: true}).success(function(res) {
          // prepare data here
          var formattedDate = res.formatted_date;
          var geo = res.geo[0];
          var notable = res.notable[0];
          $http.get(appPath+'locomotive/api/content_types/archive_items/entries.json?timeline_photo=true&auth_token='+token+'&tldate='+formattedDate+'&tlgeo='+geo+'&tlnotable='+notable, {cache: true}).success(function(data) {
            var urlToUse = data.file_slash_image;
            var sendBack = [currentTime, urlToUse];
            callback(sendBack);
          });
        });
      }
    }
  }]).
  factory('worksIndexService', ['$http', function($http) {
    return{
      name: 'Works Index Service',
      getData: function(token, type, callback){
        $http.get(appPath+'locomotive/api/content_types/published_work/entries.json?works_index=true&work_type='+type+'&auth_token='+token, {cache: false}).success(function(data) {
          // prepare data here
          data = data.data;
          for (var i=0;i<data.length;i++){ 
            if(data[i].original_image.indexOf("blank.png") != -1){
              data[i].image = '<img src="http://allen-ginsberg-org.herokuapp.com/assets/blank.png" alt="Image Missing"/>';
            } else {
              data[i].image = '<img src="https://images1-focus-opensocial.googleusercontent.com/gadgets/proxy?url='+s3imgURL+data[i].original_image+'&container=focus&resize_w=250&refresh=2592000" alt="'+data[i].name+'"/>'
            }
          }
          callback(data);
        });
      }
    }
  }]).
  factory('worksDetailService', ['$http', function($http) {
    return{
      name: 'Works Detail Service',
      getData: function(token, id, callback){
        $http.get(appPath+'locomotive/api/content_types/published_work/entries/'+id+'.json?&auth_token='+token, {cache: true}).success(function(data) {
          // prepare data here
          var reformattedData = {
            "name":data.content.name,
            "id": data.content.id,
            "publisher": data.content.publisher,
            "date": data.content.date,
            "amazon_slash_itunes_url" : data.content.amazon_slash_itunes_url,
            "description" : data.content.description,
            "geo" : data.content.geo,
            "notable" : data.content.notable,
            "archive_items": data.content.archive_items,
            "misc_tag": data.content.misc_tag,
            "type" : data.content.type
          }
          if(data.image.indexOf("blank.png") != -1){
            reformattedData.image = '<img src="http://allen-ginsberg-org.herokuapp.com/assets/blank.png" alt="Image Missing"/>';
          } else {
            reformattedData.image = '<img src="https://images1-focus-opensocial.googleusercontent.com/gadgets/proxy?url='+s3imgURL+data.image+'&container=focus&resize_w=250&refresh=2592000" title="'+data.content.name+'"/>'
          }
          callback(reformattedData);
        });
      }
    }
  }]).
  factory('archiveIndexService', ['$http', function($http) {
    return{
      name: 'Archive Index Service',
      getData: function(token, type, callback){
        $http.get(appPath+'locomotive/api/content_types/archive_items/entries.json?archive_index=true&arch_type='+type+'&auth_token='+token, {cache: false}).success(function(data) {
          // prepare data here
          data = data.data;
          if(type === "lecture"){
            

          } else {
            for (var i = data.length - 1; i >= 0; i--) {
              data[i].title = data[i].title.replace(/"/g,'&quot;');
              if(data[i].original_file.indexOf("blank.png") != -1 && (data[i].archive_type == "document" || data[i].archive_type == "lecture")){
                data[i].image = '<div class="lecture-box">'+data[i].title+'</div>';  
              } else if(data[i].original_file.indexOf("blank.png") != -1 ) {
                data[i].image = '<img class="missing" src="http://allen-ginsberg-org.herokuapp.com/assets/blank.png" title="'+data[i].title+'"/>';
              } else {
                // data[i].image = '<img src="https://images1-focus-opensocial.googleusercontent.com/gadgets/proxy?url='+s3imgURL+data[i].original_file+'&container=focus&resize_w=300&refresh=2592000" title="'+data[i].title+'"/>';
                data[i].image = '<div class="archive-image-box" style="background-image:url(https://images1-focus-opensocial.googleusercontent.com/gadgets/proxy?url='+s3imgURL+data[i].original_file+'&container=focus&resize_w=300&refresh=2592000);background-size:cover;"><div class="archive-item-label">'+data[i].title+'</div></div>';
              }
            };
          }
          callback(data);
        });
      }
    }
  }]).
  factory('archiveDetailService', ['$http', function($http) {
    return{
      name: 'Archive Detail Service',
      getData: function(token, id, callback){
        $http.get(appPath+'locomotive/api/content_types/archive_items/entries/'+id+'.json?&auth_token='+token, {cache: true}).success(function(data) {
          var reformattedData = {
            "title":data.content.title,
            "id": data.content.id,
            "slug": data.content._slug,
            "description": data.content.description,
            "date": data.content.date_item_was_created,
            "geo" : data.content.geo,
            "notable" : data.content.notable,
            "published_in": data.content.published_in,
            "misc_tag": data.content.misc_tag,
            "no_file" : data.content.if_no_file_slash_image_then_use_this_text_area,
            "type" : data.content.archive_type,
            "class_name" : data.content.is_this_a_lecture_and_part_of_a_class_which_one,
            "class_id": data.content.is_this_a_lecture_and_part_of_a_class_which_one_id
          }
          if(data.image.indexOf("blank.png") != -1){
            reformattedData.image = "";            
          } else {
            reformattedData.image = '<img id="arch-detail-img" src="https://images1-focus-opensocial.googleusercontent.com/gadgets/proxy?url='+s3imgURL+data.image+'&container=focus&resize_w=1200&refresh=2592000" />';
          }
          callback(reformattedData);
        });
      }
    }
  }]).
  factory('linksService', ['$http', function($http) {
    return{
      name: 'Links Service',
      getData: function(token, callback){
        $http.get(appPath+'locomotive/api/content_types/links/entries.json?links_page=true&auth_token='+token, {cache: true}).success(function(data) {

          data = data.data;
          
          data.sort(function(a,b){
            if(a.pos == null) a.pos = 999;
            if(b.pos == null) b.pos = 999;
            return a.pos - b.pos;
          });

          var fixedData = {};
          for (var i = 0; i < data.length; i++) {
            if(fixedData[data[i].category]){
              fixedData[data[i].category].push(data[i]);
            } else {
              fixedData[data[i].category] = [data[i]];
            }
          };
          callback(fixedData);
        });
      }
    }
  }]).
  factory('similarWorksService', ['$http', function($http) {
    return{
      name: 'Similar Works Service',
      getData: function(token, geo, notable, date, callback){
        $http.get(appPath+'/locomotive/api/content_types/published_work/entries.json?&similar_work=true&geo='+geo+'&notable='+notable+'&date='+date+'&auth_token='+token, {cache: true}).success(function(data) {
          var data = data.data;
          for (var i = data.length - 1; i >= 0; i--) {
            var imageURL = "";
            if(data[i].imageThumb.indexOf("blank.png") != -1){
              imageURL = "http://allen-ginsberg-org.herokuapp.com"+data[i].imageThumb;
            } else {
              imageURL = "https://images1-focus-opensocial.googleusercontent.com/gadgets/proxy?url="+s3imgURL+data[i].imageThumb+"&container=focus&resize_w=150&refresh=2592000";
            }
            data[i].link = "<a href='#/works/"+data[i].type+"/"+data[i].slug+"?id="+data[i].id+"' title='"+data[i].name+"'><img src='"+imageURL+"' alt='"+data[i].name+"' /></a>";
          };
          callback(data);
        });
      }
    }
  }]).
  factory('itemsInArchiveService', ['$http', function($http) {
    return{
      name: 'Items in Archive Service',
      getData: function(token, items, callback){
        $http.get(appPath+'locomotive/api/content_types/archive_items/entries.json?&items_in_archive='+items+'&auth_token='+token, {cache: true}).success(function(data) {
          var data = data.data;
          for (var i = data.length - 1; i >= 0; i--) {
            var imgURL = "";
            if(data[i].image.indexOf("blank.png") == -1){
              imgURL = '<a href="#!/archive/'+data[i].archive_type+'/'+data[i].slug+'?id='+data[i].id+'" title="'+data[i].title+' ('+data[i].archive_type+')"><img src="https://images1-focus-opensocial.googleusercontent.com/gadgets/proxy?url='+s3imgURL+data[i].image+'&container=focus&resize_w=100&refresh=2592000" alt="'+data[i].title+' ('+data[i].archive_type+')" /></a>'
            } else {
              imgURL = '<a href="#!/archive/'+data[i].archive_type+'/'+data[i].slug+'?id='+data[i].id+'" title="'+data[i].title+' ('+data[i].archive_type+')"><img src="http://allen-ginsberg-org.herokuapp.com/assets/blank.png" alt="'+data[i].title+' ('+data[i].archive_type+')" /></a>'
            }
            data[i].archiveItem = imgURL;
          };
          callback(data);
        });
      }
    }
  }]).
  factory('similarArchiveItemsService', ['$http', function($http) {
    return{
      name: 'Similar Archive Items Service',
      getData: function(token, id, geo, notable, misc, date, callback){
        $http.get(appPath+'locomotive/api/content_types/archive_items/entries.json?&similar_archive_items=true&id='+id+'&geo='+geo+'&notable='+notable+'&misc='+misc+'&date='+date+'&auth_token='+token, {cache: true}).success(function(data) {
          var data = data.data;
          for (var i = data.length - 1; i >= 0; i--) {
            if(data[i].slug == id){
              data.splice(i, 1);
            }
          }
          for (var i = data.length - 1; i >= 0; i--) {
            if(data[i].image.indexOf("blank.png") != -1){
              data[i].similarArchiveItem = '<a href="#!/archive/'+data[i].archive_type+'/'+data[i].slug+'?id='+data[i].id+'" title="'+data[i].title+' ('+data[i].archive_type+')"><img src="http://allen-ginsberg-org.herokuapp.com/assets/blank.png" alt="Missing Image" />';
            } else {
              data[i].similarArchiveItem = '<a href="#!/archive/'+data[i].archive_type+'/'+data[i].slug+'?id='+data[i].id+'" title="'+data[i].title+' ('+data[i].archive_type+')"><img src="https://images1-focus-opensocial.googleusercontent.com/gadgets/proxy?url='+s3imgURL+data[i].image+'&container=focus&resize_w=100&resize_h=100&refresh=2592000" alt="'+data[i].title+' ('+data[i].archive_type+')" /></a>';
            }
          };
          callback(data);
        });
      }
    }
  }]).
  factory('publishedInService', ['$http', function($http) {
    return{
      name: 'Published In Service',
      getData: function(token, items, callback){
        $http.get(appPath+'locomotive/api/content_types/published_work/entries.json?&published_in='+items+'&auth_token='+token, {cache: true}).success(function(data) {
          var data = data.data;
          for (var i = data.length - 1; i >= 0; i--) {
            if(data[i].imageThumb.indexOf("blank.png") != -1){
              data[i].publishedInImage = '<img src="http://allen-ginsberg-org.herokuapp.com/assets/blank.png" alt="Missing Image" />';
            } else {
              data[i].publishedInImage = '<img src="https://images1-focus-opensocial.googleusercontent.com/gadgets/proxy?url='+s3imgURL+data[i].imageThumb+'&container=focus&resize_w=150&refresh=2592000" alt="{{p.name}}" />';
            }
          };
          
          callback(data);
        });
      }
    }
  }]).
  factory('atThisTimeService', ['$http', function($http) {
    return{
      name: 'At This Time Service',
      getData: function(token, date, callback){
        $http.get(appPath+'locomotive/api/content_types/life_events/entries.json?&at_this_time='+date+'&auth_token='+token, {cache: true}).success(function(data) {
          callback(data.data);
        });
      }
    }
  }]).
  factory('otherClassService', ['$http', function($http) {
    return{
      name: 'Other Class Service',
      getData: function(token, classId, callback){
        $http.get(appPath+'locomotive/api/content_types/archive_items/entries.json?&other_class_list='+classId+'&auth_token='+token, {cache: true}).success(function(data) {
          callback(data.data);
        });
      }
    }
  }]).
  factory('nextPageService', ['$http', function($http) {
    return{
      name: 'Next Page Service',
      getData: function(token, id, archtype, callback){
        $http.get(appPath+'locomotive/api/content_types/archive_items/entries.json?&next_page='+id+'&arch_type='+archtype+'&auth_token='+token, {cache: true}).success(function(data) {
          callback(data.data);
        });
      }
    }
  }]).
  factory('resetCacheService', ['$http', function($http) {
    return{
      name: 'Reset Cache Service',
      getData: function(token, callback){
        $http.get(appPath+'locomotive/api/content_types/archive_items/entries.json?&reset_cache=true&auth_token='+token, {cache: true}).success(function(data) {
          callback(data);
        });
      }
    }
  }]);
