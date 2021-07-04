
const webCam = document.querySelector('.webcam');

const video = document.createElement('video');

const getVideo = async () => {
    video.muted = false;
    video.autoplay = true;
    video.srcObject = await initCamera();
    video.play();
    webCam.appendChild(video);
}


const initCamera = async () => {
    const config = { video: true, audio: true };
    const browser = navigator;
    let stream;

    browser.getUserMedia =
        browser.getUserMedia ||
        // for chrome
        browser.webkitGetUserMedia ||
        // for firefox
        browser.mozGetUserMedia ||
        // for internet explorer
        browser.msGetUserMedia;

   stream = await browser.mediaDevices.getUserMedia(config);

   return stream;
}

getVideo();
document.addEventListener('load', getVideo, false);