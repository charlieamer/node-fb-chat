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
        templateUrl: 'templates/login.html'
    });
});

// FILTER WHICH RETURNS HOW MUCH TIME HAS PASSED SINCE THE SOMETHING
app.filter('fromNow', function(){
    return function(date){
      console.log(date);
        return moment(date, 'X').fromNow();
    };
});

app.controller("chatCtrl", function($scope, $http, $location){
    window.$scope = $scope;
    $scope.chat_id="public"; // chatroom ID
    $scope.allMessages=[]; // all messages on chat
    $scope.users; // all users on chat
    $scope.user;
    
    //GET request for getting all messages on chat
    $scope.getLastMessages = function(){
        $http.get('/chat/last_messages').success(function (data, status) {
            $scope.allMessages = data;    
        });
    };
    
    //POST request for sending new message when send button is clicked
    $scope.sendMessage = function(newMessage){
        newMessage.id="30";
        newMessage.from=$scope.user;
        newMessage.room=$scope.chat_id;
        /*$scope.allMessages.push({
            from: newMessage.from,
            message: newMessage.message,
            on: newMessage.on,
            room: newMessage.room
        });*/
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
            $scope.users = data;
        });
    };
    
    
    //GET request when new user is logged in
    $scope.getNewUser = function(){
        $http.get('/chat/users/wait_change').success(function (data, status) {
        });
    };

    $scope.getHeartbeat = function(){
        $http.get('/heartbeat').success(function(data,status){
        });
    };
    
    //Method runs when document is loaded
    $scope.init = function(){
        //Sending GET request to see if the user is logged in or not
        $http.get('/user').success(function (data, status) {
            if(data!="false"){
                $scope.user=data;
                $location.path( "/chat/public" );
            }   
            else{
                $location.path( "/login" );
            }
        });
    };

});

function newMessages(msg_id) {
  $.get('/chat/message/' + msg_id, function (data, status) {
    $scope = window.$scope;
    $scope.$apply(function(){
      data.on = (data.on_time/1000).toString();
      $scope.allMessages.push(data);
    });
    newMessages(msg_id);
  });
}

newMessages();
