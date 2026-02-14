// Three.js Scene for Hero Section
let scene, camera, renderer;
let particles = [];
let mouseX = 0, mouseY = 0;
let windowHalfX = window.innerWidth / 2;
let windowHalfY = window.innerHeight / 2;

function init() {
    // Create scene
    scene = new THREE.Scene();
    
    // Create camera
    camera = new THREE.PerspectiveCamera(
        75, 
        window.innerWidth / window.innerHeight, 
        0.1, 
        1000
    );
    camera.position.z = 5;
    
    // Create renderer
    renderer = new THREE.WebGLRenderer({ 
        antialias: true,
        alpha: true
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    
    // Add renderer to DOM
    const container = document.getElementById('three-canvas');
    if (container) {
        // Clear any existing canvas
        while (container.firstChild) {
            container.removeChild(container.firstChild);
        }
        container.appendChild(renderer.domElement);
    }
    
    // Create particles
    createParticles();
    
    // Create abstract geometric shapes
    createAbstractGeometry();
    
    // Event listeners
    document.addEventListener('mousemove', onDocumentMouseMove);
    window.addEventListener('resize', onWindowResize);
    
    // Start animation loop
    animate();
}

function createParticles() {
    const particleCount = 2000;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    
    // Particle material
    const material = new THREE.PointsMaterial({
        size: 0.02,
        vertexColors: true,
        transparent: true,
        opacity: 0.8,
        sizeAttenuation: true
    });
    
    // Position and color each particle
    for (let i = 0; i < particleCount; i++) {
        const i3 = i * 3;
        
        // Random positions in a sphere
        const radius = 5;
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos(2 * Math.random() - 1);
        const r = radius * Math.cbrt(Math.random());
        
        positions[i3] = r * Math.sin(phi) * Math.cos(theta);
        positions[i3 + 1] = r * Math.sin(phi) * Math.sin(theta);
        positions[i3 + 2] = r * Math.cos(phi);
        
        // Colors - mix of blues and purples
        colors[i3] = Math.random() > 0.5 ? 0 : 0.5 + Math.random() * 0.5; // R
        colors[i3 + 1] = Math.random() * 0.3; // G
        colors[i3 + 2] = 0.8 + Math.random() * 0.2; // B
    }
    
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    
    // Create particle system
    const particleSystem = new THREE.Points(geometry, material);
    scene.add(particleSystem);
    particles.push(particleSystem);
}

function createAbstractGeometry() {
    // Create multiple geometric shapes
    const geometries = [
        new THREE.TorusGeometry(1.5, 0.4, 16, 100),
        new THREE.OctahedronGeometry(1.2),
        new THREE.TetrahedronGeometry(1.0),
        new THREE.ConeGeometry(0.8, 1.5, 8)
    ];
    
    const materials = [
        new THREE.MeshBasicMaterial({ 
            color: 0x00f0ff, 
            wireframe: true,
            transparent: true,
            opacity: 0.3
        }),
        new THREE.MeshBasicMaterial({ 
            color: 0x8a2be2, 
            wireframe: true,
            transparent: true,
            opacity: 0.3
        }),
        new THREE.MeshPhongMaterial({
            color: 0x00f0ff,
            emissive: 0x008090,
            shininess: 100,
            transparent: true,
            opacity: 0.2
        }),
        new THREE.MeshStandardMaterial({
            color: 0x8a2be2,
            emissive: 0x4a0b7a,
            metalness: 0.7,
            roughness: 0.3,
            transparent: true,
            opacity: 0.4
        })
    ];
    
    geometries.forEach((geometry, index) => {
        const mesh = new THREE.Mesh(geometry, materials[index]);
        
        // Position shapes randomly but within view
        mesh.position.x = (Math.random() - 0.5) * 4;
        mesh.position.y = (Math.random() - 0.5) * 4;
        mesh.position.z = (Math.random() - 0.5) * 4;
        
        // Random rotation
        mesh.rotation.x = Math.random() * Math.PI;
        mesh.rotation.y = Math.random() * Math.PI;
        
        // Store for animation
        mesh.userData = {
            rotationSpeedX: (Math.random() - 0.5) * 0.01,
            rotationSpeedY: (Math.random() - 0.5) * 0.01,
            floatSpeed: (Math.random() - 0.5) * 0.01
        };
        
        scene.add(mesh);
        particles.push(mesh);
    });
    
    // Add ambient light
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.3);
    scene.add(ambientLight);
    
    // Add directional light
    const directionalLight = new THREE.DirectionalLight(0x00f0ff, 0.8);
    directionalLight.position.set(5, 5, 5);
    scene.add(directionalLight);
    
    // Add point lights for more depth
    const pointLight1 = new THREE.PointLight(0x00f0ff, 0.5);
    pointLight1.position.set(10, 10, 10);
    scene.add(pointLight1);
    
    const pointLight2 = new THREE.PointLight(0x8a2be2, 0.5);
    pointLight2.position.set(-10, -10, -10);
    scene.add(pointLight2);
}

function onDocumentMouseMove(event) {
    mouseX = (event.clientX - windowHalfX) / 100;
    mouseY = (event.clientY - windowHalfY) / 100;
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    windowHalfX = window.innerWidth / 2;
    windowHalfY = window.innerHeight / 2;
}

function animate() {
    requestAnimationFrame(animate);
    
    // Update particles
    particles.forEach((particle, index) => {
        if (particle.isPoints || particle.isMesh) {
            // Rotate particles slowly
            particle.rotation.x += 0.001;
            particle.rotation.y += 0.001;
            
            // If it's a mesh with custom rotation speeds
            if (particle.userData) {
                particle.rotation.x += particle.userData.rotationSpeedX;
                particle.rotation.y += particle.userData.rotationSpeedY;
                
                // Make it float gently
                particle.position.y += Math.sin(Date.now() * 0.001 + index) * 0.001;
            }
        }
    });
    
    // Move camera based on mouse position for parallax effect
    camera.position.x += (mouseX - camera.position.x) * 0.05;
    camera.position.y += (-mouseY - camera.position.y) * 0.05;
    camera.lookAt(scene.position);
    
    renderer.render(scene, camera);
}

// Initialize when page loads
window.addEventListener('load', init);

// Handle window resize
window.addEventListener('resize', () => {
    if (renderer) {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    }
});

// Export for potential use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { init, animate };
}