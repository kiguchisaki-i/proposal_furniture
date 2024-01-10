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
        10000
    );

    camera.position.set(40, 25, -85);
    camera.lookAt(new THREE.Vector3(0, 20, -40));

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
            model.visible = true;
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

    // スクロール位置取得
    const scrollPosition = window.scrollY;

    // 回転計算
    let rotationAngle = (scrollPosition * -Math.PI) / 360;

    // 90度で止まるように制限
    if (rotationAngle <= -Math.PI / 0.6) {
        rotationAngle = -Math.PI / 0.6;
    }

    // ここに物体の動きに関するコードを追加
    if (model) {
        model.rotation.y = rotationAngle;
        model.position.y = Math.sin(rotationAngle) * -10;
        model.scale.set(1 + Math.abs(Math.sin(rotationAngle)), 1, 1);
    }

    // #aboutに追従
    const aboutSection = document.getElementById("about");
    const aboutSectionTop = aboutSection.offsetTop;
    const aboutSectionHeight = aboutSection.offsetHeight;

    // aboutSection内での相対的なY座標の計算
    let relativeYPosition = scrollPosition - aboutSectionTop;

    // aboutSection内にいるかどうかを判定
    const isInAboutSection = relativeYPosition >= 0 && relativeYPosition <= aboutSectionHeight;

    // aboutSection内にいる場合は追従
    if (isInAboutSection) {
        // 特定の地点に到達したかどうかを判定
        const specificPointY = 1000; // 到達したい特定の地点のY座標
        if (relativeYPosition >= specificPointY) {
            // 3Dモデルの新しいY座標を設定
            model.position.y = specificPointY - aboutSectionTop;
        } else {
            // 3Dモデルの新しいY座標の計算
            let modelYPosition = relativeYPosition * 0.3; // 適切な係数を調整

            // 3Dモデルの新しいY座標を設定
            model.position.y = modelYPosition;
        }
    } else {
        // aboutSection外にいる場合は通常の動き
        model.rotation.y = rotationAngle;

        // スクロールがaboutSectionを通り過ぎた後、aboutSectionの底辺までの距離を計算
        let distanceBelowAboutSection = scrollPosition - (aboutSectionTop + aboutSectionHeight);

        // aboutSectionの底辺までの距離が正であれば、モデルをその距離分下げる
        if (distanceBelowAboutSection > 0) {
            model.position.y = distanceBelowAboutSection;
        } else {
            model.position.y = 0;
        }

        model.scale.set(1 + Math.abs(Math.sin(rotationAngle)), 1, 1);
    }

    // #products内で削除
    const productSection = document.getElementById("products");
    const isproductSectionInViewport = isElementInViewport(productSection);

    if (isproductSectionInViewport) {
        model.visible = false;
    } else {
        model.visible = true;
    }
}

// スクロールイベントを設定
window.addEventListener('scroll', onScroll);


// #productが表示領域内にあるかどうかを判断する関数
function isElementInViewport(element) {
    const rect = element.getBoundingClientRect();
    return (
        rect.top <= window.innerHeight &&
        rect.bottom >= 0
    );
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
