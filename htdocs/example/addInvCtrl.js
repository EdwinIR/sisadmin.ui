                                  'use strict';    


                                  sisAdminApp.controller('IngresoDocumentosCtrl', 
                                    ['$scope','Restangular','$modal',
                                    function ($scope,Restangular,$modal) {
                                    $scope.inInquiry = false;
                                    $scope.inEdit = false;
                                    $scope.document={};
                                    $scope.formVisibility = false;
                                    $scope.company={};
                                    $scope.customer={};
                                    $scope.currency={};



                                  $scope.details = []

                                    $scope.addRow = function(){   
                                      $scope.details.push({ 'item':$scope.item, 'productCode': $scope.productCode, 'description':$scope.description, 
                                      'quantity':$scope.quantity, 'price':$scope.price, 'taxIGVUnit':$scope.taxIGVUnit, 
                                      'total':$scope.total});
                                      $scope.item='';
                                      $scope.productCode='';
                                      $scope.description='';
                                      $scope.quantity='';
                                      $scope.price='';
                                      $scope.taxIGVUnit='';
                                      $scope.total='';

                                      };


                                    var rDocumentTypes = Restangular.all('combo/idtype/list');
                                      rDocumentTypes.getList().then(function(response){
                                      $scope.listIdTypes =response.data;
                                     });


                                    var rDocumentTypes = Restangular.all('combo/documenttype/list');
                                    rDocumentTypes.getList().then(function(response){
                                    $scope.listDocTypes =response.data;
                                    }); 

                                     //cambiamos customer de acuerdo a emisor
                                    $scope.$watch('company', function (newValue) {
                                    if (newValue) {
                                       var emitterIdentification = $scope.company.identification;

                                        if (!$scope.inInquiry && !$scope.inEdit) {
                                        Restangular.all('customer/list/emitter').getList({emitterId : emitterIdentification}).then(function(response){
                                        $scope.listCustomer =response.data;
                                      });
                                      }
                                      }
                                    });  

                                  
                                    $scope.loadPage=function(){
                                      $scope.document={};
                                      $scope.formVisibility = false;
                                      $scope.company={};
                                      $scope.customer={};
                                      $scope.currency={};
                                      $scope.documentTypeRelation={};
                                      $scope.details = [];
                                              //var emitters = Restangular.all('emitter/list');
                                              var emitters = Restangular.all('combo/emitter/list');
                                              emitters.getList().then(function(response) {
                                                                      $scope.listEmitter=response.data;
                                              
                                              });
                                     }


                                    
                                     $scope.save = function() {
                                     $scope.document.company = $scope.company.identification;
                                     $scope.document.customer = $scope.customer.identification;
                                     $scope.document.currency = $scope.currency.descripcion;
                                     $scope.document.documentTypeCode = "01"
                                     $scope.document.lDetailDocument = $scope.details;

                                     Restangular.all('document').post($scope.document).then(function(response) {
                                      console.log(response.data);
                                      $scope.formVisibility = false;
                                      $scope.loadPage();
                                      //$scope.clear();
                                     }, 
                                     function(response) {
                                      console.log(response.data);
                                      });
                                    };


                                     $scope.saveCreditNote = function() {
                                     $scope.document.company = $scope.company.identification;
                                     $scope.document.customer = $scope.customer.identification;
                                     $scope.document.currency = $scope.currency.descripcion;
                                     $scope.document.documentTypeCode = "07"
                                     $scope.document.documentRelation = $scope.documentTypeRelation.typeId;
                                     $scope.document.lDetailDocument = $scope.details;

                                     Restangular.all('document').post($scope.document).then(function(response) {
                                      console.log(response.data);
                                      $scope.formVisibility = false;
                                      $scope.loadPage();
                                      //$scope.clear();
                                     }, 
                                     function(response) {
                                      console.log(response.data);
                                      });
                                    }; 

                                    $scope.saveDebitNote = function() {
                                     $scope.document.company = $scope.company.identification;
                                     $scope.document.customer = $scope.customer.identification;
                                     $scope.document.currency = $scope.currency.descripcion;
                                     $scope.document.documentTypeCode = "08"
                                     $scope.document.documentRelation = $scope.documentTypeRelation.typeId;
                                     $scope.document.lDetailDocument = $scope.details;

                                     Restangular.all('document').post($scope.document).then(function(response) {
                                      console.log(response.data);
                                      $scope.formVisibility = false;
                                      $scope.loadPage();
                                      //$scope.clear();
                                     }, 
                                     function(response) {
                                      console.log(response.data);
                                      });
                                    }; 

                                    $scope.clear = function() {
                                    $scope.document = null;
                                    $scope.company=null;
                                    $scope.currency=null;
                                    $scope.customer=null;
                                    $scope.item=null;
                                    $scope.productCode=null;
                                    $scope.description=null;
                                    $scope.quantity=null;
                                    $scope.price=null;
                                    $scope.taxIGVUnit=null;
                                    $scope.total=null;
                                    $scope.inInquiry=false;
                                    $scope.inEdit=false;
                                   };
      


                                    $scope.ShowForm = function() {
                                      $scope.formVisibility = true;

                                      console.log($scope.formVisibility)
                                     } 
 

                                    $scope.getIdType=function(idType) {
                                        var type = {};
                                            angular.forEach($scope.listIdTypes, function(item) {
                                              if (item.descripcion === descripcion) { type= item; }
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
                                        

                                    $scope.geCurrencyType=function(idType) {
                                        var type = {};
                                            angular.forEach($scope.listIdCurrency, function(item) {
                                              if (item.codigo === idType) { type= item; }
                                             });
                                              return type;
                                         }; 


                                      $scope.getCustomer=function(id) {
                                      var type = {};
                                      angular.forEach($scope.listCustomer, function(item) {

                                          if (item.identification.trim() === id.trim()) {
                                            type=item;
                                          }
                                        });
                                        return type;
                                      }; 


                                      $scope.getTypeDocument=function(id) {
                                      var type = {};
                                      angular.forEach($scope.listDocTypes, function(item) {

                                          if (item.typeId.trim() === id.trim()) {
                                            type=item;
                                          }
                                        });
                                        return type;
                                      };                             

                                  
                          }]);    
