'use strict';

sisAdminApp.controller('SaFacturaConceptoCtrl', ['$scope', 'Restangular', '$modal',
    function($scope, Restangular, $modal) {

        $scope.codigoDeshabilitado = false;
        $scope.display = false;
        $scope.filtro = '';
        $scope.sortType = 'ruc'; // set the default sort type
        $scope.sortReverse = false;
        $scope.displayDetail = false;
        //Subtotal
        //$scope.subTotalSuma = 1;
        $scope.names = ['Luz', 'Impuesto', 'Alquiler'];

        /*var documentos = Restangular.all('tipodocumento/list');
        documentos.getList().then(function(response) {
            $scope.documentos = response.data;
        });
        */
        $scope.loadPage = function() {
            var listado = Restangular.all('facturaconcepto/list');
            listado.getList().then(function(response){
              $scope.listaFacturasConcepto = response.data;});

        };

        //Muestra los detalles para ingresar uno nuevo
        $scope.mostrarDetalle = function() {
            $scope.displayDetail = !$scope.displayDetail;
        };

        $scope.save = function() {

            $scope.displayDetail = false;
            if ($scope.isEmpty($scope.facturaConcepto.id)) {
            Restangular.all('facturaconcepto/add').post($scope.facturaConcepto).then(function(response) {
                $scope.openModalSave($scope.facturaConcepto);
                console.log(response.data);
                $scope.clear();
                $scope.loadPage();
            });
          }else {
                Restangular.all('facturaconcepto/update').post($scope.facturaConcepto).then(function(response) {
                $scope.openModalSave($scope.facturaConcepto);
                console.log(response.data);
                $scope.clear();
                $scope.loadPage();
            });
        }



  /*          if ($scope.isEmpty($scope.factura.id)) {
                Restangular.all('factura/add').post($scope.factura).then(function(response) {
                    $scope.openModalSave($scope.factura);
                    console.log(response.data);
                    $scope.clear();
                    $scope.loadPage();
                });
            } else {
                Restangular.all('factura/update').post($scope.factura).then(function(response) {
                    $scope.openModalSave($scope.factura);
                    console.log(response.data);
                    $scope.clear();
                    $scope.loadPage();
                });
            }
*/

        };

        $scope.delete = function(facturaConcepto) {
            $scope.items = [facturaConcepto];
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
                    Restangular.one('facturaconcepto').remove({
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

        $scope.edit = function(id) {
            $scope.isCollapsed = false;
            $scope.codigoDeshabilitado = true;
            var i = 0;
            angular.forEach($scope.listaFacturasConcepto, function(item) {
                if (item.id == id) {
                    $scope.facturaConcepto = $scope.listaFacturasConcepto[i];
                    /*$scope.tipodocumentoSeleccionado = $scope.getTipoDocumento($scope.listaFacturas[i].descripcionTipoDocumento);
                    $scope.tipomonedaSeleccionado = $scope.getTipoMoneda($scope.listaFacturas[i].descripcionMoneda);
                    */
                }
                i++;
            });
        };
        /*
        $scope.getTipoDocumento = function(id) {
            var type = {};
            angular.forEach($scope.documentos, function(item) {

                if (item.descripcion.trim() === id.trim()) {
                    type = item;
                }
            });
            return type;
        };

        $scope.isEmpty = function(val) {
            return angular.isUndefined(val) || val === null || val === '';
        };

        $scope.getTipoMoneda = function(id) {
            var type = {};
            angular.forEach($scope.monedas, function(item) {

                if (item.descripcion.trim() === id.trim()) {
                    type = item;
                }
            });
            return type;
        };

        $scope.isEmpty = function(val) {
            return angular.isUndefined(val) || val === null || val === '';
        };*/


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
            /*$scope.user = {};
            $scope.ruc = {};
            $scope.role = {};
            $scope.rucCliente = {}

            $scope.tipoUsuario = {};
            $scope.emitterSelected = {};
            */
            $scope.facturaConcepto = {};
            //$scope.tipodocumentoSeleccionado = {};
            $scope.conceptoSeleccionado = {};

            $scope.inInquiry = false;
            $scope.inEdit = false;
            $scope.isCollapsed = true;
            $scope.codigoDeshabilitado = false;
            $scope.loadPage();
        };

        $scope.disableSave = function() {
            if ($scope.inInquiry === true) {
                return true;
            }
            if ($scope.isEmpty($scope.user)) {
                return true;
            }
            if ($scope.isEmpty($scope.tipoUsuario) ||
                $scope.isEmpty($scope.emitterSelected) ||
                $scope.isEmpty($scope.user.codUsuario) ||
                $scope.isEmpty($scope.role) ||
                $scope.isEmpty($scope.user.password) ||
                $scope.isEmpty($scope.user.newPassword)) {
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

        //AgregarItem
        $scope.addItem = function() {
            $scope.factura.detalles.push({
                cantidad: 1,
                precio: 1
            });
        }

        //RemoverItem
        $scope.removeItem = function(m) {
            $scope.factura.detalles.splice($scope.factura.detalles.indexOf(m), 1);
        }

        //Funcion Subtotal
        /*$scope.subTotal = function () {
          angular.forEach($scope.factura.detalles, function(detalle, key) {
            subTotalSuma += detalle.cantidad * detalle.precio;
          });
          return subTotalSuma;
        }*/

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

    }
]);




sisAdminApp.controller('MarcaPaginationCtrl', ['$scope', function($scope) {
    $scope.$watch('listaFacturas', function(newValue) {
        if (newValue) {
            $scope.totalItems = $scope.listaFacturas.length;
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
