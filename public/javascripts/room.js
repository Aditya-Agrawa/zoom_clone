const socket = io();
const videogrid = document.getElementById('video-elememt');
const myvideo = document.createElement('Video');
//document.body.appendChild(myvideo)
myvideo.muted = true;
//myvideo.controls = true;
myvideo.autoplay = true;
//var Streamvideo;
let myVideoStream;
navigator.mediaDevices.getUserMedia({
    video: true,
    audio: true,

}).then(stream => {
    myVideoStream = stream;
    streamvideo(myvideo, stream);
    peer.on('call', call => {
        call.answer(stream);
        const rvideo = document.createElement('Video');
        rvideo.autoplay = true;
        call.on('stream', remotestream => {
            streamvideo(rvideo, remotestream);
        })
    })

    socket.on('user-connected', (userId) => {
        //console.log("jai shree ram");
        connectnewuser(userId, stream);
    });
    let text = $("input");
    // when press enter send message
    $('html').keydown(function(e) {
        if (e.which == 13 && text.val().length !== 0) {
            socket.emit('message', text.val());
            text.val('')
        }
    });
    socket.on("createMessage", message => {
        console.log(message)
        $("ul").append(`<li class="message"><b>user</b><br/>${message}</li>`);
        scrollToBottom()
    })

})

const scrollToBottom = () => {
    var d = $('.main__chat_window');
    d.scrollTop(d.prop("scrollHeight"));
}

var peer = new Peer(undefined, {
    path: '/peerjs',
    host: '/',
    port: '5000'
});
peer.on('open', id => {
    //  console.log(id, "hello");
    socket.emit('room', ROOMID, id);
});
//socket.emit('room', ROOMID);
socket.on('user-disconnected', userId => {
    if (peer[userId]) peer[userId].close()
})

const connectnewuser = (userId, stream) => {
    const call = peer.call(userId, stream);
    const rvideo = document.createElement('Video');
    rvideo.autoplay = true;
    call.on('stream', remotestream => {
        streamvideo(rvideo, remotestream);
    })
    call.on('close', () => {
        rvideo.remove()
    })

    peer[userId] = call
};


const streamvideo = (video, stream) => {

    video.srcObject = stream;
    video.addEventListener('loadmetadata', () => {
        video.play();
    })

    videogrid.append(video);
}





const muteUnmute = () => {
    console.log("yes");
    const enabled = myVideoStream.getAudioTracks()[0].enabled;
    if (enabled) {
        myVideoStream.getAudioTracks()[0].enabled = false;
        setUnmuteButton();
    } else {
        setMuteButton();
        myVideoStream.getAudioTracks()[0].enabled = true;
    }
}

const setMuteButton = () => {
    const html = `
      <i class="fas fa-microphone"></i>
      <span>Mute</span>
    `
    document.querySelector('.main__mute_button').innerHTML = html;
}

const setUnmuteButton = () => {
    const html = `
      <i class="unmute fas fa-microphone-slash"></i>
      <span>Unmute</span>
    `
    document.querySelector('.main__mute_button').innerHTML = html;
}
const playStop = () => {
    console.log('object')
    let enabled = myVideoStream.getVideoTracks()[0].enabled;
    if (enabled) {
        myVideoStream.getVideoTracks()[0].enabled = false;
        setPlayVideo()
    } else {
        setStopVideo()
        myVideoStream.getVideoTracks()[0].enabled = true;
    }
}
const setStopVideo = () => {
    const html = `
      <i class="fas fa-video"></i>
      <span>Stop Video</span>
    `
    document.querySelector('.main__video_button').innerHTML = html;
}

const setPlayVideo = () => {
    const html = `
    <i class="stop fas fa-video-slash"></i>
      <span>Play Video</span>
    `
    document.querySelector('.main__video_button').innerHTML = html;
}