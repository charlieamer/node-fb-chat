var app = angular.module("chatApp",['ui.router'])
    .config(function($stateProvider, $urlRouterProvider){
        $stateProvider
        .state('home',{
            url:'/home',
            templateUrl: 'templates/home.html'
        })
        .state('/chat', {
            url:'/chat/:chat_id',
            templateUrl: 'templates/chat.html',
            controller: 'chatCtrl'
        })
        .state('/login', {
            url:'/login',
            templateUrl: 'templates/login.html',
        })
        ;
    })
;
app.controller("chatCtrl", function($scope, $http){
    $scope.chat_id="public";
    $scope.message;
    $scope.allMessages;
    $scope.users;
    
    $scope.getLastMessages = function(){
        $http.get('/chat/last_messages').success(function (data, status) {
            console.log(data);
            console.log(status);
            $scope.allMessages = data;
        });
    };
    
    $scope.sendMessage = function(msg){
        $http({
            method: 'POST',
            url: '/chat/message',
            data: JSON.stringify(msg),
            headers: {'Content-Type': 'application/json'}
        });
    };
    
    $scope.getUsers = function(){
        $http.get('/chat/users').success(function (data, status) {
            console.log(data);
            console.log(status);
            $scope.users = data;
        });
    };
    
    $scope.getNewMessages = function(msg_id){
        $http.get('/chat/message/'+msg_id).success(function (data, status) {
            console.log(data);
            console.log(status);
        });
    };
    
    $scope.getNewUser = function(){
        $http.get('/chat/users/wait_change').success(function (data, status) {
            console.log(data);
            console.log(status);
        });
    };
    
});