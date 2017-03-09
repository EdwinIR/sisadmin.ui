sisAdminApp.controller('SaStockMinMaxCtrl', ['$scope', 'Restangular', '$modal', 'LoginFactory',
    function($scope, Restangular, $modal, LoginFactory) {

        $scope.codigoDeshabilitado = false;
        $scope.display = false;
        $scope.filtro = '';
        $scope.sortType = 'ruc'; // set the default sort type
        $scope.sortReverse = false;
        $scope.listaStockMinMax = [{}];

        var date = new Date();
        var dia = date.getDate();
        var mes = date.getMonth()+1;
        var anio = date.getFullYear();

        var fechaActual = dia+'-'+mes+'-'+anio;

        $scope.fechaActual =fechaActual;

        var familias = Restangular.all('familia/list');
              familias.getList().then(function(response) {$scope.familias = response.data; });

        $scope.changeMarca = function(){
            var idFamilia = $scope.filter.familiaId;
            Restangular.all('marca/byfamilia').post(idFamilia).then(function(response){ $scope.marcafamilias= response.data; });
        };
        $scope.clear = function(){ $scope.filter.familiaId ={}; $scope.filter.marcaId = {}; }
        $scope.loadPage = function() {  };

        $scope.filter = function() {
              var familiaId = $scope.filter.familiaId;
              var marcaId = $scope.filter.marcaId;
              var almacenId = LoginFactory.getAlmacenId();
              applyFilter({ familiaId : familiaId, marcaId : marcaId, almacenId : almacenId });
         };
        var applyFilter = function (filterData) {
              $scope.pbValue=50;
              Restangular.one('stockminmax').post('filter',filterData).then(function(response) { $scope.listaStockMinMax = response.data; });
         };
        $scope.bajarPdf = function(){
              var familiaId = $scope.filter.familiaId;
              var marcaId = $scope.filter.marcaId;
              var almacenId = LoginFactory.getAlmacenId();;
              var filterData = {familiaId : familiaId, marcaId : marcaId, almacenId : almacenId};
              var fileName ='nombrearchivobajda';
              Restangular.one('stockminmax/pdf').
                withHttpConfig({responseType: 'blob'}).post('filter',filterData).then(function(response) {
                                var blob=new Blob([response.data],{type:"application/octet"});                                
                                var fname = 'StockMinMax_'+$scope.fechaActual+'.PDF';
                                saveAs(blob, fname);
              });
      };
    }
]);

sisAdminApp.controller('StockMinMaxPaginationCtrl', ['$scope',
function($scope) {
    $scope.$watch('listaStockMinMax', function(newValue) {
        if (newValue) {
            $scope.totalItems = $scope.listaStockMinMax.length;
            $scope.currentPage = 1;
        }
    });
    $scope.currentPage = 1;
    $scope.itemsPerPage = 10;
    $scope.maxSize = 10;
    $scope.setPage = function(pageNo) {  $scope.currentPage = pageNo;   };
    }
]);
