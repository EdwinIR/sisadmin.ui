'use strict';

sisAdminApp.controller('ConsultaCtrl', 
      ['$scope','Restangular','$modal','$timeout',
      function ($scope,Restangular,$modal,$timeout) {

               var rDocumentTypes = Restangular.all('combo/documenttype/list');
              rDocumentTypes.getList().then(function(response){
                          $scope.listDocTypes =response.data;
              });

              var customers = Restangular.all('combo/customer/list');
              customers.getList().then(function(response){
                          $scope.listCustomer=response.data;
              });


              var filials = Restangular.all('combo/filial/list');
              filials.getList().then(function(response){
                          $scope.listFilial=response.data;
              });

              $scope.loadPage=function(){
                    applyFilter({ customerId : null, documentTypeId : null, beginIssueDate : null,
                                endIssueDate : null, beginSequence : null, endSequence :  null, filialId : null});             
              }  

              $scope.filter = function() {
                      $scope.pbResultRefresh = true;
                      
                      var customerId = null;
                      if (!$scope.isUndefinedOrNull($scope.filter.customerSelected)) {
                                 customerId = $scope.filter.customerSelected.id;
                      } 

                      var documentTypeId = null;
                      if (!$scope.isUndefinedOrNull($scope.filter.documentTypeSelected)) {
                                 documentTypeId = $scope.filter.documentTypeSelected.typeId;
                      } 

                      var filialId = null;
                      if (!$scope.isUndefinedOrNull($scope.filter.filial)) {
                                 filialId = $scope.filter.filial.id;
                      } 

                      applyFilter({
                                    customerId : customerId,
                                    documentTypeId : documentTypeId,
                                    beginIssueDate : $scope.filter.beginIssueDate,
                                    endIssueDate : $scope.filter.endIssueDate,
                                    beginSequence : $scope.filter.beginSequence,
                                    endSequence :  $scope.filter.endSequence,
                                    filialId : filialId
                                  });
              };

              $scope.clear = function() {
                    if (!$scope.isUndefinedOrNull($scope.filter)) {
                          $scope.filter.beginIssueDate = null;
                          $scope.filter.endIssueDate = null;
                          $scope.filter.beginSequence = null;
                          $scope.filter.endSequence = null;
                          $scope.filter.documentTypeSelected = null;
                          $scope.filter.customerSelected = null;  
                          $scope.filter.filial = null; 
                    }
              };

              $scope.refresh = function() {
                      $scope.isCollapsed = true;
                      $scope.filter();
              };

              var applyFilter = function (filterData) {
                      filterData.status = 'AT';
                      $scope.pbValue=50;
                      Restangular.one('document').post('filter',filterData).then(function(response) {
                              $scope.listDocuments = response.data;
                              $scope.pbValue=100;
                              $timeout(function(){$scope.pbResultRefresh=false;$scope.pbValue=0;}, 1000);
                      });
              };

              $scope.enableFilter = function() {
                            if ($scope.isUndefinedOrNull($scope.filter)) {
                                return false;
                            } else {
                                if (!$scope.isUndefinedOrNull($scope.filter.beginIssueDate) && !$scope.isUndefinedOrNull($scope.filter.endIssueDate)) {
                                        return true;
                                } 
                                if (!$scope.isUndefinedOrNull($scope.filter.beginSequence) && !$scope.isUndefinedOrNull($scope.filter.endSequence)) {
                                        return true;
                                }        
                                if (!$scope.isUndefinedOrNull($scope.filter.documentTypeSelected)) {
                                            return true; 
                                }
                                if (!$scope.isUndefinedOrNull($scope.filter.customerSelected)) {
                                            return true; 
                                }
                                if (!$scope.isUndefinedOrNull($scope.filter.filial)) {
                                            return true; 
                                }
                            };                
                            return false;
              };

              $scope.enableClear = function() {
                            if ($scope.isUndefinedOrNull($scope.filter)) {
                                    return true;
                            } else {
                                    return $scope.isUndefinedOrNull($scope.filter.beginIssueDate) && 
                                        $scope.isUndefinedOrNull($scope.filter.endIssueDate) && 
                                        $scope.isUndefinedOrNull($scope.filter.beginSequence)  && 
                                        $scope.isUndefinedOrNull($scope.filter.endSequence) && 
                                        $scope.isUndefinedOrNull($scope.filter.documentTypeSelected) &&
                                        $scope.isUndefinedOrNull($scope.filter.customerSelected); 
                            }
              };

              $scope.isUndefinedOrNull = function(val) {
                            return angular.isUndefined(val) || val === null ;
              };

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

              $scope.getStatus=function(statusCode){
                        var desc = '';
                        if (statusCode === 'AT') {desc='Autorizado';}
                        if (statusCode === 'RH') {desc='Rechazado';}
                        if (statusCode === 'CT') {desc='Contingencia';}
                        if (statusCode === 'NV') {desc='Invalido';}
                        if (statusCode === 'AV') {desc='Archivado';}
                        return desc;
              }; 

              $scope.dwlPdf = function(fileName){
                      Restangular.one('document/pdf').
                        withHttpConfig({responseType: 'blob'}).get({fileName: fileName}).then(function(response) {
                                        var blob=new Blob([response.data],{type:"application/octet"});
                                        var fname = fileName.substring(0, fileName.lastIndexOf('.'));
                                        fname = fname + '.PDF';
                                        saveAs(blob, fname);
                                });
              };

              $scope.dwlSunatAuth = function(fileName){
                      Restangular.one('document/authorized').
                        withHttpConfig({responseType: 'blob'}).get({fileName: fileName}).then(function(response) {
                                        var blob=new Blob([response.data],{type:"application/octet"});
                                        var fname = fileName.substring(0, fileName.lastIndexOf('.'));
                                        fname = fname + '.ZIP';
                                        saveAs(blob, fname);
                                });
              };

              $scope.openModalEmail = function(fileName) {
                      $scope.items = [fileName];
                      var modalInstance = $modal.open({
                        templateUrl: 'EmailModalContent.html',
                            controller: 'ModalInstanceCtrl',
                            resolve: {
                              items: function () {
                                    return $scope.items;
                              }
                            }
                      });
              };

              $scope.verBitacora = function(documentSelected) {
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
              };               
}]);  



sisAdminApp.controller('RejectedCtrl', 
      ['$scope','Restangular','$modal','$timeout',
      function ($scope,Restangular,$modal,$timeout) {

               var rDocumentTypes = Restangular.all('combo/documenttype/list');
              rDocumentTypes.getList().then(function(response){
                          $scope.listDocTypes =response.data;
              });

              var customers = Restangular.all('combo/customer/list');
              customers.getList().then(function(response){
                          $scope.listCustomer=response.data;
              });

              $scope.loadPage=function(){
                    applyFilter({ customerId : null, documentTypeId : null, beginIssueDate : null,
                                endIssueDate : null, beginSequence : null, endSequence :  null });             
              }  

              $scope.filter = function() {
                      $scope.pbResultRefresh = true;
                      
                      var customerId = null;
                      if (!$scope.isUndefinedOrNull($scope.filter.customerSelected)) {
                                 customerId = $scope.filter.customerSelected.id;
                      } 

                      var documentTypeId = null;
                      if (!$scope.isUndefinedOrNull($scope.filter.documentTypeSelected)) {
                                 documentTypeId = $scope.filter.documentTypeSelected.typeId;
                      } 
                      applyFilter({
                                    customerId : customerId,
                                    documentTypeId : documentTypeId,
                                    beginIssueDate : $scope.filter.beginIssueDate,
                                    endIssueDate : $scope.filter.endIssueDate,
                                    beginSequence : $scope.filter.beginSequence,
                                    endSequence :  $scope.filter.endSequence
                                  });
              };

              $scope.clear = function() {
                    if (!$scope.isUndefinedOrNull($scope.filter)) {
                          $scope.filter.beginIssueDate = null;
                          $scope.filter.endIssueDate = null;
                          $scope.filter.beginSequence = null;
                          $scope.filter.endSequence = null;
                          $scope.filter.documentTypeSelected = null;
                          $scope.filter.customerSelected = null;  
                    }
              };

              $scope.refresh = function() {
                      $scope.isCollapsed = true;
                      $scope.filter();
              };


              var applyFilter = function (filterData) {
                      filterData.status = 'RH';
                      $scope.pbValue=50;
                      Restangular.one('document').post('filter',filterData).then(function(response) {
                              $scope.listDocuments = response.data;
                              $scope.pbValue=100;
                              $timeout(function(){$scope.pbResultRefresh=false;$scope.pbValue=0;}, 1000);
                      });
              };

              $scope.enableFilter = function() {
                            if ($scope.isUndefinedOrNull($scope.filter)) {
                                return false;
                            } else {
                                if (!$scope.isUndefinedOrNull($scope.filter.beginIssueDate) && !$scope.isUndefinedOrNull($scope.filter.endIssueDate)) {
                                        return true;
                                } 
                                if (!$scope.isUndefinedOrNull($scope.filter.beginSequence) && !$scope.isUndefinedOrNull($scope.filter.endSequence)) {
                                        return true;
                                }        
                                if (!$scope.isUndefinedOrNull($scope.filter.documentTypeSelected)) {
                                            return true; 
                                }
                                if (!$scope.isUndefinedOrNull($scope.filter.customerSelected)) {
                                            return true; 
                                }
                            };                
                            return false;
              };

              $scope.enableClear = function() {
                            if ($scope.isUndefinedOrNull($scope.filter)) {
                                    return true;
                            } else {
                                    return $scope.isUndefinedOrNull($scope.filter.beginIssueDate) && 
                                        $scope.isUndefinedOrNull($scope.filter.endIssueDate) && 
                                        $scope.isUndefinedOrNull($scope.filter.beginSequence)  && 
                                        $scope.isUndefinedOrNull($scope.filter.endSequence) && 
                                        $scope.isUndefinedOrNull($scope.filter.documentTypeSelected) &&
                                        $scope.isUndefinedOrNull($scope.filter.customerSelected); 
                            }
              };

              $scope.isUndefinedOrNull = function(val) {
                            return angular.isUndefined(val) || val === null ;
              };

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

              $scope.getStatus=function(statusCode){
                        var desc = '';
                        if (statusCode === 'AT') {desc='Autorizado';}
                        if (statusCode === 'RH') {desc='Rechazado';}
                        if (statusCode === 'CT') {desc='Contingencia';}
                        if (statusCode === 'NV') {desc='Invalido';}
                        if (statusCode === 'AV') {desc='Archivado';}
                        return desc;
              };  

               $scope.dwlSunatRej = function(fileName){
                      Restangular.one('document/rejected').
                        withHttpConfig({responseType: 'blob'}).get({fileName: fileName}).then(function(response) {
                                        var blob=new Blob([response.data],{type:"application/octet"});
                                        var fname = fileName.substring(0, fileName.lastIndexOf('.'));
                                        fname = fname + '.ZIP';
                                        saveAs(blob, fname);
                                });
              };

              $scope.verBitacora = function(documentSelected) {
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
              };               


              $scope.reprocesar = function(documentSelected) {
                      $scope.items = [documentSelected];
                      var modalInstance = $modal.open({
                                 templateUrl: 'ReprocessModalContent.html',
                                 controller: 'DelModalInstanceCtrl',
                                  resolve: { items: function () { return $scope.items; } }
                      });

                      modalInstance.result.then(
                           function () {
                             Restangular.one('document').remove({legalNumber:$scope.items[0].legalNumber}).then(
                                                      function(){ $scope.loadPage();});
                           }, 
                           function () {}
                      );
              }; 

              
              $scope.delete = function(documentSelected) {
                      $scope.items = [documentSelected];
                      var modalInstance = $modal.open({
                                 templateUrl: 'DelModalContent.html',
                                 controller: 'DelModalInstanceCtrl',
                                  resolve: { items: function () { return $scope.items; } }
                      });

                      modalInstance.result.then(
                           function () {
                             Restangular.one('document').remove({legalNumber:$scope.items[0].legalNumber}).then(
                                                      function(){ $scope.loadPage();});
                           }, 
                           function () {}
                      );
              }; 

              $scope.verErrores = function(documentSelected) {
                       Restangular.all('document/errors').getList({id : documentSelected.id}).then(
                                  function(response){ 
                                            $scope.bitacora =response.data; 
                                            $scope.items = [$scope.bitacora];
                                            var modalInstance = $modal.open({
                                                  templateUrl: 'ModalErrores.html',
                                                  controller: 'DelModalInstanceCtrl',
                                                   resolve: { items: function () { return $scope.items; } }
                                              });
                                              modalInstance.result.then(
                                                    function () {}, function () {}
                                              );
                                  });
                };               



}]);  


sisAdminApp.controller('ContingencyCtrl', 
      ['$scope','Restangular','$modal','$timeout',
      function ($scope,Restangular,$modal,$timeout) {

               var rDocumentTypes = Restangular.all('combo/documenttype/list');
              rDocumentTypes.getList().then(function(response){
                          $scope.listDocTypes =response.data;
              });

              var customers = Restangular.all('combo/customer/list');
              customers.getList().then(function(response){
                          $scope.listCustomer=response.data;
              });

              $scope.loadPage=function(){
                    applyFilter({ customerId : null, documentTypeId : null, beginIssueDate : null,
                                endIssueDate : null, beginSequence : null, endSequence :  null});             
              }  

              $scope.filter = function() {
                      $scope.pbResultRefresh = true;
                      
                      var customerId = null;
                      if (!$scope.isUndefinedOrNull($scope.filter.customerSelected)) {
                                 customerId = $scope.filter.customerSelected.id;
                      } 

                      var documentTypeId = null;
                      if (!$scope.isUndefinedOrNull($scope.filter.documentTypeSelected)) {
                                 documentTypeId = $scope.filter.documentTypeSelected.typeId;
                      } 
                      applyFilter({
                                    customerId : customerId,
                                    documentTypeId : documentTypeId,
                                    beginIssueDate : $scope.filter.beginIssueDate,
                                    endIssueDate : $scope.filter.endIssueDate,
                                    beginSequence : $scope.filter.beginSequence,
                                    endSequence :  $scope.filter.endSequence
                                  });
              };

              $scope.clear = function() {
                    if (!$scope.isUndefinedOrNull($scope.filter)) {
                          $scope.filter.beginIssueDate = null;
                          $scope.filter.endIssueDate = null;
                          $scope.filter.beginSequence = null;
                          $scope.filter.endSequence = null;
                          $scope.filter.documentTypeSelected = null;
                          $scope.filter.customerSelected = null;  
                    }
              };

              $scope.refresh = function() {
                      $scope.isCollapsed = true;
                      $scope.filter();
              };


              var applyFilter = function (filterData) {
                      filterData.status = 'CT';
                      $scope.pbValue=50;
                      Restangular.one('document').post('filter',filterData).then(function(response) {
                              $scope.listDocuments = response.data;
                              $scope.pbValue=100;
                              $timeout(function(){$scope.pbResultRefresh=false;$scope.pbValue=0;}, 1000);
                      });
              };

              $scope.enableFilter = function() {
                            if ($scope.isUndefinedOrNull($scope.filter)) {
                                return false;
                            } else {
                                if (!$scope.isUndefinedOrNull($scope.filter.beginIssueDate) && !$scope.isUndefinedOrNull($scope.filter.endIssueDate)) {
                                        return true;
                                } 
                                if (!$scope.isUndefinedOrNull($scope.filter.beginSequence) && !$scope.isUndefinedOrNull($scope.filter.endSequence)) {
                                        return true;
                                }        
                                if (!$scope.isUndefinedOrNull($scope.filter.documentTypeSelected)) {
                                            return true; 
                                }
                                if (!$scope.isUndefinedOrNull($scope.filter.customerSelected)) {
                                            return true; 
                                }
                            };                
                            return false;
              };

              $scope.enableClear = function() {
                            if ($scope.isUndefinedOrNull($scope.filter)) {
                                    return true;
                            } else {
                                    return $scope.isUndefinedOrNull($scope.filter.beginIssueDate) && 
                                        $scope.isUndefinedOrNull($scope.filter.endIssueDate) && 
                                        $scope.isUndefinedOrNull($scope.filter.beginSequence)  && 
                                        $scope.isUndefinedOrNull($scope.filter.endSequence) && 
                                        $scope.isUndefinedOrNull($scope.filter.documentTypeSelected) &&
                                        $scope.isUndefinedOrNull($scope.filter.customerSelected); 
                            }
              };

              $scope.isUndefinedOrNull = function(val) {
                            return angular.isUndefined(val) || val === null ;
              };

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

              $scope.getStatus=function(statusCode){
                        var desc = '';
                        if (statusCode === 'AT') {desc='Autorizado';}
                        if (statusCode === 'RH') {desc='Rechazado';}
                        if (statusCode === 'CT') {desc='Contingencia';}
                        if (statusCode === 'NV') {desc='Invalido';}
                        if (statusCode === 'AV') {desc='Archivado';}
                        return desc;
              };  


               $scope.reenviar = function(fileName) {
                      $scope.items = [fileName];
                      var modalInstance = $modal.open({
                                 templateUrl: 'ResendModalContent.html',
                                 controller: 'DelModalInstanceCtrl',
                                  resolve: { items: function () { return $scope.items; } }
                      });

                      modalInstance.result.then(
                           function () {
                             Restangular.one('document/reenviar').get({fileName:$scope.items[0]}).then(
                                                      function(){ $scope.loadPage();});
                           }, 
                           function () {}
                      );
              }; 

              /**$scope.dwlPdf = function(fileName){
                        

                        Restangular.one('document/pdf').
                        withHttpConfig({responseType: 'blob'}).get({fileName: fileName}).then(function(response) {
                                        var blob=new Blob([response.data],{type:"application/octet"});
                                        var fname = fileName.substring(0, fileName.lastIndexOf('.'));
                                        fname = fname + '.PDF';
                                        saveAs(blob, fname);
                                });
              };              
              $scope.delete = function(documentSelected) {
                      $scope.items = [documentSelected];
                      var modalInstance = $modal.open({
                                 templateUrl: 'DelModalContent.html',
                                 controller: 'DelModalInstanceCtrl',
                                  resolve: { items: function () { return $scope.items; } }
                      });

                      modalInstance.result.then(
                           function () {
                             Restangular.one('document').remove({legalNumber:$scope.items[0].legalNumber}).then(
                                                      function(){ $scope.loadPage();});
                           }, 
                           function () {}
                      );
              }; **/


}]);  




