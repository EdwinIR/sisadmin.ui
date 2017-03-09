'use strict';

sisAdminApp.controller('SaMarcaFamiliaCtrl',
              ['$scope','Restangular','$modal',
              function ($scope,Restangular,$modal) {

      $scope.codigoDeshabilitado = false;
      $scope.display = false;
      $scope.filtro   = '';
      $scope.sortType     = 'ruc'; // set the default sort type
      $scope.sortReverse  = false;
      $scope.marcafamilia = {};

      var marcas = Restangular.all('marca/list');
          marcas.getList().then(function(response){ $scope.marcas=response.data; });
      var familias = Restangular.all('familia/list');
          familias.getList().then(function(response){ $scope.familias=response.data; });

      $scope.loadPage = function() {
          var listado = Restangular.all('marcafamilia/list');
          listado.getList().then(function(response){ $scope.listaMarcaFamilias = response.data;});
      };
      $scope.importarMargenes = function() {
            var filtro = {archivocsv : ''};
            Restangular.one('marcafamilia/importar').post('filter',filtro).then(function(response) { $scope.res = response.data; });
      };
      $scope.changeFamilia = function() {
        var idFamilia = $scope.familiaSeleccionada.idSa;
        Restangular.all('data/byfamilia').post(idFamilia).then(function(response){
               $scope.margenes = response.data;
               $scope.marcafamilia.margenBase = $scope.margenes.margenBase;
               $scope.marcafamilia.margenA = $scope.margenes.margenA;
               $scope.marcafamilia.margenB = $scope.margenes.margenB;
               $scope.marcafamilia.margenC = $scope.margenes.margenC;
          });};
      $scope.save = function() {
        $scope.marcafamilia.familiaId = $scope.familiaSeleccionada.idSa;
        $scope.marcafamilia.marcaId = $scope.marcaSeleccionada.idSa;
          if($scope.isEmpty($scope.marcafamilia.id)) {
                Restangular.all('marcafamilia/add').post($scope.marcafamilia).then(function(response) {
                  if(response.data == '"OK"'){
                    $scope.openModalSave($scope.marcafamilia); console.log(response.data); $scope.clear(); $scope.loadPage();
                  } else { alert(response.data); $scope.clear(); $scope.loadPage(); } });
           } else {
                Restangular.all('marcafamilia/update').post($scope.marcafamilia).then(function(response) {
                    $scope.openModalSave($scope.marcafamilia); console.log(response.data); $scope.clear(); $scope.loadPage(); });
           }
      };
      $scope.delete = function(marcafamilia) {
          $scope.items = [marcafamilia];
          var modalInstance = $modal.open({ templateUrl: 'DelModalContent.html', controller: 'DelModalInstanceCtrl',
                resolve: {items: function () {return $scope.items;}} });
          modalInstance.result.then(
                function (selectedItem) {
                    Restangular.one('marcafamilia').remove({id:$scope.items[0].id}).then(
                        function(){$scope.clear(); $scope.loadPage();});
                },
                function () {});
      };
      $scope.edit = function(id) {
            $scope.isCollapsed  = false;
            $scope.codigoDeshabilitado = true;
            var i = 0;
            angular.forEach($scope.listaMarcaFamilias, function(item) {
              if (item.id == id) {
									$scope.marcaSeleccionada = $scope.getMarca($scope.listaMarcaFamilias[i].descripcionMarca);
                  $scope.marcafamilia = $scope.listaMarcaFamilias[i];
                  $scope.familiaSeleccionada = $scope.getFamilia($scope.listaMarcaFamilias[i].descripcionFamilia);
              }
              i++;
              });
      };
      $scope.getMarca=function(id) {
            var type = {};
            angular.forEach($scope.marcas, function(item) {
                if (item.descripcion.trim() === id.trim()) { type=item;} });
            return type;
      };
      $scope.getFamilia=function(id) {
            var type = {};
            angular.forEach($scope.familias, function(item) {
                if (item.descripcion.trim() === id.trim()) { type=item; } });
            return type;
      };
      $scope.openModalSave = function(user) {
            $scope.items = [user];
            var modalInstance = $modal.open({
                templateUrl: 'AddModalContent.html',
                controller: 'AddModalInstanceCtrl',
                resolve: { items: function () { return $scope.items;}} });
            modalInstance.result.then(function (selectedItem) {
                }, function () { });
      };
      $scope.clear = function() {
            $scope.user = {}; $scope.ruc={}; $scope.role={}; $scope.rucCliente={}; $scope.tipoUsuario={};
            $scope.emitterSelected={}; $scope.marcafamilia={};$scope.familiaSeleccionada={}; $scope.marcaSeleccionada={};
            $scope.inInquiry=false; $scope.codigoDeshabilitado=false; $scope.isCollapsed  = true; $scope.loadPage();
      };
      $scope.isEmpty = function(val) { return angular.isUndefined(val) || val === null || val === ''; };
}]);
sisAdminApp.controller('MarcaFamiliaPaginationCtrl', ['$scope',function ($scope) {
  $scope.$watch('listaMarcaFamilias', function (newValue) {
    if (newValue) {
      $scope.totalItems = $scope.listaMarcaFamilias.length;
      $scope.currentPage = 1;
    }
  });
  $scope.currentPage = 1;
  $scope.itemsPerPage=20;
  $scope.maxSize = 20;
  $scope.setPage = function (pageNo) {
    $scope.currentPage = pageNo;
  };
}]);
