import * as THREE from "https://unpkg.com/three@0.126.1/build/three.module.js";
import { GLTFLoader } from "https://unpkg.com/three@0.126.1/examples/jsm/loaders/GLTFLoader.js";

let camera;
let scene;
let renderer;
let model;
let dirLight;

init();
animate();

function init() {
    renderer = new THREE.WebGLRenderer({
        alpha: true,
        antialias: true,
    });
    renderer.setClearColor(0x000000, 0); 
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);

    document.getElementById("furnitureCanvasWrap").appendChild(renderer.domElement);

    scene = new THREE.Scene();

    camera = new THREE.PerspectiveCamera(
        45,
        window.innerWidth / window.innerHeight,
        0.1,
        1000
    );

    camera.position.set(-20, 30, 50);
    camera.lookAt(new THREE.Vector3(0, 10, 0));

    // 注意: OrbitControls を使わないことで削除
    // const controls = new OrbitControls(camera, renderer.domElement);
    // controls.enableDamping = true;
    // controls.dampingFactor = 0.2;
    // controls.enableZoom = false;

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

    // イベントリスナーを追加して、ユーザーのアクションを監視
    window.addEventListener('scroll', onScroll);
    window.addEventListener('resize', onResize);
}

function onScroll() {
    // スクロールイベントが発生した際の処理を記述
    // ここに物体の動きに関するコードを追加
}

function onResize() {
    // リサイズイベントが発生した際の処理を記述
    // カメラやレンダラーのサイズ調整などを行うことが一般的
}

function animate() {
    requestAnimationFrame(animate);

    dirLight.position.copy(camera.position);

    // ここに物体のアニメーションに関するコードを追加

    renderer.render(scene, camera);
}
