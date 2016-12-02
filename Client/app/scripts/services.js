/*jslint node: true */
/*jslint white:true */
/*global angular */
// Fetching data from server - localhost which is the json server now
'use strict';

angular
.module('dinnerApp')
.constant("baseURL","http://localhost:3000/") // <- to connect to json or mongodb non secure
//.constant("baseURL","https://localhost:3443/") //<- to connect to rest and mongodb
.factory('dishFactory', ['$resource', 'baseURL', function ($resource, baseURL) {
        return $resource(baseURL + "dishes/:id", {id:"@Id"}, {
            'update': {
                method: 'PUT'
            }
        });
}])

.factory('menuFactory', ['$resource', 'baseURL', function($resource,baseURL){
     return $resource(baseURL+"menu/:id", {id:"@Id"}, {
         'update': {
             method:'PUT'
         },
          'query':  {method:'GET', isArray:true}
     });


}])

.factory('orderFactory', ['$resource', 'baseURL', function($resource,baseURL){
    return $resource(baseURL+"orders/:id", {id:"@Id"}, {
         'update': {
             method:'PUT'
         },
          'query':  {method:'GET', isArray:true}
     });
}])
.service('favouriteFactory', ['$resource', 'baseURL', function($resource,baseURL){
        this.getFavourites = function(){
                            return $resource(baseURL+"favourites/:id",null,  {'update':{method:'PUT' }});
                        };
        this.saveDish = function() {
             return $resource(baseURL+"favourites/:id", null,  {'update':{method:'POST' }});
         };

         this.removeItem = function() {
             return $resource(baseURL+"favourites/:id", null,  {'delete':{method:'DELETE' }});
         };
}])
.service('custorderFactory', ['$resource', 'baseURL', function($resource,baseURL){
    this.getOrders = function(){
                            return $resource(baseURL+"orders/:id",null,  {'update':{method:'PUT' }});
                        };
      this.saveOrder = function(){
                            return $resource(baseURL+"order/:id",null,  {'update':{method:'POST' }});
                        };
}])
.factory('$localStorage', ['$window', function ($window) {
    return {
        store: function (key, value) {
            $window.localStorage[key] = value;
        },
        get: function (key, defaultValue) {
            return $window.localStorage[key] || defaultValue;
        },
        remove: function (key) {
            $window.localStorage.removeItem(key);
        },
        storeObject: function (key, value) {
            $window.localStorage[key] = JSON.stringify(value);
        },
        getObject: function (key, defaultValue) {
            return JSON.parse($window.localStorage[key] || defaultValue);
        }
    };
}])

.factory('AuthFactory', ['$resource', '$http', '$localStorage', '$rootScope', '$window', 'baseURL', function($resource, $http, $localStorage, $rootScope, $window, baseURL){

    var authFac = {},
        TOKEN_KEY = 'Token',
        isAuthenticated = false,
        username = '',
        isChef = false,
        authToken = null;

    function useCredentials(credentials) {
        isAuthenticated = true;
        username = credentials.username;
        authToken = credentials.token;

        // Set the token as header for your requests!
        $http.defaults.headers.common['x-access-token'] = authToken;
      }

      function loadUserCredentials() {
        var credentials = $localStorage.getObject(TOKEN_KEY,'{}');
        if (credentials.username !== undefined) {
          useCredentials(credentials);
        }
      }

      function storeUserCredentials(credentials) {
        $localStorage.storeObject(TOKEN_KEY, credentials);
        useCredentials(credentials);
      }



  function destroyUserCredentials() {
    authToken = undefined;
    username = '';
    isAuthenticated = false;
    $http.defaults.headers.common['x-access-token'] = authToken;
    $localStorage.remove(TOKEN_KEY);
  }

    authFac.login = function(loginData) {
        console.log('loginData:: ' + loginData);
        $resource(baseURL + "users/login") //resource end point on rest api server!!
        .save(loginData,
           function(response) {

              storeUserCredentials({username:loginData.username, token: response.token});
              $rootScope.$broadcast('login:Successful');
           },
           function(response){
              isAuthenticated = false;
           }
        );
    };

    authFac.logout = function() {
        $resource(baseURL + "users/logout").get(function(response){
        });
        destroyUserCredentials();
    };

    authFac.register = function(registerData) {

        $resource(baseURL + "users/register")
        .save(registerData,
           function(response) {
              authFac.login({username:registerData.username, password:registerData.password});
            if (registerData.rememberMe) {
                $localStorage.storeObject('userinfo',
                    {username:registerData.username, password:registerData.password});
            }

              $rootScope.$broadcast('registration:Successful');
           },
           function(response){
                //ngDialog.openConfirm({ template: message, plain: 'true'});

           }

        );
    };

    authFac.isAuthenticated = function() {
        return isAuthenticated;
    };

    authFac.getUsername = function() {
        return username;
    };

    loadUserCredentials();

    return authFac;

}])
;
