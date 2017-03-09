sisAdminApp.controller('SaMenuCtrl', ['$scope', 'LoginFactory', 'Restangular',
'$window', '$timeout', '$modal',
function($scope, LoginFactory, Restangular, $window, $timeout, $modal) {

  //Configuramos Headers
  Restangular.setDefaultHeaders({
    'Authorization': $window.sessionStorage.token
  });

  //inicializamos variables para menus
  $scope.accordionStatus = {
    open1: true,
    open2: false,
    open3: false,
    open4: false,
    open5: false,
    open6: false
  };
  $scope.accordionOneAtATime = true;
  $scope.seccion = [];
  $scope.seccion[0] = true;
  $scope.seccion[1] = false;
  $scope.seccion[2] = false;
  $scope.seccion[3] = false;
  $scope.seccion[4] = false;
  $scope.seccion[5] = false;
  $scope.seccion[6] = false;
  $scope.seccion[7] = false;
  $scope.seccion[8] = false;
  $scope.seccion[9] = false;
  $scope.seccion[10] = false;
  $scope.seccion[11] = false;
  $scope.seccion[12] = false;
  $scope.seccion[13] = false;
  $scope.seccion[14] = false;
  $scope.seccion[15] = false;
  $scope.seccion[16] = false;
  $scope.seccion[17] = false;
  $scope.seccion[18] = false;
  $scope.seccion[19] = false;
  $scope.seccion[20] = false;
  $scope.seccion[21] = false;
  $scope.seccion[22] = false;
  $scope.seccion[23] = false;
  $scope.seccion[24] = false;
  $scope.seccion[25] = false;
  $scope.seccion[26] = false;
  $scope.seccion[27] = false;
  $scope.seccion[28] = false;
  $scope.seccion[29] = false;
  $scope.seccion[30] = false;
  $scope.seccion[31] = false;
  $scope.seccion[32] = false;
  $scope.seccion[33] = false;
  $scope.seccion[34] = false;
  $scope.seccion[35] = false;
  $scope.seccion[36] = false;
  $scope.seccion[37] = false;
  $scope.seccion[38] = false;
  $scope.seccion[39] = false;
  $scope.seccion[40] = false;
  $scope.seccion[41] = false;
  $scope.seccion[42] = false;
  $scope.seccion[43] = false;
  $scope.seccion[44] = false;
  $scope.seccion[45] = false;
  $scope.seccion[46] = false;
  $scope.seccion[47] = false;
  $scope.seccion[48] = false;
  $scope.seccion[49] = false;
  $scope.seccion[50] = false;
  $scope.seccion[51] = false;
  $scope.seccion[52] = false;
  $scope.seccion[53] = false;
  $scope.seccion[54] = false;
  $scope.seccion[55] = false;
  $scope.seccion[56] = false;
  $scope.seccion[57] = false;
  $scope.seccion[58] = false;
  $scope.seccion[59] = false;
  $scope.seccion[60] = false;
  $scope.seccion[61] = false;
  $scope.seccion[62] = false;
  $scope.seccion[63] = false;
  $scope.seccion[64] = false;
  $scope.seccion[65] = false;
  $scope.seccion[66] = false;
  $scope.seccion[67] = false;
  $scope.seccion[68] = false;
  $scope.seccion[69] = false;
  $scope.seccion[70] = false;
  $scope.seccion[71] = false;
  $scope.seccion[72] = false;
  $scope.seccion[73] = false;
  $scope.seccion[74] = false;
  $scope.seccion[75] = false;
  $scope.seccion[76] = false;
  $scope.seccion[77] = false;
  $scope.seccion[78] = false;
  $scope.seccion[79] = false;

  //Declaramos e inicializamos variables para funcionalidad
  $scope.filter = {};
  $scope.listDocuments = [];
  $scope.pbResultRefresh = false;
  $scope.pbValue = 0;
  $scope.pbResultRefresh = true;
  $scope.isCollapsed = true;
  $scope.loggedUser = LoginFactory.getUserName();

  $scope.role = LoginFactory.getUserRole();
  $scope.rol = {
    codRol: $scope.role,
    descripcion: '',
    isActive: 'Y'
  }
  $scope.menus = [];
  Restangular.one('rolemenu').post('filter', $scope.rol).then(function(response) {
    $scope.menus = response.data;
    $scope.pbValue = 100;
    $timeout(function() {
      $scope.pbResultRefresh = false;
      $scope.pbValue = 0;
    }, 1000);
  });

  /** funcion para logout**/
  $scope.logout = function() {
    LoginFactory.logout();
  };

  /** funciones para seleccion de menu **/
  $scope.selSeccion = function(number) {
    for (var i = 0; i <= $scope.seccion.length - 1; i++) {
      if (i != number) {
        $scope.seccion[i] = false;
      } else {
        $scope.seccion[i] = true;
        $scope.clearData();
      }
    }
  };

  $scope.clearData = function() {
    $scope.listDocument = null;
    $scope.listCustomer = null;
    $scope.listUser = null;
    $scope.listRole = null;
    $scope.listEmitter = null;
  };

  /** funciones para permisos **/
  $scope.allowed = function() {
    if (LoginFactory.getUserRole() == 'Admin') return true;
    return false;
  };

  $scope.disableButtons = function(status) {
    if (status.trim() == 'AT') return true;
  };


  // var rCurrency = Restangular.all('combo/currencytype/list');
  //rCurrency.getList().then(function(response){
  //            $scope.listIdCurrency =response.data;
  //});

  $scope.displayField = function(fieldName) {
    var foundRole = false;
    angular.forEach($scope.menus, function(item) {
      if (item.codOpcionMenu === fieldName) {
        foundRole = true;
      }
    });
    return foundRole;
  };


}
]);
