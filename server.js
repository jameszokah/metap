const express = require('express');
const https = require('httpolyglot');
const fs = require('fs');
const path = require('path');
const mediasoup = require('mediasoup');
const Room = require('./Room')
const Peer = require('./Peer')
const config = require('./config');
const {peerID,router} = require('./routers/router');

const app = express();

const options = {
    key: fs.readFileSync(path.join(__dirname,config.sslKey), 'utf-8'),
    cert: fs.readFileSync(path.join(__dirname,config.sslCrt), 'utf-8')
}


const httpsServer = https.createServer(options, app)
const io = require('socket.io')(httpsServer);

app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public', 'css')));
app.use(express.static(path.join(__dirname, 'public', 'img')));
app.use(express.static(path.join(__dirname, 'public', 'js')));
app.use(express.static(path.join(__dirname, 'public', 'sounds')));


app.use('/', router);


httpsServer.listen(config.listenPort, () => {
    console.log('listening https://localhost:' + config.listenPort)
})



// all mediasoup workers
let workers = []
let nextMediasoupWorkerIdx = 0

/**
 * roomList
 * {
 *  room_id: Room {
 *      id:
 *      router:
 *      peers: {
 *          id:,
 *          name:,
 *          master: [boolean],
 *          transports: [Map],
 *          producers: [Map],
 *          consumers: [Map],
 *          rtpCapabilities:
 *      }
 *  }
 * }
 */
let roomList = new Map();
let peerList = new Map();
let allPeers = [];


;
(async () => {
    await createWorkers()
})()



async function createWorkers() {
    let {
        numWorkers
    } = config.mediasoup

    for (let i = 0; i < numWorkers; i++) {
        let worker = await mediasoup.createWorker({
            logLevel: config.mediasoup.worker.logLevel,
            logTags: config.mediasoup.worker.logTags,
            rtcMinPort: config.mediasoup.worker.rtcMinPort,
            rtcMaxPort: config.mediasoup.worker.rtcMaxPort,
        })

        worker.on('died', () => {
            console.error('mediasoup worker died, exiting in 2 seconds... [pid:%d]', worker.pid);
            setTimeout(() => process.exit(1), 2000);
        })
        workers.push(worker)

        // log worker resource usage
        /*setInterval(async () => {
            const usage = await worker.getResourceUsage();

            console.info('mediasoup Worker resource usage [pid:%d]: %o', worker.pid, usage);
        }, 120000);*/
    }
}


io.on('connection', socket => {

    socket.on('createRoom', async ({
        room_id
    }, callback) => {
        if (roomList.has(room_id)) {
            callback('already exists')
        } else {
            console.log('---created new room--- ', room_id)
            let worker = await getMediasoupWorker()
            roomList.set(room_id, new Room(room_id, worker, io))
            callback(room_id)
        }
    })

    socket.on('join', ({
        room_id,
        name,
        profile
    }, cb) => {

        console.log('---user joined--- \"' + room_id + '\": ' + name)
        if (!roomList.has(room_id)) {
            return cb({
                error: 'room does not exist'
            })
        }

        const peer = roomList.get(room_id).addPeer(new Peer(peerID? peerID : socket.id, name, profile))
        socket.room_id = room_id;
        peerList.set(peerID, new Peer(peerID ? peerID : socket.id, name));

        
        allPeers.push({ id: peerID ? peerID : socket.id, username: name, pic: profile });

        socket.broadcast.emit('join', { message: `${name} just joined ${room_id}.`});
        io.sockets.emit('newpeer', { peerList:  allPeers});
        //socket.broadcast.emit('peerList', { peerList: room() });
        // allPeers = [];
        console.log(allPeers);

        cb(roomList.get(room_id).toJson())
    })

    socket.on('getProducers', () => {
        console.log(`---get producers--- name:${roomList.get(socket.room_id).getPeers().get(peerID? peerID : socket.id).name}`)
        // send all the current producer to newly joined member
        if (!roomList.has(socket.room_id)) return
        let producerList = roomList.get(socket.room_id).getProducerListForPeer(peerID? peerID : socket.id)

        socket.emit('newProducers', producerList)
    })

    socket.on('getRouterRtpCapabilities', (_, callback) => {
        console.log(`---get RouterRtpCapabilities--- name: ${roomList.get(socket.room_id).getPeers().get(peerID? peerID : socket.id).name}`)
        try {
            callback(roomList.get(socket.room_id).getRtpCapabilities());
        } catch (e) {
            callback({
                error: e.message
            })
        }

    });

    socket.on('createWebRtcTransport', async (_, callback) => {
        console.log(`---create webrtc transport--- name: ${roomList.get(socket.room_id).getPeers().get(peerID? peerID : socket.id).name}`)
        try {
            const {
                params
            } = await roomList.get(socket.room_id).createWebRtcTransport(peerID? peerID : socket.id);

            callback(params);
        } catch (err) {
            console.error(err);
            callback({
                error: err.message
            });
        }
    });

    socket.on('connectTransport', async ({
        transport_id,
        dtlsParameters
    }, callback) => {
        console.log(`---connect transport--- name: ${roomList.get(socket.room_id).getPeers().get(peerID? peerID : socket.id).name}`)
        if (!roomList.has(socket.room_id)) return
        await roomList.get(socket.room_id).connectPeerTransport(peerID? peerID : socket.id, transport_id, dtlsParameters)
        
        callback('success')
    })

    socket.on('produce', async ({
        kind,
        rtpParameters,
        producerTransportId
    }, callback) => {
        
        if(!roomList.has(socket.room_id)) {
            return callback({error: 'not is a room'})
        }

        let producer_id = await roomList.get(socket.room_id).produce(peerID? peerID : socket.id, producerTransportId, rtpParameters, kind)
        console.log(`---produce--- type: ${kind} name: ${roomList.get(socket.room_id).getPeers().get(peerID? peerID : socket.id).name} id: ${producer_id}`)
        callback({
            producer_id
        })
    })

    socket.on('consume', async ({
        consumerTransportId,
        producerId,
        rtpCapabilities
    }, callback) => {
        //TODO null handling
        let params = await roomList.get(socket.room_id).consume(peerID? peerID : socket.id, consumerTransportId, producerId, rtpCapabilities)
        
        console.log(`---consuming--- name: ${roomList.get(socket.room_id) && roomList.get(socket.room_id).getPeers().get(peerID? peerID : socket.id).name} prod_id:${producerId} consumer_id:${params.id}`)
        callback(params)

       
    })

    socket.on('resume', async (data, callback) => {

        await consumer.resume();
        callback();
    });

    socket.on('getMyRoomInfo', (_, cb) => {
        cb(roomList.get(socket.room_id).toJson())
    })

    socket.on('disconnect', async () => {
        try {
            console.log(`---disconnect--- name: ${roomList.get(socket.room_id) && roomList.get(socket.room_id).getPeers().get(peerID ? peerID : socket.id).name}`)
            if (!socket.room_id) return
            const peer_id = await roomList.get(socket.room_id).removePeer(peerID? peerID : socket.id)
        if(allPeers.length !== 0) {
            let newPeers = [];
            peers = allPeers.find(peer => {
                 if(peer) {
                     return peer.id !== peer_id;
                 }
            });
            newPeers.push(peers)
            allPeers = [...newPeers];
            console.log(peer_id)
            console.log(newPeers)
            socket.broadcast.emit('updatepeer', {peerList: allPeers});
        }

        } 
        catch(err) {
            console.log(err);
        }

    })

    socket.on('producerClosed', ({
        producer_id
    }) => {
        console.log(`---producer close--- name: ${roomList.get(socket.room_id) && roomList.get(socket.room_id).getPeers().get(peerID? peerID : socket.id).name}`)
        roomList.get(socket.room_id).closeProducer(peerID? peerID : socket.id, producer_id)
    })

    socket.on('exitRoom', async (_, callback) => {
        console.log(`---exit room--- name: ${roomList.get(socket.room_id) && roomList.get(socket.room_id).getPeers().get(peerID? peerID : socket.id).name}`)
        if (!roomList.has(socket.room_id)) {
            callback({
                error: 'not currently in a room'
            })
            return
        }
        // close transports
        await roomList.get(socket.room_id).removePeer(peerID? peerID : socket.id)
        if (roomList.get(socket.room_id).getPeers().size === 0) {
            roomList.delete(socket.room_id)
        }

        socket.room_id = null


        callback('successfully exited room')
    })


     socket.on('exitPeer', async (_, callback) => {
        console.log(`---exit peer--- name: ${roomList.get(socket.room_id) && roomList.get(socket.room_id).getPeers().get(peerID? peerID : socket.id).name}`)
        if (!roomList.has(socket.room_id) && !roomList.get(socket.room_id).getPeers().get(peerID? peerID : socket.id).name) {
            callback({
                error: 'peer already left a room'
            })
            return
        }
       try {
              // close transports
        const peer_id = await roomList.get(socket.room_id).removePeer(peerID? peerID : socket.id)
       
         if(allPeers.length !== 0) {
            let newPeers = [];
            peers = allPeers.find(peer => {
                 if(peer) {
                     return peer.id !== peer_id;
                 }
            });
            newPeers.push(peers)
            allPeers = [...newPeers];
            console.log(peer_id)
            console.log(newPeers)
            socket.broadcast.emit('updatepeer', {peerList: allPeers});
        }

        callback('successfully exited from room')
       }
       catch(err) {
           console.log(err);
       }
    })

    // Chat Message
    socket.on('chat', data => {
        console.log(data);
        socket.broadcast.emit('chat', data);
    })
})

function room() {
    return Object.values(roomList).map(r => {
        return {
            router: r.router.id,
            peers: Object.values(r.peers).map(p => {
                return {
                    name: p.name,
                }
            }),
            id: r.id
        }
    })
}


/**
 * Get next mediasoup Worker.
 */
function getMediasoupWorker() {
    const worker = workers[nextMediasoupWorkerIdx];

    if (++nextMediasoupWorkerIdx === workers.length)
        nextMediasoupWorkerIdx = 0;

    return worker;
}


