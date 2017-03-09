'use strict';

sisAdminApp.controller('SaTrabajadorCtrl', 
              ['$scope','Restangular','$modal',
              function ($scope,Restangular,$modal) {
                       
                        $scope.edicion = false;
                        $scope.display = false;
                        $scope.filtro   = '';
                        $scope.sortType     = 'ruc'; // set the default sort type
                        $scope.sortReverse  = false;


                          var sedes = Restangular.all('sede/list');
                          sedes.getList().then(function(response){
                              $scope.sedes=response.data;                                          
                          });  

                         var departamentos = Restangular.all('departamento/list');
                          departamentos.getList().then(function(response){
                              $scope.departamentos=response.data;                                          
                          });    

                          var tipostrabajadores = Restangular.all('tipotrabajador/list');
                          tipostrabajadores.getList().then(function(response){
                              $scope.tipostrabajadores=response.data;                                          
                          }); 

                          var puestostrabajos = Restangular.all('puestotrabajo/list');
                          puestostrabajos.getList().then(function(response){
                              $scope.puestostrabajos=response.data;                                          
                          }); 

                    
                       
                      $scope.loadPage = function() {  
                            var listado = Restangular.all('trabajador/list');
                            listado.getList().then(function(response){ $scope.listaTrabajadores = response.data;});
                        };


                      $scope.save = function() {     
                          $scope.trabajador.sedeId = $scope.sedeSeleccionada.id;
                          $scope.trabajador.departamentoId = $scope.departamentoSeleccionado.id;
                          $scope.trabajador.tipoTrabajadorId = $scope.tipoTrabajadorSeleccionado.id;
                          $scope.trabajador.puestoTrabajoId = $scope.puestoTrabajoSeleccionado.id;                   
                          if($scope.isEmpty($scope.trabajador.id)) {
                                Restangular.all('trabajador/add').post($scope.trabajador).then(function(response) {
                                    $scope.openModalSave($scope.trabajador);                                  
                                    console.log(response.data);                    
                                    $scope.clear();
                                    $scope.loadPage();
                                });
                           } else {
                                Restangular.all('trabajador/update').post($scope.trabajador).then(function(response) {
                                    $scope.openModalSave($scope.trabajador);                                  
                                    console.log(response.data);                    
                                    $scope.clear();
                                    $scope.loadPage();
                                });
                           }    
                      };

                      $scope.delete = function(trabajador) {
                               $scope.items = [trabajador];
                               var modalInstance = $modal.open({
                                    templateUrl: 'DelModalContent.html',
                                    controller: 'DelModalInstanceCtrl',
                                    resolve: {items: function () {return $scope.items;}}
                               });

                               modalInstance.result.then(
                                  function (selectedItem) {
                                        Restangular.one('trabajador').remove({id:$scope.items[0].id}).then(
                                        function(){$scope.clear(); $scope.loadPage();});
                                  },                                
                                  function () {}
                               );
                      };
                     
                      $scope.edit = function(id) {
                                      $scope.isCollapsed  = false;                                      
                                      $scope.edicion = true;
                                      var i = 0;
                                      angular.forEach($scope.listaTrabajadores, function(item) {
                                          if (item.id == id) {
                                                $scope.trabajador = $scope.listaTrabajadores[i];
												$scope.sedeSeleccionada = $scope.getSede($scope.listaTrabajadores[i].descripcionSede);
                                                $scope.departamentoSeleccionado = $scope.getDepartamento($scope.listaTrabajadores[i].descripcionDepartamento);
                                                $scope.tipoTrabajadorSeleccionado = $scope.getTipoTrabajador($scope.listaTrabajadores[i].descripcionTipoTrabajador);
                                                $scope.puestoTrabajoSeleccionado = $scope.getPuestoTrabajo($scope.listaTrabajadores[i].descripcionPuestoTrabajo);
                                          }
                                          i++;
                                      });
                      };

							$scope.getSede=function(id) {
                                      var type = {};
                                      angular.forEach($scope.sedes, function(item) {

                                          if (item.descripcion.trim() === id.trim()) {
                                            type=item;
                                          }
                                        });
                                        return type;
                                      };

                              $scope.getDepartamento=function(id) {
                                      var type = {};
                                      angular.forEach($scope.departamentos, function(item) {

                                          if (item.descripcion.trim() === id.trim()) {
                                            type=item;
                                          }
                                        });
                                        return type;
                                      };

                               $scope.getTipoTrabajador=function(id) {
                                      var type = {};
                                      angular.forEach($scope.tipostrabajadores, function(item) {

                                          if (item.descripcion.trim() === id.trim()) {
                                            type=item;
                                          }
                                        });
                                        return type;
                                      };

                              $scope.getPuestoTrabajo=function(id) {
                                      var type = {};
                                      angular.forEach($scope.puestostrabajos, function(item) {

                                          if (item.descripcion.trim() === id.trim()) {
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

                                  $scope.trabajador={};
                                  $scope.sedeSeleccionada={};
                                  $scope.departamentoSeleccionado={};
                                  $scope.tipoTrabajadorSeleccionado={};
                                  $scope.puestoTrabajoSeleccionado={};

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
                                    $scope.getStringValor=function(stringvalor){
                        var desc = '';
                        if (angular.isUndefined(stringvalor) || stringvalor === null) {desc='';} 
                        else 
                        {
                          desc=stringvalor;
                        }                       
                        return desc;
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
  $scope.$watch('listaTrabajadores', function (newValue) {
    if (newValue) {
      $scope.totalItems = $scope.listaTrabajadores.length;
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
