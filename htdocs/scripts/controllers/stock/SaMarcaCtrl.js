sisAdminApp.controller('SaMarcaCtrl',
    ['$scope', 'Restangular', '$modal',
    function($scope, Restangular, $modal) {

        $scope.codigoDeshabilitado = false;
        $scope.display = false;
        $scope.filtro = '';
        $scope.sortType = 'ruc'; // set the default sort type
        $scope.sortReverse = false;

        $scope.loadPage = function() {
            var listado = Restangular.all('marca/list');
            listado.getList().then(function(response) {
                $scope.listado = response.data; });
        };
        $scope.save = function() {
            if ($scope.isEmpty($scope.marca.id)) {
                Restangular.all('marca/add').post($scope.marca).then(
                    function(response) {
                          if(response.data == '"OK"'){ $scope.openModalSave($scope.marca); console.log(response.data); $scope.clear(); $scope.loadPage();
                          } else { alert(response.data); $scope.clear(); $scope.loadPage(); } } );
            } else {
                Restangular.all('marca/update').post($scope.marca).then(function(response) {
                    $scope.openModalSave($scope.marca); console.log(response.data); $scope.clear(); $scope.loadPage(); });
             }
        };
        $scope.edit = function(id) {
            $scope.isCollapsed = false; $scope.codigoDeshabilitado = true;
            var i = 0;
            angular.forEach($scope.listado, function(item) {
                if (item.id == id) { $scope.marca = $scope.listado[i]; }
                i++; });
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
        $scope.refreshInput = function(index) {
            $scope.user = $scope.listUser[index];
            var customers = Restangular.all('customer/list');
            customers.getList().then(function(response) {
                $scope.listCustomer = response.data;
                $scope.rucCliente = $scope.getCustomer($scope.listUser[index].rucEmpresa);
            });
        };
        $scope.clear = function() {
            $scope.user = {}; $scope.ruc = {}; $scope.role = {}; $scope.rucCliente = {}; $scope.tipoUsuario = {};
            $scope.emitterSelected = {}; $scope.marca = {}; $scope.inInquiry = false; $scope.inEdit = false;
            $scope.codigoDeshabilitado = false;$scope.isCollapsed = true; $scope.loadPage();
        };
        $scope.isEmpty = function(val) { return angular.isUndefined(val) || val === null || val === ''; };
}]);
sisAdminApp.controller('MarcaPagCtrl', ['$scope',function ($scope) {
  $scope.$watch('listado', function (newValue) {
    if (newValue) {
      $scope.totalItems = $scope.listado.length;
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
