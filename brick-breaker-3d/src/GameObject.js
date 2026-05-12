import * as THREE from 'three';

export class Paddle {
  constructor() {
    const geometry = new THREE.BoxGeometry(4, 1, 1);
    const material = new THREE.MeshStandardMaterial({
      color: 0x00ffaa,
      metalness: 0.3,
      roughness: 0.5
    });
    this.mesh = new THREE.Mesh(geometry, material);
    this.mesh.position.set(0, 0.5, 10);
    this.mesh.castShadow = true;
    this.mesh.receiveShadow = true;
    this.mesh.userData.type = 'paddle';
    this.speed = 0.3;
  }

  move(direction) {
    this.mesh.position.x += direction * this.speed;
    this.mesh.position.x = Math.max(-6, Math.min(6, this.mesh.position.x));
  }

  moveTo(x) {
    this.mesh.position.x = x;
    this.mesh.position.x = Math.max(-6, Math.min(6, this.mesh.position.x));
  }

  getBoundingBox() {
    return new THREE.Box3().setFromObject(this.mesh);
  }
}

export class Ball {
  constructor() {
    const geometry = new THREE.SphereGeometry(0.5, 32, 32);
    const material = new THREE.MeshStandardMaterial({
      color: 0xff6b6b,
      metalness: 0.5,
      roughness: 0.3
    });
    this.mesh = new THREE.Mesh(geometry, material);
    this.mesh.position.set(0, 0.5, 8);
    this.mesh.castShadow = true;
    this.mesh.userData.type = 'ball';
    this.velocity = new THREE.Vector3(0.15, 0, -0.15);
    this.speed = 0.2;
  }

  update() {
    this.mesh.position.add(this.velocity);
  }

  reset() {
    this.mesh.position.set(0, 0.5, 8);
    this.velocity.set(0.15, 0, -0.15);
  }

  getBoundingBox() {
    return new THREE.Box3().setFromObject(this.mesh);
  }

  bounce(normal) {
    this.velocity.reflect(normal);
  }
}

export class Brick {
  constructor(x, z, color) {
    const geometry = new THREE.BoxGeometry(2, 1, 1);
    const material = new THREE.MeshStandardMaterial({
      color: color,
      metalness: 0.2,
      roughness: 0.6
    });
    this.mesh = new THREE.Mesh(geometry, material);
    this.mesh.position.set(x, 0.5, z);
    this.mesh.castShadow = true;
    this.mesh.receiveShadow = true;
    this.mesh.userData.type = 'brick';
    this.points = 10;
  }

  getBoundingBox() {
    return new THREE.Box3().setFromObject(this.mesh);
  }
}
