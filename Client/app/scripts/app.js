/*jslint node: true */
/*jslint white:true */
/*global angular */
'use strict';



angular
    .module('dinnerApp', ['ui.router','ngResource','ngFileUpload','angular.filter','angular-input-stars'])
    
    .config(function($stateProvider, $urlRouterProvider) {
    $stateProvider
            // route for the home page
            .state('app', {
                url:'/',
                views: {
                    'header': {
                        templateUrl : 'views/headerhome.html',
                        controller  : 'DinnerHomeController'
                    },
                    'content': {
                        templateUrl : 'views/dinnerhome.html',
                        controller  : 'DinnerHomeController'
                    },
                     'footer': {
                      templateUrl : 'views/footer.html'
                    }
                }
            })
            // route for about us
            .state('app.aboutus', {
                url:'aboutus',
                views: {
                    'header@': {
                        templateUrl : 'views/header.html'
                    },
                    'content@': {
                        templateUrl : 'views/aboutus.html'
                    },
                     'footer@': {
                      templateUrl : 'views/footernone.html'
                    }
                }
            })
            // route for the signup page
            .state('app.signup', {
                url:'signup',
                views: {
                    'header@': {
                        templateUrl : 'views/header.html'
                    },
                    'content@': {
                        templateUrl : 'views/signup.html',
                        controller  : 'SignupController'
                    },
                     'footer@': {
                       templateUrl : 'views/footer.html' 
                    }
                }
            })
            // route for the manageDishes page
            .state('app.managedishes', {
                url:'managedishes',
                views: {
                    'header@': {
                        templateUrl : 'views/headerchef.html',
                        controller  : 'HeaderController'
                    },
                    'content@': {
                        templateUrl : 'views/managedishes.html',
                        controller  : 'DishController'
                   },
                    'footer@': {
                       templateUrl : 'views/footer.html' 
                    }
                    
                }
            })
            // route for the addDish page
            .state('app.adddish', {
                url:'newdish',
                views: {
                     'header@': {
                        templateUrl : 'views/headerchef.html',
                        controller  : 'HeaderController'
                    },
                    'content@': {
                        templateUrl : 'views/adddish.html',
                        controller  : 'AddDishController'
                     }
                }
            })
            // route for the addDish page
            .state('app.editdish', {
                url:'editdish/:id',
                views: {
                     'header@': {
                        templateUrl : 'views/headerchef.html',
                        controller  : 'HeaderController'
                    },
                    'content@': {
                        templateUrl : 'views/editdish.html',
                        controller  : 'EditDishController'
                     }
                }
            })
            // route for the dishdetail page
            .state('app.dishdetail', {
                url: 'managedishes/:id',
                views: {
                     'header@': {
                        templateUrl : 'views/headerchef.html',
                        controller  : 'HeaderController'
                    },
                    'content@': {
                        templateUrl : 'views/dishdetail.html',
                        controller  : 'DishDetailController'
                   }
                }
            })
            // route for the menuOfTheDay page
            .state('app.todaysmenu', {
                url:'todaysmenu',
                views: {
                    'header@': {
                        templateUrl : 'views/headerchef.html',
                        controller  : 'HeaderController'
                    },
                    'content@': {
                        templateUrl : 'views/todaysmenu.html',
                        controller  : 'MenuController'
                   },
                    'footer@': {
                       templateUrl : 'views/footer.html' 
                    }
                    
                }
            })
            // route for chef order
            .state('app.cheforder', {
                url: 'cheforder',
                views: {
                     'header@': {
                        templateUrl : 'views/headerchef.html',
                         controller  : 'HeaderController'
                    },
                    'content@': {
                        templateUrl : 'views/cheforders.html',
                        controller  : 'ChefOrderController'
                     }
                }
        
            })
/*   BEGIN CUSTOMER ROUTES */
            // route for favourites
            .state('app.favourites', {
                url: 'favourites',
                views: {
                     'header@': {
                        templateUrl : 'views/headercustomer.html'
                    },
                    'content@': {
                        templateUrl : 'views/favourites.html',
                        controller  : 'FavouriteController'
                     }
                }
        
            })
            // route for the menuOfTheDay page
            .state('app.customermenu', {
                url:'customermenu',
                views: {
                    'header@': {
                        templateUrl : 'views/headercustomer.html'
                    },
                    'content@': {
                        templateUrl : 'views/customermenu.html',
                        controller  : 'FavouriteController'
                   },
                    'footer@': {
                       templateUrl : 'views/footer.html' 
                    }
                    
                }
            })
            // route for the dishdetail page
            .state('app.dishdetailcust', {
                url: 'dishdetails/:id',
                views: {
                     'header@': {
                        templateUrl : 'views/headercustomer.html'
                    },
                    'content@': {
                        templateUrl : 'views/dishdetailcust.html',
                        controller  : 'DishDetailController'
                   }
                }
            })
            // route for the customer order page
            .state('app.customerorder', {
                url: 'myorders/:id',
                views: {
                     'header@': {
                        templateUrl : 'views/headercustomer.html'
                    },
                    'content@': {
                        templateUrl : 'views/customerorders.html',
                        controller  : 'CustumerOrderController'
                   }
                }
            })
            // route for the customer basket page
            .state('app.mybasket', {
                url: 'mybasket/:id',
                views: {
                     'header@': {
                        templateUrl : 'views/headercustomer.html'
                    },
                    'content@': {
                        templateUrl : 'views/mybasket.html',
                        controller  : 'CustumerOrderController'
                   }
                }
            })
            ;
            $urlRouterProvider.otherwise('/');
    })
;


   