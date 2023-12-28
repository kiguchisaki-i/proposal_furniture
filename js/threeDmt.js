import * as THREE from '../three';

window.addEventListener('DOMContentLoaded', init);

function init() {
    const renderer = new THREE.WebGLRenderer({
        canvas: document.querySelector('#furnitureCanvas'),
        alpha: true,
    });

    const width = document.getElementById('furnitureCanvasWrap').getBoundingClientRect().width;
    const height = document.getElementById('furnitureCanvasWrap').getBoundingClientRect().height;
    renderer.setPixelRatio(1);
    renderer.setSize(width, height);

    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(45, width / height, 1, 10000);
    camera.position.set(4707, 2121, 3237);

    const controls = new THREE.OrbitControls(camera, renderer.domElement);

    const loader = new THREE.GLTFLoader();
    const url = 'object/sofa.glb';

    const w_height = window.innerHeight;

    let model = null;
    loader.load(
        url,
        function (gltf) {
            model = gltf.scene;
            model.scale.set(100.0, 100.0, 100.0);
            model.position.set(0, (w_height / 3 * -1), 0);
            scene.add(gltf.scene);
        },
        function (error) {
            console.log('An error happened');
            console.log(error);
        }
    );
    renderer.gammaOutput = true;
    renderer.gammaFactor = 2.2;

    const light = new THREE.DirectionalLight(0xFFFFFF);
    light.intensity = 1;
    light.position.set(3, 10, 1);
    scene.add(light);

    const ambient = new THREE.AmbientLight(0xf8f8ff, 0.7);
    scene.add(ambient);

    tick();

    function tick() {
        controls.update();

        if (model != null) {
            console.log(model);
        }
        renderer.render(scene, camera);
        requestAnimationFrame(tick);
    }
}
