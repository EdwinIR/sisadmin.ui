 'use strict';    

sisAdminApp.controller('EmitterCtrl', 
        ['$scope','Restangular','$modal',
        function ($scope,Restangular,$modal) {

                $scope.loadPage=function(){

                  Restangular.one('emitter').get().then(function(response){
                  $scope.emitter=response.data;
                });

                 }  
 
}]);    
