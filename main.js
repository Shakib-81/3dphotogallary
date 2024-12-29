import * as THREE from 'three';
import { Reflector } from 'three/examples/jsm/Addons.js';
import { userData } from 'three/webgpu';
import { rotate } from 'three/webgpu';
import { Easing, Tween, update as updateTween } from 'tween';
const images = [
    '1.jpg',
    '2.jpg',
    '3.jpg',
    '4.jpg',
    '5.jpg',
    '6.jpg'

];

const titles = [
    'Enjoy 3D World',
    'Hi 2',
    'Hi 3',
    'Hi 4',
    'Hi 5',
    'Hi 6'
];

const artists = [
    'Mr Shakib 3D Wall',
    'Osthir WOrld2',
    'Osthir WOrld3',
    'Osthir WOrld4',
    'Osthir WOrld5',
    'Osthir WOrld6'
];
const textureLoader = new THREE.TextureLoader();

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setAnimationLoop(animate);
document.body.appendChild(renderer.domElement);

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

const rootNode = new THREE.Object3D();
scene.add(rootNode);

let count = 6;
for (let i = 0; i < count; i++) {
    const texture = textureLoader.load(images[i]);
    texture.colorSpace = THREE.SRGBColorSpace;

    const baseNode = new THREE.Object3D();
    baseNode.rotation.y = (2 * Math.PI / count) * i;
    rootNode.add(baseNode);

    const border = new THREE.Mesh(
        new THREE.BoxGeometry(3.2, 2.2, 0.09),
        new THREE.MeshStandardMaterial({ color: 0x202020 })

    );
    border.name = `Border${i}`;
    border.position.z = -4;

    baseNode.add(border);
    const aetwork = new THREE.Mesh(
        new THREE.BoxGeometry(3, 2, 0.1),
        new THREE.MeshStandardMaterial({ map: texture })
    );
    aetwork.name = `Art${i}`;
    aetwork.position.z = -4;
    baseNode.add(aetwork);

    const leftArrowTexture = textureLoader.load('left.png');
    const rightArrowTexture = textureLoader.load('right.png');
    const left = new THREE.Mesh(
        new THREE.BoxGeometry(0.3, 0.3, 0.1),
        new THREE.MeshStandardMaterial({ map: leftArrowTexture, transparent: true })

    );
    left.name = `LeftArrow`;
    left.userData = (i=== count -1) ? 0: i+1;
    left.position.set(-1.8, 0, -4);
    baseNode.add(left);

    const right = new THREE.Mesh(
        new THREE.BoxGeometry(0.3, 0.3, 0.1),
        new THREE.MeshStandardMaterial({ map: rightArrowTexture, transparent: true })

    );
    right.name = `RightArrow`;
    right.userData = (i=== count -1) ? 0: i+1;
    right.position.set(1.8, 0, -4);
    baseNode.add(right);
}

const spotLight = new THREE.SpotLight(0xffffff, 100.0, 10.0, 0.7, 1);
spotLight.position.set(0, 5, 0);
spotLight.target.position.set(0, 1, -5);
scene.add(spotLight);
scene.add(spotLight.target);

const mirror = new Reflector(
    new THREE.CircleGeometry(10),
    {
        color: 0x404040,
        textureWidth: window.innerWidth,
        textureHeight: window.innerHeight
    }
)
mirror.position.y = -1.1;
mirror.rotateX(-Math.PI / 2);
scene.add(mirror);

camera.position.z = 0;
function roatedGallary(direction, newIndex) {
    // rootNode.rotateY(direction * (2 * Math.PI / count));updated in next line
    const deltaY = (direction * (2 * Math.PI / count));

    new Tween(rootNode.rotation)
        .to({ y: rootNode.rotation.y + deltaY })
        .easing(Easing.Quadratic.InOut)
        .start()
        .onStart(() => {
            // document.getElementById('title').innerText = titles[newIndex];
            // document.getElementById('artist').innerText = artists[newIndex];
            document.getElementById('title').style.opacity = 0;
            document.getElementById('artist').style.opacity = 0;
        })
        .onComplete(() => {
            
            document.getElementById('title').style.opacity = 1;
            document.getElementById('artist').style.opacity = 1;
        })

}
function animate() {
    updateTween();
    // cube.rotation.x += 0.01;
    // rootNode.rotation.y += 0.001;

    renderer.render(scene, camera);

}

window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    mirror.getRenderTarget().setSize(window.innerWidth, window.innerHeight);
})

window.addEventListener('click', (ev) => {
    const raycaster = new THREE.Raycaster();
    const mouseNDC = new THREE.Vector2((ev.clientX / window.innerWidth) * 2 - 1,
        -(ev.clientY / window.innerHeight) * 2 + 1);
    raycaster.setFromCamera(mouseNDC, camera);
    const intersections = raycaster.intersectObject(rootNode, true);
    if (intersections.length > 0) {
        // console.log(intersections);
        const obj = intersections[0].object;
        const newIndex = obj.userData;
        if (obj.name === 'LeftArrow') {
            // console.log('LeftArrow');
            roatedGallary(-1);
            
            console.log(newIndex);
        }
        if (obj.name === 'RightArrow') {
            // console.log('RightArrow');
            roatedGallary(1);
            console.log(newIndex);
        }
    }
})

document.getElementById('title').innerText = titles[0];
document.getElementById('artist').innerText = artists[0];