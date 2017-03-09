'use strict';


sisAdminApp.controller('CustomerCtrl', 
      ['$scope','Restangular','$modal', 
      function ($scope,Restangular,$modal) {

              $scope.inInquiry=false;
              $scope.inEdit = false;
              $scope.tipoIdentificacion={};
              $scope.moneda={};
              $scope.searchClient   = '';

              //$scope.searchA   = '';
              

              $scope.sortType     = 'identificationEmitter'; // set the default sort type
              $scope.sortReverse  = false;
                          
               var rDocumentTypes = Restangular.all('combo/idtype/list');
               rDocumentTypes.getList().then(function(response){
                          $scope.listIdTypes =response.data;
               });
    
               var rEmitters = Restangular.all('combo/emitter/list');
               rEmitters.getList().then(function(response){
                          $scope.listEmitter =response.data;
               }); 
    
              $scope.setearA = function() {$scope.letraInicial = 'a';};
              $scope.setearB = function() {$scope.letraInicial = 'b';};
              $scope.setearC = function() {$scope.letraInicial = 'c';};
              $scope.setearD = function() {$scope.letraInicial = 'd';};
              $scope.setearE = function() {$scope.letraInicial = 'e';};
              $scope.setearF = function() {$scope.letraInicial = 'f';};
              $scope.setearG = function() {$scope.letraInicial = 'g';};
              $scope.setearH = function() {$scope.letraInicial = 'h';};
              $scope.setearI = function() {$scope.letraInicial = 'i';};
              $scope.setearJ = function() {$scope.letraInicial = 'j';};
              $scope.setearK = function() {$scope.letraInicial = 'k';};
              $scope.setearL = function() {$scope.letraInicial = 'l';};
              $scope.setearM = function() {$scope.letraInicial = 'm';};
              $scope.setearN = function() {$scope.letraInicial = 'n';};
              $scope.setearO = function() {$scope.letraInicial = 'o';};
              $scope.setearP = function() {$scope.letraInicial = 'p';};
              $scope.setearQ = function() {$scope.letraInicial = 'q';};
              $scope.setearR = function() {$scope.letraInicial = 'r';};
              $scope.setearS = function() {$scope.letraInicial = 's';};
              $scope.setearT = function() {$scope.letraInicial = 't';};
              $scope.setearU = function() {$scope.letraInicial = 'u';};
              $scope.setearV = function() {$scope.letraInicial = 'v';};
              $scope.setearW = function() {$scope.letraInicial = 'w';};
              $scope.setearX = function() {$scope.letraInicial = 'x';};
              $scope.setearY = function() {$scope.letraInicial = 'y';};
              $scope.setearZ = function() {$scope.letraInicial = 'z';};
              $scope.setearALL = function() {$scope.letraInicial = '';};




              $scope.startsWith = function (actual, expected) {
                    var lowerStr = (actual + "").toLowerCase();
                     return lowerStr.indexOf(expected.toLowerCase()) === 0;
              };

               $scope.loadPage = function() {
                    var user = Restangular.all('customer/list');
                    user.getList().then(function(response){
                              $scope.listCustomer=response.data;
                    });
               };

               $scope.save = function() {
                    $scope.client.identificationEmitter = $scope.emitterSelected.identification;
                    $scope.client.identificationTypeCode = $scope.identificationTypeSelected.codigo;                            
                    Restangular.all('customer').post($scope.client).then(
                          function(response) {
                                      console.log(response.data);
                                      $scope.loadPage();
                                      $scope.clear();
                          }, 
                          function(response) {
                                      console.log(response.data);
                          });
               };

               $scope.openModalDelete = function(customer) {
                                    $scope.items = [customer];
                                    var modalInstance = $modal.open({
                                                  templateUrl: 'DelModalContent.html',
                                                  controller: 'DelModalInstanceCtrl',
                                                  resolve: { items: function () { return $scope.items; } }
                                    });
                                    modalInstance.result.then(
                                                  function () {
                                                        Restangular.one('customer').remove({identification:$scope.items[0].identification, 
                                                                                 identificationEmitter:$scope.items[0].identificationEmitter}).then(
                                                                                                  function(){ $scope.loadPage(); });
                                                  }, 
                                                  function () {}
                                    );
               };
                          
               $scope.inquiry = function(index) {
                                    $scope.inInquiry = true;
                                    $scope.inEdit = false;
                                    $scope.client = $scope.listCustomer[index];
                                    $scope.identificationTypeSelected = $scope.getIdType($scope.listCustomer[index].identificationTypeCode);
                                    $scope.emitterSelected=$scope.getEmitter($scope.listCustomer[index].identificationEmitter);
               };

               $scope.getIdType=function(idType) {
                                var type = {};
                                angular.forEach($scope.listIdTypes, function(item) {
                                            if (item.codigo === idType) { type= item; }
                                });
                                return type;
               };

               $scope.getEmitter=function(id) {
                                var emit = {};
                                angular.forEach($scope.listEmitter, function(item) {
                                          if (item.identification === id) { emit=item; }
                                });
                                return emit;
               }; 

               $scope.isEmpty = function(val) {
                                return angular.isUndefined(val) || val === null || val === '';
               };
}]);


sisAdminApp.controller('CustomerPaginationCtrl', ['$scope',function ($scope) {
  $scope.$watch('listCustomer', function (newValue) {
    if (newValue) {
      $scope.totalItems = $scope.listCustomer.length;
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






