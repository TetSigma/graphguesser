import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
// Typescript cant find this declaration file but it works just fine
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import earthTexture from "../../assets/earth.png";
import cloudsTexture from "../../assets/clouds.jpg";

interface RotatingEarthProps {
  startCameraMove: boolean;
  redirectUrl: string;
}

const RotatingEarth: React.FC<RotatingEarthProps> = ({
  startCameraMove,
  redirectUrl,
}) => {
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const earthRef = useRef<THREE.Mesh | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);

  useEffect(() => {
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x040d21); // Dark background color
    sceneRef.current = scene;

    // Create camera with initial position
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.set(0, 10, 7);
    cameraRef.current = camera;

    // Renderer setup
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Load textures
    const textureLoader = new THREE.TextureLoader();
    const earthTextureImage = textureLoader.load(earthTexture);
    earthTextureImage.anisotropy = renderer.capabilities.getMaxAnisotropy();

    const cloudsTextureImage = textureLoader.load(cloudsTexture);
    cloudsTextureImage.anisotropy = renderer.capabilities.getMaxAnisotropy();

    // Earth geometry and material
    const geometry = new THREE.SphereGeometry(5, 256, 256);
    const earthMaterial = new THREE.MeshStandardMaterial({
      map: earthTextureImage,
    });
    const earth = new THREE.Mesh(geometry, earthMaterial);
    scene.add(earth);
    earthRef.current = earth;

    // Ambient light
    const ambientLight = new THREE.AmbientLight(0xbbbbbb, 0.3);
    scene.add(ambientLight);

    // Directional light for strong effect on one side
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1.5);
    directionalLight.position.set(-5, 3, -8);
    camera.add(directionalLight); // Attach light to camera
    scene.add(camera);

    // Orbit controls setup
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableRotate = false;
    controls.enableZoom = false;
    controls.enablePan = false;
    controlsRef.current = controls;

    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);
      const rotationSpeed = 0.0001;
      if (earthRef.current) earthRef.current.rotation.y += rotationSpeed;
      renderer.render(scene, camera);
    };
    animate();

    // Star background
    const starsGeometry = new THREE.BufferGeometry();
    const starsMaterial = new THREE.PointsMaterial({
      color: 0x888888,
      size: 0.1,
    });
    const starCount = 1000;
    const positions = new Float32Array(starCount * 3);
    for (let i = 0; i < starCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 200;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 200;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 200;
    }
    starsGeometry.setAttribute(
      "position",
      new THREE.BufferAttribute(positions, 3)
    );
    const stars = new THREE.Points(starsGeometry, starsMaterial);
    scene.add(stars);

    // Handle window resizing
    const handleResize = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      renderer.setSize(width, height);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      if (controlsRef.current) controlsRef.current.dispose();
      if (rendererRef.current) rendererRef.current.dispose();
      document.body.removeChild(renderer.domElement);
    };
  }, []);

  // Camera movement effect
  useEffect(() => {
    if (startCameraMove && cameraRef.current) {
      const start = new THREE.Vector3(0, 10, 7);
      const mid = new THREE.Vector3(
        (Math.random() - 0.5) * 10,
        (Math.random() - 0.5) * 10,
        7 + Math.random() * 5
      );
      const end = new THREE.Vector3(
        (Math.random() - 0.5) * 5,
        (Math.random() - 0.5) * 5,
        5 + Math.random() * 2
      );

      const curve = new THREE.CatmullRomCurve3([start, mid, end]);
      let progress = 0;

      const moveCamera = () => {
        if (progress <= 1) {
          const easedProgress =
            progress < 0.5
              ? 2 * progress * progress
              : -1 + (4 - 2 * progress) * progress;

          const position = curve.getPoint(easedProgress);
          if (cameraRef.current) {
            cameraRef.current.position.copy(position);
            cameraRef.current.lookAt(new THREE.Vector3(0, 0, 0));
          }

          progress += 0.002;
          requestAnimationFrame(moveCamera);
        } else {
          window.location.href = redirectUrl;
        }
      };

      moveCamera();
    }
  }, [startCameraMove, redirectUrl]);

  return <div></div>;
};

export default RotatingEarth;
