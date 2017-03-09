'use strict';

sisAdminApp.controller('SaListaXInventarioCtrl', ['$scope', 'Restangular', '$modal','LoginFactory',
    function($scope, Restangular, $modal,LoginFactory) {

        $scope.codigoDeshabilitado = false;
        $scope.display = false;
        $scope.filtro = '';
        $scope.sortType = 'ruc'; // set the default sort type
        $scope.sortReverse = false;

        var familias = Restangular.all('familia/list');
        familias.getList().then(function(response){
          $scope.familias = response.data;
        });

        var date = new Date();
        var dia = date.getDate();
        var mes = date.getMonth()+1;
        var anio = date.getFullYear();


        $scope.fechaActual =dia+'-'+mes+'-'+anio;


        $scope.changeMarca = function(){
          var idFamilia = $scope.filter.familiaId;
          Restangular.all('marca/byfamilia').post(idFamilia).then(function(response){
            $scope.marcafamilias = response.data;
          });
        };

        var almacenId = LoginFactory.getAlmacenId();
        var zonas = Restangular.all('zona/byalmacen').post(almacenId);
        zonas.then(function(response){
          $scope.listaZonas = response.data;
        });

        $scope.clear = function(){
            $scope.filter.familiaId ={};
            $scope.filter.marcaId = {};
            $scope.filter.zonaId = {};
        }

        $scope.filter = function() {
                var familiaId = $scope.filter.familiaId;
                var marcaId = $scope.filter.marcaId;
                //var zonaId = $scope.filter.zonaId;
                var almacenId = LoginFactory.getAlmacenId();

                applyFilter({
                        familiaId : familiaId,
                        marcaId : marcaId,
                        almacenId : almacenId
                        //zonaId : zonaId
                });
        };

        var applyFilter = function (filterData) {
                $scope.pbValue=50;
                Restangular.one('listainventario').post('filter',filterData).then(function(response) {
                        $scope.listaInventario = response.data;
                        //$timeout(function(){$scope.pbResultRefresh=false;$scope.pbValue=0;}, 1000);
                });
        };

        $scope.bajarPdf = function(){
              var familiaId = $scope.filter.familiaId;
              var marcaId = $scope.filter.marcaId;
              var almacenId = LoginFactory.getAlmacenId();;
              var filterData = {
                  familiaId : familiaId,
                  marcaId : marcaId,
                  almacenId : almacenId
              };
              var fileName ='nombrearchivobajda';
              Restangular.one('listainventario/pdf').
                          withHttpConfig({responseType: 'blob'}).post('filter',filterData).then(function(response) {
              var blob=new Blob([response.data],{type:"application/octet"});
              var fname = 'Lista_por_Inventario_'+$scope.fechaActual+'.PDF';
              saveAs(blob, fname);
        });
      };

        $scope.loadPage = function() {
            /*var listado = Restangular.all('marca/list');
            listado.getList().then(function(response) {
                $scope.listaMarcas = response.data;
            });*/
        };

        $scope.openModalSave = function(user) {
            $scope.items = [user];
            var modalInstance = $modal.open({
                templateUrl: 'AddModalContent.html',
                controller: 'AddModalInstanceCtrl',
                resolve: {
                    items: function() {
                        return $scope.items;
                    }
                }
            });

            modalInstance.result.then(function(selectedItem) {

            }, function() {

            });
        };

        $scope.refreshInput = function(index) {
            $scope.user = $scope.listUser[index];

            var customers = Restangular.all('customer/list');
            customers.getList().then(function(response) {
                $scope.listCustomer = response.data;
                $scope.rucCliente = $scope.getCustomer($scope.listUser[index].rucEmpresa);

            });
        };

        $scope.disableSave = function() {
            if ($scope.isEmpty($scope.marca.codigo) ||
                $scope.isEmpty($scope.marca.descripcion)) {
                return true;
            }
            return false;
        };

        $scope.isEmpty = function(val) {
            return angular.isUndefined(val) || val === null || val === '';
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
