'use strict';

sisAdminApp.controller('SaZonaCtrl',
              ['$scope','Restangular','$modal',
              function ($scope,Restangular,$modal) {

                        $scope.codigoDeshabilitado = false;
                        $scope.display = false;
                        $scope.filtro   = '';
                        $scope.sortType     = 'ruc'; // set the default sort type
                        $scope.sortReverse  = false;


                      $scope.loadPage = function() {
                            var almacenId = 1;
                            Restangular.all('zona/byalmacen').post(almacenId).then(function(response){
                              $scope.listaZonas = response.data;
                            });
                        };

                      $scope.save = function() {
                        $scope.zona.almacenId = 1;
                          if($scope.isEmpty($scope.zona.id)) {
                                Restangular.all('zona/add').post($scope.zona).then(function(response) {
                                  if(response.data == '"OK"'){
                                    $scope.openModalSave($scope.zona);
                                    console.log(response.data);
                                    $scope.clear();
                                    $scope.loadPage();
                                  } else {
                                    alert(response.data);
                                    $scope.clear();
                                    $scope.loadPage();
                                  }
                                });
                           } else {
                                Restangular.all('zona/update').post($scope.zona).then(function(response) {
                                    $scope.openModalSave($scope.zona);
                                    console.log(response.data);
                                    $scope.clear();
                                    $scope.loadPage();
                                });
                           }
                      };

                      $scope.delete = function(zona) {
                               $scope.items = [zona];
                               var modalInstance = $modal.open({
                                    templateUrl: 'DelModalContent.html',
                                    controller: 'DelModalInstanceCtrl',
                                    resolve: {items: function () {return $scope.items;}}
                               });

                               modalInstance.result.then(
                                  function (selectedItem) {
                                        Restangular.one('zona').remove({id:$scope.items[0].id}).then(
                                        function(){$scope.clear(); $scope.loadPage();});
                                  },
                                  function () {}
                               );
                      };

                      $scope.edit = function(id) {
                                      $scope.isCollapsed  = false;
                                      $scope.codigoDeshabilitado = true;
                                      var i = 0;
                                      angular.forEach($scope.listaZonas, function(item) {
                                          if (item.id == id) {
                                                $scope.zona = $scope.listaZonas[i];
												                        $scope.almacenSeleccionado = $scope.getAlmacen($scope.listaZonas[i].descripcionAlmacen);
                                          }
                                          i++;
                                      });
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

                                  $scope.zona={};
                                  $scope.almacenSeleccionado={};

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
                                      angular.forEach($scope.listaUbicaciones, function(item) {
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


                                      $scope.getAlmacen=function(id) {
                                      var type = {};
                                      angular.forEach($scope.almacenes, function(item) {

                                          if (item.descripcion.trim() === id.trim()) {
                                            type=item;
                                          }
                                        });
                                        return type;
                                      };

                                      $scope.isEmpty = function(val) {
                                      return angular.isUndefined(val) || val === null || val === '';
                                      };

}]);




sisAdminApp.controller('ZonaPaginationCtrl', ['$scope',function ($scope) {
  $scope.$watch('listaZonas', function (newValue) {
    if (newValue) {
      $scope.totalItems = $scope.listaZonas.length;
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
