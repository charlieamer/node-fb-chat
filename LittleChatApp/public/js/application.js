var app = angular.module("chatApp",['ui.router'])
.config(function($stateProvider, $urlRouterProvider){
    $stateProvider
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
});

app.filter('fromNow', function(){
    return function(date){
        return moment(date, 'hhmmddmmyyyy').fromNow();
    }
});

app.controller("chatCtrl", function($scope, $http){
    $scope.chat_id="public"; // chatroom ID
    $scope.allMessages=[
    {
        "id": 30,
        "from": "amerz",
        "message": "hepek",
        "room": "public",
        "on":"145009092014"
    }
]; // all messages on chat
    $scope.users; // all users on chat
    $scope.user= "SAMPLE USER"; // existing user
    
    //GET request for getting all messages on chat
    $scope.getLastMessages = function(){
        $http.get('/chat/last_messages').success(function (data, status) {
            console.log(data);
            console.log(status);
            $scope.allMessages = data;
        });
    };
    
    //POST request for sending new message when send button is clicked
    $scope.sendMessage = function(newMessage){
        newMessage.id="30";
        newMessage.from=$scope.user;
        newMessage.room=$scope.chat_id;
        $http({
            method: 'POST',
            url: '/chat/message',
            data: JSON.stringify(newMessage),
            headers: {'Content-Type': 'application/json'}
        });
        newMessage.message="";
        newMessage.from="";
        newMessage.room="";
    };
    
    //GET request for getting all users on chat
    $scope.getUsers = function(){
        $http.get('/chat/users').success(function (data, status) {
            console.log(data);
            console.log(status);
            $scope.users = data;
        });
    };
    
    //GET request for getting new messages on chat
    $scope.getNewMessages = function(msg_id){
        $http.get('/chat/message/'+msg_id).success(function (data, status) {
            console.log(data);
            console.log(status);
        });
    };
    
    //GET request when new user is logged in
    $scope.getNewUser = function(){
        $http.get('/chat/users/wait_change').success(function (data, status) {
            console.log(data);
            console.log(status);
        });
    };
    
});