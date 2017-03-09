'use strict';


sisAdminApp.controller('ConfigCtrl', 
          ['$scope','Restangular','$modal','$filter',
          function ($scope,Restangular,$modal,$filter) {


   
                  $scope.loadPage=function(){
                        Restangular.one('emitter').get().then(function(response){
                                  $scope.emisor=response.data;
                        });
                  }  
                  
                  /** 
                  $scope.loadPage = function() {                             
                         Restangular.one('emitter/config').get().then(function(response){
                          $scope.emitterSelected=response.data;
                          $scope.frequency = $scope.getIdType($scope.emitterSelected.archiveTypeTime);
                        });
                  };**/



                    $scope.getStyle = function() {
                            return {
                                      "background-color" : "#5cb85c",
                                      "color" :  "#fff"
                                  }
                    };

           
                    var freq = Restangular.all('combo/frequency/list');
                     freq.getList().then(function(response){
                                $scope.listFrequency=response.data;
                    });

 
               
                       $scope.clear = function() {
                              $scope.emitterSelected=null;
                              $scope.frequency = null;
                                 
                        };


                          $scope.getIdType=function(idType) {
                                var type = {};
                                angular.forEach($scope.listFrequency, function(item) {
                                            if (item.codigo === idType) { type= item; }
                                });
                                return type;
                                  };

                              $scope.save = function() {
                                      $scope.emitterSelected.archiveTypeTime = $scope.frequency.codigo;                            
                                      Restangular.all('emitter/conf').post($scope.emitterSelected).then(
                                          function(response) {
                                                      console.log(response.data);
                                                      $scope.loadPage();
                                                      $scope.clear();
                                          }, 
                                          function(response) {
                                                      console.log(response.data);
                                          });
                                          
                               };
                
               
}]);


