var porock = angular.module('porock', []);

(function(app){
    "use strict";
    app.controller("PORockController", function($scope, $http){
        $scope.title = 'hello world'
        $http.get('https://cdn.jwplayer.com/v2/playlists/kmRHFfHr').then(function(res){
            $scope.playlist = res.data;
            $scope.selectedVideo = res.data.playlist[0];
            console.log($scope.selectedVideo)
            $scope.playlist.playlist.shift();

            function loadPlaylist(thePlaylist) {
                jwplayer().load(thePlaylist);
            }
        });
    });
})(porock);
// adminApp.config(function ($stateProvider,$urlRouterProvider) {
//
//     $urlRouterProvider.otherwise('/main');
//     $urlRouterProvider.otherwise(function ($injector) {
//         var interval = $injector.get('$interval');
//         var root = $injector.get('$rootScope');
//         var timer = interval(function () {
//             if (root.shell && root.shell.userCmisId) {
//                 interval.cancel(timer);
//                 $injector.get('$state').transitionTo('admin.userDetail', {cmisId: root.shell.userCmisId});
//             }
//         }, 200);
//     });
//
//
//     //Main page states
//     $stateProvider
//         .state('admin', {
//             abstract: true,
//             templateUrl: 'js/admin/admin-root.html'
//         })
//
//         .state('main', {
//             url: "/home",
//             controller: ["$window", function ($window) {
//                 $window.location.href = '/';
//             }]
//         })
//
//
// });
// porock.controller('PORockController', function ($scope, $stateParams, $state, $filter, $uibModal, $http, $q, $timeout){
//     $scope.title = 'whats up';
// });
