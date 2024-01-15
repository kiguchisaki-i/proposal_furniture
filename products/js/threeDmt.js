import * as THREE from "https://unpkg.com/three@0.126.1/build/three.module.js";
import { GLTFLoader } from "https://unpkg.com/three@0.126.1/examples/jsm/loaders/GLTFLoader.js";

let camera;
let scene;
let renderer;
let model;
let dirLight;

let inertialScroll = 0;
let inertialScrollPercent = 0;

let targetRotation = 0;

init();
animate();

function onScroll(){
    
}

function init() {
    renderer = new THREE.WebGLRenderer({
        alpha: true,
        antialias: true,
        physicallyCorrectLights: true,
    });
    renderer.setClearColor(0x000000, 0);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.outputEncoding = THREE.sRGBEncoding;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
    

    document
        .getElementById("furnitureCanvasWrap-ul")
        .appendChild(renderer.domElement);

    scene = new THREE.Scene();

    camera = new THREE.PerspectiveCamera(
        60,
        window.innerWidth / window.innerHeight,
        0.01,  
        1000
    );


    camera.position.set(80, 50, 60);
    camera.lookAt(new THREE.Vector3(10, 0, 0));

    dirLight = new THREE.SpotLight(0xffffff, 1.5);
    dirLight.position.copy(camera.position);
    scene.add(dirLight);

    const targetObject = new THREE.Object3D();
    targetObject.position.set(0, 10, 0);
    scene.add(targetObject);
    dirLight.target = targetObject;

    const loader = new GLTFLoader();

    loader.load(
        "./object/sofa2.glb",
        function (gltf) {
            model = gltf.scene;
            model.traverse((object) => {
                if (object.isMesh) {
                    object.material.transparent = true;
                    object.material.opacity = 1;
                    object.material.depthTest = true;
                }
            });
            model.scale.set(2, 2, 2);
            scene.add(model);
        },
        undefined,
        function (e) {
            console.error(e);
        }
    );

    window.addEventListener("scroll", function () {
        onScroll();
        setScrollPercent();
    });
    window.addEventListener("resize", onResize);

    window.addEventListener("scroll", onScroll);
    window.addEventListener("resize", onResize);
}


function onResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

function animate() {
    requestAnimationFrame(animate);

    dirLight.position.copy(camera.position);

    if (model) {
        model.rotation.y += (targetRotation - model.rotation.y) * 0.1;
    }

    renderer.render(scene, camera);
}
