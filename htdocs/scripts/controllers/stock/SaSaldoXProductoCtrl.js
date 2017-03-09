'use strict';

sisAdminApp.controller('SaSaldoXProductoCtrl', ['$scope', 'Restangular', '$modal','LoginFactory',
    function($scope, Restangular, $modal, LoginFactory) {

        $scope.codigoDeshabilitado = false;
        $scope.display = false;
        $scope.filtro = '';
        $scope.sortType = 'ruc'; // set the default sort type
        $scope.sortReverse = false;
        $scope.paEnvio={};

        var familias = Restangular.all('familia/list'); familias.getList().then(function(response) { $scope.familias = response.data; });

          $scope.changeMarca = function(){ var idFamilia  = $scope.filter.familiaId;
               Restangular.all('marca/byfamilia').post(idFamilia).then(function(response){ $scope.marcafamilias= response.data; });
          };
          $scope.changeProducto = function(){ var idMarca = $scope.filter.marcaId; var idFamilia  = $scope.filter.familiaId;
              var filtro = { familiaId : idFamilia, marcaId : idMarca }
              Restangular.all('producto/bymarcafamilia').post(filtro).then(function(response){ $scope.marcaproductos= response.data; });
          };
          $scope.filter = function() { var productoId = $scope.filter.productoId; var almacenId=LoginFactory.getAlmacenId();
                applyFilter({ productoId : productoId, almacenId : almacenId });
        };
        var applyFilter = function (filterData) { Restangular.one('saldoporproducto').post('filter',filterData).then(function(response) { $scope.saldoProducto = response.data; }); };
        $scope.loadPage = function() { }; 
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
