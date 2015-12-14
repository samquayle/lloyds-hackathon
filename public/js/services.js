angular.module('cars.services', [])

  .factory('carservice', function($http) {
    return {
      get : function(id) {
        return $http.get('/api/cars/' + id);
      },
      getAll : function() {
        return $http.get('/api/cars');
      },
      create : function(carData) {
        return $http.post('/api/cars', carData);
      },
      update : function(id, carData) {
        return $http.put('/api/cars/'+ id, carData);
      },
      delete : function(id) {
        return $http.delete('/api/cars/' + id);
      }
    }
  })

  .factory('AuthenticationService', function($http) {
    return {
      login : function(credentials) {
        return $http.post('/login', credentials);
      },
      logout : function() {
        return $http.post('/logout');
      },
      createUser : function(credentials) {
        return $http.post('/register', credentials);
      }
    }
  });

