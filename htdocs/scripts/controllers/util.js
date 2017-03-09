sisAdminApp.controller('PaginationCtrl', 
      ['$scope',function ($scope) {
            $scope.$watch('listDocuments', function (newValue) {
              if (newValue) {
                $scope.totalItems = $scope.listDocuments.length;
                $scope.currentPage = 1;
              }
            });
            $scope.currentPage = 1;
            $scope.itemsPerPage= 10;
            $scope.maxSize = 10;
            $scope.setPage = function (pageNo) {
              $scope.currentPage = pageNo;
            };
}]);



//se extrae por manejar distinto scope vs el scope del include
sisAdminApp.controller('DatePickerController', ['$scope',function ($scope) {

//inicializando fecha actual
  $scope.today = function() {

  $scope.filter.fechaEnvioFactura = new Date();
  $scope.filter.fechaResumenEmision = new Date();
  $scope.filter.fechaResumenGeneracion = new Date();
  $scope.filter.fechaTicket = new Date();
  };

    $scope.today();

    var fechaFinal = new Date();
    var fechaInicial = new Date();
    $scope.minDate = fechaInicial.setDate(fechaInicial.getDate() - 7);
    $scope.maxDate = new Date();

    /*$scope.$watch('filter.fechaEnvioFactura', function(v){
     $scope.minDate = v;
     $scope.maxDate = v;
  });*/



  //parametros para manejo de fecha
    $scope.dateParamFormat = 'dd/MM/yyyy';
    $scope.dateParamOptions = {
      formatYear: 'yyyy',
      startingDay: 1
    };

    //fechai inicial
    $scope.openBeginDate = function($event) {
      $event.preventDefault();
      $event.stopPropagation();
      $scope.openedBeginDate = true;
    };

    $scope.openedBeginDate = false;

    //fecha final
    $scope.openEndDate = function($event) {
      $event.preventDefault();
      $event.stopPropagation();
      $scope.openedEndDate = true;
    };
    $scope.openedEndDate = false;
}]);


sisAdminApp.controller('DelModalInstanceCtrl',
      ['$scope','$modalInstance','items',
      function ($scope, $modalInstance, items) {
              $scope.items = items;
              $scope.ok = function () {
                $modalInstance.close();
              };

              $scope.cancel = function () {
                $modalInstance.dismiss('cancel');
              };

}]);


sisAdminApp.controller('DesAnularModalInstanceCtrl',
      ['$scope','$modalInstance','items',
      function ($scope, $modalInstance, items) {
              $scope.items = items;
              $scope.ok = function () {
                $modalInstance.close();
              };

              $scope.cancel = function () {
                $modalInstance.dismiss('cancel');
              };

}]);

sisAdminApp.controller('DesBajarModalInstanceCtrl',
      ['$scope','$modalInstance','items',
      function ($scope, $modalInstance, items) {
              $scope.items = items;
              $scope.ok = function () {
                $modalInstance.close();
              };

              $scope.cancel = function () {
                $modalInstance.dismiss('cancel');
              };

}]);




sisAdminApp.controller('RemModalInstanceCtrl',
      ['$scope','$modalInstance','items',
      function ($scope, $modalInstance, items) {
              $scope.items = items;
              $scope.ok = function () {
                $modalInstance.close();
              };

              $scope.cancel = function () {
                $modalInstance.dismiss('cancel');
              };

}]);



sisAdminApp.controller('EnvModalInstanceCtrl',
      ['$scope','$modalInstance','items',
      function ($scope, $modalInstance, items) {
              $scope.items = items;
              $scope.ok = function () {
                $modalInstance.close();
              };

              $scope.cancel = function () {
                $modalInstance.dismiss('cancel');
              };

}]);

sisAdminApp.controller('EnvResumenConfirmCtrl',
      ['$scope','$modalInstance','items',
      function ($scope, $modalInstance, items) {
              $scope.items = items;
              $scope.ok = function () {
                $modalInstance.close();
              };

              $scope.cancel = function () {
                $modalInstance.dismiss('cancel');
              };

}]);






sisAdminApp.controller('BajaModalInstanceCtrl',
      ['$scope','$modalInstance','items',
      function ($scope, $modalInstance, items) {
              $scope.items = items;
              $scope.ok = function () {
                $modalInstance.close();
              };

              $scope.cancel = function () {
                $modalInstance.dismiss('cancel');
              };

}]);



sisAdminApp.controller('AddModalInstanceCtrl',
      ['$scope','$modalInstance','items',
      function ($scope, $modalInstance, items) {
              $scope.items = items;
              $scope.ok = function () {
                $modalInstance.close();
              };

              $scope.cancel = function () {
                $modalInstance.dismiss('cancel');
              };

}]);

sisAdminApp.controller('ModalUploadCtrl',
      ['$scope','$modalInstance','items',
      function ($scope, $modalInstance, items) {
              $scope.items = items;
              $scope.ok = function () {
                $modalInstance.close();
              };

              $scope.cancel = function () {
                $modalInstance.dismiss('cancel');
              };

}]);

sisAdminApp.controller('ModalDetailsCtrl',
      ['$scope','$modalInstance','items',
      function ($scope, $modalInstance, items) {
              $scope.items = items;
              $scope.ok = function () {
                $modalInstance.close();
              };

              $scope.cancel = function () {
                $modalInstance.dismiss('cancel');
              };

}]);

sisAdminApp.controller('ModalFacturaProcesadaCtrl',
      ['$scope','$modalInstance','items',
      function ($scope, $modalInstance, items) {
              $scope.items = items;
              $scope.ok = function () {
                $modalInstance.close();

              };

              $scope.cancel = function () {
                $modalInstance.dismiss('cancel');
              };

}]);

sisAdminApp.controller('ModalResumenCtrl',
      ['$scope','$modalInstance','items',
      function ($scope, $modalInstance, items) {
              $scope.items = items;
              $scope.ok = function () {
                $modalInstance.close();

              };

              $scope.cancel = function () {
                $modalInstance.dismiss('cancel');
              };

}]);


sisAdminApp.controller('ConfirmationModalCtrl',
	      ['$scope','$modalInstance','items',
	      function ($scope, $modalInstance, items) {
	              $scope.items = items;
	              $scope.ok = function () {
	                $modalInstance.close();
	              };
	}]);


sisAdminApp.controller('ModalInstanceCtrl',
      ['$scope','$modalInstance','items', 'Restangular',
      function ($scope,$modalInstance,items, Restangular) {
              $scope.items = items;

              $scope.ok = function () {

                Restangular.one('document/send').get({fileName:$scope.items[0],
                                                      emails:$scope.listEmails,
                                                      legalNumber:$scope.items[1],
                                                      customerName:$scope.items[2] });

                  $modalInstance.close();

              };
              $scope.cancel = function () {
                  $modalInstance.dismiss('cancel');
              };
}]);

sisAdminApp.controller('NotaModalCtrl',
      ['$scope','$modalInstance','items','Restangular',
      function ($scope, $modalInstance, items, Restangular) {
              $scope.items = items;

              $scope.ok = function () {
                Restangular.one('document/asociadocumento').get({ documentoModificado:$scope.documentoModificado,
                                                                  tipoDocumento:$scope.items[0],
                                                                  numeroLegal:$scope.items[1],
                                                                  filename : $scope.items[2]
                                                               }).then(function(response) {

                                                               });

              $modalInstance.close();


              };

              $scope.cancel = function () {
                $modalInstance.dismiss('cancel');
              };

}]);

sisAdminApp.controller('ModalReprocesoCtrl',
      ['$scope','$modalInstance','items',
      function ($scope, $modalInstance, items) {
                $scope.items = items;
                $scope.ok = function () {
                $modalInstance.close();

              };

}]);



sisAdminApp.controller('RepModalInstanceCtrl',
      ['$scope','$modalInstance','items', 'Restangular',
      function ($scope,$modalInstance,items, Restangular) {
              $scope.items = items;
              $scope.ok = function () {
                Restangular.one('document/rew').get({id:$scope.items[0]});
                $modalInstance.close("sent");
              };

              $scope.cancel = function () {
                $modalInstance.dismiss('cancel');
              };
}]);

sisAdminApp.directive('formAutofillFix', function() {
  return function(scope, elem, attrs) {
    // Fixes Chrome bug: https://groups.google.com/forum/#!topic/angular/6NlucSskQjY
    elem.prop('method', 'POST');

    // Fix autofill issues where Angular doesn't know about autofilled inputs
    if(attrs.ngSubmit) {
      setTimeout(function() {
        elem.unbind('submit').submit(function(e) {
          e.preventDefault();
          elem.find('input, textarea, select').trigger('input').trigger('change').trigger('keydown');
          scope.$apply(attrs.ngSubmit);
        });
      }, 0);
    }
  };
});


sisAdminApp.directive('autoFillSync', function($timeout) {
   return {
      require: 'ngModel',
      link: function(scope, elem, attrs, ngModel) {
          var origVal = elem.val();
          $timeout(function () {
              var newVal = elem.val();
              if(ngModel.$pristine && origVal !== newVal) {
                  ngModel.$setViewValue(newVal);
              }
          }, 500);
      }
   }
})

//***FUNCIONES DE CADENA***/
sisAdminApp.filter('substring', function() {
  return function(str, start, end) {
    return str.substring(start, end);
  };
})

sisAdminApp.filter('split', function() {
        return function(input, splitChar, splitIndex) {
            // do some bounds checking here to ensure it has that index
            return input.split(splitChar)[splitIndex];
        }
    });


sisAdminApp.filter('breakline', ['$sce', function ($sce) {
        return function (text) {
        return text ? $sce.trustAsHtml(text.replace(/\n/g, '<br/>')) : '';
        };
}]);
/*
<p ng-bind-html="{{items}} | breakline"></p>
*/
sisAdminApp.filter('strong', ['$sce', function ($sce) {
        return function (text) {
        return text ? $sce.trustAsHtml(text.replace(/\n/g, '<strong>')) : '';
        };
}]);

sisAdminApp.directive('capitalize', function() {
   return {
     require: 'ngModel',
     link: function(scope, element, attrs, modelCtrl) {
        var capitalize = function(inputValue) {
           if(inputValue == undefined) inputValue = '';
           var capitalized = inputValue.toUpperCase();
           if(capitalized !== inputValue) {
              modelCtrl.$setViewValue(capitalized);
              modelCtrl.$render();
            }
            return capitalized;
         }
         modelCtrl.$parsers.push(capitalize);
         capitalize(scope[attrs.ngModel]);  // capitalize initial value
     }
   };
});

/**
sisAdminApp.controller('CliModalInstanceCtrl', ['$scope','$modalInstance','items', 'Restangular', 'LoginFactory','alerts',function ($scope,$modalInstance,items, Restangular, LoginFactory,alerts) {
  $scope.items = items;
  $scope.alerts = alerts;
  //seteo correo por defecto = del usuario.
  var params = {
    id : LoginFactory.getUserId(),
    type : LoginFactory.getUserType()
  };
  Restangular.one('user').get(params).then(function(resp) {
    $scope.listEmails = resp.data.email;
  });


  $scope.ok = function () {
    Restangular.one('document/send').get({id:$scope.items[0],emails:$scope.listEmails}).then(function(resp) {
      $scope.alerts.push({type : "success" , msg: 'Correo enviado correctamente!.'});
      $modalInstance.close("sent");
    },
    function(resp) {
      $scope.alerts.push({type : "danger" , msg: 'Error al enviar correo.'});
      $modalInstance.close("sent");
    });
  };

  $scope.cancel = function () {
    $modalInstance.dismiss('cancel');
  };

}]);


sisAdminApp.controller('DropDownCtrl', ['$scope',function ($scope) {
  $scope.status = {
    isopen: false
  };

  $scope.toggleDropdown = function($event) {
    $event.preventDefault();
    $event.stopPropagation();
    $scope.status.isopen = !$scope.status.isopen;
  };
}]);

sisAdminApp.controller('PaginationCtrl', ['$scope',function ($scope) {
  $scope.$watch('listDocuments', function (newValue) {
    if (newValue) {
      $scope.totalItems = $scope.listDocuments.length;
      $scope.currentPage = 1;
    }
  });
  $scope.currentPage = 1;
  $scope.itemsPerPage=10;
  $scope.setPage = function (pageNo) {
    $scope.currentPage = pageNo;
  };
}]);
**/
