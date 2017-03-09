'use strict';

sisAdminApp.controller('SaFacturaCtrl', ['$scope', 'Restangular', '$modal',
    function($scope, Restangular, $modal) {

        $scope.codigoDeshabilitado = false;
        $scope.display = false;
        $scope.filtro = '';
        $scope.sortType = 'ruc'; // set the default sort type
        $scope.sortReverse = false;
        $scope.displayDetail = false;
        
        var date = new Date();
        var dia = date.getDate();
        var mes = date.getMonth()+1;
        var anio = date.getFullYear();

        var fechaActual = dia+'-'+mes+'-'+anio;

        $scope.fechaActual =fechaActual;

        $scope.exportar = function(){
               $scope.file = 'name';
               Restangular.one('marca/reporteF').
                     withHttpConfig({responseType: 'blob'}).post().then(function(response) {
                                     var blob=new Blob([response.data],{type:"application/octet"});
                                     var fname = 'Factura_'+fechaActual+'.xlsx';
                                     saveAs(blob, fname);
                   });
        }


        $scope.factura = {
            detalles: [{
                cantidad: 0,
                precio: 0
            }],
            baseImponible: 0,
            tasaIgv: 18,
            igv: 0,
            total: 0,
            otrosCargos: 0,
            cambio: 3.50
        };
        var documentos = Restangular.all('tipodocumento/list');
        documentos.getList().then(function(response) {
            $scope.documentos = response.data;
        });

        var monedas = Restangular.all('moneda/list');
        monedas.getList().then(function(response) {
            $scope.monedas = response.data;
        });

        var productos = Restangular.all('producto/list');
        productos.getList().then(function(response) {
            $scope.listaProductos = response.data;
        });

        var proveedores = Restangular.all('proveedor/list');
        proveedores.getList().then(function(response) {
            $scope.proveedores = response.data;
        });

        $scope.loadPage = function() {
            var listado = Restangular.all('factura/list');
            listado.getList().then(function(response){ $scope.listaFacturas = response.data;});

        };

        //Muestra los detalles para ingresar uno nuevo
        $scope.mostrarDetalle = function() {
            $scope.displayDetail = !$scope.displayDetail;
        };

        $scope.save = function() {
            $scope.factura.tipoDocumentoCodigo = $scope.tipodocumentoSeleccionado.codigo;
            $scope.factura.tipoMonedaCodigo = $scope.tipomonedaSeleccionado.codigo;
            $scope.factura.idProveedor = $scope.proveedorSeleccionado.id;

            //Limpiar la tabla
            /*$scope.factura={
                          detalles:[{
                            cantidad:0,
                            precio:0
                          }],
                          baseImponible:0,
                          tasaIgv:18,
                          igv:0,
                          total:0
                        };
            */

            $scope.displayDetail = false;

            if ($scope.isEmpty($scope.factura.id)) {
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
        };

        $scope.delete = function(factura) {
            $scope.items = [factura];
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
                    Restangular.one('factura').remove({
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
            $scope.displayDetail = true;
            var i = 0;
            angular.forEach($scope.listaFacturas, function(item) {
                if (item.id == id) {
                    $scope.factura = $scope.listaFacturas[i];
                    $scope.tipodocumentoSeleccionado = $scope.getTipoDocumento($scope.listaFacturas[i].descripcionTipoDocumento);
                    $scope.tipomonedaSeleccionado = $scope.getTipoMoneda($scope.listaFacturas[i].descripcionMoneda);
                    $scope.proveedorSeleccionado = $scope.getProveedor($scope.listaFacturas[i].razonSocialProveedor);
                }
                i++;
            });
        };

        $scope.getTipoDocumento = function(id) {
            var type = {};
            angular.forEach($scope.documentos, function(item) {

                if (item.descripcion.trim() === id.trim()) {
                    type = item;
                }
            });
            return type;
        };

        $scope.getProveedor = function(id) {
            var type = {};
            angular.forEach($scope.proveedores, function(item) {

                if (item.razonSocial.trim() === id.trim()) {
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
            $scope.user = {};
            $scope.ruc = {};
            $scope.role = {};
            $scope.rucCliente = {}

            $scope.tipoUsuario = {};
            $scope.emitterSelected = {};

            $scope.factura = {};
            $scope.tipodocumentoSeleccionado = {};
            $scope.tipomonedaSeleccionado = {};

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
