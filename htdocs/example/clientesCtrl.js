
'use strict';

sisAdminApp.controller('ClientesCtrl', 
      ['$scope','Restangular','$modal','$timeout','$captcha',
      function ($scope,Restangular,$modal,$timeout,$captcha) {

    	  
        var rDocumentTypes = Restangular.all('cliente/list');
              rDocumentTypes.getList().then(function(response){
                          $scope.listDocTypes =response.data;
              });

          $scope.saveCliente = function() {

                            $scope.Cliente.razonSocial = $scope.Cliente.razonSocial;

                           

                                Restangular.all('Cliente').post($scope.Cliente).then(function(response) {
                                  //if(response.data ==='\"OK\"'){}
                                    $scope.openModalSave($scope.Cliente); 
                                 
                                console.log(response.data);                    
                                $scope.clear();
                                $scope.loadPage();
                               });                           
                                
                      };

              /**  FUNCIONES DE BUSQUEDA DOCUMENTOS **/                
              $scope.filter = function() {


            	  
                      if(!$scope.disableFilter()) {
                                
                                $scope.pbResultRefresh = false;
                                var amount = null;
                                if (!$scope.isNull($scope.filter.amount)) {
                                           amount = $scope.filter.amount;
                                }
                                var legalNumber = null;
                                  if (!$scope.isNull($scope.filter.legalNumber)) {
                                           legalNumber = $scope.filter.legalNumber;
                                }
                                
                               var issueDate = null;
                                 if (!$scope.isNull($scope.filter.issueDate)) {
                                	issueDate = $scope.filter.issueDate;
                                }

                                var ruc = null;
                                 if (!$scope.isNull($scope.filter.ruc)) {
                                  ruc = $scope.filter.ruc;
                                }


                                if($captcha.checkResult($scope.resultado) == true)
                                {
                                  $scope.pbResultRefresh = true;
                                  applyFilter({legalNumber : legalNumber , amount : amount, issueDate : issueDate, ruc : ruc});

                                }  
                                                     
                                
                      }
              };

              $scope.clear = function() {
                    if (!$scope.isNull($scope.filter)) {
                          $scope.filter.amount = null;
                          $scope.filter.legalNumber = null;
                          $scope.filter.issueDate = null;
                          $scope.resultado = null;
                          $scope.filter.ruc = null;
                          
                    }
              };

              var applyFilter = function (filterData) {
                      $scope.pbValue=50;
                      Restangular.one('public/document').post('filter',filterData).then(function(response) {
                             
                             if( response.data == 0){alert('No se encontro documentos')}
                              $scope.listDocuments = response.data;

                              $scope.pbValue=100;
                              $timeout(function(){$scope.pbResultRefresh=false;$scope.pbValue=0;}, 1000);
                      });
              };

              $scope.disableFilter = function() {

                          if ($scope.isNull($scope.filter.issueDate) ||
                              $scope.isNull($scope.filter.amount) ||
                              $scope.isNull($scope.filter.ruc) ||
                              $scope.isNull($scope.filter.legalNumber)||
                              $scope.isNull($scope.resultado))
                               {return true;}
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

              $scope.dwlSunatAuth = function(fileName){
                      Restangular.one('document/signed').
                        withHttpConfig({responseType: 'blob'}).get({fileName: fileName}).then(function(response) {
                                        var blob=new Blob([response.data],{type:"application/octet"});
                                        var fname = fileName.substring(0, fileName.lastIndexOf('.'));
                                        fname = fname + '.ZIP';
                                        saveAs(blob, fname);
                                });
              };

              
               /**  FUNCIONES DE OBTENCION DESCRIPCIONES **/
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

              $scope.isNull = function(val) {
                            return angular.isUndefined(val) || val === null || val === '';
              };


}]);  