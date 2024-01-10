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

function setScrollPercent() {
    inertialScroll +=
        ((document.documentElement.scrollTop || document.body.scrollTop) -
            inertialScroll) *
        0.08;
    inertialScrollPercent = (
        (inertialScroll /
            ((document.documentElement.scrollHeight ||
                document.body.scrollHeight) -
                document.documentElement.clientHeight)) *
        100
    ).toFixed(2);

    const scroll =
        ((document.documentElement.scrollTop || document.body.scrollTop) /
            ((document.documentElement.scrollHeight ||
                document.body.scrollHeight) -
                document.documentElement.clientHeight)) *
        100;
    document.getElementById("percent").innerText = inertialScrollPercent;
    document.getElementById("scroll").innerText = Number(scroll).toFixed(2);
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
        .getElementById("furnitureCanvasWrap")
        .appendChild(renderer.domElement);

    scene = new THREE.Scene();

    camera = new THREE.PerspectiveCamera(
        45,
        window.innerWidth / window.innerHeight,
        0.1,
        10000
    );

    camera.position.set(-20, 30, 50);
    camera.lookAt(new THREE.Vector3(0, 10, 0));

    dirLight = new THREE.SpotLight(0xffffff, 1.5);
    dirLight.position.copy(camera.position);
    scene.add(dirLight);

    const targetObject = new THREE.Object3D();
    targetObject.position.set(0, 10, 0);
    scene.add(targetObject);
    dirLight.target = targetObject;

    const loader = new GLTFLoader();

    loader.load(
        "./object/sofa.glb",
        function (gltf) {
            model = gltf.scene;
            model.traverse((object) => {
                if (object.isMesh) {
                    object.material.transparent = true;
                    object.material.opacity = 0.8;
                    object.material.depthTest = true;
                }
            });
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

function onScroll() {
    const scrollPosition = window.scrollY;

    const aboutSection = document.getElementById("about");
    const aboutRect = aboutSection.getBoundingClientRect();
    const isAboutVisible = aboutRect.top <= window.innerHeight && aboutRect.bottom >= 0;

    const productsSection = document.getElementById("products");
    const productsRect = productsSection.getBoundingClientRect();
    const isProductsVisible = productsRect.top <= window.innerHeight && productsRect.bottom >= 0;

    if (isAboutVisible) {
        model.scale.set(1 + scrollPosition / 3000, 1 + scrollPosition / 3000, 1 + scrollPosition / 3000);
        targetRotation = (scrollPosition * -Math.PI) / -1700;
    } else if (isProductsVisible) {
        model.scale.set(1 - scrollPosition / 1000, 1 - scrollPosition / 1000, 1 - scrollPosition / 1000);
        targetRotation = (scrollPosition * -Math.PI) / -600;
    } else {
        model.scale.set(1, 1, 1);
        targetRotation = (scrollPosition * -Math.PI) / -500;
    }
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
