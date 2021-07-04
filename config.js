const os = require('os');


const getListenIps = () => {
    const listenIps = []
    if (typeof window === 'undefined') {
        const os = require('os')
        const networkInterfaces = os.networkInterfaces()
        const ips = []
        if (networkInterfaces) {
            for (const [key, addresses] of Object.entries(networkInterfaces)) {
                addresses.forEach(address => {
                    if (address.family === 'IPv4') {
                        listenIps.push({ ip: address.address, announcedIp: null })
                    }
                    /* ignore link-local and other special ipv6 addresses.
                     * https://www.iana.org/assignments/ipv6-address-space/ipv6-address-space.xhtml
                     */
                    else if (address.family === 'IPv6' && address.address[0] !== 'f') {
                        listenIps.push({ ip: address.address, announcedIp: null })
                    }
                })
            }
        }
    }
    if (listenIps.length === 0) {
        listenIps.push({ ip: '127.0.0.1', announcedIp: null })
    }
    return listenIps
}

module.exports = {
    listenIp: '127.0.0.1',
    listenPort: 3016,
    sslCrt: './ssl/cert.pem',
    sslKey: './ssl/key.pem',

    mediasoup: {
        // Worker settings
        numWorkers: Object.keys(os.cpus()).length,
        worker: {
            rtcMinPort: 10000,
            rtcMaxPort: 10100,
            logLevel: 'warn',
            logTags: [
                'info',
                'ice',
                'dtls',
                'rtp',
                'srtp',
                'rtcp',
                // 'rtx',
                // 'bwe',
                // 'score',
                // 'simulcast',
                // 'svc'
            ],
        },
        // Router settings
        router: {
            mediaCodecs:
                [
                    {
                        kind: 'audio',
                        mimeType: 'audio/opus',
                        clockRate: 48000,
                        channels: 2
                    },
                    {
                        kind: 'video',
                        mimeType: 'video/VP8',
                        clockRate: 90000,
                        parameters:
                        {
                            'x-google-start-bitrate': 1000
                        }
                    },
                ]
        },
        // WebRtcTransport settings
        webRtcTransport: {
            listenIps: getListenIps(),
            maxIncomingBitrate: 1500000,
            initialAvailableOutgoingBitrate: 1000000
        },
    }
};

