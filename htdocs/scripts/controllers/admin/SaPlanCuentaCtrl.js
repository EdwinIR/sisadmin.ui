'use strict';

sisAdminApp.controller('SaPlanCuentaCtrl', 
              ['$scope','Restangular','$modal',
              function ($scope,Restangular,$modal) {
                       
                        $scope.codigoDeshabilitado = false;
                        $scope.display = false;
                        $scope.filtro   = '';
                        $scope.sortType     = 'ruc'; // set the default sort type
                        $scope.sortReverse  = false;

                        
                       
                      $scope.loadPage = function() {  
                            var listado = Restangular.all('plancuenta/list');
                            listado.getList().then(function(response){ $scope.listaPlanCuentas = response.data;});
                        };

                      $scope.save = function() {                        
                          if($scope.isEmpty($scope.plancuenta.id)) {
                                Restangular.all('plancuenta/add').post($scope.plancuenta).then(function(response) {
                                    $scope.openModalSave($scope.plancuenta);                                  
                                    console.log(response.data);                    
                                    $scope.clear();
                                    $scope.loadPage();
                                });
                           } else {
                                Restangular.all('plancuenta/update').post($scope.plancuenta).then(function(response) {
                                    $scope.openModalSave($scope.plancuenta);                                  
                                    console.log(response.data);                    
                                    $scope.clear();
                                    $scope.loadPage();
                                });
                           }    
                      };

                      $scope.delete = function(plancuenta) {
                               $scope.items = [plancuenta];
                               var modalInstance = $modal.open({
                                    templateUrl: 'DelModalContent.html',
                                    controller: 'DelModalInstanceCtrl',
                                    resolve: {items: function () {return $scope.items;}}
                               });

                               modalInstance.result.then(
                                  function (selectedItem) {
                                        Restangular.one('plancuenta').remove({id:$scope.items[0].id}).then(
                                        function(){$scope.clear(); $scope.loadPage();});
                                  },                                
                                  function () {}
                               );
                      };
                     
                      $scope.edit = function(id) {
                                      $scope.isCollapsed  = false;                                      
                                      $scope.codigoDeshabilitado = true;
                                      var i = 0;
                                      angular.forEach($scope.listaPlanCuentas, function(item) {
                                          if (item.id == id) {
                                                $scope.plancuenta = $scope.listaPlanCuentas[i];
                                          }
                                          i++;
                                      });
                      };
//prueba

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

                                  $scope.plancuenta={};

                                  $scope.inInquiry=false;
                                  $scope.inEdit=false;
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
  $scope.$watch('listaPlanCuentas', function (newValue) {
    if (newValue) {
      $scope.totalItems = $scope.listaPlanCuentas.length;
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
