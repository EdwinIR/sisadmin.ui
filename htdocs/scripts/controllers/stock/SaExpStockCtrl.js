sisAdminApp.controller('SaExportStockCtrl', ['$scope', 'Restangular', '$modal', 'LoginFactory',
    function($scope, Restangular, $modal, LoginFactory) {

        $scope.codigoDeshabilitado = false;
        $scope.display = false;
        $scope.filtro = '';
        $scope.sortType = 'ruc'; // set the default sort type
        $scope.sortReverse = false;
        $scope.listaOrdenCompra = [{}];
        $scope.orden={};
        $scope.proveedor={};
        $scope.precio={};
        $scope.producto={};
        $scope.margen={};
        $scope.productostock={};
        $scope.productoprecio={};
        var date = new Date();
        var dia = date.getDate();
        var mes = date.getMonth()+1;
        var anio = date.getFullYear();
        var fechaActual = dia+'-'+mes+'-'+anio;
        $scope.fechaActual =fechaActual;
        var familias = Restangular.all('familia/list');
              familias.getList().then(function(response) { $scope.familias = response.data; });
        $scope.changeMarca = function(){
            var idFamilia = $scope.producto.familiaId;
            Restangular.all('marca/byfamilia').post(idFamilia).then(function(response){
            $scope.marcafamilias= response.data;
            $scope.producto.marcaId=0;
            });
        };
        $scope.changeMarcaMargen = function(){
            var idFamilia = $scope.margen.familiaId;
            Restangular.all('marca/byfamilia').post(idFamilia).then(function(response){
            $scope.margenmarcafamilias= response.data;
            $scope.margen.marcaId=0;
            });
        };
        $scope.changeMarcaStock = function(){
            var idFamilia = $scope.productostock.familiaId;
            Restangular.all('marca/byfamilia').post(idFamilia).then(function(response){
            $scope.stockmarcafamilias= response.data;
            $scope.productostock.marcaId=0;
            });
        };
        $scope.changeMarcaPrecio = function(){
            var idFamilia = $scope.productoprecio.familiaId;
            Restangular.all('marca/byfamilia').post(idFamilia).then(function(response){
            $scope.preciomarcafamilias= response.data;
            $scope.productoprecio.marcaId=0;
            });
        };
        $scope.clear=function() { $scope.producto.marcaId=0;$scope.producto.familiaId=0; };
        $scope.clearMargen=function() { $scope.margen.marcaId=0;$scope.margen.familiaId=0; };
        $scope.loadPage = function() {  };
        $scope.reporteproducto = function() {
             var filterData = $scope.productofiltro();
               Restangular.one('reporteproductos').
                  withHttpConfig({responseType: 'blob'}).post('filter',filterData).then(
                      function(response){ var blob=new Blob([response.data],{type:"application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"});
                                          var fname = "reporte_productos_" +   $scope.fechaActual + ".xlsx";
                                          saveAs(blob,fname); });
        };
        $scope.productofiltro = function() {
           var marcaId=null;var familiaId=null;
               if(!$scope.isNull($scope.producto.marcaId)){
                marcaId=$scope.producto.marcaId;
              }
               if(!$scope.isNull($scope.producto.familiaId)){
                familiaId=$scope.producto.familiaId;
              }
               var filtro={marcaId:marcaId, familiaId:familiaId};
               return filtro;
        };
        $scope.reportemargen = function() {
             var filtroData = $scope.margenfiltro();
               Restangular.one('reportemargenes').
                  withHttpConfig({responseType: 'blob'}).post('filter',filtroData).then(
                      function(response){ var blob=new Blob([response.data],{type:"application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"});
                                          var fname = "reporte_margenes_" +   $scope.fechaActual + ".xlsx";
                                          saveAs(blob,fname); });
        };
        $scope.margenfiltro = function() {
           var marcaId=null;var familiaId=null;
               if(!$scope.isNull($scope.margen.marcaId)){marcaId=$scope.margen.marcaId;}
               if(!$scope.isNull($scope.margen.familiaId)){familiaId=$scope.margen.familiaId;}
               var filtro={marcaId:marcaId, familiaId:familiaId};
               return filtro;
        };
        $scope.reportestock = function() {
             var filtroDato = $scope.stockfiltro();
               Restangular.one('reporteproductostock').
                  withHttpConfig({responseType: 'blob'}).post('filter',filtroDato).then(
                      function(response){ var blob=new Blob([response.data],{type:"application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"});
                                          var fname = "reporte_productos_stock_" +   $scope.fechaActual + ".xlsx";
                                          saveAs(blob,fname); });
        };
        $scope.stockfiltro = function() {
           var marcaId=null;var familiaId=null;var almacenId=null;
               if(!$scope.isNull($scope.productostock.marcaId)){marcaId=$scope.productostock.marcaId;}
               if(!$scope.isNull($scope.productostock.familiaId)){familiaId=$scope.productostock.familiaId;}
               almacenId = LoginFactory.getAlmacenId();
               var filtro={marcaId:marcaId, familiaId:familiaId, almacenId:almacenId};
               return filtro;
        };
        $scope.reporteprecio = function() {
             var filtroDat = $scope.preciofiltro();
               Restangular.one('reporteproductoprecios').
                  withHttpConfig({responseType: 'blob'}).post('filter',filtroDat).then(
                      function(response){ var blob=new Blob([response.data],{type:"application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"});
                                          var fname = "reporte_productos_precios_" +   $scope.fechaActual + ".xlsx";
                                          saveAs(blob,fname); });
        };
        $scope.preciofiltro = function() {
           var marcaId=null;var familiaId=null;
               if(!$scope.isNull($scope.productoprecio.marcaId)){marcaId=$scope.productoprecio.marcaId;}
               if(!$scope.isNull($scope.productoprecio.familiaId)){familiaId=$scope.productoprecio.familiaId;}
               var filtro={marcaId:marcaId, familiaId:familiaId};
               return filtro;
        };
        $scope.isNull = function(val) { return angular.isUndefined(val) || val === null ; };
    }
]);

sisAdminApp.controller('ReporteOrdenCtrl', ['$scope',
function($scope) {
    $scope.$watch('listaOrdenCompra', function(newValue) {
        if (newValue) {
            $scope.totalItems = $scope.listaOrdenCompra.length;
            $scope.currentPage = 1;
        }
    });
    $scope.currentPage = 1;
    $scope.itemsPerPage = 10;
    $scope.maxSize = 10;
    $scope.setPage = function(pageNo) {  $scope.currentPage = pageNo;   };
    }
]);
