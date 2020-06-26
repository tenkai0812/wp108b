/*建構http服務*/
var app = require('http').createServer();
/*引入socket.io*/
var io = require('socket.io')(app);
/*端口*/
var PORT = 8081;
/*定義用戶組數*/
var users = [];

app.listen(PORT);

io.on('connection', function (socket) {
	/*是否為新用戶*/
	var isNewPerson = true; 
	/*當下登入用戶*/
    var username = null;
	/*登入*/
	socket.on('login',function(data){
		for(var i=0;i<users.length;i++){
	        if(users[i].username === data.username){
	          	isNewPerson = false;
	          	break;
	        }else{
	          	isNewPerson = true;
	        }
	    }
	    if(isNewPerson){
	        username = data.username;
	        users.push({
	          username:data.username
	        })
	        /*登入成功*/
	        socket.emit('loginSuccess',data);
	        /*向所有連接的客戶端廣播新用戶進入群組*/
	        io.sockets.emit('add',data);
	    }else{
	    	/*登入失敗*/
	        socket.emit('loginFail','');
	    }  
	})

	/*發送消息*/
	socket.on('sendMessage',function(data){
        io.sockets.emit('receiveMessage',data);
    })

	/*退出登入*/
	socket.on('disconnect',function(){
		/*向所有連接的客戶端廣播用戶離開群組*/
      	io.sockets.emit('leave',username);
      	users.map(function(val,index){
        if(val.username === username){
          	users.splice(index,1);
        }
      })
    })
})

console.log('app listen at'+PORT);