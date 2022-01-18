"use strict";

import * as THREE from '../../assets/plugins/three.js/build/three.module.js';
import { GLTFLoader } from '../plugins/three.js/examples/jsm/loaders/GLTFLoader.js';
import { OrbitControls } from '../plugins/three.js/examples/jsm/controls/OrbitControls.js';
import { RGBELoader } from '../plugins/three.js/examples/jsm/loaders/RGBELoader.js';
import { GUI } from '../plugins/three.js/examples/jsm/libs/dat.gui.module.js';

 
let gltfLoader, controls, scene, canvas, camera, renderer,model


const gui = new GUI()



initThreeJs()
lightGltf()
loaderGltf();
controlsGltf();
animate()

function initThreeJs() {
    canvas = document.querySelector('#c');

    scene = new THREE.Scene();

    camera = new THREE.PerspectiveCamera(55, (window.innerWidth *.35)/( window.innerHeight*.6),1, 1000);
    camera.position.set(0,2,2) 


    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, preserveDrawingBuffer: true, });
    renderer.setSize(window.innerWidth*.35, window.innerHeight*.6)
    renderer.outputEncoding = THREE.sRGBEncoding;



    // window.addEventListener('resize', function () {
    //     camera.aspect = window.innerWidth  / window.innerHeight ;
    //     camera.updateProjectionMatrix();
    //     renderer.setSize(window.innerWidth *.3, window.innerHeight*.6);
    //     renderer.render(scene, camera)

    // },false);


    //environment

    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    pmremGenerator.compileEquirectangularShader();
    const rgbeLoader = new RGBELoader();
    rgbeLoader.load('../../indiega/assets/gltf/textures/Grass_baseColor.jpeg', function (texture) {
        const envMap = pmremGenerator.fromEquirectangular(texture).texture;
        scene.environment = envMap;

        texture.dispose();
        pmremGenerator.dispose();

    });
    canvas.appendChild(renderer.domElement);


}

function lightGltf() {
   const AmbientLight = new THREE.AmbientLight(0xFFFFFF, 1);
    scene.add(AmbientLight);

const DirectionalLight = new THREE.DirectionalLight(0xFFFFFF, 1);
DirectionalLight.position.set(0, 10, 0);
DirectionalLight.target.position.set(-5, 0, 0);
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
  
    gltfLoader = new GLTFLoader();
    gltfLoader.load(
        '../../assets/gltf/scene.gltf',
        function (gltf) {
            model=gltf.scene
           model.scale.set(.08, .08, .08)
           model.position.set(0, .2, 0)

            scene.add(model);
        }
    )
}

function animate() {
    if (model) {
        model.rotation.y += 0.001;
    }

    renderer.render(scene, camera);

    requestAnimationFrame(animate);
}
