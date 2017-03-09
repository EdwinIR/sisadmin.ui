'use strict';

sisAdminApp.controller('SaAjusteInventarioCtrl', ['$scope', 'Restangular', '$modal','LoginFactory',
    function($scope, Restangular, $modal,LoginFactory) {

        $scope.codigoDeshabilitado = false;
        $scope.display = false;
        $scope.filtro = '';
        $scope.sortType = 'ruc'; // set the default sort type
        $scope.sortReverse = false;
        $scope.displayDetail = false;
        $scope.ajusteinventario={};
        $scope.busqueda={};
        var familias = Restangular.all('familia/list');familias.getList().then(function(response) { $scope.familias = response.data;  });

        $scope.changeMarca = function(){
          var idFamilia  = $scope.filter.familiaId;
          Restangular.all('marca/byfamilia').post(idFamilia).then(function(response){
             $scope.marcafamilias= response.data;
           });};
        $scope.changeBusquedaMarca = function(){
           var idFamilia  = $scope.busqueda.familiaId;
           Restangular.all('marca/byfamilia').post(idFamilia).then(function(response){
             $scope.marcas= response.data;
           });};
        $scope.changeBusquedaMarcaCabecera = function(){
           var idFamilia  = $scope.filter.familiaId;
           Restangular.all('marca/byfamilia').post(idFamilia).then(function(response){
             $scope.marcasCabecera= response.data;
           });};
        $scope.changeProducto = function(){
          var idMarca = $scope.filter.marcaId;
          var idFamilia  = $scope.filter.familiaId;
          var filtro = { familiaId : idFamilia, marcaId : idMarca }
            Restangular.all('producto/bymarcafamilia').post(filtro).then(function(response){
              $scope.marcaproductos= response.data;
          });};
        $scope.filter = function() {
          var productoId = $scope.filter.productoId;
          var almacenId = LoginFactory.getAlmacenId();
            applyFilter({ productoId : productoId, almacenId : almacenId
          });};
        var applyFilter = function (filterData) {
          Restangular.one('productoalmacen').post('filter',filterData).then(function(response) {
            $scope.productoAlmacen = response.data;
          });};
        $scope.filtroAvanzado = function() {
          var familiaId = $scope.busqueda.familiaId;
          var marcaId = $scope.busqueda.marcaId;
          var fechaDesde = $scope.busqueda.fechaDesde;
          var fechaHasta = $scope.busqueda.fechaHasta;
                applyFiltro({ familiaId : familiaId, marcaId : marcaId, fechaDesde : fechaDesde, fechaHasta : fechaHasta
          });};
       var applyFiltro = function (filterData) {
         Restangular.one('ajusteinventario').post('filtro',filterData).then(function(response) {
            $scope.listadoAjustesInventario = response.data;
            $scope.busqueda.marcaId=0;
         });};
        $scope.loadPage = function() {
          var listadoAjustesInventario = Restangular.all('ajusteinventario/list');
            listadoAjustesInventario.getList().then(function(response) { $scope.listadoAjustesInventario = response.data;
            });
        };
        $scope.save = function() {
            $scope.ajusteinventario.unidadMedidaId= $scope.productoAlmacen.unidadMedidaId;
            $scope.ajusteinventario.stockAnterior=$scope.productoAlmacen.stock;
            $scope.ajusteinventario.productoId = $scope.productoAlmacen.id;
            $scope.ajusteinventario.almacenId = LoginFactory.getAlmacenId();
              Restangular.all('ajusteinventario/add').post($scope.ajusteinventario).then(function(response) {
                $scope.openModalSave($scope.ajusteinventario); console.log(response.data); $scope.clear(); $scope.loadPage();});
        };
        $scope.openModalSave = function(user) {
          $scope.items = [user];
          var modalInstance = $modal.open({
              templateUrl: 'AddModalContent.html',
              controller: 'AddModalInstanceCtrl',
              resolve: { items: function() { return $scope.items; } }
            });
            modalInstance.result.then(function(selectedItem) { }, function() { });
        };
        $scope.mostrarBusqueda = function() { $scope.displayDetail = !$scope.displayDetail; };
        $scope.clear = function() {
            $scope.user = {}; $scope.ruc = {}; $scope.role = {}; $scope.rucCliente = {}; $scope.tipoUsuario = {}; $scope.emitterSelected = {}; $scope.ajusteinventario = {};
            $scope.productoAlmacen = {}; $scope.filter.familiaId = 0; $scope.filter.marcaId = 0; $scope.filter.productoId = 0;
            $scope.inInquiry = false; $scope.inEdit = false; $scope.codigoDeshabilitado = false; $scope.isCollapsed = true;
            $scope.displayDetail = false; $scope.busqueda={}; $scope.busqueda.marcaId=0; $scope.busqueda.familiaId=0;
        };
        $scope.limpiar= function(){ $scope.busqueda={}; $scope.busqueda.marcaId=0; $scope.busqueda.familiaId=0; };
        $scope.disableSave = function() { if ($scope.isEmpty($scope.marca.codigo) || $scope.isEmpty($scope.marca.descripcion)) { return true; } return false;
        };
        $scope.isEmpty = function(val) { return angular.isUndefined(val) || val === null || val === ''; };
        $scope.getValidacion = function(){
                var stockNuevo = $scope.ajusteinventario.stockNuevo;
                var stockActual = $scope.productoAlmacen.stock;
           if(stockActual>0){$scope.ajusteinventario.stockNuevo=stockNuevo;}else{ $scope.ajusteinventario.stockNuevo=1;}
         };
    }
]);
sisAdminApp.controller('AjusteInventarioPaginationCtrl', ['$scope', function($scope) {
    $scope.$watch('listadoAjustesInventario', function(newValue) {
        if (newValue) {
            $scope.totalItems = $scope.listadoAjustesInventario.length;
            $scope.currentPage = 1;
        }
    });
    $scope.currentPage = 1;
    $scope.itemsPerPage = 20;
    $scope.maxSize = 20;
    $scope.setPage = function(pageNo) {
        $scope.currentPage = pageNo;
    };
}]);
