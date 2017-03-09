'use strict';

sisAdminApp.controller('SaUnidadMedidaCtrl',
              ['$scope','Restangular','$modal',
              function ($scope,Restangular,$modal) {

                        $scope.codigoDeshabilitado = false;
                        $scope.display = false;
                        $scope.filtro   = '';
                        $scope.sortType     = 'ruc'; // set the default sort type
                        $scope.sortReverse  = false;

                      $scope.loadPage = function() {
                            var listado = Restangular.all('unidadmedida/list');
                            listado.getList().then(function(response){
                              $scope.listaUnidadMedidas = response.data;
                            });
                        };

                      $scope.save = function() {
                          if($scope.isEmpty($scope.unidadmedida.id)) {
                                Restangular.all('unidadmedida/add').post($scope.unidadmedida).then(function(response) {
                                  if(response.data == '"OK"'){
                                    $scope.openModalSave($scope.unidadmedida);
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
                                Restangular.all('unidadmedida/update').post($scope.unidadmedida).then(function(response) {
                                    $scope.openModalSave($scope.unidadmedida);
                                    console.log(response.data);
                                    $scope.clear();
                                    $scope.loadPage();
                                });
                           }
                      };

                      $scope.delete = function(unidadmedida) {
                               $scope.items = [unidadmedida];
                               var modalInstance = $modal.open({
                                    templateUrl: 'DelModalContent.html',
                                    controller: 'DelModalInstanceCtrl',
                                    resolve: {items: function () {return $scope.items;}}
                               });

                               modalInstance.result.then(
                                  function (selectedItem) {
                                        Restangular.one('unidadmedida').remove({id:$scope.items[0].id}).then(
                                        function(){$scope.clear(); $scope.loadPage();});
                                  },
                                  function () {}
                               );
                      };

                      $scope.edit = function(id) {
                                      $scope.isCollapsed  = false;
                                      $scope.codigoDeshabilitado = true;
                                      var i = 0;
                                      angular.forEach($scope.listaUnidadMedidas, function(item) {
                                          if (item.id == id) {
                                                $scope.unidadmedida = $scope.listaUnidadMedidas[i];
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

                                  $scope.unidadmedida={};

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




sisAdminApp.controller('UnidadMedidaPaginationCtrl', ['$scope',function ($scope) {
  $scope.$watch('listaUnidadMedidas', function (newValue) {
    if (newValue) {
      $scope.totalItems = $scope.listaUnidadMedidas.length;
      $scope.currentPage = 1;
    }
  });
  $scope.currentPage = 1;
  $scope.itemsPerPage = 20;
  $scope.maxSize = 20;
  $scope.setPage = function (pageNo) {
    $scope.currentPage = pageNo;
  };
}]);
