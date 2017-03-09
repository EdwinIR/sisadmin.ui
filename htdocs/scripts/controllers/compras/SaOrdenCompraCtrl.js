sisAdminApp.controller('SaOrdenCompraCtrl',
      ['$scope','Restangular','$modal', 'LoginFactory',
      function ($scope,Restangular,$modal,LoginFactory) {
        $scope.codigoDeshabilitado=false; $scope.display=false;
        $scope.filtro=''; $scope.sortType='ruc';
        $scope.sortReverse=false; $scope.displayDetail=false;
        $scope.camposDeshabilitados=false;
        $scope.ordenCompra = {
                    detalles:[{productoLeido:null, productoId:0, descripcionProducto:'',
                      unidadMedidaId:0, descripcionUnidadMedida : '', precioUnitario:0,
                      descuento1:0, descuento2:0, descuento3:0, descuento4:0, precioNeto:0, cantidad:0, totalCompra:0 }]
        };
        var almacenes = Restangular.all('almacen/list');
        almacenes.getList().then(function(response){ $scope.almacenes=response.data; });
        var proveedores = Restangular.all('proveedor/list');
        proveedores.getList().then(function(response){ $scope.proveedores=response.data;});
        var productos = Restangular.all('producto/list');
        productos.getList().then(function(response){ $scope.listaProductos = response.data; });
        var condicionespagos = Restangular.all('condicionpago/list');
        condicionespagos.getList().then(function(response){ $scope.condicionespagos=response.data; });
        var tiposmonedas = Restangular.all('moneda/list');
        tiposmonedas.getList().then(function(response){ $scope.tiposmonedas=response.data; });
        $scope.loadPage = function() {
            var listado = Restangular.all('ordencompra/list');
            listado.getList().then(function(response){ $scope.listaOrdenesCompras = response.data;});};

        $scope.mostrarDetalle = function() { $scope.displayDetail = !$scope.displayDetail; };
        $scope.salvadoParcial = function() { $scope.ordenCompra.estado='Parcial'; $scope.salvado(); }
        $scope.salvadoPendiente = function() { $scope.ordenCompra.estado='Pendiente'; $scope.salvado(); }
        $scope.salvado = function() {
              $scope.ordenCompra.idProveedor=$scope.proveedorSeleccionado.id;
              $scope.ordenCompra.idAlmacen=LoginFactory.getAlmacenId();
              $scope.ordenCompra.condicionPagoCodigo = $scope.condicionSeleccionado.codigo;
              $scope.ordenCompra.tipoMonedaCodigo = $scope.tipoMonedaSeleccionado.codigo; $scope.displayDetail = false;
              for (var i = 0; i < $scope.ordenCompra.detalles.length; i++) {
                 var det = $scope.ordenCompra.detalles[i]; det.productoLeido =null; }
              if($scope.isEmpty($scope.ordenCompra.id)) {
                      Restangular.all('ordencompra/add').post($scope.ordenCompra).then(function(response) {
                          $scope.openModalSave($scope.ordenCompra); console.log(response.data); $scope.limpiar(); $scope.loadPage(); });
              } else { Restangular.all('ordencompra/update').post($scope.ordenCompra).then(function(response) {
                          $scope.openModalSave($scope.ordenCompra); console.log(response.data); $scope.limpiar(); $scope.loadPage(); });
              }
        };
        $scope.borrar = function(ordencompra) {
                     $scope.items = [ordencompra];
                     var modalInstance = $modal.open({ templateUrl: 'DelModalContent.html', controller: 'DelModalInstanceCtrl',
                          resolve: {items: function () {return $scope.items;}}  });
                     modalInstance.result.then(
                          function (selectedItem) {
                                Restangular.one('ordencompra').remove({id:$scope.items[0].id}).then(
                                            function(){$scope.limpiar(); $scope.loadPage();});
                          },
                          function () {} );
        };
        $scope.editar = function(id) {
                    $scope.isCollapsed  = false;
                    $scope.codigoDeshabilitado = true;
                    $scope.displayDetail = true;
                    $scope.camposDeshabilitados=false;
                    var i = 0;
                    angular.forEach($scope.listaOrdenesCompras, function(item) {
                      if (item.id == id) {
                          $scope.ordenCompra = $scope.listaOrdenesCompras[i];
                          $scope.proveedorSeleccionado = $scope.getProveedor($scope.listaOrdenesCompras[i].razonSocialProveedor);
                          $scope.condicionSeleccionado = $scope.getCondiciones($scope.listaOrdenesCompras[i].descripcionCondicionPago);
                          $scope.tipoMonedaSeleccionado = $scope.getTipo($scope.listaOrdenesCompras[i].descripcionTipoPago);
                      }
                      i++;
                    });
                    for (var i = 0; i < $scope.ordenCompra.detalles.length; i++) {
                          var det = $scope.ordenCompra.detalles[i];
                          angular.forEach($scope.listaProductos, function(item) {
                              if (item.id == det.productoId) { $scope.ordenCompra.detalles[i].productoLeido=item; }
                          });
                    }
        };
        $scope.ver = function(id) {
                    $scope.isCollapsed  = false;
                    $scope.codigoDeshabilitado = true;
                    $scope.displayDetail = true;
                    $scope.camposDeshabilitados=true;
                    var i = 0;
                    angular.forEach($scope.listaOrdenesCompras, function(item) {
                      if (item.id == id) {
                          $scope.ordenCompra = $scope.listaOrdenesCompras[i];
                          $scope.proveedorSeleccionado = $scope.getProveedor($scope.listaOrdenesCompras[i].razonSocialProveedor);
                          $scope.condicionSeleccionado = $scope.getCondiciones($scope.listaOrdenesCompras[i].descripcionCondicionPago);
                          $scope.tipoMonedaSeleccionado = $scope.getTipo($scope.listaOrdenesCompras[i].descripcionTipoPago);
                      }
                      i++;
                    });
                    for (var i = 0; i < $scope.ordenCompra.detalles.length; i++) {
                          var det = $scope.ordenCompra.detalles[i];
                          angular.forEach($scope.listaProductos, function(item) {
                              if (item.id == det.productoId) { $scope.ordenCompra.detalles[i].productoLeido=item; }
                          });
                    }
        };
        $scope.limpiar = function() {
             $scope.user = {}; $scope.ruc={};  $scope.role={}; $scope.rucCliente={}; $scope.tipoUsuario={};
             $scope.emitterSelected={}; $scope.ordencompra={}; $scope.proveedorSeleccionado = {}; $scope.condicionSeleccionado = {};
             $scope.tipoMonedaSeleccionado = {}; $scope.ordencompra.detalles = {}; $scope.inInquiry=false; $scope.codigoDeshabilitado=false;
             $scope.isCollapsed  = true;
             $scope.camposDeshabilitados=false;
             $scope.ordenCompra = {
                  detalles:[{ productoLeido:null, productoId:0, descripcionProducto:'', unidadMedidaId:0, descripcionUnidadMedida : '',
                      precioUnitario:0, descuento1:0, descuento2:0, descuento3:0, descuento4:0, precioNeto:0, cantidad:0, totalCompra:0 }]
            };
            $scope.loadPage();
        };
        $scope.openModalSave = function(user) {
          $scope.items = [user];
          var modalInstance = $modal.open({
             templateUrl: 'AddModalContent.html',
             controller: 'AddModalInstanceCtrl',
             resolve: { items: function () {return $scope.items;}} });
          modalInstance.result.then(function (selectedItem) {
                }, function () { });
        };
        $scope.getProveedor=function(id) {
            var type = {};
            angular.forEach($scope.proveedores, function(item) {
               if(item.razonSocial.trim() == id.trim()) { type=item; } });
            return type;
        };
        $scope.getTipo=function(id) {
                  var type = {};
                  angular.forEach($scope.tiposmonedas, function(item) {
                       if (item.descripcion.trim() == id.trim()) { type=item; } });
                  return type;
        };
        $scope.getCondiciones=function(id) {
                         var type = {};
                         angular.forEach($scope.condicionespagos, function(item) {
                             if (item.descripcion.trim() == id.trim()) { type=item; } });
                         return type;
        };
        $scope.addItem=function(){
            $scope.ordenCompra.detalles.push({ precioUnitario:0, descuento1:0, descuento2:0, descuento3:0, descuento4:0,
                                            precioNeto:0, cantidad:0, totalCompra:0 });
        }
        $scope.removeItem = function(m){
           $scope.ordenCompra.detalles.splice($scope.ordenCompra.detalles.indexOf(m),1); }
       $scope.changeProducto = function(detalle,detalleLeido){
          detalle.descripcionProducto = detalleLeido.descripcion;
          detalle.unidadMedidaId = detalleLeido.unidadMedidaId;
          detalle.descripcionUnidadMedida = detalleLeido.unidadMedidaPrincipal;
          detalle.productoId = detalleLeido.id;
       }
       $scope.isEmpty = function(val) { return angular.isUndefined(val) || val === null || val === ''; };
}]);

sisAdminApp.controller('OrdenCompraPaginationCtrl', ['$scope',function ($scope) {
  $scope.$watch('listaOrdenesCompras', function (newValue) {
    if (newValue) {
      $scope.totalItems = $scope.listaOrdenesCompras.length;
      $scope.currentPage = 1;
    }
  });
  $scope.currentPage = 1;
  $scope.itemsPerPage=10;
  $scope.maxSize = 10;
  $scope.setPage = function (pageNo) {
    $scope.currentPage = pageNo;
  };
}]);
