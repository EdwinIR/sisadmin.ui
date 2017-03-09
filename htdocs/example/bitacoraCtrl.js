'use strict';

sisAdminApp.controller('BitacoraCtrl', 
      ['$scope','Restangular','$modal','$timeout',
      function ($scope,Restangular,$modal,$timeout) {

      	$scope.listDocument = {};

            
              
            $scope.loadPage = function() {
            var customers = Restangular.all('documentLog/list');
            customers.getList().then(function(response){
                      $scope.listDocument=response.data;
                                    });
                          };


             $scope.filter = function(){
              var legalNumber = $scope.filter.beginSequence
                                        Restangular.all('documentLog').getList({documentId : legalNumber}).then(function(response){
                                        $scope.listDocument =response.data;
                                      });


             };             

            $scope.enableFilter = function() {
              return false;
            };



   }]); 