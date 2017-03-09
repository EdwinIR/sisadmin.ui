'use strict';

sisAdminApp.directive('fileInput',['$parse', function($parse){

	return {

		restrict: 'A',
		link: function(scope,elm,attrs){
			elm.bind('change',function(){

					$parse(attrs.fileInput)
					.assign(scope,elm[0].files)
					scope.$apply();})

		  }
	}}]);


sisAdminApp.controller('uploadCtrl', 
      ['$scope','$http','Restangular','$timeout','$modal',
      function ($scope,$http,Restangular,$timeout,$modal) {

              $scope.sortType     = 'fechaEmision'; 
              $scope.sortReverse  = false;  
              $scope.searchDoc   = '';     


        $scope.paginaInicial = function()
        {
                     var rListDocuments = Restangular.all('reception/list');
                         rListDocuments.getList().then(function(response){
                          $scope.listDocuments =response.data;});
        };
        
      	$scope.filesChanged = function(elm)
      	{
      		$scope.files = elm.files;          
          $scope.$apply();

      		
      	}
 
      	$scope.upload = function () 
        {
                  $scope.pbResultRefreshFiles = true;
                  $scope.pbValue=50;
      		        var fd = new FormData();

      		        angular.forEach($scope.files, function(file) 
                  {	

            	     fd.append('file', file);
                  })

                       Restangular.all('document/upload').withHttpConfig({ transformRequest: angular.identity }).post(fd, null, { "Content-Type": undefined}).then(function(response) {
                        $scope.pbValue=100;
                        $timeout(function(){$scope.pbResultRefreshFiles=false;$scope.pbValue=0;}, 1000);
                        $scope.openModalUpload(response.data);
                        $scope.clear();
                        $scope.paginaInicial();
                        console.log(response.data)
                        });


      	};

        $scope.dowloandEmail = function()
        {
              $scope.pbResultRefreshFiles = true;
              $scope.pbValue=50;
              Restangular.one('document').post('downloademail').then(function(response) {
              $scope.pbValue=100;
              $timeout(function(){$scope.pbResultRefreshFiles=false;$scope.pbValue=0;}, 1000);
              $scope.openModalUpload(response.data);  
              $scope.paginaInicial();
              console.log(response.data);});
        };

        $scope.descargaPDF = function(fileName){
                      Restangular.one('reception/pdf').
                        withHttpConfig({responseType: 'blob'}).get({fileName: fileName}).then(function(response) {
                                        var blob=new Blob([response.data],{type:"application/octet"});
                                        var fname = fileName + '.PDF';                                        
                                        saveAs(blob, fname);
                                });
        };

          $scope.disable = function() {

                     if ( $scope.isNull($scope.files)) 
                          {return true;}

                           return false;   
            };


            $scope.clear = function() {
                        $scope.files = null; 

                          
              };

            $scope.isNull = function(val) {
                      return angular.isUndefined(val) || val === null ;
            };

            $scope.getCurrencyPrefix=function(type){
                        var desc= type;
                        if (type === 'PEN') {desc='S/.';}
                        if (type === 'USD') {desc='USD.';}
                        return desc;
              }; 

            $scope.getTipo=function(typeCode){
                        var desc = '';
                        if (typeCode === '01') {desc='Factura';}
                        if (typeCode === '03') {desc='Boleta';}
                        if (typeCode === '07') {desc='Credito';}
                        if (typeCode === '08') {desc='Debito';}
                    
                        return desc;
              };

            $scope.openModalUpload = function(respuesta) {
                                            $scope.items = respuesta;
                                            var modalInstance = $modal.open({
                                                      templateUrl: 'AddModalContent.html',
                                                      controller: 'ModalUploadCtrl',
                                                      resolve: {
                                  items: function () {
                                        return $scope.items;}}
                          });

                                modalInstance.result.then(function (selectedItem) {
                              
                                }, function () {
                                  
                                });
              };

              $scope.openModalDetails = function(respuesta) {
                                            $scope.items = respuesta;
                                            var modalInstance = $modal.open({
                                                      templateUrl: 'DetailsModalContent.html',
                                                      controller: 'ModalDetailsCtrl',
                                                      resolve: {
                                  items: function () {
                                        return $scope.items;}}
                          });

                                modalInstance.result.then(function (selectedItem) {
                              
                                }, function () {
                                  
                                });
              };  

              $scope.getDetails = function(codigo)
              {
                 var codigoDoc = codigo; 
                 var rListDocuments = Restangular.all('receptiondetail/list');
                     rListDocuments.getList({id : codigoDoc}).then(function(response){
                     $scope.listDocumentsDetail =response.data;
                     $scope.openModalDetails(response.data);
                   });
              }


}]);  