"use strict";

import * as THREE from '../plugins/three.js/build/three.module.js';
import { GLTFLoader } from '../plugins/three.js/examples/jsm/loaders/GLTFLoader.js';
import { OrbitControls } from '../plugins/three.js/examples/jsm/controls/OrbitControls.js';
import { RoomEnvironment } from '../plugins/three.js/examples/jsm/environments/RoomEnvironment.js';

let gltfLoader, controls, scene, canvas, camera, renderer, model
let manager = new THREE.LoadingManager();

initThreeJs()
lightGltf()
loaderGltf()
controlsGltf();
animate()

function initThreeJs() {
    canvas = document.querySelector('#island');

    scene = new THREE.Scene();

    camera = new THREE.PerspectiveCamera(55, (window.innerWidth * .35) / (window.innerHeight * .6), 1, 1000);
    camera.position.set(0, 2, 2)


    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, preserveDrawingBuffer: true, });
    renderer.setSize(window.innerWidth * .35, window.innerHeight * .6)
    renderer.physicallyCorrectLights = true;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.7;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.VSMShadowMap;
    renderer.outputEncoding = THREE.sRGBEncoding;



    // window.addEventListener('resize', function () {
    //     camera.aspect = window.innerWidth  / window.innerHeight ;
    //     camera.updateProjectionMatrix();
    //     renderer.setSize(window.innerWidth *.3, window.innerHeight*.6);
    //     renderer.render(scene, camera)

    // },false);


    //environment

    const rgbeLoader = new THREE.TextureLoader();

    rgbeLoader.load('../assets/gltf/hdr.jpg', function (texture) {
        const pmremGenerator = new THREE.PMREMGenerator(renderer);

        pmremGenerator.compileEquirectangularShader();
        const environment = new RoomEnvironment();
        const envMap = pmremGenerator.fromScene(environment).texture;
        scene.environment = envMap;

        texture.dispose();
        pmremGenerator.dispose();

    });
    canvas.appendChild(renderer.domElement);
}




function loaderGltf() {
  
    gltfLoader = new GLTFLoader(manager);
    gltfLoader.load(
        '../assets/gltf/Island.gltf',
        function (gltf) {
            model=gltf.scene
           model.scale.set(.08, .08, .08)
           model.position.set(0, 0.2, 0)

            scene.add(model);
        }
    )
}

manager.onStart = function ( url, itemsLoaded, itemsTotal ) {

	console.log( 'Started loading file: ' + url + '.\nLoaded ' + itemsLoaded + ' of ' + itemsTotal + ' files.' );
    $("#gltfShow").LoadingOverlay("show", {
        background: 'red',
        image: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 1000"><circle r="80" cx="500" cy="90"/><circle r="80" cx="500" cy="910"/><circle r="80" cx="90" cy="500"/><circle r="80" cx="910" cy="500"/><circle r="80" cx="212" cy="212"/><circle r="80" cx="788" cy="212"/><circle r="80" cx="212" cy="788"/><circle r="80" cx="788" cy="788"/></svg>`,
        imageColor: 'red',
        imageAutoResize: true,
    });

    // Hide it after 3 seconds
        $("#gltfShow").LoadingOverlay("hide");
  
};

manager.onLoad = function ( ) {

	console.log( 'Loading complete!');
  

};


manager.onProgress = function ( url, itemsLoaded, itemsTotal ) {

	console.log( 'Loading file: ' + url + '.\nLoaded ' + itemsLoaded + ' of ' + itemsTotal + ' files.' );

};

manager.onError = function ( url ) {

	console.log( 'There was an error loading ' + url );

};

function lightGltf() {
    const AmbientLight = new THREE.AmbientLight(0xFFFFFF, 1);
    scene.add(AmbientLight);

    const DirectionalLight = new THREE.DirectionalLight(0xFFFFFF, 1);
    scene.add(DirectionalLight);
}



function controlsGltf() {

    controls = new OrbitControls(camera, renderer.domElement);


    controls.mouseButtons = {
        LEFT: THREE.MOUSE.ROTATE,
        MIDDLE: THREE.MOUSE.DOLLY,
    }


    controls.enabled = true;
    controls.enableZoom = false;
    controls.enablePan = false;

    controls.maxPolarAngle = Math.PI / 2.5;
    controls.minPolarAngle = Math.PI / 2.5;

    controls.enableDamping = false
    controls.screenSpacePanning = false

    controls.update();
}
function animate() {
    if (model) {
        model.rotation.y += 0.001;
    }

    renderer.render(scene, camera);

    requestAnimationFrame(animate);
}
