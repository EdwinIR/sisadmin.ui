sisAdminApp.controller('SaLoginCtrl',
     ['$scope', '$window', '$location',
      'LoginFactory', 'Restangular',
      function ($scope, $window, $location, LoginFactory, Restangular){

        var almacenes = Restangular.all('almacen/list');
        almacenes.getList().then(function(response) {
            $scope.almacenes = response.data;
        });

                $scope.incorrectCredentials=false;
                $scope.login = function(isValid) {
                      $scope.loginMessage='';
                      if (isValid) {
                              $scope.user.userType = 'E';
                              //$scope.user.companyIdentification = $scope.emitterSelected.identification;
                              //$scope.user.companyIdentification = '20565812948';
                              Restangular.all('user/login').post($scope.user).then(
                                      function(response) {
                                              $window.sessionStorage.token = response.data.token;
                                              //actualizo datos usuario para resto controllers.
                                              LoginFactory.setUserId($scope.user.userName);
                                              LoginFactory.setUserName(response.data.userDescription);
                                              LoginFactory.setUserType('E');
                                              LoginFactory.setUserRole(response.data.userRole);
                                              LoginFactory.setAlmacenId($scope.user.almacenId)
                                              //LoginFactory.setCompanyId($scope.emitterSelected.id);
                                              //redireccionar a pagina principal
                                              $location.path('/home');
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
