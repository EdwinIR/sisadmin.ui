  'use strict';

  sisAdminApp.controller('SaProductoCtrl', ['$scope', 'Restangular', '$modal',
      function($scope, Restangular, $modal) {

          $scope.codigoDeshabilitado = false;
          $scope.display = false;
          $scope.filtro = '';
          $scope.sortType = 'ruc'; // set the default sort type
          $scope.sortReverse = false;
          $scope.producto = { };
          $scope.botonDeshabilitado=true;
          $scope.producto.productoDetalleA={ };
          $scope.producto.productoDetalleB={ };
          $scope.producto.productoDetalleC={ };
          $scope.loadPage = function() {
              var listado = Restangular.all('producto/listaproductos');
              listado.getList().then(function(response) {
                  $scope.listaProductos = response.data;
                });
                var almacenId = 1;
                Restangular.all('zona/byalmacen').post(almacenId).then(function(response){
                  $scope.listaZonas = response.data;
                });
          };
          $scope.habilitados = function(){
            if($scope.producto.codigoEquivalente!=null && $scope.producto.descripcion!=null && $scope.producto.unidadMedidaPrincipal!=0 && $scope.producto.zonaId>0
              && $scope.producto.ubicacionId>0 && $scope.producto.familiaId>0 && $scope.producto.marcaId){
              if(( $scope.valido($scope.producto.productoDetalleA.codigoBarra) && $scope.producto.productoDetalleA.unidadMedidaId>0 && $scope.producto.productoDetalleA.precio>0) ||
                  ($scope.valido($scope.producto.productoDetalleB.codigoBarra) && $scope.producto.productoDetalleB.unidadMedidaId>0 && $scope.producto.productoDetalleB.precio>0) ||
                  ($scope.valido($scope.producto.productoDetalleC.codigoBarra) && $scope.producto.productoDetalleC.unidadMedidaId>0 && $scope.producto.productoDetalleC.precio>0)){
                $scope.botonDeshabilitado=false;
              }else{$scope.botonDeshabilitado=true;}
            }else{
              $scope.botonDeshabilitado=true;
            }
          };
          $scope.valido = function(val) {
              if(val === null || angular.isUndefined(val) || val ===""){
                return false;
              }else{ return true; }
            };
          var unidadmedidas = Restangular.all('unidadmedida/list');
          unidadmedidas.getList().then(function(response) {
              $scope.unidadmedidas = response.data;
          });
          var zonas = Restangular.all('zona/list');
          zonas.getList().then(function(response) {
              $scope.zonas = response.data;
          });
          var ubicaciones = Restangular.all('ubicacion/list');
          ubicaciones.getList().then(function(response) {
              $scope.ubicaciones = response.data;
          });
          var marcas = Restangular.all('marca/list');
          marcas.getList().then(function(response) {
              $scope.marcas = response.data;
          });
          var almacenes = Restangular.all('almacen/list');
          almacenes.getList().then(function(response) {
              $scope.almacenes = response.data;
          });
          var modelos = Restangular.all('modelo/list');
          modelos.getList().then(function(response) {
              $scope.modelos = response.data;
          });
          var proveedores = Restangular.all('proveedor/list');
          proveedores.getList().then(function(response) {
              $scope.proveedores = response.data;
          });
          var familias = Restangular.all('familia/list');
          familias.getList().then(function(response) {
              $scope.familias = response.data;
          });

          $scope.changeAlmacen = function(almacenIde){
            Restangular.all('zona/byalmacen').post(almacenIde).then(function(response) {
                $scope.zonas = response.data; });
          };
          $scope.changeZona = function(zonaIde){
            Restangular.all('ubicacion/byzona').post(zonaIde).then(function(response) {
                $scope.ubicaciones = response.data; $scope.habilitados(); });
          };
          $scope.changeMarca = function(){
            var idFamilia = $scope.producto.familiaId;
            Restangular.all('marca/byfamilia').post(idFamilia).then(function(response){
              $scope.marcafamilias= response.data; });
          };
          $scope.importarProductos = function() {
                var filtro = {archivocsv : ''};
                Restangular.one('producto/importar').post('filter',filtro).then(function(response) {
                        $scope.res = response.data; });
          };
          $scope.removeItem = function(m){$scope.producto.ubicaciones.splice($scope.producto.ubicaciones.indexOf(m),1); }
          $scope.addItem=function(){ $scope.producto.ubicaciones.push({ }); }
          $scope.mostrarDetalle = function() { $scope.displayDetail = !$scope.displayDetail; };
          $scope.validarDetalles = function() {
            if($scope.producto.unidadMedidaPrincipal=='A'){
              if($scope.valido($scope.producto.productoDetalleA.codigoBarra) && $scope.producto.productoDetalleA.unidadMedidaId>0 && $scope.producto.productoDetalleA.precio>0){
                  $scope.save();
                }else{ alert('Ingresar Detalle A');}
            }else if($scope.producto.unidadMedidaPrincipal=='B'){
              if($scope.valido($scope.producto.productoDetalleB.codigoBarra) && $scope.producto.productoDetalleB.unidadMedidaId>0 && $scope.producto.productoDetalleB.precio>0){
                  $scope.save();
                }else{ alert('Ingresar Detalle B');}
            }else if($scope.producto.unidadMedidaPrincipal=='C'){
              if($scope.valido($scope.producto.productoDetalleC.codigoBarra) && $scope.producto.productoDetalleC.unidadMedidaId>0 && $scope.producto.productoDetalleC.precio>0){
                  $scope.save();
                }else{ alert('Ingresar Detalle C'); }
            }
          };
          $scope.save = function() {
              if ($scope.isEmpty($scope.producto.id)) {
                  Restangular.all('producto/add').post($scope.producto).then(function(response) {
                      $scope.openModalSave($scope.producto); console.log(response.data);
                      $scope.clear(); $scope.loadPage();
                  });
              } else {
                  Restangular.all('producto/update').post($scope.producto).then(function(response) {
                      $scope.openModalSave($scope.producto); console.log(response.data);
                      $scope.clear(); $scope.loadPage();
                  });
              }
          };
          $scope.edit = function(id) {
              $scope.isCollapsed = false;
              $scope.codigoDeshabilitado = true;
              var i = 0;
              angular.forEach($scope.listaProductos, function(item) {
                  if (item.id == id) {
                      $scope.producto = $scope.listaProductos[i];
                      Restangular.all('marca/byfamilia').post($scope.listaProductos[i].familiaId).then(function(response){
                        $scope.marcafamilias= response.data;
                      });
                      Restangular.all('ubicacion/byzona').post($scope.listaProductos[i].zonaId).then(function(response) {
                          $scope.ubicaciones = response.data;
                        });
                      $scope.producto.almacenId = $scope.listaProductos[i].almacenId;
                      $scope.producto.zonaId =$scope.getZona($scope.listaProductos[i].zonaId);                      
                      $scope.producto.ubicacionId =$scope.getUbicacion($scope.listaProductos[i].ubicacionId);
                      
                  }
                  i++;
              });

          };
          $scope.getZona=function(id) {
            var type = {};
            angular.forEach($scope.zonas, function(item) {
                if (item.id.trim() == id.trim()) {
                  type=item;
                }
              });
              return type;
            };
            
            $scope.getUbicacion=function(id) {
                var type = {};
                angular.forEach($scope.ubicaciones, function(item) {
                    if (item.id.trim() == id.trim()) {
                      type=item;
                    }
                  });
                  return type;
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
              $scope.emitterSelected = {}; $scope.producto = {}; $scope.inInquiry = false; $scope.codigoDeshabilitado = false;
              $scope.isCollapsed = true; $scope.loadPage();
          };
          $scope.getStringValor = function(stringvalor) {
              var desc = '';
              if (angular.isUndefined(stringvalor) || stringvalor === null) {
                  desc = '';
              } else {
                  desc = stringvalor;
              }
              return desc;
          };
          $scope.isEmpty = function(val) { return angular.isUndefined(val) || val === null || val === ''; };


      }
  ]);

  sisAdminApp.controller('ProductoPaginationCtrl', ['$scope', function($scope) {
      $scope.$watch('listaProductos', function(newValue) {
          if (newValue) {
              $scope.totalItems = $scope.listaProductos.length;
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
