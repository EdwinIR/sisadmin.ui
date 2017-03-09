'use strict';

sisAdminApp.controller('ClienteConsultaCtrl', 
      ['$scope','Restangular','$modal','$timeout', 'LoginFactory',
      function ($scope,Restangular,$modal,$timeout, LoginFactory) {

      
             
              $scope.sortType     = 'issueDate'; // set the default sort type
              $scope.sortReverse  = false;  // set the default sort order
              $scope.searchDoc   = '';     // set the default search/filter term
             

               var rDocumentTypes = Restangular.all('combo/documenttype/list');
              rDocumentTypes.getList().then(function(response){
                          $scope.listDocTypes =response.data;
              });


              $scope.loadPage=function(){              
                     applyFilter({ customerId : LoginFactory.getCustomerId(), documentTypeId : null, beginIssueDate : null,
                                endIssueDate : null});             
              }   

              $scope.filter = function() {
                      $scope.pbResultRefresh = true;
                      
                      var customerId = LoginFactory.getCustomerId();       
                      var documentTypeId = null;
                      if (!$scope.isNull($scope.filter.documentTypeSelected)) {
                                 documentTypeId = $scope.filter.documentTypeSelected.typeId;
                      } 
                      applyFilter({
                                    customerId : customerId,
                                    documentTypeId : documentTypeId,
                                    beginIssueDate : $scope.filter.beginIssueDate,
                                    endIssueDate : $scope.filter.endIssueDate
                                   });
              };

         

              $scope.refresh = function() {
                      $scope.isCollapsed = true;
                      $scope.filter();
              };
         
        
              var applyFilter = function (filterData) {
                      $scope.pbValue=50;
                      filterData.customerId = LoginFactory.getCustomerId();
                      Restangular.one('customer/document').post('filter',filterData).then(function(response) {
                              $scope.listDocuments = response.data;
                              $scope.pbValue=100;
                              $timeout(function(){$scope.pbResultRefresh=false;$scope.pbValue=0;}, 1000);
                      });
              };

    
              $scope.disableFilter = function() {
                           if ( $scope.isNull($scope.filter.beginIssueDate) &&
                                 !$scope.isNull($scope.filter.endIssueDate) ) {return true;}

                           if ( !$scope.isNull($scope.filter.beginIssueDate) &&
                                 $scope.isNull($scope.filter.endIssueDate) ) {return true;}
                           return false;   
              };

                   $scope.clear = function() {
                    
                          $scope.filter.beginIssueDate = null;
                          $scope.filter.endIssueDate = null;                        
                          $scope.filter.documentTypeSelected = null;
                          
                    
              };

         
                 $scope.isNull = function(val) {
                            return angular.isUndefined(val) || val === null ;
              };

               /** Funciones para Formatear datos columnas de documento **/
               $scope.getDocumentTypeDesc=function(type) {
                        var desc = '';
                        angular.forEach($scope.listDocTypes, function(item) {
                                                  if (item.typeId === type){ desc = item.descr;}
                        });
                        return desc;
                };

              $scope.getCurrencyPrefix=function(type){
                        var desc= type;
                        if (type === 'PEN') {desc='S/.';}
                        return desc;
              };  

              /**codigo agregado por Edison**/
                  $scope.getStatus=function(statusCode){
                        var desc = '';
                        if (statusCode === 'PD') {desc='Pendiente';}
                        if (statusCode === 'AT') {desc='Autorizado';}
                        if (statusCode === 'RH') {desc='Rechazado';}
                        if (statusCode === 'CT') {desc='Contingencia';}
                        if (statusCode === 'ER') {desc='Invalido';}
                        if (statusCode === 'AV') {desc='Archivado';}
                        return desc;
              };


              /*ACCIONES DE DOCUMENTOS*/

                   $scope.dwlPdf = function(fileName){
                      Restangular.one('document/pdf').
                        withHttpConfig({responseType: 'blob'}).get({fileName: fileName}).then(function(response) {
                                        var blob=new Blob([response.data],{type:"application/octet"});
                                        var fname = fileName.substring(0, fileName.lastIndexOf('.'));
                                        fname = fname + '.PDF';
                                        saveAs(blob, fname);
                                });
              };

              $scope.dwlXml = function(fileName){
                      Restangular.one('document/holded').
                        withHttpConfig({responseType: 'blob'}).get({fileName: fileName}).then(function(response) {
                                        var blob=new Blob([response.data],{type:"application/octet"});
                                        var fname = fileName.substring(0, fileName.lastIndexOf('.'));
                                        fname = fname + '.ZIP';
                                        saveAs(blob, fname);
                                });
              };

             /*$scope.dwlBitacora = function(documentSelected) {
                       Restangular.all('document/bitacora').getList({id : documentSelected.id}).then(
                                  function(response){ 
                                            $scope.bitacora =response.data; 
                                            $scope.items = [$scope.bitacora];
                                            var modalInstance = $modal.open({
                                                  templateUrl: 'ModalBitacora.html',
                                                  controller: 'DelModalInstanceCtrl',
                                                   resolve: { items: function () { return $scope.items; } }
                                              });
                                              modalInstance.result.then(
                                                    function () {}, function () {}
                                              );
                                  });
              };*/


}]);  


