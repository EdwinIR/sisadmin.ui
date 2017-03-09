sisAdminApp.controller('SaGestionCuentasXPagarCtrl',
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
                        $scope.proveedorSel={};
                        $scope.cuentapagar = {
                          detalles:[{
                            montoDeuda:0,
                            documento:'0',
                            comentarios:'0',
                            fechaEmision:'',
                            fechaVencimiento:''
                          }]
                        };


                        $scope.valida = function(val){
                          $scope.v=false;

                          if(val==='Pagado Parcialmente'){
                            $scope.v=true;
                          }

                          return $scope.v;
                        };

                        $scope.limpiar = function() {
                            $scope.proveedorSel ={};
                            $scope.busquedaGestion ={};
                            $scope.busquedaGestion ={};
                          };

                        $scope.mostrarBusqueda = function() {
                            $scope.busquedaCuenta = !$scope.busquedaCuenta;
                          };

                          $scope.filtroAvanzado = function() {
                            var proveedorId = $scope.proveedorSel.id;
                          //  var marcaId = $scope.busqueda.marcaId;
                            var fechaDesde = $scope.busquedaGestion.fechaDesde;
                            var fechaHasta = $scope.busquedaGestion.fechaHasta;
                              applyFiltro({
                                proveedorId : proveedorId,
                              //  marcaId : marcaId,
                                fechaDesde : fechaDesde,
                                fechaHasta : fechaHasta
                              });
                            };

                            var applyFiltro = function (filterData) {
                              Restangular.one('cuentapagar').post('filtro',filterData).then(function(response) {
                                $scope.listaCuentasPagar = response.data;
                              });
                            };

                        var proveedores = Restangular.all('proveedor/list');
                          proveedores.getList().then(function(response){
                              $scope.proveedores=response.data;
                         });

                      $scope.loadPage = function() {
                            var listado = Restangular.all('cuentapagar/list');
                            listado.getList().then(function(response){ $scope.listaCuentasPagar = response.data;});
                        };

                      //Muestra los detalles para ingresar uno nuevo
                      $scope.mostrarDetalle = function() {
                            $scope.displayDetail = !$scope.displayDetail;
                      };

                      $scope.save = function() {
                        $scope.cuentapagar.proveedorId = $scope.proveedorSeleccionado.id;

                        $scope.displayDetail = false;
                          if($scope.isEmpty($scope.cuentapagar.id)) {
                                Restangular.all('cuentapagar/add').post($scope.cuentapagar).then(function(response) {
                                    $scope.openModalSave($scope.cuentapagar);
                                    console.log(response.data);
                                    $scope.clear();
                                    $scope.loadPage();
                                });
                           } else {
                             $scope.pagos.id=$scope.cuentapagar.id;
                                Restangular.all('cuentapagartotal/update').post($scope.pagos).then(function(response) {
                                    $scope.openModalSave($scope.pagos);
                                    console.log(response.data);
                                    $scope.clear();
                                    $scope.loadPage();
                                });
                           }
                      };

                      $scope.saveTotal = function() {

                        $scope.displayDetail = false;

                             $scope.pagosTotal.id=$scope.cuentapagar.id;
                                Restangular.all('cuentapagartotal/update').post($scope.pagosTotal).then(function(response) {
                                    $scope.openModalSave($scope.pagosTotal);
                                    console.log(response.data);
                                    $scope.clear();
                                    $scope.loadPage();
                                });

                      };

                      $scope.saveParcial = function() {

                        $scope.displayDetail = false;

                             $scope.pagosParcial.id=$scope.cuentapagar.id;
                                Restangular.all('cuentapagarparcial/update').post($scope.pagosParcial).then(function(response) {
                                    $scope.openModalSave($scope.pagosParcial);
                                    console.log(response.data);
                                    $scope.clear();
                                    $scope.loadPage();
                                });

                      };



                      $scope.delete = function(cuentapagar) {
                               $scope.items = [cuentapagar];
                               var modalInstance = $modal.open({
                                    templateUrl: 'DelModalContent.html',
                                    controller: 'DelModalInstanceCtrl',
                                    resolve: {items: function () {return $scope.items;}}
                               });

                               modalInstance.result.then(
                                  function (selectedItem) {
                                        Restangular.one('cuentapagar').remove({id:$scope.items[0].id}).then(
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
                                      angular.forEach($scope.listaCuentasPagar, function(item) {
                                          if (item.id == id) {
                                                $scope.cuentapagar = $scope.listaCuentasPagar[i];
                                                $scope.proveedorSeleccionado = $scope.getProveedor($scope.listaCuentasPagar[i].rucProveedor);
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
                                      angular.forEach($scope.listaCuentasPagar, function(item) {
                                          if (item.id == id) {
                                                $scope.cuentapagar = $scope.listaCuentasPagar[i];
                                                $scope.proveedorSeleccionado = $scope.getProveedor($scope.listaCuentasPagar[i].rucProveedor);
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
                                      angular.forEach($scope.listaCuentasPagar, function(item) {
                                          if (item.id == id) {
                                                $scope.cuentapagar = $scope.listaCuentasPagar[i];
                                                $scope.proveedorSeleccionado = $scope.getProveedor($scope.listaCuentasPagar[i].rucProveedor);
                                            }
                                          i++;
                                      });
                      };

                        $scope.getProveedor=function(id) {
                                      var type = {};
                                      angular.forEach($scope.proveedores, function(item) {

                                          if (item.ruc.trim() == id.trim()) {
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

                                  $scope.cuentapagar={};
                                  $scope.proveedorSeleccionado = {};
                                  $scope.cuentapagar.detalles = {};

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
                                  $scope.proveedorSeleccionado ={};
                                  $scope.proveedorSel ={};
                                  $scope.busquedaGestion ={};
                                  $scope.busquedaGestion ={};
                                  $scope.cuentapagar = {
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
                                        $scope.cuentapagar.detalles.push({
                                          montoDeuda:0,
                                          documento:"",
                                          comentarios:"",
                                          fechaVencimiento:""
                                        });
                                      }

                                      //RemoverItem
                                      $scope.removeItem = function(m){
                                        $scope.cuentapagar.detalles.splice($scope.cuentapagar.detalles.indexOf(m),1);
                                      }

                                      $scope.isEmpty = function(val) {
                                      return angular.isUndefined(val) || val === null || val === '';
                                      };

}]);




sisAdminApp.controller('GestionCuentaPagarPaginationCtrl', ['$scope',function ($scope) {
  $scope.$watch('listaCuentasPagar', function (newValue) {
    if (newValue) {
      $scope.totalItems = $scope.listaCuentasPagar.length;
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
