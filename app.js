var execPhp = require('exec-php');
var app = require('express')();
var server = require('http').Server(app);
var io = require('socket.io')(server);
var schedule = require('node-schedule');
server.listen(8080);

app.get('/', function (req, res) {
  res.sendfile(__dirname + '/index.html');
});

io.on('connection', function (socket) {
 // socket.emit('news', { hello: 'world' });
  socket.on('my event', function (data) {
	  
	  var strTemp = data.my.split(';'); //
	  var summary = strTemp[0];
	  var to_place = strTemp[1];
	  var when = strTemp[2];
	  var time = strTemp[3];
	  var rtime = strTemp[4];
	  var to_detail = to_place.split(',');
console.log(strTemp);
	 //execphp
    execPhp('twilio.php', function(error, php, outprint){
		// outprint is now `One'.
		//scheduleJob
		//var time_slice = when.split(':');
		//var j = schedule.scheduleJob('time_slice[2] time_slice[1] time_slice[0] * * *', function(){
				php.send_msg(summary, to_detail[0], when, rtime, function(err, result, output, printed){

					console.log(err);
					console.log(result);
					console.log(printed);
			});
		});
	/*//execphp
	
			  console.log('scheduleJob Done!');
		});
	*/
  });
});