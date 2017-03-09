sisAdminApp.controller('SaActualizarPrecioCtrl',
    ['$scope', 'Restangular', '$modal',
    function($scope, Restangular, $modal) {

        $scope.codigoDeshabilitado = false;
        $scope.display = false;
        $scope.filtro = '';
        $scope.sortType = 'ruc'; // set the default sort type
        $scope.sortReverse = false;
        $scope.paEnvio={};

        //$scope.marca= {descripcion: 'descripcion...'};

        $scope.loadPage = function() {
            var listadoprecio = Restangular.all('parteingresolistado/list');
            listadoprecio.getList().then(function(response) {
                $scope.listadoprecio = response.data;
            });
        };

        $scope.find = function(){
          $scope.actualizarprecio.idPrecio=$scope.actualizarprecio.idPrecio;
          Restangular.all('actualizarprecio/producto').post($scope.actualizarprecio).then(function(response) {
            if(response.data== '"Precio Actualizado"'){
              $scope.openModalSave($scope.actualizarprecio);
              alert(response.data);
              console.log(response.data);
              $scope.clear();
              $scope.loadPage();
            }else{
              alert(response.data);
              $scope.clear();
              $scope.loadPage();
            }

          });
        };


        $scope.save = function() {
            if ($scope.isEmpty($scope.marca.id)) {
                Restangular.all('marca/add').post($scope.marca).then(
                    function(response) {
                          if(response.data == '"OK"'){
                          $scope.openModalSave($scope.marca);
                          console.log(response.data);
                          $scope.clear();
                          $scope.loadPage();
                        } else {
                          alert(response.data);
                          $scope.clear();
                          $scope.loadPage();
                        }
                    }
                  );
            } else {
                Restangular.all('marca/update').post($scope.marca).then(function(response) {
                    $scope.openModalSave($scope.marca);
                    console.log(response.data);
                    $scope.clear();
                    $scope.loadPage();
                });
            }
        };

        $scope.delete = function(marca) {
            $scope.items = [marca];
            var modalInstance = $modal.open({
                templateUrl: 'DelModalContent.html',
                controller: 'DelModalInstanceCtrl',
                resolve: {
                    items: function() {
                        return $scope.items;
                    }
                }
              });
              modalInstance.result.then(
                    function(selectedItem) {
                      Restangular.one('marca').remove({
                        id: $scope.items[0].id
                    }).then(
                        function() {
                            $scope.clear();
                            $scope.loadPage();
                        });
                      },
                function() {}
                );
        };

        $scope.edit = function(codigoProducto) {
            $scope.isCollapsed = false;
            $scope.codigoDeshabilitado = true;
            var i = 0;
            angular.forEach($scope.listadoprecio, function(item) {
                if (item.codigoProducto == codigoProducto) {
                    $scope.actualizarprecio = $scope.listadoprecio[i];
                }
                i++;
            });
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

        $scope.clear = function() {
          $scope.marca = {};
          $scope.actualizarprecio= {};
            $scope.inInquiry = false;
            $scope.inEdit = false;
            $scope.codigoDeshabilitado = false;
            $scope.isCollapsed = true;
            $scope.loadPage();
        };

        $scope.disableSave = function() {
            if ($scope.isEmpty($scope.marca.codigo) ||
                $scope.isEmpty($scope.marca.descripcion)) {
                return true;
            }
            return false;
        };


        $scope.getUserType = function(id) {
            var type = {};
            angular.forEach($scope.listUserType, function(item) {
                if (item.codigo === id) {
                    type = item;
                }
            });
            return type;
        };


        $scope.getEmitter = function(id) {
            var type = {};
            angular.forEach($scope.listEmitter, function(item) {
                if (item.identification === id) {
                    type = item;
                }
            });
            return type;
        };

        $scope.getCustomer = function(id) {
            var type = {};
            angular.forEach($scope.listCustomer, function(item) {

                if (item.identification.trim() === id.trim()) {
                    type = item;
                }
            });
            return type;
        };


        $scope.getRole = function(id) {
            var type = {};
            angular.forEach($scope.listRole, function(item) {

                if (item.codRol.trim() === id.trim()) {
                    type = item;
                }
            });
            return type;
        };

        $scope.isEmpty = function(val) {
            return angular.isUndefined(val) || val === null || val === '';
        };

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
