var express = require('express');
var path = require('path');
var app = express();
var users = [];
var messages = [];

app.use(express.static(path.join(__dirname, './static')));

app.set('views', path.join(__dirname, './views'));
app.set('view engine', 'ejs');

app.get('/', function (req,res){
	res.render('index');
})

var server = app.listen(1234, function(){
	console.log('Listening on port 1234');
})

var io = require('socket.io').listen(server);

io.sockets.on('connection', function (socket){
	function localVar(){
		var name ='';

		console.log('We are using sockets!');
		socket.on('new_user', function(data){
			console.log(data);
			users.push(data);
			console.log(users);
			io.emit('new_user', data);
			name = data.name;
			console.log(name + ' is the user');
			})
		socket.emit('show_previous', users);
		socket.emit('show_old_messages', messages);
		socket.on('new_message', function(data){
			console.log(data);
			messages.push(data);
			io.emit('new_message', data)
		})
		socket.on('disconnect', function(){
			console.log('hi');
			console.log(name + ' is about to disconnect');
			io.emit('exit', {message: name + ' has disconnected'})
		})
	}
	localVar();
})