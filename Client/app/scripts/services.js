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

.factory('loginFactory', ['$resource', '$http', 'baseURL',  function($resource, $http,  baseURL){
      
       return $resource(baseURL + "users/login", null, {
            'update': {
                method: 'PUT'
            }
        });
}])

.factory('registerFactory', ['$resource', '$http', 'baseURL',  function($resource, $http,  baseURL){
      
       return $resource(baseURL + "users/signup", null, {
            'update': {
                method: 'PUT'
            }
        });
}])


.factory('AuthFactory', ['$resource', '$http', '$localStorage', '$rootScope','$window', 'baseURL', function($resource, $http, $localStorage, $rootScope, $window, baseURL){

    var authFac = {},
        TOKEN_KEY = 'Token',
        isAuthenticated = false,
        username = '',
        userid = '',
        authToken = null;

    function useCredentials(credentials) {
        isAuthenticated = true;
        username = credentials.username;
        authToken = credentials.token;
        userid = credentials.userid;

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
    userid = '';
    isAuthenticated = false;
    $http.defaults.headers.common['x-access-token'] = authToken;
    $localStorage.remove(TOKEN_KEY);
      $rootScope.$broadcast('logout:Successful');
      console.log('Token removed. destroyUserCredentials');
  }

    authFac.login = function(loginData) {
        console.log('loginData:: ' + loginData);
        //resource end point on rest api server!!
        $resource(baseURL + "users/login").save(loginData,
           function(response) {
              storeUserCredentials({username:loginData.username, token: response.token, userid: response.userid});
              $rootScope.$broadcast('login:Successful');
              return;
           },
           function(response){
              console.log("error response %s ", response);
              isAuthenticated = false;
           }
        );
    }; 
 

    authFac.logout = function() {

        $resource(baseURL + "users/logout").get(function(response){
            console.log("Logged out %s", response);
            //$rootScope.$broadcast('logout:Successful');
        });
        destroyUserCredentials();

    };

    authFac.register = function(registerData) {
        console.log('Registering.. %s', registerData);
        $resource(baseURL + "users/signup")
        .save(registerData,
           function(response) {
              console.log("%s", response);
              authFac.login({username:registerData.username, password:registerData.password});
            if (registerData.rememberMe) {
                $localStorage.storeObject('userinfo',
                    {username:registerData.username, password:registerData.password});
            }

              $rootScope.$broadcast('registration:Successful');
           },
           function(response){
             console.log("response %s", response);
                //ngDialog.openConfirm({ template: message, plain: 'true'});

           }

        );
    };
    
    authFac.storeCredentials = function(credentials) {
      $localStorage.storeObject(TOKEN_KEY, credentials);
      useCredentials(credentials);
    };

    authFac.getAuthenticated = function() {
        return this.isAuthenticated;
    };

    authFac.getUsername = function() {
        return username;
    };

    authFac.getUserId = function() {
        return userid;
    };

    authFac.setAuthenticated = function(value) {
        this.isAuthenticated = value;
    };

    loadUserCredentials();

    return authFac;

}])
;
