"use strict";

import * as THREE from '../plugins/three.js/build/three.module.js';
import { GLTFLoader } from '../plugins/three.js/examples/jsm/loaders/GLTFLoader.js';
import { OrbitControls } from '../plugins/three.js/examples/jsm/controls/OrbitControls.js';
import { RGBELoader } from '../plugins/three.js/examples/jsm/loaders/RGBELoader.js';
//import { GUI } from '../plugins/three.js/examples/jsm/libs/dat.gui.module.js';
import { RoomEnvironment } from '../plugins/three.js/examples/jsm/environments/RoomEnvironment.js';

 
let gltfLoader, controls, scene, canvas, camera, renderer,model
var manager = new THREE.LoadingManager();
const progressBar = document.querySelector(".bar")
const progressBarValue = document.querySelector('.bar__value')
manager.onStart = function (url, itemsLoaded, itemsTotal) {
    $('.loader-wrapper .cssload-loader').fadeIn();

};

function onProgress(loader) {
    if (loader.lengthComputable) {
        var percentComplete = loader.loaded / loader.total * 100;
        // console.log(Math.round(percentComplete) + '% downloaded');
        progressBar.value = Math.round(percentComplete);
        progressBarValue.innerText = Math.round(percentComplete) + '%';
    }};

function onError(error) {
    console.log("can't load...");
};


//const gui = new GUI()


initThreeJs()
lightGltf()
loaderGltf();
controlsGltf();
animate()

function initThreeJs() {
    canvas = document.querySelector('#kristalRed');

    scene = new THREE.Scene();

    camera = new THREE.PerspectiveCamera(55, (window.innerWidth *.35)/( window.innerHeight*.6),1, 1000);
    camera.position.set(0,2,2) 


    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, preserveDrawingBuffer: true, });
    renderer.setSize(window.innerWidth*.35, window.innerHeight*.6)
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

function lightGltf() {
   const AmbientLight = new THREE.AmbientLight(0xFFFFFF, 1);
    scene.add(AmbientLight);

const DirectionalLight = new THREE.DirectionalLight(0xFFFFFF, 0.1);
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




function loaderGltf() {
  
    gltfLoader = new GLTFLoader(manager);
    gltfLoader.load(
        '../assets/gltf/kristalRed.gltf',
        function (gltf) {
            model=gltf.scene
           model.scale.set(.6, .6, .6)
           model.position.set(0, -.9, 0)
           $(".cssload-loader").delay(400).fadeOut("slow");

            scene.add(model);
        }, onProgress, onError)
}

function animate() {
    if (model) {
        model.rotation.y += 0.001;
    }

    renderer.render(scene, camera);

    requestAnimationFrame(animate);
}
