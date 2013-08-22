'use strict';

/* Directives */


angular.module('gApp.directives', []);
//   directive('similarwork', ['Works', 'worksIndexService', function(Works, worksIndexService) {
//     return {
//       restrict: 'A',
//       template: '<ul class="similarWork">' + '{{notable}}' + 
//                 '</ul>',
//       scope: {
//       	geo: '=',
//       	notable: '=',
//       	misc: '='
//       },
//       link: function (scope, elem, attrs) {
//       	var compileSimilar = function(type){
//       		console.log(Works[type]);
//       		// if notable is defined, get all Works that have any geo tags the same
//       		if(scope.notable){
//       			for (var i = scope.notable.length - 1; i >= 0; i--) {
//       				for (var i = Works[type].length - 1; i >= 0; i--) {
//       					// if Works[type][i]
//       				};
//       			};
//       		}
//       	}
//       	// check to make sure Works has its index 
//       	if(!Works.book){
//       		// get works and store in Works
//     			worksIndexService.getData(api_token, "book", function(data){
// 	          Works.book = data;
// 	          compileSimilar("book");
// 	        });
//     		}
// 	          if(!Works["audio-recording"]){
// 		          worksIndexService.getData(api_token, "audio-recording", function(data){
// 			          Works["audio-recording"] = data;
// 			          if(!Works.film){
// 				          worksIndexService.getData(api_token, "film", function(data){
// 					          Works.film = data;
// 					     			compileSimilar();
// 					        });
// 				        } else {
// 				        	compileSimilar();
// 				        }
// 			        });
// 	        	} else {
// 	        		compileSimilar();
// 	        	}
// 	        });
//       	} else {
//       		compileSimilar();
//       	}
//       }
//   	}
//   }]);
