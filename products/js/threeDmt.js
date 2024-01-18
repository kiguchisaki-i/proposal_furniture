import * as THREE from "https://unpkg.com/three@0.126.1/build/three.module.js";
import { GLTFLoader } from "https://unpkg.com/three@0.126.1/examples/jsm/loaders/GLTFLoader.js";

let camera;
let scene;
let renderer;
let model;
let dirLight;

/*
let inertialScroll = 0;
let inertialScrollPercent = 0;
*/

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
        50,
        window.innerWidth / window.innerHeight,
        0.001,  
        1000
    );


    camera.position.set(80, 50, 70);
    camera.lookAt(new THREE.Vector3(10, 0, 0));

    dirLight = new THREE.SpotLight(0xffffff, 1.5);
    dirLight.position.copy(camera.position);
    scene.add(dirLight);

    const targetObject = new THREE.Object3D();
    targetObject.position.set(0, 10, 0);
    scene.add(targetObject);
    dirLight.target = targetObject;

    const loader = new GLTFLoader();

    var filepaths = [
    "./object/sofa-var-3.glb",
    "./object/another-object.glb",
];

// 各ファイルを非同期でロードする
for (var i = 0; i < filepaths.length; i++) {
    loader.load(
        filepaths[i],
        function (gltf) {
            var loadedModel = gltf.scene;
            loadedModel.traverse((object) => {
                if (object.isMesh) {
                    object.material.transparent = true;
                    object.material.opacity = 1;
                    object.material.depthTest = true;
                }
            });
            loadedModel.scale.set(3, 3, 3);
            scene.add(loadedModel);
        },
        undefined,
        function (e) {
            console.error(e);
        }
    );
}

    window.addEventListener("scroll", function () {
        /*onScroll();
        setScrollPercent();*/
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

function stopRotation() {
    gsap.to(model.rotation, { duration: 1, x: model.rotation.x, y: model.rotation.y, z: model.rotation.z });
    setTimeout(() => {
        gsap.to(model.rotation, { duration: 10, x: model.rotation.x + Math.random(), y: model.rotation.y + Math.random(), z: model.rotation.z });
    }, 30000); 
}

renderer.domElement.addEventListener('mouseover', function () {
    stopRotation(); 
});

renderer.domElement.addEventListener('mouseout', function () {
    gsap.to(model.rotation, { duration: 10, x: model.rotation.x + Math.random(), y: model.rotation.y + Math.random(), z: model.rotation.z });
});


function animate() {
    requestAnimationFrame(animate);

    dirLight.position.copy(camera.position);

    if (model) {
        if (!model.userData.animationStarted) {
            stopRotation();
            model.userData.animationStarted = true;
        }

        model.rotation.y += (targetRotation - model.rotation.y) * 0.1;
    }0

    renderer.render(scene, camera);
}

