const $ = element => document.querySelector(element);

const chatIcon = $('.control-chats');
const chatsContainer = $('.chats-container');
const boardButton = $('.control-board .board');
const boardContainer = $('.board-container');
const controlMenu = $('.control-menu a');
const menuInner = $('.menu .inner');
const menuItem = document.querySelectorAll('.menu-item a');

chatIcon.addEventListener('click', e => {
    console.log('yeaahh', e.target)
    chatsContainer.classList.toggle('chats-container__display');
    gsap.fromTo('.chats-container', { x: 300 }, {
        duration: 0.5,
        x: 0,
        ease: "circ.out"
    })
});

controlMenu.addEventListener('click', e => {
    if (menuInner.parentElement.classList.contains('show-menu')) {
        menuInner.parentElement.classList.remove('show-menu');
    }
    menuInner.parentElement.classList.add('show-menu');
    menuInner.classList.toggle('show-inner');
})

menuItem.forEach(item => {
    item.addEventListener('click', e => {
        menuInner.parentElement.classList.remove('show-menu');
        menuInner.classList.toggle('show-inner');
        if (e.target.innerHTML == item.innerHTML) {
            console.log(e.target)
        }
    })
})

console.log(menuItem);

// Keep the modal in its own scope for its own protection
(() => {
    const $modal = document.querySelector('.modal-frame');
    const $modalPopup = document.querySelector('.modal-popup');
    const $modalOverlay = document.querySelector('.modal-overlay');
    const $close = document.getElementById('close');

    function enterNewConvo() {
        $('.create-chat-input').focus();
    }

    function closeModal() {
        $modal.classList.remove('model-active');
        $modal.classList.add('leave');
    }

    $modalPopup.addEventListener('click', (e) => {
        $modal.classList.toggle('model-active');
        $modal.classList.remove('leave');
        //enterNewConvo();
    })

    $modalOverlay.addEventListener('click', (e) => {
        closeModal();
    })

    $close.addEventListener('click', (e) => {
        closeModal();
    })

    document.addEventListener('keyup', (e) => {
        if (e.which === 27) {
            closeModal();
        }
    })

    var canvas = document.querySelector('#paint');
    var ctx = canvas.getContext('2d');
    //ctx.fillStyle = 'white';
    //ctx.fillRect(0,0,canvas.width,canvas.height);


    let drawingColor = 'red';
    let drawWidth = "4";
    let isDrawing = false;


    const start = e => {
        isDrawing = true;
        ctx.beginPath();
        ctx.moveTo(e.clientX - canvas.offsetLeft,
            e.clientY - canvas.offsetTop);
        e.preventDefault();
        console.log('start...')
    }


    const draw = e => {
        if (isDrawing) {
            ctx.lineTo(e.clientX - canvas.offsetLeft,
            e.clientY - canvas.offsetTop);
            ctx.strokeStyle = drawingColor;
            ctx.lineWidth = drawWidth;
            ctx.lineCap = 'round';
            ctx.lineJoin = 'round';
            ctx.stroke();
            console.log('drawing...')

        }
    }


    canvas.addEventListener('touchstart', start, false);
    canvas.addEventListener('touchmove', draw, false);
    canvas.addEventListener('mousedown', start, false);
    canvas.addEventListener('mousemove', draw, false);






})();

// let boardElemet = `
//      <canvas id="paint"></canvas>
//  `;



// // Create Winbox 
// boardButton.addEventListener('click', e => {

   
     
// //  let winbox = new WinBox({
// //     title: "White Board",
// //     modal: true,
// //     x: "center",
// //     y: "center",
// //     width: "80%",
// //     height: "70%",
// //     index: "10000",
// //     html: boardElemet,
// //     class: "board-container",
// //     root: document.querySelector('main')
// // });

// // board(winbox.show());

// });



// const board = (show) => {


//     if (show) {

//         var canvas = document.querySelector('#paint');
//         var ctx = canvas.getContext('2d');
//         //ctx.fillStyle = 'white';
//         //ctx.fillRect(0,0,canvas.width,canvas.height);


//         let drawingColor = 'red';
//         let drawWidth = "2";
//         let isDrawing = false;


//         const start = e => {
//             isDrawing = true;
//             ctx.beginPath();
//             ctx.moveTo(e.clientX - canvas.offsetLeft,
//                 e.clientY - canvas.offsetTop);
//             e.preventDefault();
//             console.log('start...')
//         }


//         const draw = e => {
//             if (isDrawing) {
//                 ctx.lineTo(e.clientX - canvas.offsetLeft,
//                     e.clientY - canvas.offsetTop);
//                 ctx.strokeStyle = drawingColor;
//                 ctx.lineWidth = drawWidth;
//                 ctx.lineCap = 'round';
//                 ctx.lineJoin = 'round';
//                 ctx.stroke();
//                 console.log('drawing...')

//             }
//         }


//         canvas.addEventListener('touchstart', start, false);
//         canvas.addEventListener('touchmove', draw, false);
//         canvas.addEventListener('mousedown', start, false);
//         canvas.addEventListener('mousemove', draw, false);




//     }


//     //boardContainer.innerHTML = boardElemet;



//     // return boardElemet;










//     //  var canvas = document.querySelector('#paint');
//     //  var ctx = canvas.getContext('2d');

//     // // var sketch = document.querySelector('#sketch');
//     // // var sketch_style = getComputedStyle(sketch);
//     // // canvas.width = window.innerWidth -200;//parseInt(sketch_style.getPropertyValue('width'));
//     // // canvas.height = window.innerHeight;//parseInt(sketch_style.getPropertyValue('height'));

//     // var mouse = { x: 0, y: 0 };
//     // var last_mouse = { x: 0, y: 0 };

//     // /* Mouse Capturing Work */
//     // canvas.addEventListener('mousemove', function (e) {
//     //     last_mouse.x = mouse.x;
//     //     last_mouse.y = mouse.y;

//     //     mouse.x = e.pageX - this.offsetLeft;
//     //     mouse.y = e.pageY - this.offsetTop;
//     // }, false);


//     // /* Drawing on Paint App */
//     // ctx.fillStyle = '#777'
//     // ctx.fillRect(0,0, canvas.width,canvas.height);
//     // ctx.lineWidth = 5;
//     // ctx.lineJoin = 'round';
//     // ctx.lineCap = 'round';
//     // ctx.strokeStyle = 'blue';

//     // canvas.addEventListener('mousedown', function (e) {
//     //     canvas.addEventListener('mousemove', onPaint, false);
//     // }, false);

//     // canvas.addEventListener('mouseup', function () {
//     //     canvas.removeEventListener('mousemove', onPaint, false);
//     // }, false);

//     // var onPaint = function () {
//     //     console.log('painting');
//     //     ctx.beginPath();
//     //     ctx.moveTo(last_mouse.x, last_mouse.y);
//     //     ctx.lineTo(mouse.x, mouse.y);
//     //     ctx.closePath();
//     //     ctx.stroke();
//     // };

//     // window.canvas = canvas;

//     // return canvas;
// }



// window.onload = () => {
//     board();
// }




//css button ripple effect

document.body.addEventListener("mousedown", function(event) {

    var target = event.target;

    while (target) {

        if (!target.classList || !target.classList.contains("ripple")) {

            target = target.parentNode;
        } else {

            break;
        }
    }

    if (target && target.classList.contains("ripple")) {

        // Get necessary variables
        var rect = target.getBoundingClientRect(),
            left = rect.left,
            top = rect.top,
            width = target.offsetWidth,
            height = target.offsetHeight,
            offsetTop = target.offsetTop,
            offsetLeft = target.offsetLeft,
            dx = event.clientX - left,
            dy = event.clientY - top,
            maxX = Math.max(dx, width - dx),
            maxY = Math.max(dy, height - dy),
            style = window.getComputedStyle(target),
            radius = Math.sqrt((maxX * maxX) + (maxY * maxY));

        // Create the ripple and its container
        var ripple = document.createElement("div"),
            rippleContainer = document.createElement("div");

        // Add optional classes
        if (target.classList.contains("light")) {
            ripple.classList.add("light");
        } else if (target.classList.contains("dark")) {
            ripple.classList.add("dark");
        }

        // Add class, append and set location
        ripple.classList.add("ripple-effect");
        rippleContainer.classList.add("ripple-container");
        rippleContainer.appendChild(ripple);
        document.body.appendChild(rippleContainer);

        ripple.style.marginLeft = dx + "px";
        ripple.style.marginTop = dy + "px";

        rippleContainer.style.left = left + (((window.pageXOffset || document.scrollLeft) - (document.clientLeft || 0)) || 0) + "px";
        rippleContainer.style.top = top + (((window.pageYOffset || document.scrollTop) - (document.clientTop || 0)) || 0) + "px";
        rippleContainer.style.width = width + "px";
        rippleContainer.style.height = height + "px";
        rippleContainer.style.borderTopLeftRadius = style.borderTopLeftRadius;
        rippleContainer.style.borderTopRightRadius = style.borderTopRightRadius;
        rippleContainer.style.borderBottomLeftRadius = style.borderBottomLeftRadius;
        rippleContainer.style.borderBottomRightRadius = style.borderBottomRightRadius;

        setTimeout(function() {

            ripple.style.width = radius * 2 + "px";
            ripple.style.height = radius * 2 + "px";
            ripple.style.marginLeft = dx - radius + "px";
            ripple.style.marginTop = dy - radius + "px";
        }, 0);

        setTimeout(function() {

            ripple.style.backgroundColor = "rgba(0, 0, 0, 0)";
        }, 250);

        setTimeout(function() {

            ripple.remove();
            rippleContainer.remove();
        }, 650);
    }
});




// Draggable Chats

// var object = $('.chats'),
//     initX, initY, firstX, firstY;

// object.addEventListener('mousedown', function(e) {

//     e.preventDefault();
//     initX = this.offsetLeft;
//     initY = this.offsetTop;
//     firstX = e.pageX;
//     firstY = e.pageY;

//     this.addEventListener('mousemove', dragIt, false);

//     window.addEventListener('mouseup', function() {
//         object.removeEventListener('mousemove', dragIt, false);
//     }, false);

// }, false);

// object.addEventListener('touchstart', function(e) {

//     e.preventDefault();
//     initX = this.offsetLeft;
//     initY = this.offsetTop;
//     var touch = e.touches;
//     firstX = touch[0].pageX;
//     firstY = touch[0].pageY;

//     this.addEventListener('touchmove', swipeIt, false);

//     window.addEventListener('touchend', function(e) {
//         e.preventDefault();
//         object.removeEventListener('touchmove', swipeIt, false);
//     }, false);

// }, false);

// function dragIt(e) {
//     this.style.left = initX + e.pageX - firstX + 'px';
//     this.style.top = initY + e.pageY - firstY + 'px';
// }

// function swipeIt(e) {
//     var contact = e.touches;
//     this.style.left = initX + contact[0].pageX - firstX + 'px';
//     this.style.top = initY + contact[0].pageY - firstY + 'px';
// }

//end chat drag 1




//satrt chat drag 2

// (function() {

//     "use strict";

//     // Minimum resizable area
//     var minWidth = 100;
//     var minHeight = 100;

//     // Thresholds
//     var FULLSCREEN_MARGINS = -10;
//     var MARGINS = 4;

//     // End of what's configurable.
//     var clicked = null;
//     var onRightEdge, onBottomEdge, onLeftEdge, onTopEdge;

//     var rightScreenEdge, bottomScreenEdge;

//     var preSnapped;

//     var b, x, y;

//     var redraw = false;

//     var pane = $('.chats-wrapper');
//     var ghostpane = $('.chats');

//     function setBounds(element, x, y, w, h) {
//         element.style.left = x + 'px';
//         element.style.top = y + 'px';
//         element.style.width = w + 'px';
//         element.style.height = h + 'px';
//     }

//     function hintHide() {
//         setBounds(ghostpane, b.left, b.top, b.width, b.height);
//         ghostpane.style.opacity = 0;

//         // var b = ghostpane.getBoundingClientRect();
//         // ghostpane.style.top = b.top + b.height / 2;
//         // ghostpane.style.left = b.left + b.width / 2;
//         // ghostpane.style.width = 0;
//         // ghostpane.style.height = 0;
//     }


//     // Mouse events
//     pane.addEventListener('mousedown', onMouseDown);
//     document.addEventListener('mousemove', onMove);
//     document.addEventListener('mouseup', onUp);

//     // Touch events 
//     pane.addEventListener('touchstart', onTouchDown);
//     document.addEventListener('touchmove', onTouchMove);
//     document.addEventListener('touchend', onTouchEnd);


//     function onTouchDown(e) {
//         onDown(e.touches[0]);
//         e.preventDefault();
//     }

//     function onTouchMove(e) {
//         onMove(e.touches[0]);
//     }

//     function onTouchEnd(e) {
//         if (e.touches.length == 0) onUp(e.changedTouches[0]);
//     }

//     function onMouseDown(e) {
//         onDown(e);
//         e.preventDefault();
//     }

//     function onDown(e) {
//         calc(e);

//         var isResizing = onRightEdge || onBottomEdge || onTopEdge || onLeftEdge;

//         clicked = {
//             x: x,
//             y: y,
//             cx: e.clientX,
//             cy: e.clientY,
//             w: b.width,
//             h: b.height,
//             isResizing: isResizing,
//             isMoving: !isResizing && canMove(),
//             onTopEdge: onTopEdge,
//             onLeftEdge: onLeftEdge,
//             onRightEdge: onRightEdge,
//             onBottomEdge: onBottomEdge
//         };
//     }

//     function canMove() {
//         return x > 0 && x < b.width && y > 0 && y < b.height &&
//             y < 30;
//     }

//     function calc(e) {
//         b = pane.getBoundingClientRect();
//         x = e.clientX - b.left;
//         y = e.clientY - b.top;

//         onTopEdge = y < MARGINS;
//         onLeftEdge = x < MARGINS;
//         onRightEdge = x >= b.width - MARGINS;
//         onBottomEdge = y >= b.height - MARGINS;

//         rightScreenEdge = window.innerWidth - MARGINS;
//         bottomScreenEdge = window.innerHeight - MARGINS;
//     }

//     var e;

//     function onMove(ee) {
//         calc(ee);

//         e = ee;

//         redraw = true;

//     }

//     function animate() {

//         requestAnimationFrame(animate);

//         if (!redraw) return;

//         redraw = false;

//         if (clicked && clicked.isResizing) {

//             if (clicked.onRightEdge) pane.style.width = Math.max(x, minWidth) + 'px';
//             if (clicked.onBottomEdge) pane.style.height = Math.max(y, minHeight) + 'px';

//             if (clicked.onLeftEdge) {
//                 var currentWidth = Math.max(clicked.cx - e.clientX + clicked.w, minWidth);
//                 if (currentWidth > minWidth) {
//                     pane.style.width = currentWidth + 'px';
//                     pane.style.left = e.clientX + 'px';
//                 }
//             }

//             if (clicked.onTopEdge) {
//                 var currentHeight = Math.max(clicked.cy - e.clientY + clicked.h, minHeight);
//                 if (currentHeight > minHeight) {
//                     pane.style.height = currentHeight + 'px';
//                     pane.style.top = e.clientY + 'px';
//                 }
//             }

//             hintHide();

//             return;
//         }

//         if (clicked && clicked.isMoving) {

//             if (b.top < FULLSCREEN_MARGINS || b.left < FULLSCREEN_MARGINS || b.right > window.innerWidth - FULLSCREEN_MARGINS || b.bottom > window.innerHeight - FULLSCREEN_MARGINS) {
//                 // hintFull();
//                 setBounds(ghostpane, 0, 0, window.innerWidth, window.innerHeight);
//                 ghostpane.style.opacity = 0.2;
//             } else if (b.top < MARGINS) {
//                 // hintTop();
//                 setBounds(ghostpane, 0, 0, window.innerWidth, window.innerHeight / 2);
//                 ghostpane.style.opacity = 0.2;
//             } else if (b.left < MARGINS) {
//                 // hintLeft();
//                 setBounds(ghostpane, 0, 0, window.innerWidth / 2, window.innerHeight);
//                 ghostpane.style.opacity = 0.2;
//             } else if (b.right > rightScreenEdge) {
//                 // hintRight();
//                 setBounds(ghostpane, window.innerWidth / 2, 0, window.innerWidth / 2, window.innerHeight);
//                 ghostpane.style.opacity = 0.2;
//             } else if (b.bottom > bottomScreenEdge) {
//                 // hintBottom();
//                 setBounds(ghostpane, 0, window.innerHeight / 2, window.innerWidth, window.innerWidth / 2);
//                 ghostpane.style.opacity = 0.2;
//             } else {
//                 hintHide();
//             }

//             if (preSnapped) {
//                 setBounds(pane,
//                     e.clientX - preSnapped.width / 2,
//                     e.clientY - Math.min(clicked.y, preSnapped.height),
//                     preSnapped.width,
//                     preSnapped.height
//                 );
//                 return;
//             }

//             // moving
//             pane.style.top = (e.clientY - clicked.y) + 'px';
//             pane.style.left = (e.clientX - clicked.x) + 'px';

//             return;
//         }

//         // This code executes when mouse moves without clicking

//         // style cursor
//         if (onRightEdge && onBottomEdge || onLeftEdge && onTopEdge) {
//             pane.style.cursor = 'nwse-resize';
//         } else if (onRightEdge && onTopEdge || onBottomEdge && onLeftEdge) {
//             pane.style.cursor = 'nesw-resize';
//         } else if (onRightEdge || onLeftEdge) {
//             pane.style.cursor = 'ew-resize';
//         } else if (onBottomEdge || onTopEdge) {
//             pane.style.cursor = 'ns-resize';
//         } else if (canMove()) {
//             pane.style.cursor = 'move';
//         } else {
//             pane.style.cursor = 'default';
//         }
//     }

//     animate();

//     function onUp(e) {
//         calc(e);

//         if (clicked && clicked.isMoving) {
//             // Snap
//             var snapped = {
//                 width: b.width,
//                 height: b.height
//             };

//             if (b.top < FULLSCREEN_MARGINS || b.left < FULLSCREEN_MARGINS || b.right > window.innerWidth - FULLSCREEN_MARGINS || b.bottom > window.innerHeight - FULLSCREEN_MARGINS) {
//                 // hintFull();
//                 setBounds(pane, 0, 0, window.innerWidth, window.innerHeight);
//                 preSnapped = snapped;
//             } else if (b.top < MARGINS) {
//                 // hintTop();
//                 setBounds(pane, 0, 0, window.innerWidth, window.innerHeight / 2);
//                 preSnapped = snapped;
//             } else if (b.left < MARGINS) {
//                 // hintLeft();
//                 setBounds(pane, 0, 0, window.innerWidth / 2, window.innerHeight);
//                 preSnapped = snapped;
//             } else if (b.right > rightScreenEdge) {
//                 // hintRight();
//                 setBounds(pane, window.innerWidth / 2, 0, window.innerWidth / 2, window.innerHeight);
//                 preSnapped = snapped;
//             } else if (b.bottom > bottomScreenEdge) {
//                 // hintBottom();
//                 setBounds(pane, 0, window.innerHeight / 2, window.innerWidth, window.innerWidth / 2);
//                 preSnapped = snapped;
//             } else {
//                 preSnapped = null;
//             }

//             hintHide();

//         }

//         clicked = null;

//     }
// })();