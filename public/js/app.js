angular.module('cars', ['ui.router','cars.controllers','cars.services'])

  .config(function($stateProvider, $urlRouterProvider, $locationProvider, $httpProvider) {

    var checkLoggedin = function($q, $timeout, $http, $location, $rootScope, $state){
      var deferred = $q.defer();

      $http.get('/loggedin').success(function(user){
        if (user !== '0') {
          $rootScope.message = 'You logged in son!';
          deferred.resolve();
        } else {
          $rootScope.message = 'You need to log in.';
          deferred.reject();
          $state.go('login');
        }
      });

      return deferred.promise;
    };


    $httpProvider.interceptors.push(function($q, $location, $rootScope) {
      return {
        response: function(response) {
          return response;
        },
        responseError: function(response) {
          if (response.status === 401) {
            $rootScope.message = 'Incorrect email or password';
            console.log('401 error');
          }
          return $q.reject(response);
        }
      };
    });


    $locationProvider.html5Mode({
      enabled: true,
      requireBase: false
    });

    $stateProvider
      .state('login', {
        url: '/',
        templateUrl: 'templates/login.html',
        controller: 'loginCtrl'
      })
      .state('register', {
        url: '/register',
        templateUrl: 'templates/register.html',
        controller: 'registerCtrl'
      })
      .state('home', {
        url: '/home',
        templateUrl: 'templates/list.html',
        controller: 'listCtrl',
        resolve: {
          loggedin: checkLoggedin
        }
      })
      .state('add', {
        url: '/add',
        templateUrl: 'templates/detail.html',
        controller: 'addCtrl',
        resolve: {
          loggedin: checkLoggedin
        }
      })
      .state('edit', {
        url: '/cars/:id',
        templateUrl: 'templates/detail.html',
        controller: 'editCtrl',
        resolve: {
          loggedin: checkLoggedin
        }
      });

    $urlRouterProvider.otherwise('/');

  })

  .run(function($rootScope, $state, AuthenticationService){
    $rootScope.message = '';

    // Logout function is available in any pages
    $rootScope.logout = function(){
      AuthenticationService.logout()
      .success(function() {
        $rootScope.message = 'Logged out.';
        $state.go('login');
      });

    };
  });

