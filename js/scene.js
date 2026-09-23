console.log("JS cargó correctamente");
import * as THREE from 'three';
import { GLTFLoader } from 'https://cdn.jsdelivr.net/npm/three@0.165.0/examples/jsm/loaders/GLTFLoader.js';
import { TextGeometry } from 'https://cdn.jsdelivr.net/npm/three@0.165.0/examples/jsm/geometries/TextGeometry.js';
import { FontLoader } from 'https://cdn.jsdelivr.net/npm/three@0.165.0/examples/jsm/loaders/FontLoader.js';

const cameFromRoom = sessionStorage.getItem("cameFromRoom");


const scene = new THREE.Scene();
const textureLoader = new THREE.TextureLoader();

scene.background = new THREE.Color(0xd8d8d8);

const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
);
const targetPosition = new THREE.Vector3();
const targetLookAt = new THREE.Vector3();
let isMovingCamera = false;


const renderer = new THREE.WebGLRenderer({
    antialias: true
});

renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;

document.body.appendChild(renderer.domElement);
// vista guardada
const returnToTV = sessionStorage.getItem("returnToTV");
//letras
const fontLoader = new FontLoader();

fontLoader.load(
    'https://cdn.jsdelivr.net/npm/three@0.165.0/examples/fonts/helvetiker_regular.typeface.json',
    function (font) {

        const textGeometry = new TextGeometry('SALON DE LA HISTORIA \n DE LOS VIDEOJUEGOS', {
            font: font,
            size: 0.7,
            height: 0.3
        });
        

        const textMaterial = new THREE.MeshStandardMaterial({
            color: 0x00ffff,   // neón azul
            emissive: 0x00ffff,
            emissiveIntensity: 0
        });

        const textMesh = new THREE.Mesh(textGeometry, textMaterial);

        // 📍 pared del fondo (ajusta si tu pared está en z = -6)
        textMesh.position.set(-5.4, 6, -6);

        // 🔄 girar hacia la cámara
        textMesh.rotation.y = 0;

        scene.add(textMesh);
        
    }
);



// ======================================
// PISO
// ======================================

const carpetTexture = textureLoader.load('./models/textures/alfombra_rojo.jpg');

const floor = new THREE.Mesh(
    new THREE.PlaneGeometry(12, 12),
    new THREE.MeshStandardMaterial({
        map: carpetTexture
    })
);

floor.rotation.x = -Math.PI / 2;
floor.receiveShadow = true;

scene.add(floor);



// ======================================
// TECHO
// ======================================

const ceilingGeometry = new THREE.PlaneGeometry(12, 12);
const ceilingTexture = textureLoader.load('./models/textures/negro.jpg');

ceilingTexture.wrapS = THREE.RepeatWrapping;
ceilingTexture.wrapT = THREE.RepeatWrapping;
ceilingTexture.repeat.set(2, 2);


const ceilingMaterial = new THREE.MeshStandardMaterial({
    map: ceilingTexture,
    side: THREE.DoubleSide
});

const ceiling = new THREE.Mesh(
    ceilingGeometry,
    ceilingMaterial
);

ceiling.rotation.x = Math.PI / 2;
ceiling.position.y = 8;

scene.add(ceiling);



// ======================================
// MATERIAL PAREDES
// ======================================
const wallTexture = textureLoader.load('./models/textures/negro.jpg');

wallTexture.wrapS = THREE.RepeatWrapping;
wallTexture.wrapT = THREE.RepeatWrapping;
wallTexture.repeat.set(2, 2);

const wallMaterial = new THREE.MeshStandardMaterial({
    map: wallTexture,
    side: THREE.DoubleSide
});

// ======================================
// PARED FRONTAL
// ======================================

const frontWall = new THREE.Mesh(
    new THREE.PlaneGeometry(12, 8),
    wallMaterial
);

frontWall.position.z = -6;
frontWall.position.y = 4;

scene.add(frontWall);



// ======================================
// PARED IZQUIERDA
// ======================================

const leftWall = new THREE.Mesh(
    new THREE.PlaneGeometry(20, 8),
    wallMaterial
);

leftWall.rotation.y = Math.PI / 2;

leftWall.position.x = -6;
leftWall.position.y = 4;

scene.add(leftWall);



// ======================================
// PARED DERECHA
// ======================================

const rightWall = new THREE.Mesh(
    new THREE.PlaneGeometry(12, 8),
    wallMaterial
);

rightWall.rotation.y = -Math.PI / 2;

rightWall.position.x = 6;
rightWall.position.y = 4;

scene.add(rightWall);

const loader = new GLTFLoader();











//pared atras
const backWall = new THREE.Mesh(
    new THREE.PlaneGeometry(12, 8),
    wallMaterial
);

backWall.position.z = 6;   // 👈 atrás del cuarto (opuesto a frontWall)
backWall.position.y = 4;

scene.add(backWall);
//Sofa
loader.load(
    './models/sillon_curvo.glb',   // archivo

    function (gltf) {

        const sillon = gltf.scene;

        // posición en el centro del museo
        sillon.position.set(-5, 0, -3);

        // escala (ajusta si es necesario)
        sillon.scale.set(2, 2, 3);
        // rotacion 90 grados
        sillon.rotation.y = Math.PI / 2; 

        // sombras (opcional pero recomendado)
        sillon.traverse((child) => {
            if (child.isMesh) {
                child.castShadow = true;
                child.receiveShadow = true;
            }
        });

        //agregar a la escena
        scene.add(sillon);

        console.log("Sillón cargado correctamente");
    },

    function (xhr) {
        console.log((xhr.loaded / xhr.total * 100).toFixed(2) + "% cargado");
    },

    function (error) {
        console.error("Error cargando GLB:", error);
    }
);

//Mesa principal
let mesa;
loader.load(
    './models/mesa_centro2.glb',
    function (gltf) {
        mesa = gltf.scene;
        // POSICIÓN
        mesa.position.set(
            0.7,    // izquierda, derecha
            0.45,    // Y
            //-5 
            -2  // Z    atras, adelante
        );
        // ESCALA
        mesa.scale.set(
            4,    // X
            3,    // Y
            4     // Z
        );
        // ROTACIÓN
        mesa.rotation.set(
            0,              // X
            Math.PI / 3,    // Y
            0              // Z
        );

        scene.add(mesa);

        console.log("Mesa cargada");
    },

    undefined,

    function (error) {
        console.error(error);
    }
);

//tv
let tv;
loader.load(
    './models/tv.glb',
    function (gltf) {
        tv = gltf.scene;
        // POSICIÓN
        tv.position.set(
            5.95,    // izquierda, derecha
            10.5,    // Y
            -25.5  // Z    atras, adelante
        );
        // ESCALA
        tv.scale.set(
            10,    // X
            9,    // Y
            4     // Z
        );
        // ROTACIÓN
        tv.rotation.set(
            0,              // X
            -Math.PI / 2,    // Y
            0              // Z
        );

        scene.add(tv);

        console.log("Mesa cargada");
    },

    undefined,

    function (error) {
        console.error(error);
    }
);
























// taburete
let taburete;

loader.load(
    './models/taburete.glb',

    function (gltf) {

        // TABURETE 1
        taburete = gltf.scene;

        taburete.position.set(-1, 0, -5);
        taburete.scale.set(3, 1, 3);
        taburete.rotation.set(0, Math.PI / 3, 0);

        scene.add(taburete);

        // TABURETE 2
        const taburete2 = taburete.clone();

        taburete2.position.set(3.5, 0, -5);

        scene.add(taburete2);

        console.log("Taburetes cargados");
    },

    undefined,

    function (error) {
        console.error(error);
    }
);

//poster
const posterTexture = textureLoader.load(
    './models/textures/kratos.jpg'
);

const poster = new THREE.Mesh(
    new THREE.PlaneGeometry(2, 1.5),
    new THREE.MeshBasicMaterial({
        map: posterTexture
    })
);

poster.position.set(-5.95, 4.5, -2);
poster.rotation.y = Math.PI / 2;
poster.scale.set(0.9,3,2);

scene.add(poster);

//poster1
const poster1Texture = textureLoader.load(
    './models/textures/call-of-duty-mobile.jpg'
);

const poster1 = new THREE.Mesh(
    new THREE.PlaneGeometry(2, 1.5),
    new THREE.MeshBasicMaterial({
        map: poster1Texture
    })
);

poster1.position.set(-5.95, 4.5, -4);
poster1.rotation.y = Math.PI / 2;
poster1.scale.set(0.9,3,2);

scene.add(poster1);



// ======================================
// LUZ AMBIENTE
// ======================================

const ambientLight = new THREE.AmbientLight(
    0xffffff,
    2
);

scene.add(ambientLight);



// ======================================
// LUZ TECHO
// ======================================

const ceilingLight = new THREE.PointLight(
    0xffffff,
    60,
    30
);

ceilingLight.position.set(
    0,
    7.5,
    0
);

scene.add(ceilingLight);



// ======================================
// ILUMINACIÓN AZUL
// ======================================

const blueLight = new THREE.PointLight(
    0x4d6fff,
    30,
    15
);

blueLight.position.set(
    5,
    3,
    -5
);

scene.add(blueLight);



// ======================================
// CÁMARA
// ======================================
//original

//-------------const target = new THREE.Vector3(0, 3.5, -6);

//----------------camera.position.set(0, 3, 3);
//--------target.x += 0;


//--------------------------------------------------------------------------------------

//const target = new THREE.Vector3(-2, 3.5, -6);
//camera.position.set(0.2, 3, 0);
//target.x += 2000;
//------------------camera.lookAt(target);

//-----------------------------------------------------------------------
//camera.position.set(0.2, 3.5, 0.1);
    //camera.lookAt(10, 3.5,0);
//camara rotacion
const startBtn = document.getElementById("startBtn");
const backBtn = document.getElementById("backBtn");
const room1Btn = document.getElementById("room1Btn");
const room2Btn = document.getElementById("room2Btn");
const room3Btn = document.getElementById("room3Btn");
const room4Btn = document.getElementById("room4Btn");


// ======================================
// VIDEO EN LA TV PRINCIPAL
// ======================================

const video = document.createElement("video");

video.src = "./videos/Principal.mp4";

video.loop = true;
video.muted = true;
video.playsInline = true;

const videoTexture = new THREE.VideoTexture(video);

videoTexture.colorSpace = THREE.SRGBColorSpace;

const videoMaterial = new THREE.MeshBasicMaterial({
    map: videoTexture
});

const videoScreen = new THREE.Mesh(
    new THREE.PlaneGeometry(11, 5.9),
    videoMaterial
);

videoScreen.position.set(
    5.949,
    4.3,
    0
);

videoScreen.rotation.y = -Math.PI / 2;

// Oculto al inicio
videoScreen.visible = false;

scene.add(videoScreen);


// ======================================
// INICIAR VIDEO AL PRESIONAR INICIAR
// ======================================

startBtn.addEventListener("click", () => {

    videoScreen.visible = true;

    video.currentTime = 0;
    video.muted = false;

    video.play()
        .then(() => {
            console.log("VIDEO PRINCIPAL REPRODUCIÉNDOSE CON AUDIO");
        })
        .catch((error) => {
            console.error("NO SE PUDO REPRODUCIR EL VIDEO:", error);
        });

});

if (returnToTV) {

    camera.position.set(0.2, 3.5, 0.1);
    camera.lookAt(10, 3.5, 0);

    startBtn.style.display = "none";
    backBtn.style.display = "block";

    room1Btn.style.display = "block";
    room2Btn.style.display = "block";
    room3Btn.style.display = "block";
    room4Btn.style.display = "block";






    videoScreen.visible = true;

video.currentTime = 0;
video.muted = false;

video.play()
    .then(() => {
        console.log("VIDEO PRINCIPAL REPRODUCIÉNDOSE AL REGRESAR DEL CUARTO");
    })
    .catch((error) => {
        console.error("NO SE PUDO REPRODUCIR EL VIDEO:", error);
    });



    

} else {

    camera.position.set(0, 3, 3);
    camera.lookAt(0, 3.5, -6);

    startBtn.style.display = "block";
    backBtn.style.display = "none";
}

// 🎬 Ir a la TV
startBtn.addEventListener("click", () => {

    targetPosition.set(0.2, 3.5, 0.1);
    targetLookAt.set(10, 3.5, 0);

    isMovingCamera = true;

    startBtn.style.display = "none";
    backBtn.style.display = "block";
    room1Btn.style.display = "block";
    room2Btn.style.display = "block";
    room3Btn.style.display = "block";
    room4Btn.style.display = "block";
});

// 🔙 Volver a vista inicial
backBtn.addEventListener("click", () => {

    // Detener y ocultar el video
    video.pause();
    video.currentTime = 0;
    video.muted = true;
    videoScreen.visible = false;

    // Movimiento de cámara
    targetPosition.set(0, 3, 3);
    targetLookAt.set(0, 3.5, -6);

    isMovingCamera = true;

    backBtn.style.display = "none";
    startBtn.style.display = "block";

    room1Btn.style.display = "none";
    room2Btn.style.display = "none";
    room3Btn.style.display = "none";
    room4Btn.style.display = "none";
});

room1Btn.addEventListener("click", () => {
    window.location.href = "cuarto1.html";
});

room2Btn.addEventListener("click", () => {
    window.location.href = "cuarto2.html";
});

room3Btn.addEventListener("click", () => {
    window.location.href = "cuarto3.html";
});

room4Btn.addEventListener("click", () => {
    window.location.href = "cuarto4.html";
});

// ======================================
// RESPONSIVE
// ======================================

window.addEventListener('resize', () => {

    camera.aspect =
        window.innerWidth /
        window.innerHeight;

    camera.updateProjectionMatrix();

    renderer.setSize(
        window.innerWidth,
        window.innerHeight
    );

});



// ======================================
// ANIMACIÓN
// ======================================

function animate() {

    requestAnimationFrame(animate);

    if (isMovingCamera) {

        camera.position.lerp(targetPosition, 0.05);

        const look = new THREE.Vector3();
        look.lerpVectors(camera.position, targetLookAt, 0.05);

        camera.lookAt(look);

        if (camera.position.distanceTo(targetPosition) < 0.1) {
            isMovingCamera = false;
        }
    }

    renderer.render(scene, camera);
}

animate();