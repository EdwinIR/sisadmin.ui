'use strict';

sisAdminApp.controller('SaClienteCtrl',
              ['$scope','Restangular','$modal',
              function ($scope,Restangular,$modal) {

                        $scope.codigoDeshabilitado = false;
                        $scope.display = false;
                        $scope.filtro   = '';
                        $scope.sortType     = 'ruc'; // set the default sort type
                        $scope.sortReverse  = false;
                        $scope.letraInicial='';

              $scope.setearA = function() {$scope.letraInicial = 'a';};
              $scope.setearB = function() {$scope.letraInicial = 'b';};
              $scope.setearC = function() {$scope.letraInicial = 'c';};
              $scope.setearD = function() {$scope.letraInicial = 'd';};
              $scope.setearE = function() {$scope.letraInicial = 'e';};
              $scope.setearF = function() {$scope.letraInicial = 'f';};
              $scope.setearG = function() {$scope.letraInicial = 'g';};
              $scope.setearH = function() {$scope.letraInicial = 'h';};
              $scope.setearI = function() {$scope.letraInicial = 'i';};
              $scope.setearJ = function() {$scope.letraInicial = 'j';};
              $scope.setearK = function() {$scope.letraInicial = 'k';};
              $scope.setearL = function() {$scope.letraInicial = 'l';};
              $scope.setearM = function() {$scope.letraInicial = 'm';};
              $scope.setearN = function() {$scope.letraInicial = 'n';};
              $scope.setearO = function() {$scope.letraInicial = 'o';};
              $scope.setearP = function() {$scope.letraInicial = 'p';};
              $scope.setearQ = function() {$scope.letraInicial = 'q';};
              $scope.setearR = function() {$scope.letraInicial = 'r';};
              $scope.setearS = function() {$scope.letraInicial = 's';};
              $scope.setearT = function() {$scope.letraInicial = 't';};
              $scope.setearU = function() {$scope.letraInicial = 'u';};
              $scope.setearV = function() {$scope.letraInicial = 'v';};
              $scope.setearW = function() {$scope.letraInicial = 'w';};
              $scope.setearX = function() {$scope.letraInicial = 'x';};
              $scope.setearY = function() {$scope.letraInicial = 'y';};
              $scope.setearZ = function() {$scope.letraInicial = 'z';};
              $scope.setearALL = function() {$scope.letraInicial = '';};

              $scope.startsWith = function (actual, expected) {
                    var lowerStr = (actual + "").toLowerCase();
                     return lowerStr.indexOf(expected.toLowerCase()) === 0;
              };


                      $scope.loadPage = function() {
                            var listado = Restangular.all('cliente/list');
                            listado.getList().then(function(response){ $scope.listaClientes = response.data;});
                        };

                      $scope.save = function() {
                        
                          if($scope.isEmpty($scope.cliente.id)) {
                                Restangular.all('cliente/add').post($scope.cliente).then(function(response) {
                                    $scope.openModalSave($scope.cliente);
                                    console.log(response.data);
                                    $scope.clear();
                                    $scope.loadPage();
                                });
                           } else {
                                Restangular.all('cliente/update').post($scope.cliente).then(function(response) {
                                    $scope.openModalSave($scope.cliente);
                                    console.log(response.data);
                                    $scope.clear();
                                    $scope.loadPage();
                                });
                           }
                      };

                      $scope.delete = function(cliente) {
                               $scope.items = [cliente];
                               var modalInstance = $modal.open({
                                    templateUrl: 'DelModalContent.html',
                                    controller: 'DelModalInstanceCtrl',
                                    resolve: {items: function () {return $scope.items;}}
                               });

                               modalInstance.result.then(
                                  function (selectedItem) {
                                        Restangular.one('cliente').remove({id:$scope.items[0].id}).then(
                                        function(){$scope.clear(); $scope.loadPage();});
                                  },
                                  function () {}
                               );
                      };

                      $scope.edit = function(id) {
                                      $scope.isCollapsed  = false;
                                      $scope.codigoDeshabilitado = true;
                                      var i = 0;
                                      angular.forEach($scope.listaClientes, function(item) {
                                          if (item.id == id) {
                                                $scope.cliente = $scope.listaClientes[i];
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

                                  $scope.cliente={};


                                  $scope.inInquiry=false;
                                  $scope.inEdit=false;
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




sisAdminApp.controller('ClientePaginationCtrl', ['$scope',function ($scope) {
  $scope.$watch('listaClientes', function (newValue) {
    if (newValue) {
      $scope.totalItems = $scope.listaClientes.length;
      $scope.currentPage = 1;
    }
  });
  $scope.currentPage = 1;
  $scope.itemsPerPage=20;
  $scope.maxSize = 20;
  $scope.setPage = function (pageNo) {
    $scope.currentPage = pageNo;
  };
}]);
