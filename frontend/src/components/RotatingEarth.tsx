import React, { useEffect } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import earthTexture from '../assets/earth.png';
import cloudsTexture from '../assets/clouds.jpg';

const RotatingEarth: React.FC = () => {
  useEffect(() => {
    const scene = new THREE.Scene();

    const ambientLight = new THREE.AmbientLight(0xffffff, 5.5);
    scene.add(ambientLight);
    
    const directionalLight1 = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight1.position.set(5, 5, 5).normalize();
    scene.add(directionalLight1);

    const directionalLight2 = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight2.position.set(-5, -5, -5).normalize();
    scene.add(directionalLight2);

    const pointLight = new THREE.PointLight(0xffffff, 3, 100);
    pointLight.position.set(0, 10, 10);
    scene.add(pointLight);

    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    const geometry = new THREE.SphereGeometry(5, 120, 120);
    const textureLoader = new THREE.TextureLoader();
    const earthTextureImage = textureLoader.load(earthTexture);
    
    const material = new THREE.MeshStandardMaterial({ 
      map: earthTextureImage,
      roughness: 0.2,
      metalness: 0.5
    });

    const earth = new THREE.Mesh(geometry, material);
    scene.add(earth);

    const cloudsGeometry = new THREE.SphereGeometry(5.1, 120, 120);
    const cloudsTextureImage = textureLoader.load(cloudsTexture);
    
    const cloudsMaterial = new THREE.MeshBasicMaterial({
      map: cloudsTextureImage,
      transparent: true,
      opacity: 0.5
    });

    const clouds = new THREE.Mesh(cloudsGeometry, cloudsMaterial);
    scene.add(clouds);

    const atmosphereGeometry = new THREE.SphereGeometry(5.05, 120, 120);
    const atmosphereMaterial = new THREE.MeshStandardMaterial({
      transparent: true,
      opacity: 0.5,
      emissive: 0x1e90ff,
      emissiveIntensity: 0.7
    });

    const atmosphere = new THREE.Mesh(atmosphereGeometry, atmosphereMaterial);
    scene.add(atmosphere);

    const starsGeometry = new THREE.BufferGeometry();
    const starsMaterial = new THREE.PointsMaterial({ 
      color: 0x888888,
      size: 0.1 
    }); 
    const starCount = 1000;

    const positions = new Float32Array(starCount * 3);
    for (let i = 0; i < starCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 200;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 200;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 200;
    }

    starsGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    const stars = new THREE.Points(starsGeometry, starsMaterial);
    scene.add(stars);

    camera.position.z = 10;

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableZoom = false;
    controls.enablePan = false;

    const animate = () => {
      requestAnimationFrame(animate);
      earth.rotation.y += 0.0001;
      clouds.rotation.y += 0.0002;
      controls.update();
      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      renderer.setSize(width, height);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      controls.dispose();
      renderer.dispose();
      document.body.removeChild(renderer.domElement);
    };
  }, []);

  return null;
};

export default RotatingEarth;
