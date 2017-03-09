'use strict';

sisAdminApp.controller('SaCobranzasCtrl',
              ['$scope','Restangular','$modal',
              function ($scope,Restangular,$modal) {

                        $scope.codigoDeshabilitado = false;
                        $scope.display = false;
                        $scope.filtro   = '';
                        $scope.sortType     = 'ruc'; // set the default sort type
                        $scope.sortReverse  = false;
                        $scope.displayDetail = false;

                        $scope.clientedeuda = {
                          detalles:[{
                            documento:"",
                            fechaEmision:"",
                            montoTotal:0,
                            montoAdeudado:0,
                            fechaVencimiento:"",
                            Observaciones:""
                          }]
                        };



                      $scope.loadPage = function() {
                            var listado = Restangular.all('clientedeuda/list');
                            listado.getList().then(function(response){ $scope.listaClientesDeudas = response.data;});
                        };


                      $scope.mostrarDetalle = function() {
                            $scope.displayDetail = !$scope.displayDetail;
                      };

                      $scope.save = function() {
                        $scope.ordenCompra.idProveedor = $scope.proveedorSeleccionado.id;
                        $scope.ordenCompra.idAlmacen = $scope.almacenSeleccionado.id;
                        $scope.ordenCompra.condicionPagoCodigo = $scope.condicionSeleccionado.codigo;
                        $scope.ordenCompra.tipoMonedaCodigo = $scope.tipoSeleccionado.codigo;
                        $scope.displayDetail = false;
                          if($scope.isEmpty($scope.ordenCompra.id)) {
                                Restangular.all('ordencompra/add').post($scope.ordenCompra).then(function(response) {
                                    $scope.openModalSave($scope.ordenCompra);
                                    console.log(response.data);
                                    $scope.clear();
                                    $scope.loadPage();
                                });
                           } else {
                                Restangular.all('ordencompra/update').post($scope.ordenCompra).then(function(response) {
                                    $scope.openModalSave($scope.ordenCompra);
                                    console.log(response.data);
                                    $scope.clear();
                                    $scope.loadPage();
                                });
                           }
                      };

                      $scope.delete = function(ordencompra) {
                               $scope.items = [ordenCompra];
                               var modalInstance = $modal.open({
                                    templateUrl: 'DelModalContent.html',
                                    controller: 'DelModalInstanceCtrl',
                                    resolve: {items: function () {return $scope.items;}}
                               });

                               modalInstance.result.then(
                                  function (selectedItem) {
                                        Restangular.one('ordencompra').remove({id:$scope.items[0].id}).then(
                                        function(){$scope.clear(); $scope.loadPage();});
                                  },
                                  function () {}
                               );
                      };

                      $scope.edit = function(id) {
                                      $scope.isCollapsed  = false;
                                      $scope.codigoDeshabilitado = true;
                                      $scope.displayDetail = true;
                                      var i = 0;
                                      angular.forEach($scope.listaClientesDeudas, function(item) {
                                          if (item.id == id) {
                                                $scope.clientedeuda = $scope.listaClientesDeudas[i];
                                                //$scope.proveedorSeleccionado = $scope.getProveedor($scope.listaOrdenesCompras[i].razonSocialProveedor);
                                              //  $scope.almacenSeleccionado = $scope.getAlmacen($scope.listaOrdenesCompras[i].descripcionAlmacen);
                                              //  $scope.condicionSeleccionado = $scope.getCondiciones($scope.listaOrdenesCompras[i].descripcionCondicionPago);
                                                //$scope.tipoSeleccionado = $scope.getTipo($scope.listaOrdenesCompras[i].descripcionTipoPago);
                                               }
                                          i++;
                                      });
                      };

                        $scope.getProveedor=function(id) {
                                      var type = {};
                                      angular.forEach($scope.proveedores, function(item) {

                                          if (item.razonSocial.trim() == id.trim()) {
                                            type=item;
                                          }
                                        });
                                        return type;
                                      };

                          $scope.getAlmacen=function(id) {
                                      var type = {};
                                      angular.forEach($scope.almacenes, function(item) {

                                          if (item.descripcion.trim() == id.trim()) {
                                            type=item;
                                          }
                                        });
                                        return type;
                                      };

                           $scope.getTipo=function(id) {
                                      var type = {};
                                      angular.forEach($scope.tiposmonedas, function(item) {

                                          if (item.descripcion.trim() == id.trim()) {
                                            type=item;
                                          }
                                        });
                                        return type;
                                      };

                             $scope.getCondiciones=function(id) {
                                      var type = {};
                                      angular.forEach($scope.condicionespagos, function(item) {

                                          if (item.descripcion.trim() == id.trim()) {
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

                                  $scope.ordencompra={};
                                  $scope.proveedorSeleccionado = {};
                                  $scope.almacenSeleccionado = {};
                                  $scope.condicionSeleccionado = {};
                                  $scope.tipoSeleccionado = {};

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

                                      //AgregarItem
                                      $scope.addItem=function(){
                                        $scope.clientedeuda.detalles.push({
                                          nroDocumento:"",
                                          fechaEmisionDoc:"",
                                          montoTotalDoc:0,
                                          montoAdeudadoDoc:0,
                                          fechaVencimiento:"",
                                          Observaciones:""
                                        });
                                      }

                                      //RemoverItem
                                      $scope.removeItem = function(m){
                                        $scope.clientedeuda.detalles.splice($scope.clientedeuda.detalles.indexOf(m),1);
                                      }


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
  $scope.$watch('listaClientesDeudas', function (newValue) {
    if (newValue) {
      $scope.totalItems = $scope.listaClientesDeudas.length;
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
