'use strict';

sisAdminApp.controller('PercepcionCtrl',
      ['$scope','Restangular','$modal','$timeout',
      function ($scope,Restangular,$modal,$timeout) {


              $scope.sortType     = 'issueDate'; // set the default sort type
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

              /**  FUNCIONES DE BUSQUEDA DOCUMENTOS
              $scope.loadPage=function(){ applyFilter({beginIssueDate : null, endIssueDate : null,
                                                        documentTypeId : null, customerId : null,
                                                        filialId : null});
              }  **/

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
                      //filterData.status = 'PD';
                      $scope.pbValue=50;
                      Restangular.one('percepcion').post('filter',filterData).then(function(response) {
                            $scope.listDocuments = response.data;
                            //$scope.listDocuments = $scope.listDocumentAll.filter(function(item) {
                            //return item.status !== 'AT' &&  item.status !== 'RH' &&  item.status !== 'ER';});
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
                      Restangular.one('document/signed').
                        withHttpConfig({responseType: 'blob'}).get({fileName: fileName}).then(function(response) {
                                        var blob=new Blob([response.data],{type:"application/octet"});
                                        var fname = fileName.substring(0, fileName.lastIndexOf('.'));
                                        fname = fname + '.ZIP';
                                        saveAs(blob, fname);
                                });
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

              /**FUNCION QUE ME PERMITE ANULAR UN DOCUMENTO PENDIENTE -AN**/
              $scope.anularDocumento = function(documento) {
                                            $scope.items = [documento];
                                            var modalInstance = $modal.open({
                                                      templateUrl: 'DelModalConfirm.html',
                                                      controller: 'DelModalInstanceCtrl',
                                                      resolve: {
                                  items: function () {
                                        return $scope.items;}}
                          });

                              modalInstance.result.then(function (selectedItem)
                              {
                                Restangular.one('document/anulardocumento').get({id:$scope.items[0].id}).then(function(response) {
                                $scope.loadPage();});
                              },function () {}
                                                      );
              };



              $scope.borrarDocumento = function(documento) {
                                            $scope.items = [documento];
                                            var modalInstance = $modal.open({
                                                      templateUrl: 'RemModalConfirm.html',
                                                      controller: 'RemModalInstanceCtrl',
                                                      resolve: {
                                  items: function () {
                                        return $scope.items;}}
                          });

                              modalInstance.result.then(function (selectedItem)
                              {
                                Restangular.one('document/borrardocumento').get({id:$scope.items[0].id}).then(function(response) {
                                $scope.loadPage();});
                              },function () {}
                                                      );
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
              };






              /*$scope.anularDocumento = function(idDocumento)
             {

                Restangular.one('document/anulardocumento').get({id : idDocumento}).then(function(response) {
                $scope.loadPage();});

            };
              $scope.openModalNota = function(tipoDocumento, numeroLegal,filename) {
                                            var param = tipoDocumento+","+ numeroLegal +","+ filename +",";
                                            var paramArr = param.split(",");
                                            $scope.items = paramArr;
                                            var modalInstance = $modal.open({
                                                      templateUrl: 'NotaModalContent.html',
                                                      controller: 'NotaModalCtrl',
                                                      resolve: {
                                                                items: function () {
                                                                  return $scope.items;
                                                                 }
                                                     }
                          });


              };
              **/

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
                        if (statusCode === 'SD') {desc='Enviado';}
                        return desc;
              };

             $scope.isNull = function(val) {
                            return angular.isUndefined(val) || val === null ;
              };



}]);
