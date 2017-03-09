'use strict';

sisAdminApp.controller('UserCtrl', 
              ['$scope','Restangular','$modal',
              function ($scope,Restangular,$modal) {

                        $scope.inInquiry = false;
                        $scope.inEdit = false;
                        $scope.display = false;
                        $scope.searchUser   = '';
                        $scope.sortType     = 'ruc'; // set the default sort type
                        $scope.sortReverse  = false;
                        

                       //tablas helper
                        /*var rUserTypes = Restangular.all('combo/usertype/list');
                        rUserTypes.getList().then(function(response){
                          $scope.listUserType =response.data;
                        });*/

                       /* var rEmitters = Restangular.all('combo/emitter/list');
                        rEmitters.getList().then(function(response){
                          $scope.listEmitter =response.data;
                        });*/

                          var rEmitters = Restangular.one('emitter').get().then(function(response){
                          $scope.emitter=response.data;
                          });

                     

                        /**Filtramos roles != Cliente**/
                       var rRoles = Restangular.all('combo/role/list');
                             rRoles.getList().then(function(response){
                             $scope.listRoles =response.data;
                             $scope.listRole = $scope.listRoles.filter(function(item) {
                             return item.codRol !== 'Cliente'; });
                        })  



                        /*cambiamos customer de acuerdo a emisor
                        $scope.$watch('emitterSelected', function (newValue) {
                          if (newValue) {
                            var emitterIdentification = $scope.emitterSelected.identification;

                            if (!$scope.inInquiry && !$scope.inEdit) {
                              Restangular.all('customer/list/emitter').getList({emitterId : emitterIdentification}).then(function(response){
                                $scope.listCustomer =response.data;
                              });
                            }
                          }
                        });  */

                        $scope.loadPage = function()
                       {  
                          var tipoUsuario = 'E';                      
                          var user = Restangular.all('user/list');
                           user.getList({tipoUsuario : tipoUsuario}).then(function(response){
                           $scope.listUser=response.data;});

                        };

                        $scope.saveUser = function() {

                            $scope.user.ruc = $scope.emitter.identification;//ruc empresa $scope.user.ruc = $scope.emitterSelected.identification;
                            $scope.user.tipoUsuario = 'E';//tipo de usuario E                        
                            $scope.user.role = $scope.role.codRol;
                            $scope.user.isActive = 'Y';
                            $scope.user.rucEmpresa = '';
                            $scope.user.newRepeatPassword = $scope.user.password;

                           if($scope.user.password===$scope.user.newPassword){

                                Restangular.all('user').post($scope.user).then(function(response) {
                                  //if(response.data ==='\"OK\"'){}
                                    $scope.openModalSave($scope.user); 
                                 
                                console.log(response.data);                    
                                $scope.clear();
                                $scope.loadPage();
                               });
                            }else{

                                $scope.openModalError();


                          }
                                
                      };

                          $scope.openModalDelete = function(user) {
                                            $scope.items = [user];
                                            var modalInstance = $modal.open({
                                                      templateUrl: 'DelModalContent.html',
                                                      controller: 'DelModalInstanceCtrl',
                                                      resolve: {
                                  items: function () {
                                        return $scope.items;}}
                          });

                          modalInstance.result.then(function (selectedItem) {
                            Restangular.one('user').remove({id:$scope.items[0].codUsuario,emitterId:$scope.items[0].ruc,type:$scope.items[0].tipoUsuario}).then(function(){
                            $scope.clear();
                            $scope.loadPage();  
                            });
                        }, 
                            function () {}
                                    );
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

                        $scope.openModalError = function() {
                                            
                                            var modalInstance = $modal.open({
                                                      templateUrl: 'ErrorModalContent.html',
                                                      controller: 'AddModalInstanceCtrl',
                                                      resolve: {
                                  items: function () {
                                        return $scope.items;}}
                          });

                                modalInstance.result.then(function (selectedItem) {
                              
                                }, function () {
                                  
                                });
                        };

 



                         $scope.inquiry = function(ruc, codUsuario) {
                                      $scope.inInquiry = true;
                                      $scope.inEdit = false;
                                      $scope.isCollapsed  = false;
                                      var i = 0;
                                      angular.forEach($scope.listUser, function(item) 
                                      {
                                          if ( item.ruc.trim() === ruc && item.codUsuario.trim() === codUsuario ) 
                                          {
                                            $scope.user = $scope.listUser[i];
                                            $scope.tipoUsuario = $scope.getUserType($scope.listUser[i].tipoUsuario);
                                            $scope.role = $scope.getRole($scope.listUser[i].role);
                                           
                                            
                                          }
                                          i++;
                                      });
                                                                            


                           /* $scope.inInquiry = true;
                            $scope.inEdit = false;
                            $scope.user = $scope.listUser[index];
                            $scope.tipoUsuario = $scope.getUserType($scope.listUser[index].tipoUsuario);
                        
                            $scope.role = $scope.getRole($scope.listUser[index].role);
                           
                            $scope.refreshInput(index);*/
                          };

                          $scope.edit = function(ruc, codUsuario) {
                                      $scope.isCollapsed  = false;
                                      $scope.inInquiry = false;
                                      $scope.inEdit = true;
                            
                                      var i = 0;
                                      angular.forEach($scope.listUser, function(item) 
                                      {
                                          if (item.ruc.trim() === ruc && item.codUsuario.trim() === codUsuario) 
                                          {
                                            $scope.user = $scope.listUser[i];
                                            $scope.tipoUsuario = $scope.getUserType($scope.listUser[i].tipoUsuario);                                            
                                            $scope.role = $scope.getRole($scope.listUser[i].role);
                                          
                                            
                                          }
                                          i++;
                                      });



                           /** $scope.inInquiry = false;
                            $scope.inEdit = true;
                            $scope.user = $scope.listUser[index];
                            $scope.tipoUsuario = $scope.getUserType($scope.listUser[index].tipoUsuario);
                            $scope.emitterSelected = $scope.getEmitter($scope.listUser[index].ruc);
                            //$scope.rucCliente = $scope.getCustomer($scope.listUser[index].rucEmpresa);
                            $scope.role = $scope.getRole($scope.listUser[index].role);
                            $scope.refreshInput(index);**/



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




sisAdminApp.controller('UserPaginationCtrl', ['$scope',function ($scope) {
  $scope.$watch('listUser', function (newValue) {
    if (newValue) {
      $scope.totalItems = $scope.listUser.length;
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
