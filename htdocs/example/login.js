'use strict';

sisAdminApp.controller('ClienteLoginCtrl',
     ['$scope', '$window', '$location',
      'LoginFactory', 'Restangular',
      function ($scope, $window, $location, LoginFactory, Restangular){


              var customers = Restangular.all('combo/customer/list');
              customers.getList().then(function(response){
                          $scope.listCustomer=response.data;
              });

                $scope.incorrectCredentials=false;
                $scope.login = function(isValid) {
                      $scope.loginMessage='';
                      if (isValid) {
                              $scope.user.userType = 'C';
                              //$scope.user.companyIdentification = $scope.customerSelected.identification;
                              //$scope.user.companyIdentification = '20503423287';
                              Restangular.all('user/login').post($scope.user).then(
                                      function(response) {
                                              $window.sessionStorage.token = response.data.token;
                                              //actualizo datos usuario para resto controllers.
                                              LoginFactory.setUserId($scope.user.userName);
                                              LoginFactory.setUserName(response.data.userDescription);
                                              LoginFactory.setUserType('C');
                                              LoginFactory.setCustomerId($scope.user.companyIdentification);
                                              //redireccionar a pagina principal
                                              $location.path('/cliente/principal');
                                        },
                                        function(response){ //respuesta fallo
                                              delete $window.sessionStorage.token;
                                              $scope.incorrectCredentials=true;
                                              if (response.status == 401) {
                                                      $scope.loginMessage = "Usuario o Password Incorrecto!.";
                                                    } else {
                                                      $scope.loginMessage = "Error de conexión a servicio.";
                                              }
                                        });
                      }


                };

      }]);
