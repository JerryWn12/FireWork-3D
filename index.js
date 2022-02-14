import * as THREE from "./lib/three.module.js";
import { OrbitControls } from "./lib/OrbitControls.js";
import * as FontLoader from "./lib/FontLoader.js";
import * as TextGeometry from "./lib/TextGeometry.js";

const scene = new THREE.Scene();
scene.background = new THREE.Color(0xd8e2dc);

const width = window.innerWidth;
const height = window.innerHeight;
const camera = new THREE.OrthographicCamera(
  width / -16,
  width / 16,
  height / 16,
  height / -16,
  0.1,
  1000
);
camera.position.set(100, 100, 100);
scene.add(camera);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.setSize(width, height);

const aLight = new THREE.AmbientLight(0xcccccc, 0.4);
const dLight = new THREE.DirectionalLight(0xffffff, 0.4);
const pLight = new THREE.PointLight(0xffffff, 0.4);
dLight.position.set(100, 100, 50);
pLight.position.set(100, 100, 50);

dLight.castShadow = true;

dLight.shadow.mapSize.width = 4096;
dLight.shadow.mapSize.height = 4096;
dLight.shadow.camera.near = 0.1;
dLight.shadow.camera.far = 300;
dLight.shadow.camera.bottom = -100;
dLight.shadow.camera.right = 100;
dLight.shadow.camera.top = 100;
dLight.shadow.camera.left = -100;

scene.add(aLight);
scene.add(pLight);
scene.add(dLight);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.keyPanSpeed = 50;
controls.keys = {
  LEFT: "KeyA",
  UP: "KeyW",
  RIGHT: "KeyD",
  BOTTOM: "KeyS",
};
// controls.maxZoom = 2;
// controls.minZoom = 0.5;
controls.listenToKeyEvents(window);
controls.update();

function getSurface() {
  const geometry = new THREE.BoxGeometry(100, 2, 100);
  const material = new THREE.MeshPhongMaterial({ color: 0x95d5b2 });
  const surface = new THREE.Mesh(geometry, material);
  surface.position.set(0, 1, 0);
  surface.receiveShadow = true;
  return surface;
}

scene.add(getSurface());

function getRoadSurface() {
  const geometry = new THREE.BoxGeometry(100, 1, 30);
  const material = new THREE.MeshPhongMaterial({ color: 0x495057 });
  const road = new THREE.Mesh(geometry, material);
  road.position.set(0, 2.5, 25);
  road.castShadow = true;
  return road;
}

function getOneDashLine(x, y, z) {
  const geometry = new THREE.BoxGeometry(10, 0.1, 1);
  const material = new THREE.MeshPhongMaterial({ color: 0xffffff });
  const line = new THREE.Mesh(geometry, material);
  line.position.set(x, y, z);
  return line;
}

function getDashLineSet() {
  const dashLineSet = new THREE.Group();

  for (let i = 0; i < 5; i++) {
    dashLineSet.add(getOneDashLine(-40 + 20 * i, 3, 24));
  }

  for (let i = 0; i < 5; i++) {
    dashLineSet.add(getOneDashLine(-40 + 20 * i, 3, 26));
  }

  return dashLineSet;
}

const road = new THREE.Group();

const roadSurface = getRoadSurface();
const dashLineSet = getDashLineSet();

road.add(roadSurface);
road.add(dashLineSet);
road.position.set(0, 0, 10);

scene.add(road);

const rocket = new THREE.Group();

function getRocketHead() {
  const geometry = new THREE.CylinderGeometry(0, 1.5, 3, 32);
  const material = new THREE.MeshPhongMaterial({ color: 0xe71d36 });
  const rocketHead = new THREE.Mesh(geometry, material);
  rocketHead.castShadow = true;
  return rocketHead;
}

function getRockBodyClipA(x, y, z) {
  const geometry = new THREE.CylinderGeometry(1, 1, 1, 32);
  const material = new THREE.MeshPhongMaterial({ color: 0xe71d36 });
  const bodyClip = new THREE.Mesh(geometry, material);
  bodyClip.position.set(x, y, z);
  bodyClip.castShadow = true;
  bodyClip.receiveShadow = true;
  return bodyClip;
}

function getRockBodyClipB(x, y, z) {
  const geometry = new THREE.CylinderGeometry(1, 1, 1, 32);
  const material = new THREE.MeshPhongMaterial({ color: 0xff9f1c });
  const bodyClip = new THREE.Mesh(geometry, material);
  bodyClip.position.set(x, y, z);
  bodyClip.castShadow = true;
  bodyClip.receiveShadow = true;
  return bodyClip;
}

function getRocketBody() {
  const rocketBodyClipSet = new THREE.Group();
  for (let i = 0; i < 6; i++) {
    if (i % 2 === 0) {
      rocketBodyClipSet.add(getRockBodyClipA(0, i, 0));
    } else {
      rocketBodyClipSet.add(getRockBodyClipB(0, i, 0));
    }
  }
  return rocketBodyClipSet;
}

function getRocketStick() {
  const geometry = new THREE.CylinderGeometry(0.2, 0.2, 3);
  const material = new THREE.MeshPhongMaterial({ color: 0x343a40 });
  const stick = new THREE.Mesh(geometry, material);
  stick.castShadow = true;
  return stick;
}

function getRocketFuse() {
  const geometry = new THREE.TorusGeometry(1, 0.1, 16, 16, Math.PI / 2);
  const material = new THREE.MeshPhongMaterial({ color: 0xe71d36 });
  const rocketFuse = new THREE.Mesh(geometry, material);
  rocketFuse.rotateX(Math.PI);
  rocketFuse.rotateY(Math.PI);
  rocketFuse.castShadow = true;
  return rocketFuse;
}

const rocketHead = getRocketHead();
const rocketBody = getRocketBody();
const rocketStick = getRocketStick();
const rocketFuse = getRocketFuse();

rocket.add(rocketHead);
rocket.add(rocketBody);
rocket.add(rocketStick);
rocket.add(rocketFuse);

rocketHead.position.set(0, 10.5, 0);
rocketBody.position.set(0, 3.5, 0);
rocketStick.position.set(0, 1.5, 0);
rocketFuse.position.set(1.5, 3, 0);

rocket.position.set(-10, 2, 5);

scene.add(rocket);

function updateGroupGeometry(mesh, geometry, index) {
  mesh.children[index].geometry.dispose();
  mesh.children[index].geometry = geometry;
}

function generateTorusGeometry(
  radius,
  tube,
  radialSegments,
  tubularSegments,
  arc
) {
  const geometry = new THREE.TorusGeometry(
    radius,
    tube,
    radialSegments,
    tubularSegments,
    arc
  );
  return geometry;
}

let index01 = Math.PI / 2;
let fuseFireInterval = null;

function fuseFire() {
  if (index01 > 0) {
    updateGroupGeometry(
      rocket,
      generateTorusGeometry(1, 0.1, 16, 16, index01),
      3
    );
    index01 -= 0.035;
  } else {
    clearInterval(fuseFireInterval);
    fuseFireInterval = undefined;
  }
}

document.getElementById("fire").onclick = function () {
  if (!launchFinished) {
    fuseFireSet.visible = true;
  }
  fuseFireInterval = setInterval(fuseFire, 20);
  fuseFireSetAnimationAction.play();
  fuseLineAnimationAction.play();
};

function getFuseFireClip(px, py, pz, angle) {
  const x = 0,
    y = 0;

  const shape = new THREE.Shape();
  const rand = (Math.random() - 0.5) / 5;

  shape.moveTo(x + 1, y);
  shape.lineTo(x + 2 + (Math.random() - 0.5) / 5, y + 2 + Math.random() - 0.5) /
    5;
  shape.lineTo(
    x + 1 + (Math.random() - 0.5) / 5,
    y + 1.5 + Math.random() - 0.5
  ) / 5;
  shape.lineTo(x + 1 + (Math.random() - 0.5) / 5, y + 3 + Math.random() - 0.5) /
    5;
  shape.lineTo(
    x + 0 + (Math.random() - 0.5) / 5,
    y + 1.5 + Math.random() - 0.5
  ) / 5;
  shape.lineTo(x - 1 + (Math.random() - 0.5) / 5, y + 3 + Math.random() - 0.5) /
    5;
  shape.lineTo(
    x + -1 + (Math.random() - 0.5) / 5,
    y + 1.5 + Math.random() - 0.5
  ) / 5;
  shape.lineTo(x - 2 + (Math.random() - 0.5) / 5, y + 2 + Math.random() - 0.5) /
    5;
  shape.lineTo(x - 1, y + 0);
  shape.lineTo(x + 1, y + 0);

  const geometry = new THREE.ShapeGeometry(shape);
  const material = new THREE.MeshPhongMaterial({ color: 0xd90429 });
  material.side = THREE.DoubleSide;
  const mesh = new THREE.Mesh(geometry, material);
  mesh.rotateZ(Math.PI / -2);
  mesh.rotateX(angle);
  mesh.position.set(px, py, pz);
  return mesh;
}

function getFuseFireSet() {
  const set = new THREE.Group();
  set.add(getFuseFireClip(0, 0, 0, 0));
  set.add(getFuseFireClip(0, 0, 0, 0));
  set.add(getFuseFireClip(0, 0, 0, 0));
  set.add(getFuseFireClip(0, 0, 0, 0));
  for (let index = 0; index < 4; index++) {
    set.children[index].rotateY(Math.PI * 2 - (Math.PI / 2) * (index + 1));
    set.children[index].rotateX(Math.PI / 6);
  }
  set.scale.set(0.3, 0.3, 0.3);
  set.translateX(-8.5);
  set.translateY(4);
  set.translateZ(5);
  return set;
}

const fuseFireSet = getFuseFireSet();
fuseFireSet.visible = false;

scene.add(fuseFireSet);

let fuseFireSetKeyFrame = new THREE.NumberKeyframeTrack(
  ".rotation[z]",
  [0, 1],
  [0, Math.PI / -2]
);

let fuseFireSetAnimationClip = new THREE.AnimationClip(
  "fuseFireSetAnimationClip",
  1,
  [fuseFireSetKeyFrame]
);

let fuseFireSetAnimationMixer = new THREE.AnimationMixer(fuseFireSet);

let fuseFireSetAnimationAction = fuseFireSetAnimationMixer.clipAction(
  fuseFireSetAnimationClip
);

fuseFireSetAnimationAction.loop = THREE.LoopOnce;
fuseFireSetAnimationAction.clampWhenFinished = true;

const fuseCurve = new THREE.CatmullRomCurve3([
  new THREE.Vector3(-8.5, 4, 5),
  new THREE.Vector3(-8.85, 4.09, 5),
  new THREE.Vector3(-9.2, 4.31, 5),
  new THREE.Vector3(-9.42, 4.62, 5),
  new THREE.Vector3(-9.5, 5, 5),
]);

const fuseCurvePoints = fuseCurve.getPoints(20);

const fuseCurveGeometry = new THREE.BufferGeometry();

fuseCurveGeometry.setFromPoints(fuseCurvePoints);

let fuseCurveMaterial = new THREE.LineBasicMaterial({
  color: 0xd90429,
});

let fuseLine = new THREE.Line(fuseCurveGeometry, fuseCurveMaterial);

fuseLine.visible = false;

scene.add(fuseLine);

let fuseLineTimeArr = [];

for (let i = 0; i < 1; i += 1 / 21.0) {
  fuseLineTimeArr.push(i);
}

let fuseLineTime = new Float32Array(fuseLineTimeArr);

let fuseLinePosiArr = [];

fuseCurvePoints.forEach((elem) => {
  fuseLinePosiArr.push(elem.x, elem.y, elem.z);
});

let fuseLinePosi = new Float32Array(fuseLinePosiArr);

let fuseLineTrack = new THREE.KeyframeTrack(
  ".position",
  fuseLineTime,
  fuseLinePosi
);

let fuseLineClip = new THREE.AnimationClip("fuseLineClip", 1, [fuseLineTrack]);

let fuseLineMixer = new THREE.AnimationMixer(fuseFireSet);

fuseLineMixer.addEventListener("finished", function () {
  fuseFireSet.visible = false;
  rocketLaunchAnimationAction.play();
});

let fuseLineAnimationAction = fuseLineMixer.clipAction(fuseLineClip);
fuseLineAnimationAction.loop = THREE.LoopOnce;
fuseLineAnimationAction.clampWhenFinished = true;

let rocketLaunchKeyFrame = new THREE.KeyframeTrack(
  ".position",
  [0, 1.5],
  [-10, 2, 5, -10, 100, 5]
);

let rocketLaunchAnimationClip = new THREE.AnimationClip(
  "rocketLaunchAnimationClip",
  1.5,
  [rocketLaunchKeyFrame]
);

let rocketLaunchAnimationMixer = new THREE.AnimationMixer(rocket);

let rocketLaunchAnimationAction = rocketLaunchAnimationMixer.clipAction(
  rocketLaunchAnimationClip
);

rocketLaunchAnimationAction.loop = THREE.LoopOnce;

// const axesHelper = new THREE.AxesHelper(100);
// scene.add(axesHelper);

let launchFinished = false;

rocketLaunchAnimationMixer.addEventListener("finished", function () {
  rocket.visible = false;
  launchFinished = true;
  scene.getObjectByName("explodeText").visible = true;
  textShow();
});

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function textShow() {
  await sleep(1000);
  scene.getObjectByName("explodeText").visible = false;
  await sleep(100);
  scene.getObjectByName("explodeText2").visible = true;
}

const fontLoader = new FontLoader.FontLoader();

fontLoader.load("fonts/font.json", function (font) {
  const explodeTextGeometry = new TextGeometry.TextGeometry("(爆炸)", {
    font: font,
    size: 10,
    height: 1,
    curveSegments: 12,
    bevelEnabled: false,
    bevelThickness: 1,
    bevelSize: 1,
    bevelOffset: 1,
    bevelSegments: 1,
  });
  const explodeTextMaterial = new THREE.MeshPhongMaterial({ color: 0xd90429 });
  explodeTextMaterial.side = THREE.DoubleSide;
  const explodeText = new THREE.Mesh(explodeTextGeometry, explodeTextMaterial);
  explodeText.translateX(-23);
  explodeText.translateY(100);
  explodeText.translateZ(18);
  explodeText.rotateY(Math.PI / 4);
  explodeText.visible = false;
  explodeText.name = "explodeText";
  scene.add(explodeText);
});

fontLoader.load("fonts/font.json", function (font) {
  const explodeTextGeometry = new TextGeometry.TextGeometry("元宵快乐", {
    font: font,
    size: 10,
    height: 1,
    curveSegments: 12,
    bevelEnabled: false,
    bevelThickness: 1,
    bevelSize: 1,
    bevelOffset: 1,
    bevelSegments: 1,
  });
  const explodeTextMaterial = new THREE.MeshPhongMaterial({ color: 0xd90429 });
  explodeTextMaterial.side = THREE.DoubleSide;
  const explodeText = new THREE.Mesh(explodeTextGeometry, explodeTextMaterial);
  explodeText.translateX(-23);
  explodeText.translateY(100);
  explodeText.translateZ(18);
  explodeText.rotateY(Math.PI / 4);
  explodeText.visible = false;
  explodeText.name = "explodeText2";
  scene.add(explodeText);
});

document.body.appendChild(renderer.domElement);
let clock = new THREE.Clock();
let clock2 = new THREE.Clock();
let clock3 = new THREE.Clock();
function animate() {
  requestAnimationFrame(animate);
  controls.update();
  renderer.render(scene, camera);
  fuseFireSetAnimationMixer.update(clock.getDelta());
  fuseLineMixer.update(clock2.getDelta());
  rocketLaunchAnimationMixer.update(clock3.getDelta());
}

animate();
