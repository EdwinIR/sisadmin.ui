'use strict';

sisAdminApp.controller('DocReceiptSummary', 
      ['$scope','Restangular','$modal','$timeout',
      function ($scope,Restangular,$modal,$timeout) {
               

              $scope.sortType     = 'tipoResumen'; // set the default sort type
              $scope.sortReverse  = false;  // set the default sort order
              $scope.searchDoc   = '';     // set the default search/filter term
   
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


              /**  FUNCIONES DE BUSQUEDA DOCUMENTOS                 
              $scope.loadPage=function(){ applyFilter({beginIssueDate : null, 
                                                      endIssueDate : null});            
              }  **/


             /**  FUNCIONES DE BUSQUEDA DOCUMENTOS **/                
              $scope.loadPage=function(){ 
                          applyFilter({beginIssueDate : null, endIssueDate : null,
                                       documentTypeId : null, mes: $scope.mesActual, 
                                       status: $scope.status, anio: $scope.anioActual});            
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




            $scope.filter = function() {
                      $scope.pbResultRefresh = true;
                      var documentTypeId = null;
                      var mesId =  $scope.mesActual;
                      var anioId =  $scope.anioActual;
                      var estado = null; 
                      if (!$scope.isNull($scope.filter.documentTypeSelected)) {
                                 documentTypeId = $scope.filter.documentTypeSelected.typeId;
                      } 
                      if (!$scope.isNull($scope.filter.status)) {
                                 estado = $scope.filter.status;
                      } 

                      applyFilter({
                              beginIssueDate : $scope.filter.beginIssueDate, 
                              endIssueDate : $scope.filter.endIssueDate,
                              documentTypeId : documentTypeId, 
                              status : estado, 
                              mes: mesId,
                              anio: anioId
                      });
              };

              /**
              $scope.filter = function() {
                      $scope.pbResultRefresh = true;
                      applyFilter({beginIssueDate : $scope.filter.beginIssueDate, 
                                  endIssueDate : $scope.filter.endIssueDate});
              };**/

              var applyFilter = function (filterData) {
                      //filterData.status = 'CR';
                      $scope.pbValue=50;
                      Restangular.one('resumen').post('filter',filterData).then(function(response) {
                              $scope.listDocuments = response.data;
                              $scope.pbValue=100;
                              $timeout(function(){$scope.pbResultRefresh=false;$scope.pbValue=0;}, 1000);
                      });
              };

              $scope.clear = function() {
                          $scope.filter.beginIssueDate = null; $scope.filter.endIssueDate = null;
                          $scope.filter.status = null
                          
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


              /**  FUNCIONES DE ACCIONES SOBRE DOCUMENTOS 

              $scope.enviaResumen = function(fileName){
                      Restangular.one('resumen/envio').
                        withHttpConfig({responseType: 'blob'}).get({fileName: fileName}).then(function(response) {
                                        var blob=new Blob([response.data],{type:"application/octet"});
                                        var fname = fileName.substring(0, fileName.lastIndexOf('.'));
                                        fname = fname + '.PDF';
                                        saveAs(blob, fname);
                                });
              };
              $scope.enviarDocumento = function(documento) {
                                            $scope.items = [documento];
                                            var modalInstance = $modal.open({
                                                      templateUrl: 'EnvModalConfirm.html',
                                                      controller: 'EnvModalInstanceCtrl',
                                                      resolve: {
                                  items: function () {
                                        return $scope.items;}}
                          });

                              modalInstance.result.then(function (selectedItem)
                              {
                                Restangular.one('document/enviardocumento').get({id:$scope.items[0].id}).then(function(response) {
                                $scope.loadPage();});
                              },function () {}
                                                      );
              };**/

              $scope.enviarResumen = function(documento) {
                                            $scope.items = [documento];
                                            var modalInstance = $modal.open({
                                                      templateUrl: 'EnvResumenConfirm.html',
                                                      controller: 'EnvResumenConfirmCtrl',
                                                      resolve: {
                                  items: function () { return $scope.items;}}
                          });
                              modalInstance.result.then(function (selectedItem)
                              {
                                Restangular.one('document/enviarresumen').get({id:$scope.items[0].id}).then(function(response) {
                                $scope.loadPage();});
                              },function () {}
                                                      );
              };

              

              $scope.dwlEmail = function(fileName) {
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



              $scope.dwlPdf = function(fileName){
                      Restangular.one('resumen/pdf').
                        withHttpConfig({responseType: 'blob'}).get({fileName: fileName}).then(function(response) {
                                        var blob=new Blob([response.data],{type:"application/octet"});
                                        var fname = fileName.substring(0, fileName.lastIndexOf('.'));
                                        fname = fname + '.PDF';
                                        saveAs(blob, fname);
                                });
              };

              $scope.dwlXml = function(fileName){
                      Restangular.one('resumen/xml').
                        withHttpConfig({responseType: 'blob'}).get({fileName: fileName}).then(function(response) {
                                        var blob=new Blob([response.data],{type:"application/octet"});
                                        var fname = fileName.substring(0, fileName.lastIndexOf('.'));
                                        fname = fname + '.XML';
                                        saveAs(blob, fname);
                                });
              };
              



              $scope.dwlXmlHolded = function(fileName){
                      Restangular.one('document/authorized').
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

              /**  FUNCIONES DE OBTENCION DESCRIPCIONES **/


              $scope.getCurrencyPrefix=function(type){
                        var desc= type;
                        if (type === 'PEN') {desc='S/.';}
                        return desc;
              };  

              $scope.getStatus=function(statusCode){
                        var desc = '';
                        if (statusCode === 'PD') {desc='Pendiente';}
                        if (statusCode === 'AT') {desc='Autorizado';}
                        if (statusCode === 'SD') {desc='Enviado';}
                        return desc;
              }; 

             $scope.isNull = function(val) {
                            return angular.isUndefined(val) || val === null ;
              };


 
}]);  