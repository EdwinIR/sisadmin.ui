'use strict';

sisAdminApp.controller('SaParteIngresoAlmacenCtrl',
              ['$scope','Restangular','$modal', 'LoginFactory',
              function ($scope,Restangular,$modal, LoginFactory) {

                $scope.codigoDeshabilitado = false; $scope.display = false;
                $scope.filtro = ''; $scope.sortType = 'ruc';
                $scope.sortReverse = false; $scope.cabeceraDetalle=false;
                $scope.proveedorSeleccionado={}; $scope.parteingresoalmacen={};
                var proveedores = Restangular.all('proveedor/list');
                proveedores.getList().then(function(response){ $scope.proveedores=response.data; });
                $scope.loadPage = function() {
                  var listado = Restangular.all('parteingresoalmacen/list');
                  listado.getList().then(function(response){ $scope.listaParteIngresoAlmacenes = response.data;});
                  var ordenescompras = Restangular.all('ordencomprapdte/list');
                  ordenescompras.getList().then(function(response){ $scope.ordenescompras=response.data; });
                };
                $scope.filter = function() {
                  var ordenCompraId = $scope.parteingresoalmacen.ordenCompraId.id;
                  $scope.applyFilter({ ordenCompraId : ordenCompraId });
                };
                $scope.applyFilter = function (filterData) {
                  Restangular.one('ordencompra').post('filter',filterData).then(function(response) {
                      $scope.ordenCompra = response.data; $scope.cabeceraDetalle=true; });
                };
                $scope.salvado = function() {
                    $scope.parteingresoalmacen.ordenCompraId=$scope.parteingresoalmacen.ordenCompraId.id;
                    $scope.parteingresoalmacen.almacenId = LoginFactory.getAlmacenId();
                    if($scope.isEmpty($scope.parteingresoalmacen.id)) {
                            Restangular.all('parteingresoalmacen/add').post($scope.parteingresoalmacen).then(function(response) {
                                $scope.openModalSave($scope.parteingresoalmacen); console.log(response.data); $scope.limpiar(); $scope.loadPage();  });
                    } else {Restangular.all('parteingresoalmacen/update').post($scope.parteingresoalmacen).then(function(response) {
                                $scope.openModalSave($scope.parteingresoalmacen); console.log(response.data); $scope.limpiar(); $scope.loadPage(); });
                     }
                };
                $scope.borrar = function(parteingresoalmacen) {
                      $scope.items = [parteingresoalmacen];
                      var modalInstance = $modal.open({ templateUrl: 'DelModalContent.html', controller: 'DelModalInstanceCtrl',
                          resolve: {items: function () {return $scope.items;}}  });
                      modalInstance.result.then(
                          function (selectedItem) {
                                Restangular.one('parteingresoalmacen').remove({id:$scope.items[0].id}).then(
                                    function(){$scope.limpiar(); $scope.loadPage();});
                          },
                          function () {} );
                };
                $scope.openModalSave = function(user) {
                  $scope.items = [user];
                  var modalInstance = $modal.open({
                      templateUrl: 'AddModalContent.html',
                      controller: 'AddModalInstanceCtrl',
                      resolve: { items: function () { return $scope.items;}}  });
                  modalInstance.result.then(function (selectedItem) {
                        }, function () { });
                };
                $scope.limpiar = function() {
                    $scope.user = {}; $scope.ruc={}; $scope.role={}; $scope.rucCliente={}; $scope.tipoUsuario={};
                    $scope.emitterSelected={}; $scope.parteingresoalmacen={}; $scope.inInquiry=false; $scope.codigoDeshabilitado=false;
                    $scope.isCollapsed  = true; $scope.cabeceraDetalle=false; $scope.loadPage();
                };
                $scope.isEmpty = function(val) { return angular.isUndefined(val) || val === null || val === ''; };

}]);

sisAdminApp.controller('ParteIngresoAlmacenesPaginationCtrl', ['$scope',function ($scope) {
  $scope.$watch('listaParteIngresoAlmacenes', function (newValue) {
    if (newValue) {
      $scope.totalItems = $scope.listaParteIngresoAlmacenes.length;
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
