console.log("Simulación VR cargada");

import * as THREE from
'https://cdn.jsdelivr.net/npm/three@0.165.0/build/three.module.js';

import { GLTFLoader } from
'https://cdn.jsdelivr.net/npm/three@0.165.0/examples/jsm/loaders/GLTFLoader.js';


// ======================================
// ESCENA
// ======================================

const scene = new THREE.Scene();

scene.background = new THREE.Color(0x87ceeb);


// ======================================
// NIEBLA
// ======================================

scene.fog = new THREE.Fog(
    0x87ceeb,
    40,
    180
);


// ======================================
// CÁMARA
// ======================================

const camera = new THREE.PerspectiveCamera(
    60,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
);

camera.position.set(
    0,
    5,
    15
);

camera.lookAt(
    0,
    2,
    0
);


// ======================================
// RENDERER
// ======================================

const renderer = new THREE.WebGLRenderer({
    antialias: true
});

renderer.setSize(
    window.innerWidth,
    window.innerHeight
);

renderer.setPixelRatio(
    window.devicePixelRatio
);

renderer.shadowMap.enabled = true;

renderer.shadowMap.type =
    THREE.PCFSoftShadowMap;


document
    .getElementById("escenarioVR")
    .appendChild(renderer.domElement);


// ======================================
// LUCES
// ======================================

// Luz ambiental

const luzAmbiente =
    new THREE.HemisphereLight(
        0xffffff,
        0x557755,
        2
    );

scene.add(luzAmbiente);


// Sol

const sol =
    new THREE.DirectionalLight(
        0xffffff,
        3
    );

sol.position.set(
    40,
    60,
    20
);

sol.castShadow = true;

sol.shadow.mapSize.width = 2048;
sol.shadow.mapSize.height = 2048;

scene.add(sol);

// ======================================
// CARGADOR GLB
// ======================================

const loader = new GLTFLoader();


// ======================================
// AVATAR
// ======================================

let avatar = null;
let mixer = null;
let acciones = {};
let accionActual = null;


// ======================================
// CONTROL DEL TECLADO
// ======================================

const teclas = {};

window.addEventListener("keydown", (evento) => {

    teclas[evento.key.toLowerCase()] = true;

});

window.addEventListener("keyup", (evento) => {

    teclas[evento.key.toLowerCase()] = false;

});




// ======================================
// MOVIMIENTO DEL AVATAR
// ======================================

function moverAvatar(delta) {

    if (!avatar) return;

    const velocidad = 6 * delta;

    let moviendo = false;


    // ==============================
    // ADELANTE
    // ==============================

    if (teclas["w"]) {

        avatar.position.z -= velocidad;

        avatar.rotation.y = Math.PI;

        moviendo = true;
    }


    // ==============================
    // ATRÁS
    // ==============================

    if (teclas["s"]) {

        avatar.position.z += velocidad;

        avatar.rotation.y = 0;

        moviendo = true;
    }


    // ==============================
    // IZQUIERDA
    // ==============================

    if (teclas["a"]) {

        avatar.position.x -= velocidad;

        avatar.rotation.y = -Math.PI / 2;

        moviendo = true;
    }


    // ==============================
    // DERECHA
    // ==============================

    if (teclas["d"]) {

        avatar.position.x += velocidad;

        avatar.rotation.y = Math.PI / 2;

        moviendo = true;
    }


    // ==============================
    // CONTROL DE ANIMACIÓN
    // ==============================

    if (accionActual) {

        if (moviendo) {

    // Solo iniciar la animación si todavía no está reproduciéndose
    if (!accionActual.isRunning()) {

        accionActual.play();

    }

} else {

    // Detener cuando deja de moverse
    accionActual.stop();

}

    }

}

// ======================================
// SUELO
// ======================================

const sueloGeometry =
    new THREE.PlaneGeometry(
        180,
        180
    );

const sueloMaterial =
    new THREE.MeshStandardMaterial({
        color: 0x4f8a4f,
        roughness: 1
    });

const suelo =
    new THREE.Mesh(
        sueloGeometry,
        sueloMaterial
    );

suelo.rotation.x =
    -Math.PI / 2;

suelo.receiveShadow = true;

scene.add(suelo);


// ======================================
// CAMINO CENTRAL
// ======================================

const caminoGeometry =
    new THREE.PlaneGeometry(
        14,
        180
    );

const caminoMaterial =
    new THREE.MeshStandardMaterial({
        color: 0x8c7655,
        roughness: 1
    });

const camino =
    new THREE.Mesh(
        caminoGeometry,
        caminoMaterial
    );

camino.rotation.x =
    -Math.PI / 2;

camino.position.y =
    0.01;

camino.receiveShadow = true;

scene.add(camino);


// ======================================
// FUNCIÓN ÁRBOL
// ======================================

function crearArbol(x, z, escala = 1) {

    const grupo =
        new THREE.Group();


    // Tronco

    const tronco =
        new THREE.Mesh(
            new THREE.CylinderGeometry(
                0.5,
                0.7,
                4,
                8
            ),
            new THREE.MeshStandardMaterial({
                color: 0x6b4226
            })
        );

    tronco.position.y =
        2;

    tronco.castShadow = true;

    grupo.add(tronco);


    // Copa 1

    const copa1 =
        new THREE.Mesh(
            new THREE.SphereGeometry(
                2.3,
                12,
                12
            ),
            new THREE.MeshStandardMaterial({
                color: 0x276b35
            })
        );

    copa1.position.y =
        5;

    copa1.castShadow = true;

    grupo.add(copa1);


    // Copa 2

    const copa2 =
        new THREE.Mesh(
            new THREE.SphereGeometry(
                1.7,
                12,
                12
            ),
            new THREE.MeshStandardMaterial({
                color: 0x348c43
            })
        );

    copa2.position.set(
        1,
        6,
        0
    );

    copa2.castShadow = true;

    grupo.add(copa2);


    grupo.position.set(
        x,
        0,
        z
    );

    grupo.scale.setScalar(
        escala
    );

    scene.add(grupo);
}


// ======================================
// ÁRBOLES
// ======================================

// Lado izquierdo

crearArbol(-25, -20, 1.3);
crearArbol(-35, -5, 1);
crearArbol(-28, 15, 1.4);
crearArbol(-40, 30, 1.2);
crearArbol(-25, 45, 0.9);


// Lado derecho

crearArbol(25, -20, 1.2);
crearArbol(35, -5, 1.4);
crearArbol(28, 15, 1);
crearArbol(40, 30, 1.3);
crearArbol(25, 45, 1);


// Fondo

crearArbol(-50, 60, 1.5);
crearArbol(-30, 65, 1);
crearArbol(30, 65, 1.3);
crearArbol(50, 60, 1.5);


// ======================================
// FUNCIÓN ROCA
// ======================================

function crearRoca(
    x,
    z,
    escala = 1
) {

    const roca =
        new THREE.Mesh(
            new THREE.DodecahedronGeometry(
                1.5,
                0
            ),
            new THREE.MeshStandardMaterial({
                color: 0x777777,
                roughness: 1
            })
        );


    roca.position.set(
        x,
        1,
        z
    );


    roca.scale.set(
        escala,
        escala * 0.7,
        escala
    );


    roca.rotation.y =
        Math.random() * Math.PI;


    roca.castShadow = true;


    scene.add(roca);
}


// ======================================
// ROCAS
// ======================================

crearRoca(-12, -15, 1.2);
crearRoca(15, -10, 0.8);
crearRoca(-18, 8, 1);
crearRoca(18, 12, 1.3);
crearRoca(-14, 30, 0.7);
crearRoca(15, 35, 1);


// ======================================
// ARBUSTOS
// ======================================

function crearArbusto(
    x,
    z
) {

    const arbusto =
        new THREE.Mesh(
            new THREE.SphereGeometry(
                1.2,
                10,
                10
            ),
            new THREE.MeshStandardMaterial({
                color: 0x3d7d3d
            })
        );


    arbusto.position.set(
        x,
        1,
        z
    );


    arbusto.scale.y =
        0.7;


    arbusto.castShadow = true;


    scene.add(arbusto);
}


crearArbusto(-10, -5);
crearArbusto(10, 2);
crearArbusto(-16, 20);
crearArbusto(16, 25);
crearArbusto(-8, 40);
crearArbusto(9, 45);


// ======================================
// LUCES DECORATIVAS
// ======================================

function crearLuz(
    x,
    z
) {

    const luz =
        new THREE.PointLight(
            0xffd27d,
            2,
            15
        );

    luz.position.set(
        x,
        3,
        z
    );

    scene.add(luz);


    const esfera =
        new THREE.Mesh(
            new THREE.SphereGeometry(
                0.2,
                12,
                12
            ),
            new THREE.MeshBasicMaterial({
                color: 0xffd27d
            })
        );

    esfera.position.copy(
        luz.position
    );

    scene.add(esfera);
}


crearLuz(-7, 5);
crearLuz(7, 5);
crearLuz(-7, 25);
crearLuz(7, 25);


// ======================================
// ZONA CENTRAL
// ======================================

const zonaGeometry =
    new THREE.CircleGeometry(
        8,
        32
    );

const zonaMaterial =
    new THREE.MeshStandardMaterial({
        color: 0x5c995c,
        roughness: 1
    });

const zona =
    new THREE.Mesh(
        zonaGeometry,
        zonaMaterial
    );

zona.rotation.x =
    -Math.PI / 2;

zona.position.y =
    0.02;

scene.add(zona);




// ======================================
// CARGAR AVATAR
// ======================================

loader.load(

    './models/avatar.glb',

    function (gltf) {

        console.log(
            "Avatar cargado correctamente"
        );


        // ==================================
        // PERSONAJE
        // ==================================

        avatar = gltf.scene;

        scene.add(avatar);


        // ==================================
        // POSICIÓN
        // ==================================

        avatar.position.set(
            0,
            0,
            0
        );


        // ==================================
        // TAMAÑO
        // ==================================

        avatar.scale.set(
            1,
            1,
            1
        );


        // ==================================
        // SOMBRAS
        // ==================================

        avatar.traverse(
            function (objeto) {

                if (objeto.isMesh) {

                    objeto.castShadow = true;
                    objeto.receiveShadow = true;

                }

            }
        );


        // ==================================
        // ANIMACIONES
        // ==================================

        console.log(
            "Animaciones encontradas:",
            gltf.animations
        );


        if (gltf.animations.length > 0) {

            mixer =
                new THREE.AnimationMixer(
                    avatar
                );


            gltf.animations.forEach(
                function (clip) {

                    console.log(
                        "Animación:",
                        clip.name
                    );


                    // ==================================
// QUITAR MOVIMIENTO DEL PERSONAJE
// ==================================

// La animación solo moverá brazos y piernas.
// El movimiento por el escenario lo controla nuestro código.

clip.tracks = clip.tracks.filter(
    function (track) {

        return !track.name.endsWith(
            ".position"
        );

    }
);


const accion =
    mixer.clipAction(
        clip
    );

accion.setLoop(
    THREE.LoopRepeat,
    Infinity
);

acciones[clip.name] =
    accion;

                }
            );


            // Reproducir la primera
            // animación automáticamente
// ==================================
// ANIMACIÓN DE CAMINAR
// ==================================

accionActual =
    gltf.animations.length > 0
        ? acciones[
            gltf.animations[0].name
        ]
        : null;

// NO reproducir todavía.
// El personaje permanecerá en pose T.


            

        }

    },

    undefined,

    function (error) {

        console.error(
            "Error cargando avatar:",
            error
        );

    }

);


// ======================================
// ANIMACIÓN
// ======================================

const reloj =
    new THREE.Clock();


function animate() {

    requestAnimationFrame(
        animate
    );

    const delta =
        reloj.getDelta();


    if (mixer) {

        mixer.update(delta);

    }


    moverAvatar(delta);


    renderer.render(
        scene,
        camera
    );

}

animate();


// ======================================
// RESPONSIVE
// ======================================

window.addEventListener(
    "resize",
    () => {

        camera.aspect =
            window.innerWidth /
            window.innerHeight;

        camera.updateProjectionMatrix();


        renderer.setSize(
            window.innerWidth,
            window.innerHeight
        );

    }
);