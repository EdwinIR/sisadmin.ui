'use strict';

sisAdminApp.controller('ReporteCtrl', 
      ['$scope','Restangular','$modal','$timeout',
      function ($scope,Restangular,$modal,$timeout) {

   

              /**  CARGA INICIAL COMBOS - CRITERIO BUSQUEDA **/
                 var filials = Restangular.all('combo/filial/list');
              filials.getList().then(function(response){
                          $scope.listFilial=response.data;
              });

    

              /**  FUNCIONES DE BUSQUEDA DOCUMENTOS **/                
              $scope.loadPage=function(){ 

                $scope.filter.fechaInicio = new Date(); 
                $scope.filter.fechaFinal =  new Date(); 
                $scope.filter.beginIssueDate = new Date(); 
                $scope.filter.endIssueDate = new Date();           
              }  

              $scope.filter = function() {          

                      
                      var beginIssueDate = "";   
                      var endIssueDate   = "";            
                      var filialId       = "";
                      var nameFilial     = "";
            
                        if (!$scope.isNull($scope.filter.beginIssueDate)) {
                                 beginIssueDate = $scope.filter.beginIssueDate;
                      } 
                        if (!$scope.isNull($scope.filter.endIssueDate)) {
                                 endIssueDate = $scope.filter.endIssueDate;
                      } 
                      if (!$scope.isNull($scope.filter.filial)) {
                                 filialId = $scope.filter.filial.id;
                                 nameFilial = $scope.filter.filial.description
                      } 


                  Restangular.one('document/reporte').
                  withHttpConfig({responseType: 'blob'}).get({beginIssueDate : beginIssueDate,
                                                              endIssueDate : endIssueDate,                                                         
                                                              filialId : filialId,
                                                              nameFilial : nameFilial }).then(function(response) {
                  var blob=new Blob([response.data],{type:"application/pdf"});
                  var fname = "Reporte de Totales por Estado.pdf"          
                  saveAs(blob,fname);  
                });


                };


                $scope.filterExcel = function() {          

                      
                    var beginIssueDate = "";   
                    var endIssueDate   = "";            
                    var filialId       = "";
                    var nameFilial     = "";
            
                      if (!$scope.isNull($scope.filter.fechaInicio)) {
                                 beginIssueDate = $scope.filter.fechaInicio;
                      } 
                        if (!$scope.isNull($scope.filter.fechaFinal)) {
                                 endIssueDate = $scope.filter.fechaFinal;
                      } 
                      if (!$scope.isNull($scope.filter.filial)) {
                                 filialId = $scope.filter.filial.id;
                                 nameFilial = $scope.filter.filial.description
                      } 


                  Restangular.one('document/reportexcel').
                  withHttpConfig({responseType: 'blob'}).get({beginIssueDate : beginIssueDate,
                                                              endIssueDate : endIssueDate,                                                         
                                                              filialId : filialId,
                                                              nameFilial : nameFilial }).then(function(response) {
                  var blob=new Blob([response.data],{type:"application/vnd.ms-excel"});
                  var fname = "reporte.xls"          
                  saveAs(blob,fname);  
                });


                };

   



            

              $scope.disableFilter = function() {

                     if ( $scope.isNull($scope.filter.beginIssueDate) ||
                          $scope.isNull($scope.filter.endIssueDate) ) 
                          {return true;}

                           return false;   
              };

               $scope.disableFilterExcel = function() {

                     if ( $scope.isNull($scope.filter.fechaInicio) ||
                          $scope.isNull($scope.filter.fechaFinal) ) 
                          {return true;}

                           return false;   
              };

              $scope.clear = function() {
                          $scope.filter.beginIssueDate = new Date(); 
                          $scope.filter.endIssueDate = new Date();                           
                          $scope.filter.filial = null; 
              };

              $scope.clearExcel = function() {
                          $scope.filter.fechaInicio = new Date(); 
                          $scope.filter.fechaFinal =  new Date();                         
                          $scope.filter.filial = null; 
              };
             
              $scope.refresh = function() {
                      $scope.isCollapsed = true;
                      $scope.filter();
              };
             $scope.isNull = function(val) {
                            return angular.isUndefined(val) || val === null ;
              };


 
}]);  