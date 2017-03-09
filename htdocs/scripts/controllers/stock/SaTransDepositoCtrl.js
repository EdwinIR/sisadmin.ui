'use strict';

sisAdminApp.controller('SaTransDepositoCtrl', ['$scope', 'Restangular', '$modal','LoginFactory',
    function($scope, Restangular, $modal, LoginFactory) {

       $scope.codigoDeshabilitado = false;
       $scope.display = false;
       $scope.filtro = '';
       $scope.sortType = 'ruc'; // set the default sort type
       $scope.sortReverse = false;
       $scope.displayDetail = false;
       $scope.productoId = 0;
       $scope.recuperar={};
       $scope.guiashow=false;
       $scope.fil={};
       $scope.camposDeshabilitados=false;
       $scope.botonDeshabilitado=true;
       $scope.transdeposito = {detalles : [{codigo:null,descripcionProducto : '',idProducto : 0,idUnidadMedida : 0,descripcionUnidadMedida : '',cantidad : 0,stock : 0}]};

       var date = new Date();var dia = date.getDate();var mes = date.getMonth()+1;var anio = date.getFullYear();var fechaActual = dia+'-'+mes+'-'+anio;
       $scope.fechaActual =fechaActual;
       $scope.getValidacion = function(){
         var a= $scope.transdeposito.detalles.length;
         for(var i = 0; i <a;i++){
                var deposito = $scope.transdeposito.detalles[i];
             if(deposito.cantidad<=deposito.stock && deposito.cantidad>0){
               deposito.cantidad=deposito.cantidad; $scope.habilitar(deposito.stock);
             }else if(deposito.cantidad==0 && deposito.stock>0){
               deposito.cantidad=0; $scope.botonDeshabilitado=true;
               alert('Ingresar cantidad mayor a 0');a=1;
             }else if(deposito.cantidad>0 && deposito.stock==0){
               deposito.cantidad=0; $scope.botonDeshabilitado=true;
               alert('Elegir producto con stock'); a=1;
             }else if(deposito.cantidad>deposito.stock){
               deposito.cantidad=0; $scope.botonDeshabilitado=true;
               a=1;
             }
         }};
         $scope.habilitar = function(val){
             if($scope.fil.almacen>0 && $scope.transdeposito.fecha!=null){
                 if(val>0){ $scope.botonDeshabilitado=false; }
             }
         };
        $scope.idAlmacen=LoginFactory.getAlmacenId();
        var almacenes = Restangular.all('almacen/listval').post($scope.idAlmacen).then(function(response){$scope.almacenes = response.data;});
        var productos = Restangular.all('producto/list');productos.getList().then(function(response) {$scope.listaProductos = response.data;});
        $scope.deshabilitarBoton= function(){
          $scope.botonDeshabilitado=true;
        };
        $scope.habilitados = function(){
            if($scope.fil.almacen>0 && $scope.transdeposito.fecha!=null){
                if($scope.valorStock>0){ $scope.botonDeshabilitado=false; }
            }
        };
        $scope.changeProducto = function(keyEvent,detalle,codigo){
          if(keyEvent.which === 13){
               Restangular.all('producto/bycode').post(codigo).then(function(response) {
                $scope.p = response.data;
                detalle.descripcionProducto= $scope.p.descripcion;
                detalle.descripcionUnidadMedida= $scope.p.unidadMedidaPrincipal;
                detalle.idProducto = $scope.p.id; 
                $scope.productoId = $scope.p.id;
                $scope.recuperarStock(detalle);
                $scope.isCollapsed = false;
              });
            }       
        };        
        $scope.recuperarStock = function(detalle){
            $scope.recuperar.productoId = detalle.idProducto;
            $scope.recuperar.almacenId = LoginFactory.getAlmacenId();
            Restangular.all('transdeposito/byproducto').post($scope.recuperar).then(function(response){
              detalle.stock= response.data;
              $scope.valorStock= detalle.stock;
              if($scope.valorStock<1){
                detalle.cantidad=0;
                $scope.botonDeshabilitado=true;
                alert('elegir producto con stock mayor a cero para iniciar la transferencia');
                }
            });};
        $scope.loadPage = function() {
            var listado = Restangular.all('transdeposito/list');listado.getList().then(function(response){
              $scope.listaTransDeposito = response.data;
              $scope.listaTransDeposito.almacen = LoginFactory.getAlmacenId();
            });
        };
        $scope.mostrarDetalle = function() { $scope.displayDetail = !$scope.displayDetail;};
        $scope.save = function() {
            $scope.transdeposito.almacenOrigenId = LoginFactory.getAlmacenId();
            $scope.transdeposito.almacenDestinoId = $scope.fil.almacen;
            for (var i = 0; i < $scope.transdeposito.detalles.length; i++) {var det = $scope.transdeposito.detalles[i];det.productoLeido ='';}
            if ($scope.isEmpty($scope.transdeposito.id)) {
                Restangular.all('transdeposito/add').post($scope.transdeposito).then(function(response) {
                    $scope.openModalSave($scope.transdeposito);console.log(response.data);$scope.clear();$scope.loadPage();$scope.botonDeshabilitado=true;});
            } else {
                Restangular.all('transdeposito/update').post($scope.transdeposito).then(function(response) {
                    $scope.openModalSave($scope.transdeposito);console.log(response.data);$scope.clear();$scope.loadPage();});
            }
        };
        $scope.generarpdf = function(){
          $scope.guia.fechaInicio = $scope.transdeposito.fecha;
          $scope.guia.almacenOrigenId = LoginFactory.getAlmacenId();
          $scope.guia.almacenDestinoId = $scope.filtro.almacen;
          $scope.guia.transferenciaId = $scope.transdeposito.id;
              var fileName ='nombrearchivobajda';
              Restangular.one('transdeposito/pdf').
                withHttpConfig({responseType: 'blob'}).post('filter',$scope.guia).then(function(response) {
                                var blob=new Blob([response.data],{type:"application/octet"});
                                var fname = 'TransDepsoito'+$scope.fechaActual+'.PDF';
                                saveAs(blob, fname);
              });
              $scope.openModalSave($scope.guia);$scope.clear();$scope.loadPage();
      };
      $scope.finalizar = function(id) {
         var i = 0;
            angular.forEach($scope.listaTransDeposito, function(item) {if (item.id == id) {$scope.transdeposito = $scope.listaTransDeposito[i];}
                i++;
            });
                Restangular.all('transdeposito/finalizar').post($scope.transdeposito).then(function(response) {
                    $scope.openModalSave($scope.transdeposito);console.log(response.data);$scope.clear();$scope.loadPage();});
        };
        $scope.edit = function(id) {
            $scope.isCollapsed = false;$scope.codigoDeshabilitado = false;$scope.guiashow=false;$scope.camposDeshabilitados=true;
            var i = 0;
            angular.forEach($scope.listaTransDeposito, function(item) {
                if (item.id == id) {
                  $scope.transdeposito = $scope.listaTransDeposito[i];
                  $scope.fil.almacen = $scope.getDepositoDestino($scope.listaTransDeposito[i].descripcionAlmacenDestino);
                }
                i++; });
             for (var i = 0; i < $scope.transdeposito.detalles.length; i++) {
                          var det = $scope.transdeposito.detalles[i];
                          angular.forEach($scope.listaProductos, function(item) {if (item.id == det.idProducto) { $scope.transdeposito.detalles[i].productoLeido=item;}});}
        };
        $scope.crearGuia = function(id) {
            $scope.isCollapsed = false;$scope.codigoDeshabilitado = true;$scope.guiashow=true;$scope.camposDeshabilitados=true;
            var i = 0;
            angular.forEach($scope.listaTransDeposito, function(item) {
                if (item.id == id) { $scope.transdeposito = $scope.listaTransDeposito[i];$scope.almacenDestinoSeleccionado = $scope.getDepositoDestino($scope.listaTransDeposito[i].descripcionAlmacenDestino);}
                i++; });
             for (var i = 0; i < $scope.transdeposito.detalles.length; i++) {
                          var det = $scope.transdeposito.detalles[i];
                          angular.forEach($scope.listaProductos, function(item) {if (item.id == det.idProducto) { 
                            $scope.transdeposito.detalles[i].descripcionProducto=item.descripcion;
                          }});}
        };
        $scope.getDepositoDestino=function(id) { var type = {};angular.forEach($scope.almacenes, function(item) { 
          if (item.descripcion.trim() == id.trim()) {
            type=item;
          }});
        return type;
      };
        $scope.openModalSave = function(user) {
            $scope.items = [user];
            var modalInstance = $modal.open({
                templateUrl: 'AddModalContent.html',
                controller: 'AddModalInstanceCtrl',
                resolve: {items: function() {return $scope.items; } }
            });
            modalInstance.result.then(function(selectedItem) { }, function() {});
        };
        $scope.clear = function() {
            $scope.transdeposito = {};$scope.almacenOrigenSeleccionado = {};$scope.almacenDestinoSeleccionado = {};
            $scope.guiashow=false;$scope.camposDeshabilitados=false;$scope.guia={};
            $scope.isCollapsed  = true;$scope.displayDetail = false;$scope.fil.almacen=0;
            $scope.transdeposito = {detalles : [{productoLeido : null,idProducto : 0,descripcionProducto : '',idUnidadMedida : 0,descripcionUnidadMedida : '',cantidad : 0}]};
            $scope.loadPage();
        };
        $scope.addItem = function() {$scope.transdeposito.detalles.push({cantidad: 0});$scope.botonDeshabilitado=true;}
        $scope.removeItem = function(m) {$scope.transdeposito.detalles.splice($scope.transdeposito.detalles.indexOf(m), 1);$scope.getValidacion();}
        $scope.isEmpty = function(val) {return angular.isUndefined(val) || val === null || val === '';};
        $scope.validarAlmacen = function(almacenDestino){if(almacenDestino==$scope.idAlmacen){return true;}else {return false;}};

    }
]);
sisAdminApp.controller('TransDepositoPaginationCtrl', ['$scope', function($scope) {
    $scope.$watch('listaTransDeposito', function(newValue) {
        if (newValue) {
            $scope.totalItems = $scope.listaTransDeposito.length;
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
