'use strict';

sisAdminApp.controller('SaOperacionProveedorCtrl', 
              ['$scope','Restangular','$modal',
              function ($scope,Restangular,$modal) {
                       
                        $scope.codigoDeshabilitado = false;
                        $scope.display = false;
                        $scope.filtro   = '';
                        $scope.sortType     = 'ruc'; // set the default sort type
                        $scope.sortReverse  = false;

                        var proveedores = Restangular.all('proveedor/list');
                          proveedores.getList().then(function(response){
                              $scope.proveedores=response.data;                                          
                         });
                       
                      $scope.loadPage = function() {  
                            var listado = Restangular.all('operacionproveedor/list');
                            listado.getList().then(function(response){ $scope.listaOperacionProveedores = response.data;});
                        };

                      $scope.save = function() {
                            $scope.operacionproveedor.proveedorId=$scope.proveedorSeleccionado.id;
                          if($scope.isEmpty($scope.operacionproveedor.id)) {
                                Restangular.all('operacionproveedor/add').post($scope.operacionproveedor).then(function(response) {
                                    $scope.openModalSave($scope.operacionproveedor);                                  
                                    console.log(response.data);                    
                                    $scope.clear();
                                    $scope.loadPage();
                                });
                           } else {
                                Restangular.all('operacionproveedor/update').post($scope.operacionproveedor).then(function(response) {
                                    $scope.openModalSave($scope.operacionproveedor);                                  
                                    console.log(response.data);                    
                                    $scope.clear();
                                    $scope.loadPage();
                                });
                           }    
                      };

                      $scope.delete = function(operacionproveedor) {
                               $scope.items = [operacionproveedor];
                               var modalInstance = $modal.open({
                                    templateUrl: 'DelModalContent.html',
                                    controller: 'DelModalInstanceCtrl',
                                    resolve: {items: function () {return $scope.items;}}
                               });

                               modalInstance.result.then(
                                  function (selectedItem) {
                                        Restangular.one('operacionproveedor').remove({id:$scope.items[0].id}).then(
                                        function(){$scope.clear(); $scope.loadPage();});
                                  },                                
                                  function () {}
                               );
                      };
                     
                      $scope.edit = function(id) {
                                      $scope.isCollapsed  = false;                                      
                                      $scope.codigoDeshabilitado = true;
                                      var i = 0;
                                      angular.forEach($scope.listaOperacionProveedores, function(item) {
                                          if (item.id == id) {
                                                $scope.operacionproveedor = $scope.listaOperacionProveedores[i];
												$scope.proveedorSeleccionado = $scope.getProveedor($scope.listaOperacionProveedores[i].razonSocialProveedor);
                                          }
                                          i++;
                                      });
                      };

						$scope.getProveedor=function(id) {
                                      var type = {};
                                      angular.forEach($scope.proveedores, function(item) {

                                          if (item.razonSocial.trim() === id.trim()) {
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

                                  $scope.operacionproveedor={};
                                  $scope.proveedorSeleccionado={};


                                  $scope.inInquiry=false;
                                  $scope.codigoDeshabilitado=false;
                                  $scope.isCollapsed  = true;
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
  $scope.$watch('listaOperacionProveedores', function (newValue) {
    if (newValue) {
      $scope.totalItems = $scope.listaOperacionProveedores.length;
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
