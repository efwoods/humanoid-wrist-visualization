import * as THREE from "https://cdn.skypack.dev/three@0.160.1";
import { GLTFLoader } from "https://cdn.skypack.dev/three@0.160.1/examples/jsm/loaders/GLTFLoader.js";
import { OrbitControls } from "https://cdn.skypack.dev/three@0.160.1/examples/jsm/controls/OrbitControls.js";

let scene, camera, renderer, model, rightWrist, leftWrist;
const clock = new THREE.Clock();

init();
animate();

function init() {
  scene = new THREE.Scene();
  scene.background = new THREE.Color(0x202020);

  camera = new THREE.PerspectiveCamera(
    50,
    window.innerWidth / window.innerHeight,
    0.1,
    100
  );
  camera.position.set(2, 2, 3);

  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);

  const controls = new OrbitControls(camera, renderer.domElement);
  controls.target.set(0, 1, 0);
  controls.update();

  const light = new THREE.DirectionalLight(0xffffff, 1);
  light.position.set(5, 10, 7);
  scene.add(light);

  const ambient = new THREE.AmbientLight(0x404040);
  scene.add(ambient);

  const loader = new GLTFLoader();
  loader.load("model/humanoid.glb", (gltf) => {
    model = gltf.scene;
    scene.add(model);

    model.traverse((child) => {
      if (child.isBone) {
        if (child.name.toLowerCase().includes("wrist_r")) {
          rightWrist = child;
        } else if (child.name.toLowerCase().includes("wrist_l")) {
          leftWrist = child;
        }
      }
    });

    console.log("Right Wrist:", rightWrist?.name);
    console.log("Left Wrist:", leftWrist?.name);
  });

  window.addEventListener("resize", onWindowResize);
  window.addEventListener("keydown", handleKeyInput);
}

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

function handleKeyInput(event) {
  const delta = 0.1;
  switch (event.key) {
    case "q": // rotate left wrist up
      if (leftWrist) leftWrist.rotation.x += delta;
      break;
    case "a": // rotate left wrist down
      if (leftWrist) leftWrist.rotation.x -= delta;
      break;
    case "w": // rotate right wrist up
      if (rightWrist) rightWrist.rotation.x += delta;
      break;
    case "s": // rotate right wrist down
      if (rightWrist) rightWrist.rotation.x -= delta;
      break;
  }
}

function animate() {
  requestAnimationFrame(animate);
  const delta = clock.getDelta();
  renderer.render(scene, camera);
}
