var socket = function(io) {
    var allClients = new Array();
    var nameOfClients = new Array();
    io
        .of('/chat')
        .on('connection', function(client) {

            client.on('disconnect', function() {
                var i = allClients.indexOf(client);
                if (i > -1) {
                    client.broadcast.emit('newMessage', {
                    	type: "info",
                        message: nameOfClients[i].name + " has left."
                    });
                	allClients.splice(i,1);
           			nameOfClients.splice(i,1);
                }
            });

            setInterval(function() {
                client.broadcast.emit('buddylist', nameOfClients);
            }, 10000);

            client.on('addUser', function(data) {
                nameOfClients.push({
                    name: data.user
                });
                allClients.push(client);
                data.type = "info";
                data.message = data.user + " has joined";
                client.broadcast.emit('newMessage', data);

            });

            client.on('addMessage', function(data) {
                data.type = "chat";
                client.broadcast.emit('newMessage', data);
            })
        });
}
module.exports = socket;