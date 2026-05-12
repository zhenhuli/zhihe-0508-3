import * as THREE from 'three';

export class GameScene {
  constructor() {
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.objects = [];
    this.init();
  }

  init() {
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setClearColor(0x1a1a2e);
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    this.camera.position.set(0, 15, 20);
    this.camera.lookAt(0, 0, 0);

    this.addLights();
    this.addWalls();

    window.addEventListener('resize', () => this.onResize());
  }

  addLights() {
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    this.scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(10, 20, 10);
    directionalLight.castShadow = true;
    directionalLight.shadow.mapSize.width = 2048;
    directionalLight.shadow.mapSize.height = 2048;
    this.scene.add(directionalLight);
  }

  addWalls() {
    const wallMaterial = new THREE.MeshStandardMaterial({
      color: 0x16213e,
      transparent: true,
      opacity: 0.3
    });

    const leftWall = new THREE.Mesh(
      new THREE.BoxGeometry(1, 10, 30),
      wallMaterial
    );
    leftWall.position.set(-8, 0, 0);
    leftWall.userData.type = 'wall';
    this.scene.add(leftWall);
    this.objects.push(leftWall);

    const rightWall = new THREE.Mesh(
      new THREE.BoxGeometry(1, 10, 30),
      wallMaterial
    );
    rightWall.position.set(8, 0, 0);
    rightWall.userData.type = 'wall';
    this.scene.add(rightWall);
    this.objects.push(rightWall);

    const topWall = new THREE.Mesh(
      new THREE.BoxGeometry(16, 10, 1),
      wallMaterial
    );
    topWall.position.set(0, 0, -15);
    topWall.userData.type = 'wall';
    this.scene.add(topWall);
    this.objects.push(topWall);

    const bottomWall = new THREE.Mesh(
      new THREE.BoxGeometry(16, 10, 1),
      wallMaterial
    );
    bottomWall.position.set(0, 0, 15);
    bottomWall.userData.type = 'bottom';
    this.scene.add(bottomWall);
    this.objects.push(bottomWall);
  }

  addObject(object) {
    this.scene.add(object.mesh);
    this.objects.push(object);
  }

  removeObject(object) {
    this.scene.remove(object.mesh);
    const index = this.objects.indexOf(object);
    if (index > -1) {
      this.objects.splice(index, 1);
    }
  }

  onResize() {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }

  render() {
    this.renderer.render(this.scene, this.camera);
  }

  getDomElement() {
    return this.renderer.domElement;
  }
}
