'use strict';

sisAdminApp.controller('SaExportacionVentasCtrl', ['$scope', 'Restangular', '$modal',
    function($scope, Restangular, $modal) {

        $scope.codigoDeshabilitado = false;
        $scope.display = false;
        $scope.filtro = '';
        $scope.sortType = 'ruc'; // set the default sort type
        $scope.sortReverse = false;
        $scope.comprobante = {};
        $scope.cliente = {};
        var date = new Date();
        var dia = date.getDate();
        var mes = date.getMonth()+1;
        var anio = date.getFullYear();

        var fechaActual = dia+'-'+mes+'-'+anio;

        $scope.fechaActual =fechaActual;

        $scope.reportecomp = function() {
               var filterData = $scope.comprobantesfiltro();
               Restangular.one('reportecomprobantes').
                  withHttpConfig({responseType: 'blob'}).post('filter',filterData).then(
                      function(response){ var blob=new Blob([response.data],{type:"application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"});
                                          var fname = "reporte_comprobantes_" +   $scope.fechaActual + ".xlsx";
                                          saveAs(blob,fname); });
            };
            $scope.comprobantesfiltro = function() {
                     var fechaInicio=null;var fechaFin=null;
                     if(!$scope.isNull($scope.comprobante.fechaInicio)){fechaInicio=$scope.comprobante.fechaInicio;}
                     if(!$scope.isNull($scope.comprobante.fechaFin)){fechaFin=$scope.comprobante.fechaFin;}
                     var filtro={fechaInicio:fechaInicio, fechaFin:fechaFin};
                     return filtro;
            };
            $scope.reportecliente = function() {
                   var filterData = $scope.clientesfiltro();
                   Restangular.one('reporteclientes').
                      withHttpConfig({responseType: 'blob'}).post('filter',filterData).then(
                          function(response){ var blob=new Blob([response.data],{type:"application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"});
                                              var fname = "reporte_clientes_" +   $scope.fechaActual + ".xlsx";
                                              saveAs(blob,fname); });
                };
            $scope.clientesfiltro = function() {
                    var region=null;
                    if(!$scope.isNull($scope.cliente.region)){region=$scope.cliente.region;}
                    var filtro={region:region};
                    return filtro;
                };
            $scope.reportevendedores = function() {
                    Restangular.one('reportevendedores/filter').
                      withHttpConfig({responseType: 'blob'}).post().then(
                          function(response){ var blob=new Blob([response.data],{type:"application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"});
                                              var fname = "reporte_vendedores_" +   $scope.fechaActual + ".xlsx";
                                              saveAs(blob,fname); });
                    };

        $scope.isNull = function(val) { return angular.isUndefined(val) || val === null ; };

        $scope.clear = function() {

        };

    }
]);




sisAdminApp.controller('MarcaPaginationCtrl', ['$scope', function($scope) {
    $scope.$watch('listaMarcas', function(newValue) {
        if (newValue) {
            $scope.totalItems = $scope.listaMarcas.length;
            $scope.currentPage = 1;
        }
    });
    $scope.currentPage = 1;
    $scope.itemsPerPage = 10;
    $scope.maxSize = 10;
    $scope.setPage = function(pageNo) {
        $scope.currentPage = pageNo;
    };
}]);
