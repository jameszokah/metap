(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
/// Getting DOM elements
const $ = element => document.querySelector(element);
const startAudioButton = $('.startAudioButton');
const startVideoButton = $('.startVideoButton');
const startScreenButton = $('.startScreenButton');
const stopAudioButton = $('.stopAudioButton');
const stopVideoButton = $('.stopVideoButton');
const stopScreenButton = $('.stopScreenButton');
const videoSelect = $('#video-select');
const audioSelect = $('#audio-select');
const localMedia = $('.local-video');
const remoteVideos = $('.remote-video');
const videoMedia = $('.video-media');
const remoteAudios = $('.screen-media');
const remoteScreenVideo = $('.screen-media');
const users = $('.users');
const participateVideo = $('.participate-video');
const sendMessage = $('.send-message');
const chatInput = $('#chat-input');
const displayChat = $('.display-chat');
const btnLeave = $('.btn-leave');




const showPeer = (data) => {
    let peers = data.peerList;
    users.innerHTML = '';
    console.log('peerList : ', peers);
    peers.forEach(peer => {
        let user = '';
        if (peer) {
            user = `
    <li class="user-active">
        <div class="user-profile">
            <div class="active"></div>
            <img src=${peer.pic} alt="${peer.username} profile pic"  />
        </div>
        <div class="user-media__control">
            <div class="user-vid waves-effect"><span class="iconify" data-icon="bi:camera-video-off"
                    data-inline="false"></span></div>
            <div class="user-mic waves-effect"><span class="iconify" data-icon="bi:mic"
                    data-inline="false"></span></div>
        </div>

        <h6 class="username">
            <span>
            ${peer.username}
            </span>
        </h6>

    </li>
`;
        }



        users.insertAdjacentHTML('beforeend', user);



    })
    

}

const showPeerVideo = (data) => {
   
     let peers = data.peerList;
    participateVideo.innerHTML = '';
    console.log('peerList : ', peers);
    peers.forEach((peer,i,peers) => {
        let user = '';
        if (peer) {
           if(peers.length == 1) {
                user = `
        <div class="users-video local-video">
                       <span class="iconify person" data-icon="ant-design:user-outlined"
                                data-inline="false"></span>
                     <div class="user-video__control">
                     <div class="user-vid user-video__icon"><span class="iconify" data-icon="bi:camera-video-off"
                                    data-inline="false"></span></div>
                            <div class="user-mic user-video__icon"><span class="iconify" data-icon="bi:mic" data-inline="false"></span>
                            </div>
                             <p class="user-video__icon video-name"><span>${peer.username}</span></p>

                     </div>
                </div>
    `;
           }
           else {
                user = `
        <div class="users-video remote-video">
                        <span class="iconify person" data-icon="ant-design:user-outlined"
                                data-inline="false"></span>
                     <div class="user-video__control">
                     <div class="user-vid user-video__icon"><span class="iconify" data-icon="bi:camera-video-off"
                                    data-inline="false"></span></div>
                            <div class="user-mic user-video__icon"><span class="iconify" data-icon="bi:mic" data-inline="false"></span>
                            </div>
                             <p class="user-video__icon video-name"><span>${peer.username}</span></p>

                     </div>
                </div>
    `;
           }
        }



        participateVideo.insertAdjacentHTML('beforeend', user);



    })
}

const joinNewPeer = () => {
    socket.on('newpeer', (data) => {
       showPeerVideo(data);
       showPeer(data);
    })
}


const updatePeer = () => {
    socket.on('updatepeer', (data) => {
        console.log(data)
        showPeerVideo(data);
        showPeer(data);
    })
} 


if (location.href.substr(0, 5) !== 'https')
    location.href = 'https' + location.href.substr(4, location.href.length - 4);

// let meeting_id;
const socket = io('/');

//nameInput.value = 'bob' + Math.round(Math.random() * 1000)

socket.request = function request(type, data = {}) {
    return new Promise((resolve, reject) => {
        socket.emit(type, data, (data) => {
            if (data.error) {
                reject(data.error)
            } else {
                resolve(data)
            }
        })
    })
}

let rc = null

function joinRoom(name, room_id, profile) {
    if (rc && rc.isOpen()) {
        console.log('already connected to a room')
    } else {
        console.log('Just connected to a Room');
           if(users) {
    //joinNewPeer();
    //updatePeer();
}
        rc = new RoomClient(localMedia ? localMedia : remoteScreenVideo,
                            remoteVideos ? remoteVideos : remoteScreenVideo,
                            remoteAudios,
                            window.mediasoupClient,
                            socket,
                            room_id,
                            name,
                            roomOpen,
                            remoteScreenVideo,
                            videoMedia,
                            profile,
                            joinNewPeer,
                            updatePeer
            );
         console.log(localMedia)
        addListeners(rc);
    }

}

function roomOpen() {
    reveal(startAudioButton)
    hide(stopAudioButton)
    reveal(startVideoButton)
    hide(stopVideoButton)
    reveal(startScreenButton)
    hide(stopScreenButton)
    reveal(videoMedia)
    
}

function hide(elem) {
    if (elem) elem.className = 'hidden';
}

function reveal(elem) {
   if (elem) elem.classList.remove('hidden');
}


function addListeners(rc) {
    rc.on(RoomClient.EVENTS.startScreen, () => {
        hide(startScreenButton)
        reveal(stopScreenButton)
        hide(videoMedia);
    })

    rc.on(RoomClient.EVENTS.stopScreen, () => {
        hide(stopScreenButton)
        reveal(startScreenButton)
        reveal(videoMedia);

    })

    rc.on(RoomClient.EVENTS.stopAudio, () => {
        hide(stopAudioButton)
        reveal(startAudioButton)

    })
    rc.on(RoomClient.EVENTS.startAudio, () => {
        hide(startAudioButton)
        reveal(stopAudioButton)
    })

    rc.on(RoomClient.EVENTS.startVideo, () => {
        hide(startVideoButton)
        reveal(stopVideoButton)
    })
    rc.on(RoomClient.EVENTS.stopVideo, () => {
        hide(stopVideoButton)
        reveal(startVideoButton)
    })
    rc.on(RoomClient.EVENTS.exitRoom, () => {
        hide(videoMedia)
    })

}

// Load mediaDevice options
navigator.mediaDevices.enumerateDevices().then(devices =>
    devices.forEach(device => {
        let el = null
        if ('audioinput' === device.kind) {
            el = audioSelect
        } else if ('videoinput' === device.kind) {
            el = videoSelect
        }
        if (!el) return

        let option = document.createElement('option')
        option.value = device.deviceId
        option.innerText = device.label
        el.appendChild(option)
    })
);

    
if (meeting_id ) {
 
    joinRoom(nameInput, roomTitle,'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1234&q=80');
    console.log('MEETING ID created at: ', meeting_id);
    console.log('TITLE created at : ', roomTitle);
    console.log('USERNAME created at: ', nameInput);
    console.log('PROFILE created at: ', 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1234&q=80');

}

const chatHTML = () => {
    if (chatInput.value !== '') {

        rc.socket.emit('chat', {
            name: nameInput,
            pic: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1234&q=80',
            message: chatInput.value
        })

        chatMackup = `
    <li> 
        <div class="chat-me">
            <div class="message-body">
                <div class="message-output-me">
                    <p>${chatInput.value}</p>
                </div>
                <div class="user-profile chat-avator chat-avator-me"><img src="${'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1234&q=80'}" alt="${nameInput}" /></div>
                <span class="chat-user-name__me">${nameInput}</span>

            </div>
        </div>
    </li>
`;

        displayChat.insertAdjacentHTML('beforeend', chatMackup);
        chatInput.value = '';
        chatInput.focus()

    }
}
 
 let chatMackup;
sendMessage.addEventListener('click', e => {
   chatHTML()
});

document.addEventListener('keypress', e => {
    if(e.which === 13 || e.keyCode === 13 ) {
        chatHTML()
    }
})

rc.socket.on('chat', data => {
    chatMackup = `
        <li>
            <div class="message-body">
                <div class="message-output">
                    <p>${data.message}</p>
                </div>
                <div class="user-profile chat-avator"><img src="${data.pic}" alt="${data.name}" /></div>
                <span class="chat-user-name">${data.name}</span>

            </div>
        </li>
    `;
    displayChat.insertAdjacentHTML('beforeend', chatMackup)
})



    //dom Listeners

if (startVideoButton != null)
    startVideoButton.addEventListener('click', e => {
    rc.produce(RoomClient.mediaType.video, videoSelect.value);
}, false);


if (startAudioButton != null)
    startAudioButton.addEventListener('click', e => {
    rc.produce(RoomClient.mediaType.audio, audioSelect.value)
}, false);

if (startScreenButton != null)
    startScreenButton.addEventListener('click', e => {
    rc.produce(RoomClient.mediaType.screen)
}, false);

if (stopVideoButton !== null)
stopVideoButton.addEventListener('click', e => {
    rc.closeProducer(RoomClient.mediaType.video);
}, false)

if (stopAudioButton !== null)
stopAudioButton.addEventListener('click', e => {
    rc.closeProducer(RoomClient.mediaType.audio);
}, false)

if (stopScreenButton !== null)
stopScreenButton.addEventListener('click', e => {
    rc.closeProducer(RoomClient.mediaType.screen);
}, false);

if (btnLeave !== null)
btnLeave.addEventListener('click', async (e) => {
    rc.exitPeer()
    const res = await fetch('/leave',{
        method: 'POST',
        headers: {'content-type': 'application/json'},
        body: JSON.stringify({name: nameInput})
    })
    const data = await res.json();
    window.location.href = data.redirect;
}, false);


console.log(rc)
window.rc = rc;

},{}]},{},[1]);
