'use strict';

sisAdminApp.controller('MenuCtrl', 
		['$scope','Restangular','$modal','$window',
		function ($scope,Restangular,$modal, $window) {

				$scope.alerts = [];
				$scope.closeAlert = function(index) {
			    		$scope.alerts.splice(index, 1);
			  	};
			  	
				
				
		  		/*$scope.loadPage=function(){
			            var roles = Restangular.all('combo/role/list');
			            roles.getList().then(function(response) {
			                                    $scope.listRole=response.data;
			            });    
		        }*/ 

		        $scope.loadPage=function(){
			            var rRoles = Restangular.all('combo/role/list');
                             rRoles.getList().then(function(response){
                             $scope.listRoles =response.data;
                             $scope.listRole = $scope.listRoles.filter(function(item) {
                             return item.codRol !== 'Cliente'; });
                        });     
		        }

		           



				$scope.loadRoleMenu = function(){
					Restangular.all('loadRoleMenu').post($scope.role)
						.then(
							function(response) {
				                $scope.listMenu=response.data;
				            }
				        );
				};

				$scope.seleccionarHijos = function(seleccionado){
					for (var i = 0; i < $scope.listMenu.length; i++) {
						if ($scope.listMenu[i].codOpcionMenuPadre == seleccionado.codOpcionMenu && seleccionado.seleccionado == true) {
							    $scope.listMenu[i].seleccionado = true;  
	  					}else{
	  						if ($scope.listMenu[i].codOpcionMenuPadre == seleccionado.codOpcionMenu && seleccionado.seleccionado == false) {
	  							$scope.listMenu[i].seleccionado = false;
	  						}
	  					}

					};

				};


				 $scope.clear = function() {
                   			$scope.role = null;
                   			$scope.listMenu = null;
                 };

     			$scope.saveListRoleMenu = function() {[
     				Restangular.all('setRole').post($scope.role)
	                	.then(
	                		function(response) {
	                  			console.log(response.data);
	                		}
	                	)
	                ,	
	                Restangular.all('saveListRoleMenu').post($scope.listMenu)
	                	.then(
	                		function(response) {
	                			 		$scope.clear();	                  					
	                		}, 
          					function(response) {
          								console.log('hubo problemas en la grabacion');
          					}
	                	)]
                };





}]);