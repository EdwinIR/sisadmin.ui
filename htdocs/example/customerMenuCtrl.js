'use strict';

sisAdminApp.controller('ClientePrincipalCtrl', 
	['$scope','LoginFactory','Restangular',
	'$window','$timeout','$modal',
	function ($scope, LoginFactory, Restangular,$window,$timeout,$modal) {
				
			 //Configuramos Headers
            Restangular.setDefaultHeaders({'Authorization': $window.sessionStorage.token});
            
             $scope.accordionStatus = {open1 : true};
             $scope.accordionOneAtATime = true;    
		
             $scope.seccion = [];
			       $scope.seccion[0]=true;
    		     $scope.seccion[1]=false;

    		//Declaramos e inicializamos variables para funcionalidad
             $scope.filter = {};
             $scope.alerts = [];
		         $scope.listDocuments = [];
			       $scope.pbResultRefresh=true;
			       $scope.isCollapsed = true;
			       $scope.pbValue=0; 
			       $scope.loggedUser = LoginFactory.getUserName();

			       $scope.role = LoginFactory.getUserRole(); 
			       $scope.rol = { codRol: $scope.role, descripcion: '', isActive: 'Y'}


			$scope.selSeccion = function(number) { 
                        for(var i=0;i<=$scope.seccion.length-1; i++) {
                            if (i!=number) { $scope.seccion[i] = false; } 
                              else { 
                                  $scope.seccion[i] = true;
                                  $scope.clearData() ;
                              }
                        }
            };


               $scope.clearData = function() {
                $scope.listDocument = null;
                
              };
			 $scope.logout = function() { LoginFactory.logout(); };

			  $scope.allowed = function() {
                if (LoginFactory.getUserRole() == 'Cliente') return true; 
                return false;
              };

}]);