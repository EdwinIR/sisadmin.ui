

// create a module to make it easier to include in the app module
angular.module('rcForm', []).directive(rcSubmitDirective);

var sisAdminApp = angular.module('SisAdminApp', ['ngResource', 'ngRoute', 'ngAnimate', 'ngSanitize',
    'ngTouch', 'ui.bootstrap', 'restangular', 'angularFileUpload', 'udpCaptcha', 'rcForm'
]);

sisAdminApp.controller('varEmpresa', ['$scope', function($scope) {

    $scope.nombreEmpresa = 'Empresa';

    this.setLetters = function(from, to) {
        this.fromLetter = from;
        this.toLetter = to;
    };


}])


sisAdminApp.filter('startsWithLetter', function() {
    return function(items, fromLetter, toLetter) {
        var filtered = [];
        if (items != null) {
            for (var i = 0; i < items.length; i++) {
                var item = items[i];
                var firstLetter = item.name.substring(0, 1).toLowerCase();
                if ((!fromLetter || firstLetter >= fromLetter) &&
                    (!toLetter || firstLetter <= toLetter)) {
                    filtered.push(item);
                }
            }
        }

        return filtered;
    };
});


/*var customDirectives = angular.module('customDirectives', []);
sisAdminApp.directive('customTabs', function () {
        return {
        restrict: 'A',
        template: '\
            <ul class="nav nav-tabs">\
              <li class="active"><a href="#{{contentBaseId}}-1" data-toggle="tab">Tab 1</a></li>\
              <li><a href="" data-toggle="tab">Tab 2</a></li>\
              <li><a href="#{{contentBaseId}}-3" data-toggle="tab">Tab 3</a></li>\
              <li><a href="#{{contentBaseId}}-4" data-toggle="tab">Tab 4</a></li>\
            </ul>\
            <div class="tab-content">\
              <div class="tab-pane active" id="{{contentBaseId}}-1">Tab 1 sample content</div>\
              <div class="tab-pane" id="tab-2">Tab 2 sample content</div>\
              <div class="tab-pane" id="{{contentBaseId}}-3">Tab 3 sample content</div>\
              <div class="tab-pane" id="{{contentBaseId}}-4">Tab 4 sample content</div>\
            </div>',
        link: function(scope, el, attrs){
            scope.contentBaseId = attrs.tabsBaseId;
        }
    };
});
angular.module('CustomComponents', ['customDirectives']);*/


sisAdminApp.directive('tabs', function() {
    return {
        restrict: 'E',
        transclude: true,
        scope: {},
        controller: ["$scope", function($scope) {
            var panes = $scope.panes = [];

            $scope.select = function(pane) {
                angular.forEach(panes, function(pane) {
                    pane.selected = false;
                });
                pane.selected = true;
            }

            this.addPane = function(pane) {
                if (panes.length == 0) $scope.select(pane);
                panes.push(pane);
            }
        }],
        template: '<div class="tabbable">' +
            '<ul class="nav nav-tabs">' +
            '<li ng-repeat="pane in panes" ng-class="{active:pane.selected}">' +
            '<a href="" ng-click="select(pane)">{{pane.title}}</a>' +
            '</li>' +
            '</ul>' +
            '<div class="tab-content" ng-transclude></div>' +
            '</div>',
        replace: true
    };
})




sisAdminApp.directive('pane', function() {
    return {
        require: '^tabs',
        restrict: 'E',
        transclude: true,
        scope: {
            title: '@'
        },
        link: function(scope, element, attrs, tabsCtrl) {
            tabsCtrl.addPane(scope);
        },
        template: '<div class="tab-pane" ng-class="{active: selected}" ng-transclude>' +
            '</div>',
        replace: true
    };
})









var interceptor = function($q, $location, $window) {
    return {
        request: function(config) {
            console.log('antes de enviar modif');
            config.headers['Authorization'] = $window.sessionStorage.token;
            return config;
        },
        responseError: function(rejection) {
            console.log('Failed with', rejection.status, 'status');
            console.log($location.url());
            console.log($location.path());
            if (rejection.status == 501 || rejection.status == 401) {
                var urlPattern = new RegExp('cliente');
                if (urlPattern.test($location.path())) {
                    $location.path("/cliente/login");
                } else {
                    $location.path("/login");
                }
            }
            return $q.reject(rejection);
        }
    }
};

sisAdminApp.config(['$routeProvider', '$locationProvider', '$httpProvider',
    function($routeProvider, $locationProvider, $httpProvider) {
        $routeProvider
        /**.when('/cliente/login', { templateUrl: 'views/cliente_login.html', controller: 'ClienteLoginCtrl' })
        .when('/cliente/principal', { templateUrl: 'views/cliente_menu.html', controller: 'ClientePrincipalCtrl'})
        .when('/consulta/publico', { templateUrl: 'views/consulta_publica.html', controller: 'DocumentClientCtrl' })
        .when('/empresa/login', { templateUrl: 'views/emisor_login.html', controller: 'EmpresaLoginCtrl' })
        .when('/empresa/principal', { templateUrl: 'views/emisor_menu.html', controller: 'EmpresaPrincipalCtrl' })
        .when('/db', { templateUrl: 'views/db.html', controller: 'DBCtrl' })
        .when('/intro', { templateUrl: 'views/intro.html', controller: 'introCtrl' })
        .when('/intro_usuario', { templateUrl: 'views/intro_usuario.html', controller: 'introCtrl' })**/

        /* .when('/familias', { templateUrl: 'views/sa_familia.html', controller: 'SaFamiliasCtrl' })*/
            // .when('/clientes', {
            //     templateUrl: 'views/sa_cliente.html',
            //     controller: 'ClientesCtrl'
            // })
            // .when('/db', {
            //     templateUrl: 'views/db.html',
            //     controller: 'DBCtrl'
            // })
            .when('/home', {
                templateUrl: 'views/sa_menu.html',
                controller: 'SaMenuCtrl'
            })
            .when('/login', {
                templateUrl: 'views/sa_login.html',
                controller: 'SaLoginCtrl'
            })
            // .when('/', {
            //     templateUrl: 'views/pub.html',
            //     controller: 'DocumentClientCtrl'
            // })
            .otherwise({
                redirectTo: '/'
            });

        $locationProvider.html5Mode(false);
        $httpProvider.interceptors.push(interceptor);
    }
]);

sisAdminApp.config(['RestangularProvider',
    function(RestangularProvider) {
        RestangularProvider.setBaseUrl('http://localhost:8080/sisadmin.restapi/api/v1');
        RestangularProvider.setFullResponse(true);
        RestangularProvider.setDefaultHeaders({
            'Content-Type': 'application/json'
        });
    }
]);


//manejo global entre controllers de datos de login
sisAdminApp.factory('LoginFactory', ['$window', '$location', 'Restangular',
    function($window, $location, Restangular) {
        return {
            setUserId: function(userId) {
                $window.sessionStorage.user = userId;
            },
            getUserId: function() {
                return $window.sessionStorage.user;
            },
            setUserName: function(userName) {
                $window.sessionStorage.name = userName;
            },
            getUserName: function() {
                return $window.sessionStorage.name;
            },
            setUserType: function(userType) {
                $window.sessionStorage.type = userType;
            },
            getUserType: function() {
                return $window.sessionStorage.type;
            },
            setUserRole: function(userRole) {
                $window.sessionStorage.role = userRole;
            },
            getUserRole: function() {
                return $window.sessionStorage.role;
            },
            setCustomerId: function(customerId) {
                $window.sessionStorage.customerId = customerId;
            },
            getCustomerId: function() {
                return $window.sessionStorage.customerId;
            },
            setAlmacenId: function(almacenId) {
                $window.sessionStorage.almacenId = almacenId;
            },
            getAlmacenId: function() {
                return $window.sessionStorage.almacenId;
            },

            //setCompanyId : function(companyId) { $window.sessionStorage.companyId = companyId; },
            //getCompanyId : function() { return $window.sessionStorage.companyId; },
            logout: function() {
                delete $window.sessionStorage.token;
                delete $window.sessionStorage.user;
                delete $window.sessionStorage.name;
                delete $window.sessionStorage.type;
                delete $window.sessionStorage.role;
                Restangular.setDefaultHeaders({
                    'Authorization': ''
                });
                var urlPattern = new RegExp('cliente');
                if (urlPattern.test($location.path())) {
                    $location.path("/cliente/login");
                } else {
                    $location.path("/login");
                }
            }
        }
    }
]);


sisAdminApp.filter('offset', function() {
    return function(input, start) {
        start = parseInt(start, 10);

        if (input == null) {return null;}
        else { return input.slice(start);}

    };
});



sisAdminApp.controller('introCtrl', ['$scope', 'LoginFactory', 'Restangular', '$window', '$timeout', '$modal', '$location',
    function($scope, LoginFactory, Restangular, $window, $timeout, $modal, $location) {
        $scope.buscar = function() {
            $location.path("/consulta/publico");
        }

        $scope.loginCliente = function() {
            $location.path("/cliente/login");
        }

        $scope.loginUsuario = function() {
            $location.path("/empresa/login");
        }

    }
]);
