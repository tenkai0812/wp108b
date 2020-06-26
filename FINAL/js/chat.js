$(function(){
	/*建立socket連接，使用websocket協定，端口號是服務器端端口号*/
	var socket = io('ws://localhost:8081');
	/*定義用戶名*/
	var uname = null;

	/*登入*/
	$('.login-btn').click(function(){
		uname = $.trim($('#loginName').val());
		if(uname){
			/*向服務端發送登入event*/
            socket.emit('login',{username:uname})
        }
        else{
			alert('請輸入暱稱')
		}
	})

	/*發送消息*/
	$('.sendBtn').click(function(){
		sendMessage()
	});
	$(document).keydown(function(event){
		if(event.keyCode == 13){
			sendMessage()
		}
	})

	/*登入成功*/
	socket.on('loginSuccess',function(data){
		if(data.username === uname){
            checkin(data)
            alert('登入成功')
		}else{
			alert('用戶名不匹配，請重新操作')
		}
	})

	/*登入失败*/
	socket.on('loginFail',function(){
		alert('暱稱重複')
	})

	/*新用戶加入提示*/
	socket.on('add',function(data){
		var html = '<p>系统消息:'+data.username+'已加入聊天室</p>';
		$('.chat-con').append(html);
	})

	/*接收消息*/
	socket.on('receiveMessage',function(data){
		showMessage(data)
	})

	/*用戶退出群組提示*/
	socket.on('leave',function(name){
		if(name != null){
			var html = '<p>FBI warning:'+name+'已退出聊天室</p>';
			$('.chat-con').append(html);
		}
	})

	/*隱藏登入界面 顯示聊天界面*/
	function checkin(data){
		$('.login-wrap').hide('slow');
		$('.chat-wrap').show('slow');
	}

	/*發送消息*/
	function sendMessage(){
		var txt = $('#sendtxt').val();
		$('#sendtxt').val('');
		if(txt){
			socket.emit('sendMessage',{username:uname,message:txt});
		}
	}

	/*顯示消息*/
	function showMessage(data){
		var html
		if(data.username === uname){
			html = '<div class="chat-item item-right clearfix"><span class="img fr"></span><span class="message fr">'+data.message+'</span></div>'
		}else{
			html='<div class="chat-item item-left clearfix rela"><span class="abs uname">'+data.username+'</span><span class="img fl"></span><span class="fl message">'+data.message+'</span></div>'
		}
		$('.chat-con').append(html);
	}

})