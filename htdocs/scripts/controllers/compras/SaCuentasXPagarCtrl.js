'use strict';

sisAdminApp.controller('SaCuentasXPagarCtrl',
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

                        $scope.cuentapagar = {
                          detalles:[{
                            montoDeuda:'',
                            documento:'',
                            comentarios:'',
                            fechaEmision:'',
                            fechaVencimiento:''
                          }]
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

                      $scope.getTotal = function(){
                            var suma=0;

                            for(var i = 0; i <$scope.cuentapagar.detalles.length;i++){
                                var cuenta = $scope.cuentapagar.detalles[i];
                                $scope.cuentapagar.total =suma;
                                suma = $scope.cuentapagar.total  + (1 * $scope.validation(cuenta.montoDeuda));
                              }

                            $scope.cuentapagar.total = suma;
                      };

                      $scope.validation = function(val) {

                            if(angular.isUndefined(val) || val === null || val === ''){
                              return 0;
                              }
                              return val;
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
                                Restangular.all('cuentapagar/update').post($scope.cuentapagar).then(function(response) {
                                    $scope.openModalSave($scope.cuentapagar);
                                    console.log(response.data);
                                    $scope.clear();
                                    $scope.loadPage();
                                });
                           }
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




sisAdminApp.controller('CuentaPagarPaginationCtrl', ['$scope',function ($scope) {
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
