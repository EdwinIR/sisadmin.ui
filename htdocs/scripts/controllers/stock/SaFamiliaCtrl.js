'use strict';

sisAdminApp.controller('SaFamiliaCtrl', ['$scope', 'Restangular', '$modal',
    function($scope, Restangular, $modal) {

        $scope.codigoDeshabilitado = false;
        $scope.display = false;
        $scope.filtro = '';
        $scope.sortType = 'ruc'; // set the default sort type
        $scope.sortReverse = false;

        var almacenId = 1;
        var zonas = Restangular.all('zona/byalmacen').post(almacenId);
        zonas.then(function(response) {
            $scope.zonas = response.data;
        });
        $scope.loadPage = function() {
            var listado = Restangular.all('familia/list');
            listado.getList().then(function(response) { $scope.listaFamilias = response.data; });
        };
        $scope.save = function() {
            $scope.familia.zonaId = $scope.zonaSeleccionada.id;
            if ($scope.isEmpty($scope.familia.id)) {
                Restangular.all('familia/add').post($scope.familia).then(function(response) {
                  if(response.data == '"OK"'){
                    $scope.openModalSave($scope.familia); console.log(response.data);
                    $scope.clear(); $scope.loadPage();
                  } else{
                    alert(response.data); $scope.clear(); $scope.loadPage();
                  }
                });
            } else {
                Restangular.all('familia/update').post($scope.familia).then(function(response) {
                    $scope.openModalSave($scope.familia); console.log(response.data);
                    $scope.clear(); $scope.loadPage();
                });
            }
        };
        $scope.edit = function(id) {
            $scope.isCollapsed = false;
            $scope.codigoDeshabilitado = true;
            var i = 0;
            angular.forEach($scope.listaFamilias, function(item) {
                if (item.id == id) { $scope.familia = $scope.listaFamilias[i]; }
                i++;
            });
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
        $scope.clear = function() {
            $scope.user = {}; $scope.ruc = {}; $scope.role = {}; $scope.rucCliente = {}; $scope.tipoUsuario = {};
            $scope.emitterSelected = {}; $scope.familia = {}; $scope.inInquiry = false; $scope.inEdit = false;
            $scope.codigoDeshabilitado = false; $scope.isCollapsed = true; $scope.loadPage();
        };
        $scope.isEmpty = function(val) { return angular.isUndefined(val) || val === null || val === ''; };
    }
]);

sisAdminApp.controller('FamiliaPaginationCtrl', ['$scope', function($scope) {
    $scope.$watch('listaFamilias', function(newValue) {
        if (newValue) {
            $scope.totalItems = $scope.listaFamilias.length;
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
