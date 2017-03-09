sisAdminApp.controller('SaGestionCuentasXCobrarCtrl',
              ['$scope','Restangular','$modal',
              function ($scope,Restangular,$modal) {

                        $scope.codigoDeshabilitado = false;
                        $scope.display = false;
                        $scope.filtro   = '';
                        $scope.sortType     = 'ruc'; // set the default sort type
                        $scope.sortReverse  = false;
                        $scope.displayDetail = false;
                        $scope.disabled=false;
                        $scope.botonesDeshabilitados=true;
                        $scope.pagos={};
                        $scope.pagoParcial=false;
                        $scope.pagoTotal=false;
                        $scope.pagosTotal={};
                        $scope.pagosParcial={};
                        $scope.busquedaGestion={};
                        $scope.busquedaCuenta=false;
                        $scope.clienteSel={};
                        $scope.cuentacobrar = {
                          detalles:[{
                            montoDeuda:0,
                            documento:'0',
                            comentarios:'0',
                            fechaEmision:'',
                            fechaVencimiento:''
                          }]
                        };

                        $scope.mostrarBusqueda = function() {
                            $scope.busquedaCuenta = !$scope.busquedaCuenta;
                          };

                          $scope.limpiar = function(){
                            $scope.clienteSel={};
                            $scope.busquedaGestion={};

                          };

                          $scope.filtroAvanzado = function() {
                            var clienteId = $scope.clienteSel.id;
                            var fechaDesde = $scope.busquedaGestion.fechaDesde;
                            var fechaHasta = $scope.busquedaGestion.fechaHasta;
                              applyFiltro({
                                clienteId : clienteId,
                              //  marcaId : marcaId,
                                fechaDesde : fechaDesde,
                                fechaHasta : fechaHasta
                              });
                            };

                            var applyFiltro = function (filterData) {
                              Restangular.one('cuentacobrar').post('filtro',filterData).then(function(response) {
                                $scope.listaCuentasCobrar = response.data;
                              });
                            };

                        var clientes = Restangular.all('cliente/list');
                          clientes.getList().then(function(response){
                              $scope.clientes=response.data;
                         });

                      $scope.loadPage = function() {
                            var listado = Restangular.all('cuentacobrar/list');
                            listado.getList().then(function(response){ $scope.listaCuentasCobrar = response.data;});
                        };

                      //Muestra los detalles para ingresar uno nuevo
                      $scope.mostrarDetalle = function() {
                            $scope.displayDetail = !$scope.displayDetail;
                      };

                      $scope.save = function() {
                        $scope.cuentacobrar.clieteId = $scope.clienteSeleccionado.id;

                        $scope.displayDetail = false;
                          if($scope.isEmpty($scope.cuentacobrar.id)) {
                                Restangular.all('cuentacobrar/add').post($scope.cuentacobrar).then(function(response) {
                                    $scope.openModalSave($scope.cuentacobrar);
                                    console.log(response.data);
                                    $scope.clear();
                                    $scope.loadPage();
                                });
                           } else {
                             $scope.pagos.id=$scope.cuentacobrar.id;
                                Restangular.all('cuentacobrartotal/update').post($scope.pagos).then(function(response) {
                                    $scope.openModalSave($scope.pagos);
                                    console.log(response.data);
                                    $scope.clear();
                                    $scope.loadPage();
                                });
                           }
                      };

                      $scope.saveTotal = function() {

                        $scope.displayDetail = false;

                             $scope.pagosTotal.id=$scope.cuentacobrar.id;
                                Restangular.all('cuentacobrartotal/update').post($scope.pagosTotal).then(function(response) {
                                    $scope.openModalSave($scope.pagosTotal);
                                    console.log(response.data);
                                    $scope.clear();
                                    $scope.loadPage();
                                });

                      };

                      $scope.saveParcial = function() {

                        $scope.displayDetail = false;

                             $scope.pagosParcial.id=$scope.cuentacobrar.id;
                                Restangular.all('cuentacobrarparcial/update').post($scope.pagosParcial).then(function(response) {
                                    $scope.openModalSave($scope.pagosParcial);
                                    console.log(response.data);
                                    $scope.clear();
                                    $scope.loadPage();
                                });

                      };



                      $scope.delete = function(cuentacobrar) {
                               $scope.items = [cuentacobrar];
                               var modalInstance = $modal.open({
                                    templateUrl: 'DelModalContent.html',
                                    controller: 'DelModalInstanceCtrl',
                                    resolve: {items: function () {return $scope.items;}}
                               });

                               modalInstance.result.then(
                                  function (selectedItem) {
                                        Restangular.one('cuentacobrar').remove({id:$scope.items[0].id}).then(
                                        function(){$scope.clear(); $scope.loadPage();});
                                  },
                                  function () {}
                               );
                      };

                      $scope.edit = function(id) {
                                      $scope.isCollapsed  = false;
                                      $scope.codigoDeshabilitado = true;
                                      $scope.displayDetail = true;
                                      $scope.pagoParcial = false;
                                      $scope.pagoTotal = false;
                                      $scope.busquedaCuenta=false;
                                      $scope.botonesDeshabilitados = true;
                                      var i = 0;
                                      angular.forEach($scope.listaCuentasCobrar, function(item) {
                                          if (item.id == id) {
                                                $scope.cuentacobrar = $scope.listaCuentasCobrar[i];
                                                $scope.clienteSeleccionado = $scope.getCliente($scope.listaCuentasCobrar[i].rucCliente);
                                            }
                                          i++;
                                      });
                      };

                      $scope.editPagoParcial = function(id) {
                                      $scope.isCollapsed  = false;
                                      $scope.codigoDeshabilitado = true;
                                      $scope.displayDetail = true;
                                      $scope.pagoTotal=false;
                                      $scope.pagoParcial = true;
                                      $scope.botonesDeshabilitados = true;
                                      $scope.pagosTotal={};
                                      var i = 0;
                                      angular.forEach($scope.listaCuentasCobrar, function(item) {
                                          if (item.id == id) {
                                                $scope.cuentacobrar = $scope.listaCuentasCobrar[i];
                                                $scope.proveedorSeleccionado = $scope.getProveedor($scope.listaCuentasCobrar[i].rucProveedor);
                                            }
                                          i++;
                                      });
                      };

                      $scope.editPagoTotal = function(id) {
                                      $scope.isCollapsed  = false;
                                      $scope.codigoDeshabilitado = true;
                                      $scope.displayDetail = true;
                                      $scope.botonesDeshabilitados = true;
                                      $scope.pagoTotal = true;
                                      $scope.pagoParcial = false;
                                      $scope.pagosParcial={};
                                      var i = 0;
                                      angular.forEach($scope.listaCuentasCobrar, function(item) {
                                          if (item.id == id) {
                                                $scope.cuentacobrar = $scope.listaCuentasCobrar[i];
                                                $scope.proveedorSeleccionado = $scope.getCliente($scope.listaCuentasCobrar[i].rucCliente);
                                            }
                                          i++;
                                      });
                      };

                        $scope.getCliente=function(id) {
                                      var type = {};
                                      angular.forEach($scope.clientes, function(item) {

                                          if (item.identificador.trim() == id.trim()) {
                                            type=item;
                                          }
                                        });
                                        return type;
                                      };

                      $scope.habilitarBotones = function() {
                                $scope.botonesDeshabilitados = false;
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

                          $scope.clear = function() {
                                  $scope.user = {};
                                  $scope.ruc={};
                                  $scope.role={};
                                  $scope.rucCliente={}

                                  $scope.tipoUsuario={};
                                  $scope.emitterSelected={};

                                  $scope.cuentacobrar={};
                                  $scope.proveedorSeleccionado = {};
                                  $scope.cuentacobrar.detalles = {};

                                  $scope.inInquiry=false;
                                  $scope.codigoDeshabilitado=false;
                                  $scope.isCollapsed  = true;
                                  $scope.displayDetail = false;
                                  $scope.botonesDeshabilitados=true;
                                  $scope.pagosTotal={};
                                  $scope.pagosParcial={};
                                  $scope.pagoParcial=false;
                                  $scope.pagoTotal=false;
                                  $scope.busquedaCuenta=false;
                                  $scope.clienteSel ={};
                                  $scope.proveedorSeleccionado ={};
                                  $scope.busquedaGestion ={};
                                  $scope.busquedaGestion ={};
                                  $scope.cuentacobrar = {
                                    detalles:[{
                                      montoDeuda:0,
                                      documento:"",
                                      comentarios:"",
                                      fechaEmision:"",
                                      fechaVencimiento:""
                                    }]
                                  };
                                   $scope.loadPage();
                                };

                                      //AgregarItem
                                      $scope.addItem=function(){
                                        $scope.cuentacobrar.detalles.push({
                                          montoDeuda:0,
                                          documento:"",
                                          comentarios:"",
                                          fechaVencimiento:""
                                        });
                                      }

                                      //RemoverItem
                                      $scope.removeItem = function(m){
                                        $scope.cuentacobrar.detalles.splice($scope.cuentacobrar.detalles.indexOf(m),1);
                                      }

                                      $scope.isEmpty = function(val) {
                                      return angular.isUndefined(val) || val === null || val === '';
                                      };

}]);




sisAdminApp.controller('GestionCuentaCobrarPaginationCtrl', ['$scope',function ($scope) {
  $scope.$watch('listaCuentasCobrar', function (newValue) {
    if (newValue) {
      $scope.totalItems = $scope.listaCuentasCobrar.length;
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
