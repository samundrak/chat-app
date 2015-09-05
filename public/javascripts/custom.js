var socket = io('http://localhost:2000/chat');
angular.module('react', ['ngAnimate'])
    .controller('chatCtrl', ['$scope',
        function($scope) {
            $scope.users = [];
            $scope.connectedClients = 0;


            socket.on('buddylist', function(data) {
                if (!data) return false;

                $scope.connectedClients = data.length;
                $scope.users = data;
                $scope.$apply();
            });
            socket.on('newMessage', function(data) {
                console.log(data);
                // if (data) {
                if (data.type === 'chat') {
                    $scope.chats.push({
                        username: data.username,
                        text: data.text,
                        type: 'chat'
                    });
                } else if (data.type === 'info') {
                    $scope.users.push({
                        name: data.user
                    });
                    $scope.connectedClients += 1;
                    // console.loog(data);
                    $scope.chats.push({
                        type: 'info',
                        message: data.message
                    });
                    $scope.$apply();
                }
                // }
                $scope.$apply();
            });

            while (true) {
                $scope.username = prompt("Buddy What's your name");
                if ($scope.username) {
                    $scope.users.push({
                        name: $scope.username
                    });
                    $scope.connectedClients++;
                    socket.emit('addUser', {
                        user: $scope.username
                    });
                    break;
                }
            }


            $scope.chats = [];
            $scope.send = function() {
                var text = $scope.text;
                var username = $scope.username;

                $scope.text = '';
                if(text === 'clear'){
                	$scope.chats = [];
                	return false;
                }
                var data = {
                    username: username,
                    text: text,
                    type: 'chat'
                }
                $scope.chats.push(data)
                socket.emit('addMessage', data);
            }
        }
    ])