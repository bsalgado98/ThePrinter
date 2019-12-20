import { Printer } from './objects/Printer.js';
import { PrintedText } from './objects/PrintedText.js';
import { PointerLockControls } from './node_modules/three/examples/jsm/controls/PointerLockControls.js'

//WORLD
let scene, camera, controls, renderer, ambLight, frontLight;

//CONSTANTS
const COLORS = {
    BLACK: 0x000000,
    WHITE: 0xFFFFFF,
    GREEN: 0x39ff14
}

//GLOBAL PROPERTIES
let loader, userInputText, readyToPrint = false;

var moveForward = false;
var moveBackward = false;
var moveLeft = false;
var moveRight = false;
var canJump = false;

var prevTime = performance.now();
var velocity = new THREE.Vector3();
var direction = new THREE.Vector3();
var vertex = new THREE.Vector3();
var color = new THREE.Color();
let gamepads, gp

//DOM ELEMENTS
const textSubmit = document.getElementById('text-submit');
const textInput = document.getElementById('text-input');

//OBJECTS
let printer, printedText;

function setup(font) {
    //WORLD SETUP
    scene = new THREE.Scene();

    camera = new THREE.PerspectiveCamera();
    // camera.position.x = 20;
    camera.position.y = 10;
    camera.position.z = 40;
    // camera.rotation.y += 0.4;
    // camera.rotation.x -= 0.2;
    renderer = new THREE.WebGLRenderer();
    renderer.setClearColor(COLORS.BLACK);
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.shadowMap.enabled = true;

    controls = new PointerLockControls(camera);
    controls.lock();
    scene.add(controls.getObject());

    gamepads = navigator.getGamepads ? navigator.getGamepads() : (navigator.webkitGetGamepads ? navigator.webkitGetGamepads() : [])
    if(!gamepads) {
        console.log('NO GAMEPADS!')
        return;
    }
    else {
        console.log('WE GOT SOME GAMEPADS')
    }
    gp = gamepads[0]

    var onKeyDown = function ( event ) {

        switch ( event.keyCode ) {

            case 38: // up
            case 87: // w
                moveForward = true;
                break;

            case 37: // left
            case 65: // a
                moveLeft = true;
                break;

            case 40: // down
            case 83: // s
                moveBackward = true;
                break;

            case 39: // right
            case 68: // d
                moveRight = true;
                break;

            case 32: // space
                if ( canJump === true ) velocity.y += 350;
                canJump = false;
                break;

        }

    };

    var onKeyUp = function ( event ) {

        switch ( event.keyCode ) {

            case 38: // up
            case 87: // w
                moveForward = false;
                break;

            case 37: // left
            case 65: // a
                moveLeft = false;
                break;

            case 40: // down
            case 83: // s
                moveBackward = false;
                break;

            case 39: // right
            case 68: // d
                moveRight = false;
                break;

        }

    };

    document.addEventListener( 'keydown', onKeyDown, false );
    document.addEventListener( 'keyup', onKeyUp, false );

    document.getElementById("printer").appendChild(renderer.domElement);

    ambLight = new THREE.AmbientLight(0x798296, 1.0);
    scene.add(ambLight);

    frontLight = new THREE.DirectionalLight(COLORS.WHITE, 0.2);
    frontLight.position.set(0, 0, 200);
    frontLight.castShadow = true;
    scene.add(frontLight);

    //OBJECT SETUP
    printer = new Printer(7, COLORS.GREEN);
    scene.add(printer.mesh);

    printedText = new PrintedText("", COLORS.WHITE, font);
    scene.add(printedText.mesh);
}

function animate() {
    gamepads = navigator.getGamepads ? navigator.getGamepads() : (navigator.webkitGetGamepads ? navigator.webkitGetGamepads() : [])
    gp = gamepads[1]
    if(gp) {
        console.log(gp.axes)
        if(axesMoved(gp.axes[3]) < 0) {
            moveForward = true
        }
        else if(axesMoved(gp.axes[3]) > 0) {
            moveBackward = true
        }
        else if(axesMoved(gp.axes[2]) < 0) {
            moveLeft = true
        }
        else if(axesMoved(gp.axes[2]) > 0) {
            moveRight = true
        }
        else {
            moveForward = false
            moveBackward = false
            moveLeft = false
            moveRight = false
        }
    }
    // if(readyToPrint) {
    //     printedText.print();
    // }

    var time = performance.now();
    var delta = ( time - prevTime ) / 1000;

    velocity.x -= velocity.x * 10.0 * delta;
    velocity.z -= velocity.z * 10.0 * delta;

    velocity.y -= 9.8 * 100.0 * delta; // 100.0 = mass

    direction.z = Number( moveForward ) - Number( moveBackward );
    direction.x = Number( moveRight ) - Number( moveLeft );
    direction.normalize(); // this ensures consistent movements in all directions

    if ( moveForward || moveBackward ) velocity.z -= direction.z * 400.0 * delta;
    if ( moveLeft || moveRight ) velocity.x -= direction.x * 400.0 * delta;

    // if ( onObject === true ) {

    //     velocity.y = Math.max( 0, velocity.y );
    //     canJump = true;

    // }

    controls.moveRight( - velocity.x * delta );
    controls.moveForward( - velocity.z * delta );

    controls.getObject().position.y += ( velocity.y * delta ); // new behavior

    if ( controls.getObject().position.y < 10 ) {

        velocity.y = 0;
        controls.getObject().position.y = 10;

        canJump = true;

    }

    prevTime = time;

    window.requestAnimationFrame(animate);
    renderer.render(scene, camera);
}

function setupListeners() {
    textSubmit.addEventListener('click', () => {
        printedText.setText(textInput.value);
        scene.add(printedText.mesh)
        readyToPrint = true;
        printedText.print();
    })
    window.addEventListener("gamepadconnected", (e) => {
        var gamepad = navigator.getGamepads()[e.gamepad.index]
        console.log("Gamepad connected at index %d: %s. %d buttons, %d axes.", gamepad.index, gamepad.id, gamepad.buttons.length, gamepad.axes.length)
    })
}

function axesMoved(a) {
    if(a !== 0) {
        return a
    }
    else {
        return 0
    }
}

function buttonPressed(b) {
    if(typeof(b) == "object") {
        return b.pressed
    }
    return b == 1.0
}

// function setupControls() {
//     window.onkeydown = function(e) {
//         switch(e.keyCode) {
//             case 83:
//                 camera.position.z += 1;
//                 break;
//             case 87:
//                 camera.position.z -= 1;
//                 break;
//             case 65:
//                 camera.position.x -= 1;
//                 break;
//             case 68:
//                 camera.position.x += 1;
//                 break;
//         }
//     }
// }

loader = new THREE.FontLoader();
loader.load('./node_modules/three/examples/fonts/helvetiker_regular.typeface.json', (font) => {
    setup(font);
    setupListeners();
    // setupControls();
    animate();
})