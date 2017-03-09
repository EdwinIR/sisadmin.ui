sisAdminApp.controller('DBCtrl', 
        ['$scope', 'LoginFactory', 'Restangular', 
        '$window', '$timeout','$modal' , 
        function ($scope, LoginFactory, Restangular, $window, $timeout, $modal) {
      	       	Restangular.setDefaultHeaders({'Authorization': $window.sessionStorage.token});
              	$scope.agregarEmisora = function() {   
                      Restangular.all('emitter/save').post().then(function(response){
                            $scope.correcto = "yeahhh";
                });
         	}
}]);   