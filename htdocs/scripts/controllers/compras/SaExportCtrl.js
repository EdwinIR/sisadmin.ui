sisAdminApp.controller('SaExportCtrl', ['$scope', 'Restangular', '$modal', 'LoginFactory',
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
        var date = new Date();
        var dia = date.getDate();
        var mes = date.getMonth()+1;
        var anio = date.getFullYear();

        var fechaActual = dia+'-'+mes+'-'+anio;

        $scope.fechaActual =fechaActual;

        $scope.clear = function(){$scope.orden ={}; $scope.precio = {};$scope.proveedor={}; }
        $scope.loadPage = function() {  };

            $scope.reporteoc = function() {
               var filterData = $scope.ordencomprafiltro();
               Restangular.one('reporteordencompras').
                  withHttpConfig({responseType: 'blob'}).post('filter',filterData).then(
                      function(response){ var blob=new Blob([response.data],{type:"application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"});
                                          var fname = "reporte_ordencompra_" +   $scope.fechaActual + ".xlsx";
                                          saveAs(blob,fname); });
                                          $scope.clear();
            };
            $scope.ordencomprafiltro = function() {
                     var fechaInicio=null;var fechaFin=null;
                     if(!$scope.isNull($scope.orden.fechaInicio)){fechaInicio=$scope.orden.fechaInicio;}
                     if(!$scope.isNull($scope.orden.fechaFin)){fechaFin=$scope.orden.fechaFin;}
                     var filtro={fechaInicio:fechaInicio, fechaFin:fechaFin};
                     return filtro;
            };
            $scope.reportepro = function() {
                   var filtroDatos = $scope.proveedorfiltro();
                   Restangular.one('reporteproveedor').
                      withHttpConfig({responseType: 'blob'}).post('filter',filtroDatos).then(
                          function(response){ var blob=new Blob([response.data],{type:"application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"});
                                              var fname = "reporte_proveedor_" +   $scope.fechaActual + ".xlsx";
                                              saveAs(blob,fname); });
                                              $scope.clear();
            };
            $scope.proveedorfiltro = function() {
                         var ciudad=null;
                         if(!$scope.isNull($scope.proveedor.ciudad)){ciudad=$scope.proveedor.ciudad;}
                         var filtro={ciudad:ciudad};
                         return filtro;
              };
              $scope.reportepia = function() {
                     var filtroData = $scope.piafiltro();
                     Restangular.one('reportepia').
                        withHttpConfig({responseType: 'blob'}).post('filter',filtroData).then(
                            function(response){ var blob=new Blob([response.data],{type:"application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"});
                                                var fname = "reporte_preciosActualizar_" +   $scope.fechaActual + ".xlsx";
                                                saveAs(blob,fname); });
                                                $scope.clear();
              };
              $scope.piafiltro = function() {
                       var inicioFecha=null;var finFecha=null;
                       if(!$scope.isNull($scope.precio.inicioFecha)){inicioFecha=$scope.precio.inicioFecha;}
                       if(!$scope.isNull($scope.precio.finFecha)){finFecha=$scope.precio.finFecha;}
                       var filtro={inicioFecha:inicioFecha, finFecha:finFecha};
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
