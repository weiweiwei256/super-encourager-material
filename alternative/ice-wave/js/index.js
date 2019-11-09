/* init */
var scene = new THREE.Scene();
var sWidth = window.innerWidth;
var sHeight = window.innerHeight;
var sRatio = sWidth / sHeight;
var camera = new THREE.PerspectiveCamera(75, sRatio, 0.1, 1000);
camera.lookAt(new THREE.Vector3(0, 0, 0));
camera.position.z = 9;
var vFOV = camera.fov * Math.PI / 180;
var renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(sWidth, sHeight);

function setDimensions() {
  sWidth = window.innerWidth;
  sHeight = window.innerHeight;
  sRatio = sWidth / sHeight;
  renderer.setSize(sWidth, sHeight);
  camera.aspect = sRatio;
  camera.updateProjectionMatrix();
  vFOV = camera.fov * Math.PI / 180;
}
window.addEventListener('resize', setDimensions);
document.body.appendChild(renderer.domElement);

var stats = new Stats();
stats.setMode(1);
stats.domElement.style.position = 'absolute';
stats.domElement.style.left = '0px';
stats.domElement.style.zIndex = 2;
stats.domElement.style.top = '0px';
document.body.appendChild(stats.domElement);

camera.position.z = 8;
/* end init */

/* start light */
var spotLight = new THREE.SpotLight(0xcccccc, 1, 0, Math.PI / 2);
spotLight.position.set(5, 0, 10);
scene.add(spotLight);
/* end light */

/* start plane mesh with shader material */
var geometry = new THREE.PlaneBufferGeometry(40, 40, 256, 256);
var count = geometry.attributes.position.count;
var values = new Float32Array(count).map(Math.random);
geometry.addAttribute('displacement', new THREE.BufferAttribute(values, 1));
var vertexShader = document.querySelector('#vertexshader').innerText;
var fragmentShader = document.querySelector('#fragmentshader').innerText;
var uniforms = {
  amplitude: { value: 1.0 },
  light: { value: [0.0, 0.0, 10.0] },
  tick: { value: 1.0 }
};
var shaderMaterial = new THREE.ShaderMaterial({
  uniforms: uniforms,
  vertexShader: vertexShader,
  fragmentShader: fragmentShader
});
shaderMaterial.transparent = true;
var plane = new THREE.Mesh(geometry, shaderMaterial);
scene.add(plane);
/* end plane mesh */

/* start upate & render */
var update = function update(time) {
  plane.rotation.y = Math.sin(time / 4000) / 5;
  plane.rotation.x = -1.0;
  uniforms.amplitude.value = (Math.sin(time / 1000) + 4) / 3;
  uniforms.light.value = [Math.sin(time / 1000), Math.cos(time / 1000), 100.0];
  uniforms.tick.value = time;
};

var render = function render(time) {
  requestAnimationFrame(render);

  stats.update();
  update(time);

  renderer.render(scene, camera);
};
render();
/* end update & render */