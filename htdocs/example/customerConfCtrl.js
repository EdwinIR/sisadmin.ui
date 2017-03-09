'use strict';


sisAdminApp.controller('ClienteConfiguracionCtrl', ['$scope','LoginFactory','Restangular','$window','$modal'
	,function ($scope, LoginFactory, Restangular, $window,$modal) {

           $scope.alerts = [];

 $scope.save = function() 
 {
 					$scope.client.identification = LoginFactory.getCustomerId();
          $scope.client.codUsuario = LoginFactory.getUserId();

                  if ($scope.client.newPass === $scope.client.repeatPass) {

                       Restangular.all('update/client').post($scope.client).then(
                            function(response) {
                                    
                                   console.log(response.data);
                                    $scope.clear();
                            }, 
                            function(response) {
                                 
                                 console.log(response.data);
                            }
                       );
                      $scope.alerts = [{ type: 'success', msg: 'Contraseña actualizada correctamente' }];
                       
                     }else{$scope.alerts = [{ type: 'danger', msg: 'Las contraseñas no son iguales' }];}

};

                $scope.clear = function() {
                                    $scope.client = null;
                                    //$scope.alerts = [];
                                   
               };

                $scope.closeAlert = function(index) {
                $scope.alerts.splice(index, 1);
  };


 				
}]); 