import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { CSS3DRenderer, CSS3DObject } from 'three/examples/jsm/renderers/CSS3DRenderer';
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js'; // Correct import
//useEffect runs code when component is mounted/updated, useRef stores references to DOM elements without re-rendering.
//CSS3DRenderer renders 3D objects with CSS.
//dat.GUI creates an interface for tweaking variables--can probably be stylized in CSS?

console.log('MountRef:', mountRef.current);
console.log('Renderer:', renderer.domElement);
console.log('CSS Renderer:', renderer2.domElement);


const ThreeScene = () => {
const mountRef = useRef(null);
const frustumSize = 500;
let camera, scene, scene2, renderer, renderer2, controls, avatar, plane, gui, planeSettings;
let mouseMoveHandler = null;
//mountRef references the DOM element where the scene will be mounted (added to DOM)
//frustrumSize is the size of the viewable area
//variables initialized (camera, scene, etc.) are set up later in useEffect
// Define the default camera position and look target

const defaultCameraPosition = new THREE.Vector3(300, 300, 400);
const defaultLookTarget = new THREE.Vector3(0, 0, 0);
useEffect(() => {
const aspect = window.innerWidth / window.innerHeight;
//actually sets up the scene; ensures the code runs when the component mounts

// Initialize Camera
camera = new THREE.OrthographicCamera(
(frustumSize * aspect) / -2,
(frustumSize * aspect) / 2,
frustumSize / 2,
frustumSize / -2,1,1000
);

camera.position.copy(defaultCameraPosition);
camera.lookAt(defaultLookTarget);

// Initialize Scenes
scene = new THREE.Scene();
scene.background = new THREE.Color(0xf0f0f0);
scene2 = new THREE.Scene();
//scene is the primary scene for 3D objects; scene2 is for rendering 3D objects with CSS styles
// Add lighting

const ambientLight = new THREE.AmbientLight(0x404040, 1);
scene.add(ambientLight);
const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(10, 20, 10).normalize();
scene.add(directionalLight);

// WebGL Renderer setup
renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
// is standard renderer for 3D in Three.js

// CSS3D Renderer setup
renderer2 = new CSS3DRenderer();
renderer2.setSize(window.innerWidth, window.innerHeight);
renderer2.domElement.style.position = 'absolute';
renderer2.domElement.style.top = 0;
// allows rendering using HTML/CSS for better integration with DOM

// Append renderers to the DOM
mountRef.current.appendChild(renderer.domElement);
mountRef.current.appendChild(renderer2.domElement);
//allows Three.js scenes to be displayed ; connects renderers' DOM (canvas) elements to React component root element

// Orbit Controls
controls = new OrbitControls(camera, renderer2.domElement);
controls.minZoom = 0.4;
controls.maxZoom = 3;
//zoom, pan, rotate

// Initialize dat.GUI
planeSettings = {
width: window.innerWidth,
height: 2200,
};
// triggers updatePlane function

// Create first plane
const plane1 = createPlane(
    planeSettings.width / 1.2, // Width
    planeSettings.height,      // Height
    'seagreen',                // Color
    new THREE.Vector3(0, -50, 0), // Position
    new THREE.Euler(-Math.PI / 2, 0, 0) // Rotation
  );
  
  // Create second plane with different parameters
  const plane2 = createPlane(
    200, // Width
    2200, // Height
    'lightblue', // Color
    new THREE.Vector3(-515, -50, 200), // Position
    new THREE.Euler(-Math.PI / 2, 0, 0) // Rotation
  );
  
  const plane3 = createPlane(
    200, // Width
    2200, // Height
    'lightblue', // Color
    new THREE.Vector3(515, -50, 200), // Position
    new THREE.Euler(-Math.PI / 2, 0, 0) // Rotation
  );

  const plane4 = createPlane(
    1230, // Width
    200, // Height
    'purple', // Color
    new THREE.Vector3(0, -50, -1000), // Position
    new THREE.Euler(-Math.PI / 2, 0, 0) // Rotation
  );
  // You can keep adding more planes by calling the function with different parameters
  
  const text = createText('Hello, 3D World!', new THREE.Vector3(0, 50, 0));
  scene.add(text);

// Avatar setup
const avatarGeometry = new THREE.BoxGeometry(20, 20, 20);
const avatarMaterial = new THREE.MeshStandardMaterial({
color: 0xff0000,
roughness: 0.5,
metalness: 0.2,
});

avatar = new THREE.Mesh(avatarGeometry, avatarMaterial);
avatar.position.set(0, -45, 0);
scene.add(avatar);

// Animation loop
const animate = () => {
requestAnimationFrame(animate);
controls.update();
renderer.render(scene, camera);
renderer2.render(scene2, camera);
};

animate();
//repeatedly calls itself using requestAnimationFrame -> loop. updates controls and renders scenes

// Resize handler

const onWindowResize = () => {
const aspect = window.innerWidth / window.innerHeight;
camera.left = -(frustumSize * aspect) / 2;
camera.right = (frustumSize * aspect) / 2;
camera.top = frustumSize / 2;
camera.bottom = -(frustumSize / 2);
camera.updateProjectionMatrix();
renderer.setSize(window.innerWidth, window.innerHeight);
renderer2.setSize(window.innerWidth, window.innerHeight);
scene.remove(scene.getObjectByName('floorPlane'));
plane = createPlane(planeSettings.width, planeSettings.height, 'seagreen', new THREE.Vector3(0, -50, 0), new THREE.Euler(-Math.PI / 2, 0, 0));
};

//ensures that when window size changes, camera viewing area and renderer's size adjust accordingly
window.addEventListener('resize', onWindowResize);

    // Movement Controls
    const handleKeyDown = (event) => {
      const moveDistance = 10;

      // Move avatar
      let newX = avatar.position.x;
      let newZ = avatar.position.z;

      // Check for arrow key presses and adjust avatar position
      if (event.key === 'ArrowUp') {
        newZ = Math.min(newZ + moveDistance, planeSettings.height / 2 - 20); // Constrain to the height of the plane
      } else if (event.key === 'ArrowDown') {
        newZ = Math.max(newZ - moveDistance, -planeSettings.height / 2 + 20); // Constrain to the height of the plane
      } else if (event.key === 'ArrowLeft') {
        newX = Math.max(newX - moveDistance, -planeSettings.width / 2 + 20); // Constrain to the width of the plane
      } else if (event.key === 'ArrowRight') {
        newX = Math.min(newX + moveDistance, planeSettings.width / 2 - 20); // Constrain to the width of the plane
      }

      // Update avatar's position
      avatar.position.set(newX, avatar.position.y, newZ);
    };
    window.addEventListener('keydown', handleKeyDown);

// Scroll handler for top-down movement
const handleWheel = (event) => {
if (controls.enabled && !controls.enableZoom) {
const zoomFactor = event.deltaY * 0.05;
camera.position.y -= zoomFactor;
camera.position.y = Math.max(camera.position.y, 50); // Prevent moving too low
camera.updateProjectionMatrix();
}

};
//handleWheel() should modify camera position when user scrolls -> zoom effect

window.addEventListener('wheel', handleWheel, { passive: false });

// Cleanup
return () => {
window.removeEventListener('resize', onWindowResize);
window.removeEventListener('wheel', handleWheel);
if (mouseMoveHandler) window.removeEventListener('mousemove', mouseMoveHandler);
mountRef.current.removeChild(renderer.domElement);
mountRef.current.removeChild(renderer2.domElement);
};
//makes sure all event listeners/renderers are removed when component unmounts

}, []);

 // Function to create 3D text
 const createText = (text, position) => {
    const loader = new THREE.FontLoader();
    loader.load('/assets/SourceSerifPro-Regular.json', (font) => {
      const geometry = new THREE.TextGeometry(text, {
        font: font,
        size: 50,
        height: 10,
        curveSegments: 12,
      });
      const material = new THREE.MeshBasicMaterial({ color: 0x000000 });
      const mesh = new THREE.Mesh(geometry, material);
      mesh.position.copy(position);
      scene.add(mesh);
    }, undefined, (error) => {
        console.error('Error loading font:', error);
      });
  };

const createPlane = (width, height, color, pos, rot) => {
    // Create CSS3DObject plane
    const element = document.createElement('div');
    element.style.width = `${width}px`;
    element.style.height = `${height}px`;
    element.style.opacity = 0.75;
    element.style.background = color;
    const cssObject = new CSS3DObject(element);
    cssObject.position.copy(pos);
    cssObject.rotation.copy(rot);
    scene2.add(cssObject);
  
    // Create 3D plane mesh
    const material = new THREE.MeshBasicMaterial({ color: 0x000000, wireframe: true });
    const geometry = new THREE.PlaneGeometry(width, height);
    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.copy(cssObject.position);
    mesh.rotation.copy(cssObject.rotation);
    mesh.name = 'floorPlane';
    scene.add(mesh);
  
    return { mesh, cssObject };
  };
  

const updatePlane = () => {
scene.remove(scene.getObjectByName('floorPlane'));
const bottomY = -50;
plane = createPlane(planeSettings.width, planeSettings.height, 'seagreen', new THREE.Vector3(0, bottomY, 0), new THREE.Euler(-Math.PI / 2, 0, 0));
};

const createCSS3DPlane = (width, height, color, position) => {
    // Create a div element to be used in the CSS3DObject
    const element = document.createElement('div');
    element.style.width = `${width}px`;
    element.style.height = `${height}px`;
    element.style.backgroundColor = color;
    
    // Create the CSS3DObject
    const planeCSS3DObject = new CSS3DObject(element);
  
    // Set the position of the plane
    planeCSS3DObject.position.set(position.x, position.y, position.z);
  
    // Add it to the scene
    scene2.add(planeCSS3DObject);
  
    return planeCSS3DObject;
  };  

const setOrthographicView = () => {
controls.enabled = true;
camera.position.copy(defaultCameraPosition);
camera.lookAt(defaultLookTarget);
controls.update();
avatar.position.set(0, -45, 0);
plane.mesh.visible = true;
if (mouseMoveHandler) {
window.removeEventListener('mousemove', mouseMoveHandler);
mouseMoveHandler = null;
}

controls.enableRotate = true;
controls.enableZoom = true;
};

const setTopDownView = () => {
controls.enabled = true;
controls.enableRotate = false;
controls.enableZoom = true;
camera.position.set(0, 100, 0);
camera.lookAt(0, 0, 0);
camera.rotation.set(-Math.PI / 2, 0, 0);
plane.mesh.visible = false;
const onMouseMove = (event) => {
const mouseX = (event.clientX / window.innerWidth) * 2 - 1;
const mouseY = -(event.clientY / window.innerHeight) * 2 + 1;
const vector = new THREE.Vector3(mouseX, mouseY, 0.5);
vector.unproject(camera);
const newX = THREE.MathUtils.clamp(vector.x, -planeSettings.width / 2 + 20, planeSettings.width / 2 - 20);
const newZ = THREE.MathUtils.clamp(vector.z, -planeSettings.height / 2 + 20, planeSettings.height / 2 - 20);
avatar.position.set(newX, -45, newZ);
};

mouseMoveHandler = onMouseMove;
window.addEventListener('mousemove', mouseMoveHandler);
};

return (
<div ref={mountRef} style={{ position: 'relative', width: '100%', height: '100vh' }}>
<button onClick={setOrthographicView}
style={{ position: 'absolute', top: '10px', left: '10px', zIndex: 10 }}
>Orthographic View
</button>

<button
onClick={setTopDownView} style={{ position: 'absolute', top: '10px', left: '150px', zIndex: 10 }}
>
Top-Down View
</button>
</div>

);
};

export default ThreeScene;
