'use strict';

sisAdminApp.controller('SaAfpPeriodoCtrl', 
              ['$scope','Restangular','$modal',
              function ($scope,Restangular,$modal) {
                       
                        $scope.codigoDeshabilitado = false;
                        $scope.display = false;
                        $scope.filtro   = '';
                        $scope.sortType     = 'ruc'; // set the default sort type
                        $scope.sortReverse  = false; 

                        var periodos = Restangular.all('periodo/list');
                          periodos.getList().then(function(response){
                              $scope.periodos=response.data;
                        });   

                        var afps = Restangular.all('afp/list');
                          afps.getList().then(function(response){
                              $scope.afps=response.data;
                        });                
                       
                      $scope.loadPage = function() { 
                            //$scope.edicion = true; 
                            var listado = Restangular.all('afpperiodo/list');
                            listado.getList().then(function(response){ $scope.listaAfpPeriodos = response.data;});
                        };


                      $scope.save = function() {
                          $scope.afpperiodo.periodoId = $scope.periodoSeleccionado.id;
                          $scope.afpperiodo.afpId = $scope.afpSeleccionado.id;
                          if($scope.isEmpty($scope.afpperiodo.id)) {
                                Restangular.all('afpperiodo/add').post($scope.afpperiodo).then(function(response) {
                                    $scope.openModalSave($scope.afpperiodo);                                  
                                    console.log(response.data);                    
                                    $scope.clear();
                                    $scope.loadPage();
                                });
                           } else {
                                Restangular.all('afpperiodo/update').post($scope.afpperiodo).then(function(response) {
                                    $scope.openModalSave($scope.afpperiodo);                                  
                                    console.log(response.data);                    
                                    $scope.clear();
                                    $scope.loadPage();
                                });
                           }    
                      };

                      $scope.delete = function(afpperiodo) {
                               $scope.items = [afpperiodo];
                               var modalInstance = $modal.open({
                                    templateUrl: 'DelModalContent.html',
                                    controller: 'DelModalInstanceCtrl',
                                    resolve: {items: function () {return $scope.items;}}
                               });

                               modalInstance.result.then(
                                  function (selectedItem) {
                                        Restangular.one('afpperiodo').remove({id:$scope.items[0].id}).then(
                                        function(){$scope.clear(); $scope.loadPage();});
                                  },                                
                                  function () {}
                               );
                      };
                     
                      $scope.edit = function(id) {
                                      $scope.isCollapsed  = false;                                      
                                      $scope.codigoDeshabilitado = true;
                                      var i = 0;
                                      angular.forEach($scope.listaAfpPeriodos, function(item) {
                                          if (item.id == id) {
                                                $scope.afpperiodo = $scope.listaAfpPeriodos[i];
												                        $scope.afpSeleccionado = $scope.getAfp($scope.listaAfpPeriodos[i].descripcionAfp);
                                                $scope.periodoSeleccionado = $scope.getPeriodo($scope.listaAfpPeriodos[i].descripcionPeriodo);
                                          }
                                          i++;
                                      });
                      };
							$scope.getAfp=function(id) {
                                      var type = {};
                                      angular.forEach($scope.afps, function(item) {

                                          if (item.descripcion.trim() === id.trim()) {
                                            type=item;
                                          }
                                        });
                                        return type;
                                      };

                              $scope.getPeriodo=function(id) {
                                      var type = {};
                                      angular.forEach($scope.periodos, function(item) {

                                          if (item.codigo.trim() === id.trim()) {
                                            type=item;
                                          }
                                        });
                                        return type;
                                      };

                      $scope.openModalSave = function(user) {
                                            $scope.items = [user];
                                            var modalInstance = $modal.open({
                                                      templateUrl: 'AddModalContent.html',
                                                      controller: 'AddModalInstanceCtrl',
                                                      resolve: {
                                  items: function () {
                                        return $scope.items;}}
                          });

                                modalInstance.result.then(function (selectedItem) {
                              
                                }, function () {
                                  
                                });
                              };

                        $scope.refreshInput = function(index) {
                        $scope.user = $scope.listUser[index];
                        
                        var customers = Restangular.all('customer/list');
                                    customers.getList().then(function(response){
                                            $scope.listCustomer=response.data;
                          $scope.rucCliente = $scope.getCustomer($scope.listUser[index].rucEmpresa);
                         
                          });
                          };

                          $scope.clear = function() {
                                  $scope.user = {};
                                  $scope.ruc={};
                                  $scope.role={};
                                  $scope.rucCliente={}

                                  $scope.tipoUsuario={};
                                  $scope.emitterSelected={};

                                  $scope.afpperiodo={};
                                  $scope.afpSeleccionado = {};
                                  $scope.periodoSeleccionado = {};

                                  $scope.inInquiry=false;
                                  $scope.inEdit=false;
                                  $scope.isCollapsed  = true;
                                  $scope.codigoDeshabilitado=false;
                                   $scope.loadPage();
                                };

                                  $scope.disableSave = function() {
                                   if ($scope.inInquiry===true){return true;} 
                                   if ($scope.isEmpty($scope.user)){return true;}
                                   if ($scope.isEmpty($scope.tipoUsuario) 
                                        || $scope.isEmpty($scope.emitterSelected)
                                        || $scope.isEmpty($scope.user.codUsuario)                                        
                                        || $scope.isEmpty($scope.role)
                                        || $scope.isEmpty($scope.user.password)
                                        || $scope.isEmpty($scope.user.newPassword)) {
                                                      return true;
                                     } 
                                     return false;
                              };
                                    $scope.getStringValor=function(stringvalor){
                        var desc = '';
                        if (angular.isUndefined(stringvalor) || stringvalor === null) {desc='';} 
                        else 
                        {
                          desc=stringvalor;
                        }                       
                        return desc;
              }; 



                                      $scope.getUserType=function(id) {
                                      var type = {};
                                      angular.forEach($scope.listUserType, function(item) {
                                          if (item.codigo === id) {
                                            type=item;
                                          }
                                        });
                                        return type;
                                      };


                                      $scope.getEmitter=function(id) {
                                      var type = {};
                                      angular.forEach($scope.listEmitter, function(item) {
                                          if (item.identification === id) {
                                            type=item;
                                          }
                                        });
                                        return type;
                                      };

                                      $scope.getCustomer=function(id) {
                                      var type = {};
                                      angular.forEach($scope.listCustomer, function(item) {

                                          if (item.identification.trim() === id.trim()) {
                                            type=item;
                                          }
                                        });
                                        return type;
                                      };


                                      $scope.getRole=function(id) {
                                      var type = {};
                                      angular.forEach($scope.listRole, function(item) {

                                          if (item.codRol.trim() === id.trim()) {
                                            type=item;
                                          }
                                        });
                                        return type;
                                      };

                                      $scope.isEmpty = function(val) {
                                      return angular.isUndefined(val) || val === null || val === '';
                                      };

}]);




sisAdminApp.controller('MarcaPaginationCtrl', ['$scope',function ($scope) {
  $scope.$watch('listaAfpPeriodos', function (newValue) {
    if (newValue) {
      $scope.totalItems = $scope.listaAfpPeriodos.length;
      $scope.currentPage = 1;   
    }
  });
  $scope.currentPage = 1;
  $scope.itemsPerPage=10;
  $scope.maxSize = 10;
  $scope.setPage = function (pageNo) {
    $scope.currentPage = pageNo;
  };
}]);
