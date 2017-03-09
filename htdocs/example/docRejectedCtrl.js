'use strict';

sisAdminApp.controller('DocRejectedCtrl', 
      ['$scope','Restangular','$modal','$timeout',
      function ($scope,Restangular,$modal,$timeout) {

              $scope.sortType     = 'documentTypeCode'; // set the default sort type
              $scope.sortReverse  = false;  // set the default sort order
              $scope.searchDoc     = '';     // set the default search/filter term


              var fechaHoy = new Date();
              $scope.mesActual = fechaHoy.getMonth();
              $scope.anioActual = fechaHoy.getFullYear();

              
              $scope.obj ={"selected": $scope.anioActual.toString()};
 
              $scope.opts = [
                  {value: '2015', text: '2015' },
                  {value: '2016', text: '2016' },
                  {value: '2017', text: '2017' },
                  {value: '2018', text: '2018' }
              ];



              /**  CARGA INICIAL COMBOS - CRITERIO BUSQUEDA **/                
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
                          applyFilter({beginIssueDate : null, endIssueDate : null,
                                       documentTypeId : null, customerId : null, 
                                       filialId : null, mes: $scope.mesActual, 
                                       anio: $scope.anioActual});            
              };  

              $scope.cambiarAnio = function() {
                                                console.log($scope.obj.selected, $scope.obj.selected);
                                                //console.log($scope.anioElegido.text, $scope.anioElegido.value);
                                                $scope.anioActual = $scope.obj.selected; 
                                                $scope.mesActual ='';
                                                $scope.filter();
                                              }; 

                       

              $scope.setearEne = function() {$scope.mesActual = '0'; $scope.filter();};
              $scope.setearFeb = function() {$scope.mesActual = '1'; $scope.filter();};
              $scope.setearMar = function() {$scope.mesActual = '2'; $scope.filter();};
              $scope.setearAbr = function() {$scope.mesActual = '3'; $scope.filter();};
              $scope.setearMay = function() {$scope.mesActual = '4'; $scope.filter();};
              $scope.setearJun = function() {$scope.mesActual = '5'; $scope.filter();};
              $scope.setearJul = function() {$scope.mesActual = '6'; $scope.filter();};
              $scope.setearAgo = function() {$scope.mesActual = '7'; $scope.filter();};
              $scope.setearSet = function() {$scope.mesActual = '8'; $scope.filter();};
              $scope.setearOct = function() {$scope.mesActual = '9'; $scope.filter();};
              $scope.setearNov = function() {$scope.mesActual = '10'; $scope.filter();};              
              $scope.setearDic = function() {$scope.mesActual = '11'; $scope.filter();};
              $scope.setearAll = function() {$scope.mesActual = ''; $scope.filter();}; 





              /**  FUNCIONES DE BUSQUEDA DOCUMENTOS                 
              $scope.loadPage=function(){ applyFilter({beginIssueDate : null, endIssueDate : null,
                                                        documentTypeId : null, customerId : null, 
                                                        filialId : null});            
              }  

              $scope.filter = function() {
                      $scope.pbResultRefresh = true;
                      var documentTypeId = null;
                      var customerId = null;
                      var filialId = null;
                      if (!$scope.isNull($scope.filter.customerSelected)) {
                                 customerId = $scope.filter.customerSelected.id;
                      } 
                      if (!$scope.isNull($scope.filter.documentTypeSelected)) {
                                 documentTypeId = $scope.filter.documentTypeSelected.typeId;
                      } 
                      if (!$scope.isNull($scope.filter.filial)) {
                                 filialId = $scope.filter.filial.id;
                      } 
                      applyFilter({beginIssueDate : $scope.filter.beginIssueDate, endIssueDate : $scope.filter.endIssueDate,
                                    documentTypeId : documentTypeId, customerId : customerId,
                                    filialId : filialId});
              };**/


              $scope.filter = function() {
                      $scope.pbResultRefresh = true;
                      var documentTypeId = null;
                      var customerId = null;
                      var filialId = null;
                      var mesId =  $scope.mesActual;
                      var anioId =  $scope.anioActual;
                      if (!$scope.isNull($scope.filter.customerSelected)) {
                                 customerId = $scope.filter.customerSelected.id;
                      } 
                      if (!$scope.isNull($scope.filter.documentTypeSelected)) {
                                 documentTypeId = $scope.filter.documentTypeSelected.typeId;
                      } 
                      if (!$scope.isNull($scope.filter.filial)) {
                                 filialId = $scope.filter.filial.id;
                      } 
                      applyFilter({
                              beginIssueDate : $scope.filter.beginIssueDate, 
                              endIssueDate : $scope.filter.endIssueDate,
                              documentTypeId : documentTypeId, 
                              customerId : customerId,
                              filialId : filialId,
                              mes: mesId,
                              anio: anioId
                      });
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

              $scope.clear = function() {
                          $scope.filter.beginIssueDate = null; $scope.filter.endIssueDate = null;
                          $scope.filter.documentTypeSelected = null; $scope.filter.customerSelected = null;  
                          $scope.filter.filial = null; 
              };

              $scope.refresh = function() {
                      $scope.isCollapsed = true;
                      $scope.filter();
              };

              $scope.disableFilter = function() {
                           if ( $scope.isNull($scope.filter.beginIssueDate) &&
                                 !$scope.isNull($scope.filter.endIssueDate) ) {return true;}
                           if ( !$scope.isNull($scope.filter.beginIssueDate) &&
                                 $scope.isNull($scope.filter.endIssueDate) ) {return true;}
                           return false;   
              };



             /**  FUNCIONES DE ACCIONES SOBRE DOCUMENTOS **/
             $scope.dwlXml = function(fileName){
                      Restangular.one('document/rejected').
                        withHttpConfig({responseType: 'blob'}).get({fileName: fileName}).then(function(response) {
                                        var blob=new Blob([response.data],{type:"application/octet"});
                                        var fname = fileName.substring(0, fileName.lastIndexOf('.'));
                                        fname = fname + '.ZIP';
                                        saveAs(blob, fname);
                                });
              };

              $scope.dwlBitacora = function(documentSelected) {
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

              $scope.dwlErrores = function(documentSelected) {
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


               /** 
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
              }; **/


              /**  FUNCIONES DE OBTENCION DESCRIPCIONES **/
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
                        if (statusCode === 'PD') {desc='Pendiente';}
                        if (statusCode === 'AT') {desc='Autorizado';}
                        if (statusCode === 'RH') {desc='Rechazado';}
                        if (statusCode === 'CT') {desc='Contingencia';}
                        if (statusCode === 'ER') {desc='Invalido';}
                        if (statusCode === 'AV') {desc='Archivado';}
                        return desc;
              }; 

              $scope.isNull = function(val) {
                            return angular.isUndefined(val) || val === null ;
              };



}]);  
