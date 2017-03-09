'use strict';

sisAdminApp.controller('SaComprobantesPtoVtaCtrl', ['$scope', 'Restangular', '$modal',
    function($scope, Restangular, $modal) {

        $scope.codigoDeshabilitado = false;
        $scope.display = false;
        $scope.filtro = '';
        $scope.sortType = 'ruc'; // set the default sort type
        $scope.sortReverse = false;
        $scope.busqueda={};

        $scope.comprobante = {
          detalles:[{
            codigo:'',
            producto:'',
            unidadMedida:'',
            cantidad:0,
            precioUnitario:0,
            precioNeto:0,
            precioTotal:0
          }]
        };
        $scope.mostrarBusqueda = function() {
          $scope.displayDetail = !$scope.displayDetail;
        };
        var vendedores = Restangular.all('vendedor/list');
           vendedores.getList().then(function(response){
           $scope.vendedores=response.data;
        });

         $scope.exportar = function(){
                var nroDocumento = $scope.busqueda.nroDocumento;
                var fechaDesde = $scope.busqueda.fechaDesde;
                var fechaHasta = $scope.busqueda.fechaHasta;
                var vendedorId = $scope.busqueda.vendedorId;
                var  filterData = {
                        nroDocumento : nroDocumento,
                        fechaDesde : fechaDesde,
                        fechaHasta : fechaHasta,
                        vendedorId : vendedorId
                };
               $scope.file = 'name';
               Restangular.one('comprobante/reporteF').
                     withHttpConfig({responseType: 'blob'}).post('filter',filterData).then(function(response) {
                                     var blob=new Blob([response.data],{type:"application/octet"});
                                     var fname = 'Comprobante_'+fechaActual+'.xlsx';
                                     saveAs(blob, fname);
                   });
        }  

        $scope.filter = function() {
                var nroDocumento = $scope.busqueda.nroDocumento;
                var fechaDesde = $scope.busqueda.fechaDesde;
                var fechaHasta = $scope.busqueda.fechaHasta;
                var vendedorId = $scope.busqueda.vendedorId;
                applyFiltro({
                        nroDocumento : nroDocumento,
                        fechaDesde : fechaDesde,
                        fechaHasta : fechaHasta,
                        vendedorId : vendedorId
                });
        };

        var applyFiltro = function (filterData) {
                 Restangular.one('comprobante').post('filtro',filterData).then(function(response) {
                         $scope.listaComprobantes = response.data;
                          $scope.busqueda.idAlmacen=0;
                         //$timeout(function(){$scope.pbResultRefresh=false;$scope.pbValue=0;}, 1000);
                 });
         };

        $scope.loadPage = function() {
            var listado = Restangular.all('comprobante/list');
            listado.getList().then(function(response) {
                $scope.listaComprobantes = response.data;
            });
        };

        $scope.solonumeros = function(e) {
            var key = e.keyCode || e.which;
            var teclado = String.fromCharCode(key);
            var numeros = "0123456789";
            var especiales = "8-37-38-46";
            var teclado_especial = false;
            for (var i in especiales) {
                if (key == especiales[i]) {
                    teclado_especial = true;
                }
            }

            if (numeros.indexOf(teclado) == -1 && !teclado_especial) {
                return false;
            }
        }
        $scope.edit = function(id) {
          $scope.isCollapsed  = false;
          $scope.codigoDeshabilitado = true;
          $scope.displayDetail = true;
          $scope.botonesDeshabilitados = true;
            var i = 0;
            angular.forEach($scope.listaComprobantes, function(item) {
                if (item.id == id) {
                    $scope.comprobante = $scope.listaComprobantes[i];
                }
                i++;
            });
        };

        $scope.limpiar = function() {
                     $scope.busqueda ={}; 
                    $scope.vendedorSeleccionado={};             
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

            $scope.comprobante = {};
        //  $scope.marca.descripcion={''};

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

    }
]);




sisAdminApp.controller('ComprobantesPaginationCtrl', ['$scope', function($scope) {
    $scope.$watch('listaComprobantes', function(newValue) {
        if (newValue) {
            $scope.totalItems = $scope.listaComprobantes.length;
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
