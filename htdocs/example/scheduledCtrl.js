'use strict';

sisAdminApp.controller('ScheduledCtrl', [
		'$scope',
		'Restangular',
		'$modal',
		'$timeout',
		function($scope, Restangular, $modal, $timeout) {
			$scope.progress = { current: 0, total: 10 };
			
		       $scope.loadPage = function(){
                    var serieBoleta = Restangular.all('combo/serie/boleta/list');
	                serieBoleta.getList().then(function(response){
	                $scope.listSerieBoletas=response.data;}); 
	                var serieFactura = Restangular.all('combo/serie/factura/list');
	                serieFactura.getList().then(function(response){
	                $scope.listSerieFacturas=response.data;  });
                }

			
				$scope.btnEnvioFacturas = function() {
					$scope.pbResultRefreshFactura = true;
					!$scope.disableFactura();

				    var beginIssueDate = null;
                    var serie = '';
                    var numeroLegal;
                    var status = 'PD';
                    if (!$scope.isNull($scope.filter.fechaEnvioFactura)) {
                    		beginIssueDate = $scope.filter.fechaEnvioFactura;
                    } 

                    /*if (!$scope.isNull($scope.filter.serieEnvioFactura)) {
                    		serie = $scope.filter.serieEnvioFactura.serie;
                    }*/ 
                    if (!$scope.isNull($scope.filter.numeroLegal)) {
                    		numeroLegal = $scope.filter.numeroLegal;
                    }

                   if (!$scope.isNull($scope.filter.statusEnvioFactura)) {
                    		status = $scope.filter.statusEnvioFactura;
                    } 
                    
                                        
					applyEnvioFacturas({beginIssueDate : beginIssueDate, 
										numeroLegal : numeroLegal, 
										status : status});
				}
				
				$scope.btnGenerarResumen = function() {
					$scope.pbResultRefreshResumen = true;
				    var beginIssueDate = null;
				    var fechaGeneracionResumen = null;
                    var numeracion = '';
                    

                    if (!$scope.isNull($scope.filter.fechaResumenEmision)) {
                    		beginIssueDate = $scope.filter.fechaResumenEmision;
                    } 

                      if (!$scope.isNull($scope.filter.fechaResumenGeneracion)) {
                    		fechaGeneracionResumen = $scope.filter.fechaResumenGeneracion;
                    }

                    if (!$scope.isNull($scope.filter.numeracionResumen)) {
                    		numeracion = $scope.filter.numeracionResumen;
                    } 

           
					applyGenerarResumen({ beginIssueDate : beginIssueDate,
										  fechaGeneracionResumen : fechaGeneracionResumen, 
									      numeracionResumen : numeracion});
				}

				$scope.btnEnviarResumen = function() {
                    var identificadorResumen = '';
                    var status = 'CR';	
                    if (!$scope.isNull($scope.filter.identificadorResumen)) {
                    		identificadorResumen = $scope.filter.identificadorResumen;
                    } 

                   if (!$scope.isNull($scope.filter.statusResumen)) {
                    		status = $scope.filter.statusResumen;
                    }	
					applyEnviarResumen({identificadorResumen : identificadorResumen, 
										 status : status });
				}	
		
				$scope.btnVerificarTicket = function() {
                    var numeroTicket = '';
                    if (!$scope.isNull($scope.filter.numeroTicket)) {
                    		numeroTicket = $scope.filter.numeroTicket;
                    } 
					applyVerificarTicket({identificadorResumen : numeroTicket });
				}	





				$scope.btnConStatusTicket = function() {

				    var beginIssueDate = null;
                    var identificadorResumen = '';
                    var status = 'SD';	

                    if (!$scope.isNull($scope.filter.fechaTicket)) {
                    		beginIssueDate = $scope.filter.fechaTicket;
                    } 

                    if (!$scope.isNull($scope.filter.identificadorResumen)) {
                    		identificadorResumen = $scope.filter.identificadorResumen;
                    } 

                   if (!$scope.isNull($scope.filter.statusTicket)) {
                    		status = $scope.filter.statusTicket;
                    }	



					applyConStatusTicket({beginIssueDate: beginIssueDate, 
										 identificadorResumen : identificadorResumen, 
										 status : status });
				}	

		       
			var applyEnvioFacturas = function(filterData){	
						$scope.pbValue=50;					
						Restangular.one('scheluded').post('sendpendinginvoices',filterData).then(function(response) {
						//$scope.mensaje = response.data;
						var t = response.data;	
						var tArr = t.split(".");					     	
						$scope.pbValue=100;
                        $timeout(function(){$scope.pbResultRefreshFactura=false;$scope.pbValue=0;}, 1000);
						//$scope.openModalFactura($scope.mensaje);
						$scope.openModalFactura(tArr);
						$scope.clearFactura();
					
						});
			};

			var applyGenerarResumen = function(filterData) {
					$scope.pbValue=50;
					Restangular.one('scheluded').post('generatereceiptsummary',filterData).then(function(response) {
					//$scope.mensaje = response.data;
					var t = response.data;	
					var tArr = t.split(".");	
					$scope.pbValue=100;
                    $timeout(function(){$scope.pbResultRefreshResumen=false;$scope.pbValue=0;}, 1000);			
					//$scope.openModalResumen($scope.mensaje);
					$scope.openModalResumen(tArr);					
					$scope.clearResumen();
					});
			};

			var applyEnviarResumen = function(filterData){
				Restangular.one('scheluded').post('sendreceiptsummary',filterData).then(function(response) {
				$scope.mensaje= response.data;});
			};
			

			var applyVerificarTicket = function(filterData){
				Restangular.one('scheluded').post('verifyticket',filterData).then(function(response) {
				$scope.mensaje= response.data;});
			};



			var applyConStatusTicket = function(filterData){
				Restangular.one('scheluded').post('getreceiptsummarystatus',filterData).then(function(response) {
				$scope.mensaje= response.data;});
			};
			
		

			$scope.disableFactura = function() {
                        if ($scope.isNull($scope.filter.fechaEnvioFactura) ){return true;}
                        if ($scope.isNull($scope.filter.numeroLegal) ) {return true;}                          
                           return false;   
              };

            $scope.disableResumen = function() {
                        if ($scope.isNull($scope.filter.fechaResumenEmision)){return true;}
                        //if ($scope.isNull($scope.filter.fechaGeneracionResumen) ){return true;}
                        
                        if ($scope.isNull($scope.filter.numeracionResumen)) {return true;}
                        
                        if($scope.filter.numeracionResumen.length != 5) {return true;}                             
                           return false;  
              };

            $scope.disableEnviarResumen = function() {
                        if ($scope.isNull($scope.filter.identificadorResumen)) {return true;}                   
                        if ($scope.filter.identificadorResumen.length === 0) {return true;}                            
                        return false;  
             };

            $scope.disableVerificarTicket = function() {
                        if ($scope.isNull($scope.filter.numeroTicket)) {return true;}                   
                        if ($scope.filter.numeroTicket.length === 0) {return true;}                            
                        return false;  
             };




            $scope.disableTicket = function() {
                        if ($scope.isNull($scope.filter.fechaTicket) ){return true;}
                        if ($scope.isNull($scope.filter.identificadorResumen)) {return true;}                   
                        if ($scope.filter.identificadorResumen.length === 0) {return true;}                            
                           return false;  
              };



                $scope.openModalFactura = function(response) {
                                            //$scope.items = $scope.mySplit(factura);
                                            $scope.items = response;
                                            var modalInstance = $modal.open({
                                                      templateUrl: 'ModalContentFacturaProcesada.html',
                                                      controller: 'ModalFacturaProcesadaCtrl',
                                                      size : 'lg',
                                                      resolve: {
								                                    items: function () {

								                                        return $scope.items;
								                                    }

								                                  

								                                }
                                            });

                                          modalInstance.result.then(function (selectedItem) {
                              
                                          }, function () {
                                  
                                              });
                };

                $scope.openModalResumen = function(response) {
                                            $scope.items = response;
                                            var modalInstance = $modal.open({
                                                      templateUrl: 'ModalContentResumen.html',
                                                      controller: 'ModalResumenCtrl',
                                                      size : 'lg',
                                                      resolve: {
								                                    items: function () {
								                                        return $scope.items;
								                                    }
								                                }
                                            });

                                          modalInstance.result.then(function (selectedItem) {
                              
                                          }, function () {
                                  
                                              });
                };



			
			$scope.clearFactura = function() {
				$scope.filter.fechaEnvioFactura = new Date();
				$scope.filter.numeroLegal = null;
				$scope.filter.statusEnvioFactura = null;

			};
			$scope.clearResumen = function() {
				$scope.filter.fechaResumen = new Date();
				$scope.filter.numeracionResumen = null;
				//cope.filter.statusResumen = null;

			};

			$scope.isNull = function(val) {
				return angular.isUndefined(val) || val === null;
			};

			$scope.isNumber = function(val){
				return angular.isNumber(val);
			}

				$scope.mySplit = function(string) {    							
				$scope.array = string.split(',');
				$scope.result = '';	
				  	for (var i = 0; i <= $scope.array.length - 1; i++) {        	           
        	           $scope.result += $scope.array[i];
                    }                    
   				 return $scope.result.trim();
			}

			



			


		} ]);


