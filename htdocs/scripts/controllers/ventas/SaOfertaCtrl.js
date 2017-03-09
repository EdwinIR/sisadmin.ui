'use strict';

sisAdminApp.controller('SaOfertaCtrl', ['$scope', 'Restangular', '$modal',
    function($scope, Restangular, $modal) {

        $scope.codigoDeshabilitado = false;
        $scope.display = false;
        $scope.filtro = '';
        $scope.sortType = 'ruc'; // set the default sort type
        $scope.sortReverse = false;

        $scope.oferta = {
          ofertaDetalleDtos:[{
            productoOfertaLeido:null,
            productoId:0,
            descripcionProducto:'',
            precioA:0,
            precioOfertaA:0,
            precioB:0,
            precioOfertaB:0,
            precioC:0,
            precioOfertaC:0
          }]
        };







        var productoOfertasListado = Restangular.all('productooferta/list');
        productoOfertasListado.getList().then(function(response){
              $scope.productoOfertas = response.data;
        });

    /**
        var productos = Restangular.all('producto/list');
        productos.getList().then(function(response){
          $scope.listaProductos = response.data;
        });
    **/




        $scope.loadPage = function() {
            var listado = Restangular.all('oferta/list');
            listado.getList().then(function(response) {
                $scope.listaOfertas = response.data;
            });
        };


$scope.selectedTemplate = function(detalle, detalleLeido) {
    detalle.precioA = detalleLeido.precioA;
    detalle.precioB = detalleLeido.precioB;
    detalle.precioC = detalleLeido.precioC;
    //detalle.productoOfertaLeido = detalleLeido.descripcionProducto;
}

/**
        $scope.cargarProducto = function(productoId, precioA, precioB, precioC) {
            for (var i = 0; i < $scope.oferta.ofertaDetalleDtos.length; i++) {
                  var det = $scope.oferta.ofertaDetalleDtos[i];
                  if(det.productoId==productoId){
                    det.precioA =precioA;
                    det.precioB =precioB;
                    det.precioC =precioC;
                  }
              }
        };
**/


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
        $scope.changeCantidad = function(){
          Restangular.all('ofertadetalle/bycodigoproducto').post($scope.oferta).then(function(response) {
              $scope.productosdetalle = response.data;
          });
        };
        $scope.mostrarDetalle = function() {
              $scope.displayDetail = !$scope.displayDetail;
        };

        $scope.removeItem = function(m){
          $scope.ordenCompra.detalles.splice($scope.ordenCompra.detalles.indexOf(m),1);
        };

        $scope.save = function() {


            for (var i = 0; i < $scope.oferta.ofertaDetalleDtos.length; i++) {
                  var det = $scope.oferta.ofertaDetalleDtos[i];
                  det.productoOfertaLeido ='';
              }




            if ($scope.isEmpty($scope.oferta.id)) {
                Restangular.all('oferta/add').post($scope.oferta).then(function(response) {
                    $scope.openModalSave($scope.oferta);
                    console.log(response.data);
                    $scope.clear();
                    $scope.loadPage();
                });
            } else {
                Restangular.all('oferta/update').post($scope.oferta).then(function(response) {
                    $scope.openModalSave($scope.oferta);
                    console.log(response.data);
                    $scope.clear();
                    $scope.loadPage();
                });
            }
        };

        $scope.delete = function(oferta) {
            $scope.items = [oferta];
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
                    Restangular.one('oferta').remove({
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
            angular.forEach($scope.listaMarcas, function(item) {
                if (item.id == id) {
                    $scope.marca = $scope.listaMarcas[i];
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
            $scope.user = {};
            $scope.ruc = {};
            $scope.role = {};
            $scope.rucCliente = {}

            $scope.tipoUsuario = {};
            $scope.emitterSelected = {};

            $scope.marca = {};
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
