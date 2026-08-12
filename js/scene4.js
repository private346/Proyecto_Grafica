console.log("JS cargó correctamente");
import * as THREE from 'three';
import { GLTFLoader } from 'https://cdn.jsdelivr.net/npm/three@0.165.0/examples/jsm/loaders/GLTFLoader.js';
import { TextGeometry } from 'https://cdn.jsdelivr.net/npm/three@0.165.0/examples/jsm/geometries/TextGeometry.js';
import { FontLoader } from 'https://cdn.jsdelivr.net/npm/three@0.165.0/examples/jsm/loaders/FontLoader.js';




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
//letras
const fontLoader = new FontLoader();

/*fontLoader.load(
    'https://cdn.jsdelivr.net/npm/three@0.165.0/examples/fonts/helvetiker_regular.typeface.json',
    function (font) {

        const textGeometry = new TextGeometry('   LA NUEVA \nGENERACION', {
            font: font,
            size: 1,
            height: 0.3
        });
        

        const textMaterial = new THREE.MeshStandardMaterial({
            color: 0x00ffff,   // neón azul
            emissive: 0x00ffff,
            emissiveIntensity: 0
        });

        const textMesh = new THREE.Mesh(textGeometry, textMaterial);

        // 📍 pared del fondo (ajusta si tu pared está en z = -6)
        textMesh.position.set(-4.3, 6, -6);

        // 🔄 girar hacia la cámara
        textMesh.rotation.y = 0;

        scene.add(textMesh);
        
    }
);*/



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



//------------------------------------------------------------------------
//---------------------------------------------------------------------------------
// ======================================
// FUNCIÓN REUTILIZABLE PARA MODELOS 3D
// ======================================

function crearModelo3D(
    idContenedor,
    rutaModelo,
    velocidad = 0.01,
    rotacionX = 0,
    rotacionY = 0,
    rotacionZ = 0
) {

    const contenedorModelo =
        document.getElementById(idContenedor);

    if (!contenedorModelo) {

        console.error(
            "No se encontró el contenedor:",
            idContenedor
        );

        return;
    }


    // ======================================
    // ESCENA
    // ======================================

    const escenaModelo = new THREE.Scene();

    let modeloActual = null;


    // ======================================
    // CÁMARA
    // ======================================

    const camaraModelo =
        new THREE.PerspectiveCamera(
            45,
            contenedorModelo.clientWidth /
            contenedorModelo.clientHeight,
            0.1,
            1000
        );


    // ======================================
    // RENDERER
    // ======================================

    const rendererModelo =
        new THREE.WebGLRenderer({
            antialias: true,
            alpha: true
        });

    rendererModelo.setSize(
        contenedorModelo.clientWidth,
        contenedorModelo.clientHeight
    );

    rendererModelo.setPixelRatio(
        window.devicePixelRatio
    );

    contenedorModelo.appendChild(
        rendererModelo.domElement
    );


    // ======================================
    // LUCES
    // ======================================

    const luzAmbienteModelo =
        new THREE.AmbientLight(
            0xffffff,
            3
        );

    escenaModelo.add(
        luzAmbienteModelo
    );


    const luzModelo =
        new THREE.DirectionalLight(
            0xffffff,
            5
        );

    luzModelo.position.set(
        5,
        5,
        5
    );

    escenaModelo.add(
        luzModelo
    );


    // ======================================
    // CARGAR MODELO GLB
    // ======================================

    console.log(
        "Intentando cargar:",
        rutaModelo
    );

    loader.load(

        rutaModelo,

        function (gltf) {

            console.log(
                "Modelo cargado correctamente:",
                rutaModelo
            );


            // ======================================
            // OBTENER MODELO
            // ======================================

            const modelo =
                gltf.scene;

            modeloActual =
                modelo;
                modelo.rotation.x = rotacionX;
modelo.rotation.y = rotacionY;
modelo.rotation.z = rotacionZ;

                

            escenaModelo.add(
                modelo
            );


            // ======================================
            // CALCULAR TAMAÑO ORIGINAL
            // ======================================

            const caja =
                new THREE.Box3()
                .setFromObject(modelo);

            const tamaño =
                caja.getSize(
                    new THREE.Vector3()
                );


            console.log(
                "Tamaño original:",
                tamaño
            );


            // ======================================
            // ESCALAR MODELO
            // ======================================

            const mayor =
                Math.max(
                    tamaño.x,
                    tamaño.y,
                    tamaño.z
                );

            const escala =
                3 / mayor;

            modelo.scale.set(
                escala,
                escala,
                escala
            );


            // ======================================
            // CENTRAR MODELO
            // DESPUÉS DE ESCALAR
            // ======================================

            const cajaFinal =
                new THREE.Box3()
                .setFromObject(modelo);

            const centroFinal =
                cajaFinal.getCenter(
                    new THREE.Vector3()
                );


            modelo.position.x -=
                centroFinal.x;

            modelo.position.y -=
                centroFinal.y;

            modelo.position.z -=
                centroFinal.z;


            // ======================================
            // CALCULAR TAMAÑO FINAL
            // ======================================

            const cajaAjustada =
                new THREE.Box3()
                .setFromObject(modelo);

            const tamañoFinal =
                cajaAjustada.getSize(
                    new THREE.Vector3()
                );


            const mayorFinal =
                Math.max(
                    tamañoFinal.x,
                    tamañoFinal.y,
                    tamañoFinal.z
                );


            // ======================================
            // AJUSTAR CÁMARA
            // ======================================

            const distanciaCamara =
                mayorFinal * 1.8;


            camaraModelo.position.set(
                0,
                0,
                distanciaCamara
            );


            camaraModelo.lookAt(
                0,
                0,
                0
            );


            console.log(
                "Modelo preparado para visualizarse"
            );

        },


        undefined,


        function (error) {

            console.error(
                "Error cargando el modelo:",
                rutaModelo,
                error
            );

        }

    );


    // ======================================
    // ANIMACIÓN DEL MODELO
    // ======================================

    function animarModelo() {

        requestAnimationFrame(
            animarModelo
        );


        if (modeloActual) {

            modeloActual.rotation.y +=
                velocidad;

        }


        rendererModelo.render(
            escenaModelo,
            camaraModelo
        );

    }


    animarModelo();


    // ======================================
    // RESPONSIVE
    // ======================================

    window.addEventListener(
        "resize",
        () => {

            if (!contenedorModelo)
                return;


            camaraModelo.aspect =
                contenedorModelo.clientWidth /
                contenedorModelo.clientHeight;


            camaraModelo.updateProjectionMatrix();


            rendererModelo.setSize(
                contenedorModelo.clientWidth,
                contenedorModelo.clientHeight
            );

        }
    );

}



// ======================================
// MODELO ps5
// ======================================

crearModelo3D(
    "ps5",
    "./models/ps5.glb",
    0.005,
    0.5
);
// ======================================
// MODELO switch
// ======================================

crearModelo3D(
    "switch",
    "./models/nintendo_switch.glb",
    0.005
);

// ======================================
// MODELO pxbox
// ======================================

crearModelo3D(
    "xbox",
    "./models/xbox.glb",
    0.005,
    0.5
);
// ======================================
// MODELO px gamer
// ======================================

crearModelo3D(
    "gamer",
    "./models/pc_gamer.glb",
    0.005
);


// ======================================
// MODELO fornite
// ======================================

crearModelo3D(
    "fornite",
    "./models/deadpool_fornite.glb",
    0.005
    
);
// ======================================
// MODELO minecraft
// ======================================

crearModelo3D(
    "minecraft",
    "./models/steve.glb",
    0.005
);


// ======================================
// MODELO hollow
// ======================================

crearModelo3D(
    "hollow",
    "./models/hollow.glb",
    0.005
    
);
// ======================================
// MODELO resident evil
// ======================================

crearModelo3D(
    "evil",
    "./models/creep.glb",
    0.005
);



// ======================================
// MODELO meta
// ======================================

crearModelo3D(
    "meta",
    "./models/meta_quest_3.glb",
    0.005
    
);
// ======================================
// MODELO resident pokemon
// ======================================

crearModelo3D(
    "pokemon",
    "./models/pokeball.glb",
    0.005
);






//----------------------------------------------------------------------





//pared atras
const backWall = new THREE.Mesh(
    new THREE.PlaneGeometry(12, 8),
    wallMaterial
);

backWall.position.z = 6;   // 👈 atrás del cuarto (opuesto a frontWall)
backWall.position.y = 4;

scene.add(backWall);




//poster
const posterTexture = textureLoader.load(
    './models/textures/evil.jpg'
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
    './models/textures/thelast.jpg'
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

//poster 3
const posterTexture3 = textureLoader.load(
    './models/textures/gta.jpg'
);

const poster3 = new THREE.Mesh(
    new THREE.PlaneGeometry(2, 1.5),
    new THREE.MeshBasicMaterial({
        map: posterTexture3
    })
);

poster3.position.set(5.95, 4.5,-4); // cambia Z para separarlo
poster3.rotation.y = -Math.PI / 2;
poster3.scale.set(0.9, 3, 2);

scene.add(poster3);

//poster 4

const posterTexture4 = textureLoader.load(
    './models/textures/spider.jpg'
);

const poster4 = new THREE.Mesh(
    new THREE.PlaneGeometry(2, 1.5),
    new THREE.MeshBasicMaterial({
        map: posterTexture4
    })
);

poster4.position.set(5.95, 4.5, -2); // cambia Z para separarlo
poster4.rotation.y = -Math.PI / 2;
poster4.scale.set(0.9, 3, 2);

scene.add(poster4);

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

const target = new THREE.Vector3(0, 3.5, -6);

camera.position.set(0, 3, 3);
target.x += 0;

//--------------------------------------------------------------------------------------

//const target = new THREE.Vector3(-2, 3.5, -6);
//camera.position.set(0.2, 3, 0);
//target.x += 2000;
camera.lookAt(target);

//-----------------------------------------------------------------------
//camera.position.set(0.2, 3.5, 0.1);
    //camera.lookAt(10, 3.5,0);
//camara rotacion
const startBtn = document.getElementById("startBtn");
const backBtn = document.getElementById("backBtn");

// 🎬 Ir a la TV
/*startBtn.addEventListener("click", () => {

    targetPosition.set(0.2, 3.5, 0.1);
    targetLookAt.set(10, 3.5, 0);

    isMovingCamera = true;

    startBtn.style.display = "none";
    backBtn.style.display = "block";
});

// 🔙 Volver a vista inicial
backBtn.addEventListener("click", () => {

    targetPosition.set(0, 3, 3);
    targetLookAt.set(0, 3.5, -6);

    isMovingCamera = true;

    backBtn.style.display = "none";
    startBtn.style.display = "block";
});*/



// boton atras
const backBtn1 = document.getElementById("backBtn1");
// -----------boton desplegable
const infoBtn = document.getElementById("infoBtn");

const infoPanel = document.getElementById("infoPanel");

infoBtn.addEventListener("click", () => {

    if (infoBtn.classList.contains("abierto")) {

        // CERRAR INFORMACIÓN

        infoBtn.classList.remove("abierto");
        infoPanel.classList.remove("abierto");

        infoBtn.textContent = "▼ VER HISTORIA";

    } else {

        // ABRIR INFORMACIÓN

        infoBtn.classList.add("abierto");
        infoPanel.classList.add("abierto");

        infoBtn.textContent = "▲ REGRESAR";

    }

});
backBtn1.addEventListener("click", () => {
    sessionStorage.setItem("returnToTV", "true");
window.location.href = "index.html";
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