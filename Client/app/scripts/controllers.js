/*jslint node: true */
/*jslint white:true */
/*global angular */
/*jslint nomen: true*/

'use strict';



angular
.module('dinnerApp')
.controller('DishController', ['$scope','dishFactory', 'menuFactory' , '$state', 'baseURL', 'AuthFactory', function($scope, dishFactory, menuFactory, $state, baseURL, AuthFactory) {
            $scope.showDishes = false;
            $scope.message = "Loading ...";
            $scope.imgURL = baseURL;
            //console.log('user id %s ', AuthFactory.getUserId());
            $scope.chefid = AuthFactory.getUserId();
    
            dishFactory.query(
                function(response) {
                    $scope.dishes = response;
                    //console.log(response);
                    $scope.showDishes = true;
                },
                function(response) {
                    $scope.message = "Error: "+response.status + " " + response.statusText;
                });

            $scope.addToMenu = function(chefid, dishid) {
                //console.log('Add to menu %s %s ', chefid, dishid);
                menuFactory.save({chef: chefid, _id: dishid});
                $state.go('app.todaysmenu',{},  {reload: true});

            };

}])
.controller('DishDetailController', ['$scope','$stateParams','dishFactory', 'menuFactory','$state', 'baseURL', function($scope, $stateParams, dishFactory, menuFactory, $state, baseURL) {
            $scope.orderByText = "";
            $scope.showFeedback = true;
            $scope.showAddFeedback = true;

            $scope.dish = {};
            $scope.showDish = false;
            $scope.message="Loading ...";
            $scope.stars = 5;
            $scope.imgURL = baseURL;

             dishFactory.get({id:$stateParams.id})
            .$promise.then(
                    function(response){
                        $scope.dish = response;
                        $scope.showDish = true;
                    },
                    function(response) {
                        $scope.message = "Error: "+response.status + " " + response.statusText;
                    }
            );


           $scope.toggleFeedback = function() {
                $scope.showFeedback = !$scope.showFeedback;
            };

            $scope.toggleAddFeedback = function() {
                $scope.showAddFeedback = !$scope.showAddFeedback;
            };

            $scope.dishIndex = 0;

           $scope.addToMenu = function(chefid, dishid) {
                console.log('Add to menu %s %s ', chefid, dishid);
                menuFactory.save({chef: chefid, _id: dishid});
                $state.go('app.todaysmenu',{}, {reload: true});
            };
}])

.controller('EditDishController', ['$scope','$timeout','$stateParams','$window', 'dishFactory', 'Upload', 'baseURL', function($scope, $timeout, $stateParams, $window, dishFactory, Upload, baseURL) {
            $scope.orderByText = "";
            $scope.showFeedback = true;
            $scope.showAddFeedback = true;

            $scope.showDish = false;
            $scope.message="Loading ...";
            $scope.imgURL = baseURL;

            $scope.dish = {};

            dishFactory.get({id:$stateParams.id})
            .$promise.then(
                    function(response){
                        $scope.dish = response;
                        $scope.dish.image = $scope.imgURL + $scope.dish.image;
                        $scope.showDish = true;
                    },
                    function(response) {
                        $scope.message = "Error: "+response.status + " " + response.statusText;
                    }
            );

            $scope.editDish = function(file) {
                 console.log('first image :: ' + $scope.dish.image.name);
                 if ($scope.dish.image.name === undefined) {
                     console.log('image not changed' + $scope.dish.image);
                     $scope.dish.image = $scope.dish.image.substring($scope.imgURL.length);
                     dishFactory.update({id:$scope.dish._id}, $scope.dish);
                     $window.location.reload();
                 }
                 else {
                     //$scope.dish.image = 'assets/img/dishes/' + $scope.dish.image.name;
                     file.upload = Upload.upload({
                      url: 'http://localhost:3000/dishes/upload',
                      data: {file: file}
                    });
                    file.upload.then(function (response) {
                      $timeout(function () {
                        file.result = response.data;
                        console.log('Success ' + response.status + ' : ' + response.data + ' : ' + response.data.filename);
                        $scope.dish.image = 'uploads/dishes/' + response.data.filename;
                        console.log('new image :: ' + $scope.dish.image);
                        dishFactory.update({id:$scope.dish._id}, $scope.dish);

                        $window.location.reload();
                      });
                    }, function (response) {
                      if (response.status > 0) {
                        $scope.errorMsg = response.status + ': ' + response.data;
                          console.log('Success ' + response.status + ' : ' + response.data);
                      }
                    });
                }
            };
}])
 .controller('DishCommentController', ['$scope', 'dishFactory', function($scope,dishFactory) {
       $scope.userRating = {rating:5, comment:"", customer:"", date:""};
       $scope.submitComment = function () {
       $scope.userRating.date = new Date().toISOString();
       console.log($scope.userRating);
       $scope.dish.comments.push($scope.userRating);

        dishFactory.update({id:$scope.dish.id},$scope.dish);
        $scope.commentForm.$setPristine();
        $scope.userRating = {rating:5, comment:"", customer:"", date:""};
       };

}])



.controller('AddDishController',['$scope','$timeout', 'dishFactory', 'Upload', '$state', 'baseURL', 'AuthFactory', function($scope, $timeout, dishFactory, Upload, $state, baseURL, AuthFactory ) {
    $scope.orderByText = "";
    $scope.newDish = {name:"", image: "", cuisine: "", price: "", allergy: "", description: ""};
    $scope.imgURL = baseURL;
    console.log('chef id :: %s ', AuthFactory.getUserId());


     $scope.createDish = function(file) {
        //file = $scope.newDish.image;
         if (file === undefined) {
             $scope.newDish.image  = 'uploads/dishes/myDish.jpg';
              dishFactory.save($scope.newDish);
              $scope.picFile = "";
                $scope.newDish = {name:"", image: "uploads/dishes/myDish.jpg", cuisine: "", price: "", allergy: "", description: ""};
                $scope.addDishForm.$setPristine();
         } else {
            console.log('file is ' + file);
            file.upload = Upload.upload({
              url: 'http://localhost:3000/dishes/upload',
              data: {file: file}
            });

            file.upload.then(function (response) {
              $timeout(function () {
                file.result = response.data;
                console.log('Success ' + response.status + ' : ' + response.data + ' : ' + response.data.filename);
                $scope.newDish.image = 'uploads/dishes/' + response.data.filename;
                console.log($scope.newDish.description);
                  
                $scope.newDish.chef = AuthFactory.getUserId();
                dishFactory.save($scope.newDish);
                $scope.picFile = "";
                $scope.newDish = {name:"", image: "uploads/dishes/myDish.jpg", cuisine: "", price: "", allergy: "", description: ""};
                $scope.addDishForm.$setPristine();
                $state.go('app.managedishes',{}, {reload: true});
              });
            }, function (response) {
              if (response.status > 0) {
                $scope.errorMsg = response.status + ': ' + response.data;
                  console.log('Success ' + response.status + ' : ' + response.data);
              }
            });
         }

    };
}])


.controller('HeaderController', ['$scope', '$state', '$rootScope', 'AuthFactory', '$localStorage', '$window', function ($scope, $state, $rootScope, AuthFactory, $localStorage, $window) {

    $scope.loggedIn = false;
    $scope.username = '';
    $scope.userid = '';

    if(AuthFactory.getAuthenticated()) {
        $scope.loggedIn = true;
        $scope.username = AuthFactory.getUsername();
        $scope.userid = AuthFactory.getUserId();
    } 

    $scope.openLogin = function () {
        //ngDialog.open({ template: 'views/login.html', scope: $scope, className: 'ngdialog-theme-default', controller:"LoginController" });
    };

    $scope.logOut = function() {
        AuthFactory.logout();
        $scope.loggedIn = false;
        $scope.username = '';
        $scope.userid = '';
        $state.go('app',null,{reload: true});
    };

    $rootScope.$on('login:Successful', function () {
        $scope.loggedIn = AuthFactory.isAuthenticated();
        $scope.username = AuthFactory.getUsername();
        $scope.userid = AuthFactory.getUserId();
    });

    $rootScope.$on('registration:Successful', function () {
        $scope.loggedIn = AuthFactory.isAuthenticated();
        $scope.username = AuthFactory.getUsername();
        $scope.userid = AuthFactory.getUserId();
    }); 
    
    $rootScope.$on('logout:Successful', function () {
        //$scope.$digest();
    });

    /*$scope.stateis = function(curstate) {
       return $state.is(curstate);
    };*/
    
    

}])


.controller('DinnerHomeController',['$scope','$localStorage', '$window', 'loginFactory','AuthFactory', '$state', '$timeout', function($scope, $localStorage, $window, loginFactory, AuthFactory, $state, $timeout) {
    $scope.orderByText = "";
    $scope.loginData = $localStorage.getObject('userinfo','{}');

    $scope.doLogin = function() {
        if($scope.rememberMe) {
           $localStorage.storeObject('userinfo',$scope.loginData);
        }
        loginFactory.save($scope.loginData).$promise.then(
        function(response) {
            //console.log(response);
            AuthFactory.storeCredentials({username:$scope.loginData.username, token: response.token, userid: response.userid});
            AuthFactory.setAuthenticated(true);
            $scope.loggedIn = true;
            $scope.username = AuthFactory.getUsername();
            
            //console.log(AuthFactory.isAuthenticated());
             $state.go('app.managedishes',{},{reload:true});
        }, function(response) {
            //console.log('error %s', response);
             AuthFactory.setAuthenticated(false);
            // console.log(AuthFactory.isAuthenticated());
        });
      
    }; 

}])


.controller('SignupController', ['$scope','registerFactory', 'loginFactory','AuthFactory', '$localStorage', '$state', function($scope, registerFactory, loginFactory, AuthFactory, $localStorage, $state) {
    $scope.orderByText = "";
    $scope.register={};
    $scope.loginData={};

    $scope.doRegister = function() {
        if($scope.rememberMe) {
           $localStorage.storeObject('userinfo',$scope.signup);
        }
        registerFactory.save($scope.signup).$promise.then(
        function(response) {
            //console.log(response);
            $scope.loginData = {username:$scope.signup.username, password:$scope.signup.password};
            loginFactory.save($scope.loginData).$promise.then(
            function(response) {
                //console.log(response);
                AuthFactory.storeCredentials({username:$scope.loginData.username, token: response.token, userid: response.userid});
                AuthFactory.setAuthenticated(true);
                $scope.loggedIn = true;
                $scope.username = AuthFactory.getUsername();

                //console.log(AuthFactory.isAuthenticated());
                 $state.go('app.managedishes',{},{reload:true});
            }, function(response) {
                //console.log('error %s', response);
                 AuthFactory.setAuthenticated(false);
                // console.log(AuthFactory.isAuthenticated());
            });
        });
    }; 
}])

.controller('MenuController', ['$scope','menuFactory', 'dishFactory','favouriteFactory', '$state', 'baseURL', 'AuthFactory', function($scope,  menuFactory, dishFactory, favouriteFactory, $state, baseURL, AuthFactory) {
        $scope.showItems = false;
        $scope.message = "Loading ...";
        $scope.imgURL = baseURL;
        //$scope.dishes = {};
        $scope.chefid = AuthFactory.getUserId();

        menuFactory.query(
            function(response) {
                $scope.menuItems = response;
                $scope.showItems = true;
            },
            function(response) {
                $scope.message = "Error: "+response.status + " " + response.statusText;
        });

        $scope.removeFromMenu = function(id) {
            $scope.menuid = id;
            console.log("Remove Dish index :: " + $scope.menuid);
            menuFactory.update({_id:id});
            console.log('Dish removed from menu');
            $state.go($state.current, {}, {reload: true});
        };

        $scope.addToFavourites = function(id) {
              $scope.dishId = id;
                console.log("Dish index :: " + $scope.dishId);

                $scope.favourites = favouriteFactory.getFavourites().query(
                    function(response) {
                        $scope.favourites = response;
                        console.log("Ids :: " + $scope.favourites.length);
                        if($scope.favourites.length === 0) {
                             dishFactory.get({id:parseInt($scope.dishId,10)})
                                .$promise.then(
                                        function(response){
                                            $scope.dish = response;
                                            console.log("Adding dish.... " + $scope.dish);
                                            $scope.newdish = $scope.dish;
                                            $scope.newdish.dishid = $scope.dish.id;
                                            favouriteFactory.saveDish().save($scope.newdish);
                                        },
                                        function(response) {
                                            $scope.message = "Error: "+response.status + " " + response.statusText;
                                        }
                                );
                        }
                        else {
                            $scope.addDish = true;
                            angular.forEach($scope.favourites, function(dish, value) {
                                console.log("id :: " + dish.id + " " + value);
                                if($scope.dishId === dish.id ) {
                                    console.log("Matched" + $scope.dishId + " :: " + value  );
                                    $scope.addDish = false;
                                    return;
                                }
                            });
                            if ($scope.addDish) {
                                 dishFactory.get({id:parseInt($scope.dishId,10)})
                                .$promise.then(
                                        function(response){
                                            $scope.dish = response;
                                            console.log("Adding dish.... " + $scope.dish);
                                            favouriteFactory.saveDish().save($scope.dish);
                                        },
                                        function(response) {
                                            $scope.message = "Error: "+response.status + " " + response.statusText;
                                        }
                                );
                            }

                        }
                    },
                    function(response) {
                        $scope.message = "Error: "+response.status + " " + response.statusText;
                    });
        };
}])

.controller('ChefOrderController',['$scope','$window','orderFactory', 'AuthFactory', function($scope, $window,orderFactory, AuthFactory) {
    $scope.orderByText = "";
    $scope.showOrder = false;
    $scope.message = "Loading ...";
    $scope.chefid = AuthFactory.getUserId();


    orderFactory.query(
            function(response) {
                $scope.orders = response;
                $scope.showOrder = true;
            },
            function(response) {
                $scope.message = "Error: "+response.status + " " + response.statusText;
        });

    $scope.updateOrder = function(orderId, order, newStatus) {
        $scope.order = order;
        console.log('order accepted' + orderId + ' ' + $scope.order.status);
        $scope.order.status = newStatus;

        orderFactory.update({id:orderId}, $scope.order);
    };
}])

.controller('FavouriteController',['$scope', '$window', 'favouriteFactory', 'orderFactory', 'menuFactory', 'dishFactory', function($scope, $window, favouriteFactory, orderFactory, menuFactory, dishFactory) {
    $scope.showFav = false;
    $scope.showMenu = false;
    $scope.message = "Loading ...";
    $scope.showMsg = false;
    $scope.portionSizes = [{value:1,name:"1 portion"},{value:2,name:"2 portions"},{value:3,name:"3 portions"}];
    $scope.selectedDishes = [];
    $scope.allDishIds = []; // store all dishes added per order

    $scope.orderForChef = {};


     $scope.testChange = function(portionSize, dishId, dishName, price, chef) {
         $scope.dish = {dishid:"", dishname: "", quantity: "", price: ""};
         $scope.dish.dishid = dishId;
         $scope.dish.dishname = dishName;
         $scope.dish.quantity = portionSize;
         $scope.dish.price = price;



         $scope.dishIndex = $scope.allDishIds.indexOf(dishId);
         console.log('$scope.dishNames.indexOf(allDishIds)' + $scope.dishIndex);
         if ($scope.dishIndex >= 0) {
             //$scope.dishIndex = (parseInt($scope.dishIndex,10) > 0)? $scope.dishIndex-1 : $scope.dishIndex;
             console.log('$scope.dishNames.indexOf(dishName)' + $scope.dishIndex + ' $scope.selectedDishes.splice('+ $scope.dishIndex + ')');
              $scope.selectedDishes.splice($scope.dishIndex, 1, $scope.dish);
         } else {
              $scope.selectedDishes.push($scope.dish);
         }

         /* angular.forEach($scope.selectedDishes, function(selectedDish) {
             console.log(selectedDish.dishname + "\t" + selectedDish.quantity);
         });*/
         //$scope.selectedDishes.splice($scope.dishIndex, 1, $scope.dish);

         //$scope.selectedDishes.push($scope.dish);
         $scope.allDishIds.push(dishId);


         console.log("Triggered" +  portionSize + " " +  dishId + " " + chef);
         console.log($scope.selectedDishes.length);
     }  ;

     $scope.addToOrder = function(chef) {
        console.log(chef);
         console.log($scope.selectedDishes.length);
         $scope.orderedDishes = [];
         angular.forEach($scope.selectedDishes, function(selectedDish) {
             console.log(selectedDish.dishname + "\t" + selectedDish.quantity);
             $scope.orderedDishes.push(selectedDish);
         });


         $scope.newOrder =
                    {
                        "customer": "Archana",
                        "custphone": "07980531768",
                        "chef": chef,
                        "chefphone": 12345667,
                        "status": "basket",
                        "dishes": $scope.orderedDishes
                    };
                console.log($scope.newOrder);
                orderFactory.saveOrder().save($scope.newOrder);
                $scope.selectedDishes.length = 0; // clear array
                $window.location.href = "index.html#/mybasket/";
     };

    $scope.dishes = favouriteFactory.getFavourites().query(
        function(response) {
            $scope.dishes = response;
            console.log($scope.dishes.length);
            $scope.showFav = true;
        },
        function(response) {
            $scope.message = "Error: "+response.status + " " + response.statusText;
    });

     menuFactory.query(
            function(response) {
                $scope.menu = response;
                $scope.showMenu = true;
            },
            function(response) {
                $scope.message = "Error: "+response.status + " " + response.statusText;
        });

     $scope.addToFavourites = function(id) {
                $scope.dishId = id;
                $scope.msg = "";
                console.log("Dish index :: " + $scope.dishId);

                $scope.favourites = favouriteFactory.getFavourites().query(
                    function(response) {
                        $scope.favourites = response;
                        console.log("Ids :: " + $scope.favourites.length);
                        if($scope.favourites.length === 0) {
                             dishFactory.get({id:parseInt($scope.dishId,10)})
                                .$promise.then(
                                        function(response){
                                            $scope.dish = response;
                                            console.log("Adding dish.... " + $scope.dish);
                                            $scope.newdish = $scope.dish;
                                            $scope.newdish.dishid = $scope.dish.id;
                                            favouriteFactory.saveDish().save($scope.newdish);
                                            $scope.msg = "Favourite added";
                                            $window.location.reload();

                                        },
                                        function(response) {
                                            $scope.message = "Error: "+response.status + " " + response.statusText;
                                        }
                                );
                        }
                        else {
                            $scope.addDish = true;
                            angular.forEach($scope.favourites, function(dish, value) {
                                console.log("id :: " + dish.id + " " + value);
                                if($scope.dishId === dish.id ) {
                                    console.log("Matched" + $scope.dishId + " :: " + value  );
                                    $scope.addDish = false;
                                    $scope.msg = "Already a Favourite";
                                    return;
                                }
                            });
                            if ($scope.addDish) {
                                dishFactory.get({id:parseInt($scope.dishId,10)})
                                .$promise.then(
                                        function(response){
                                            $scope.dish = response;
                                            console.log("Adding dish.... " + $scope.dish);
                                            favouriteFactory.saveDish().save($scope.dish);
                                            $scope.msg = "Favourite added";
                                            $window.location.reload();

                                        },
                                        function(response) {
                                            $scope.message = "Error: "+response.status + " " + response.statusText;
                                        }
                                );
                            }

                        }
                    },
                    function(response) {
                        $scope.message = "Error: "+response.status + " " + response.statusText;
                    });
        };

    $scope.removeFromFavourites = function(id) {
        $scope.dishId = id;
        console.log("Remove Dish index :: " + $scope.dishId);

       $scope.dish = favouriteFactory.getFavourites().get({id:parseInt(id,10)})
        .$promise.then(
                function(response){
                    $scope.dish = response;
                    console.log(response);
                    console.log($scope.dish );
                    console.log($scope.dish.id);

                    $scope.dish.$delete({id:$scope.dish.id});

                    $window.location.reload();
            },
            function(response) {
                $scope.message = "Error: "+response.status + " " + response.statusText;
            }
        );
    };
}])
.controller('CustumerOrderController',['$scope', '$window', 'orderFactory', function($scope, $window, orderFactory) {
    $scope.showOrder = false;
    $scope.message = "Loading ...";
    $scope.showMsg = false;
    $scope.hideEdit = true;

    $scope.ordertoday = {value1 : true, value2 : false};


    $scope.orders = orderFactory.getOrders().query(
        function(response) {
            $scope.orders = response;
            $scope.showOrder = true;
        },
        function(response) {
            $scope.message = "Error: "+response.status + " " + response.statusText;
    });

    $scope.updateOrder = function(orderId, newStatus) {
        console.log('order accepted' + orderId + ' ' + newStatus);

        $scope.order= orderFactory.getOrders().get({id:parseInt(orderId,10)})
            .$promise.then(
                    function(response){
                        $scope.order = response;
                        console.log(response);
                        console.log($scope.order );
                        console.log($scope.order.customer);
                $scope.order.status = newStatus;
                orderFactory.getOrders().update({id:$scope.order.id},$scope.order);
                console.log($scope.order.status);
                if ($scope.order.status === 'new') {
                    $window.location.href = "index.html#/myorders/";
                } else {
                    $window.location.reload();
                }
            },
            function(response) {
                $scope.message = "Error: "+response.status + " " + response.statusText;
            }
        );
    };


    /*$scope.addToOrder = function(id) {
                $scope.showMsg = true;
                $scope.quantity = id.toString();
                console.log("Dish quantity :: " + $scope.quantity);
                console.log($scope.dish.id);
                console.log($scope.dish.name);
                console.log($scope.dish.price);
                console.log($scope.quantity);
                $scope.newOrder =
                    {
                        "customer": "Archana",
                        "custphone": "07980531768",
                        "chef": "Chef1",
                        "chefphone": 12345667,
                        "status": "basket",
                        "dishes":[
                            {
                                "dishid":$scope.dish.id,
                                "dishname":$scope.dish.name,
                                "quantity":$scope.quantity,
                                "price":$scope.dish.price
                            }
                        ]
                    };

                orderFactory.saveOrder().save($scope.newOrder);

                $window.location.reload();

                //$scope.ids = orderFactory.getOrders().query(
                    function(response) {
                        $scope.ids = response;
                        console.log("Ids :: " + $scope.ids.length);
                        if($scope.ids.length === 0) {
                             console.log($scope.dish.name);
                             console.log($scope.dish.price);
                             console.log($scope.quantity);

                        }
                        else {
                            $scope.addMenu = true;


                        }
                    },
                    function(response) {
                        $scope.message = "Error: "+response.status + " " + response.statusText;
                    }); //
                };*/


        $scope.removeFromBasket = function(id) {
            $scope.orderId = id;
            console.log("Remove Order index :: " + $scope.orderId);

           $scope.order = orderFactory.getOrders().get({id:parseInt(id,10)})
            .$promise.then(
                    function(response){
                        $scope.order = response;
                        console.log(response);
                        console.log($scope.order );
                        console.log($scope.order.id);

                        $scope.order.$delete({id:$scope.order.id});

                        $window.location.reload();
                },
                function(response) {
                    $scope.message = "Error: "+response.status + " " + response.statusText;
                }
            );
        };

    $scope.toggleEdit = function(index) {
        $scope.hideEdit = false;
        $scope.rownum = index;
    };

    $scope.editQty = function(index, orderId, qty) {
        console.log(index + " " + orderId);
         $scope.order= orderFactory.getOrders().get({id:parseInt(orderId,10)})
            .$promise.then(
                    function(response){
                        $scope.order = response;
                        console.log(response);
                        console.log($scope.order );
                        $scope.dish = $scope.order.dishes[parseInt(index,10)];
                        $scope.newDish = {
                                "dishid":$scope.dish.dishid,
                                "dishname":$scope.dish.dishname,
                                "quantity":qty,
                                "price":$scope.dish.price
                        };
                        console.log('First len: ' + $scope.order.dishes.length);
                        $scope.order.dishes.splice(parseInt(index,10), 1,  $scope.newDish);
                        console.log('Now len: ' + $scope.order.dishes.length);
                        orderFactory.getOrders().update({id:$scope.order.id},$scope.order);
                        $scope.hideEdit = true;
                        $scope.rownum = "";
                        $window.location.reload();

            },
            function(response) {
                $scope.message = "Error: "+response.status + " " + response.statusText;
            }
        );
    };

    $scope.removeItem = function(index, orderId) {
        console.log(index + " " + orderId);
         $scope.order= orderFactory.getOrders().get({id:parseInt(orderId,10)})
            .$promise.then(
                    function(response){
                        $scope.order = response;
                        console.log(response);
                        console.log($scope.order );
                        console.log($scope.order.customer);
                        console.log('First len: ' + $scope.order.dishes.length);
                        $scope.order.dishes.splice(parseInt(index,10), 1);
                        console.log('Now len: ' + $scope.order.dishes.length);
                        orderFactory.getOrders().update({id:$scope.order.id},$scope.order);
                        $window.location.reload();

            },
            function(response) {
                $scope.message = "Error: "+response.status + " " + response.statusText;
            }
        );

    };

}])
;
