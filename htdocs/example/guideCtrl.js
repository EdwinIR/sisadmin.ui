'use strict';

sisAdminApp.controller('GuideCtrl', 
              ['$scope','Restangular','$modal', 'LoginFactory','$timeout',
              function ($scope,Restangular,$modal, LoginFactory,$timeout) {

              $scope.sortType     = 'name'; // set the default sort type
              $scope.sortReverse  = false;  // set the default sort order
                   // set the default search/filter term



                          $scope.loadPage = function() {
                          $scope.pbResultRefresh = true;
                          $scope.pbValue=50;
                          var rGuides = Restangular.all('guide/list');
                                      rGuides.getList().then(function(response){
                                      $scope.listDocuments =response.data;
                                      $scope.pbValue=100;
                                      $timeout(function(){$scope.pbResultRefresh=false;$scope.pbValue=0;}, 1000);
                                     });
                        };

                         $scope.filter = function() {
                         $scope.pbResultRefresh = true;
                         $scope.pbValue=50;
                          var name = $scope.guide.name
                          Restangular.all('guide').getList({name : name}).then(function(response){
                          $scope.listDocuments =response.data;
                          $scope.pbValue=100;
                          $timeout(function(){$scope.pbResultRefresh=false;$scope.pbValue=0;}, 1000);
                          });
                        };




                        $scope.dwlGuide = function(name){
                        Restangular.one('guide/pdf').
                        withHttpConfig({responseType: 'blob'}).get({name: name}).then(function(response) {
                                        var blob=new Blob([response.data],{type:"application/octet"});
                                        saveAs(blob, name);
                                });
                        };

                        $scope.refresh = function() {
                        $scope.isCollapsed = true;
                        $scope.loadPage();
                      };

                        $scope.clear = function() {
                        $scope.guide.name = null;
                        $scope.loadPage();   
                        };


}]);
