angular.module('cars.controllers', [])

  .controller('listCtrl', ['$scope', '$http', '$state', '$stateParams', 'carservice',
    function($scope, $http, $state, $stateParams, carservice) {

    $scope.formData = {};

    carservice.getAll()
      .success(function(data) {
        $scope.cars = data;
      });

    $scope.deletecar = function(id) {
      console.log(id)
      carservice.delete(id)
        .success(function(data) {
          $scope.cars = data;
        });
    };

  }])

  .controller('editCtrl', ['$scope', '$http', '$stateParams', '$state', 'carservice',
    function($scope, $http, $stateParams, $state, carservice) {

    var carID = $stateParams.id;

    console.log($stateParams.id);

    $scope.view = 'edit';
    $scope.formData = {};

    carservice.get(carID)
      .success(function(data) {
        $scope.formData = data;
      });

    $scope.updatecar = function() {
      carservice.update(id, $scope.formData)
        .success(function(data) {
          $scope.formData = {};
          $scope.cars = data;
          $state.go('home');
        });
    };

    $scope.deletecar = function() {
      carservice.delete(id)
        .success(function(data) {
          $scope.cars = data;
          $state.go('home');
        });
    };

  }])

  .controller('addCtrl', ['$scope', '$http', '$state', 'carservice',
    function($scope, $http, $state, carservice) {

    $scope.view = 'add';

    $scope.createcar = function() {
      console.log($scope.formData);
      if (!$.isEmptyObject($scope.formData)) {
        carservice.create($scope.formData)
          .success(function(data) {
            $scope.formData = {};
            $scope.cars = data;
            $state.go('home');
          });
      }
    };

  }])

  .controller('registerCtrl', ['$scope', '$http', '$state', 'AuthenticationService',
    function($scope, $http, $state, AuthenticationService) {

    $scope.formData = {};

    $scope.registerUser = function() {
      AuthenticationService.createUser($scope.formData)
      .success(function() {
        $state.go('login');
      });
    };
  }])

  .controller('loginCtrl', ['$scope', '$http', '$state', 'AuthenticationService',
    function($scope, $http, $state, AuthenticationService) {

    $scope.formData = {};

    $scope.login = function() {
      AuthenticationService.login($scope.formData)
        .success(function(user) {
          $state.go('home');
        })
        .error(function(){
          $state.go('login');
        });

    };

  }]);
