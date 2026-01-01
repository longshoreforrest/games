/**
 * Player - Player Character Controller
 * Handles player movement, camera, and interactions
 */

import * as THREE from 'three';

export class Player {
    constructor(game) {
        this.game = game;

        // Player state
        this.position = new THREE.Vector3(0, 1.7, 10);
        this.velocity = new THREE.Vector3();
        this.direction = new THREE.Vector3();

        // Movement settings
        this.moveSpeed = 5;
        this.runSpeed = 10;
        this.jumpForce = 8;
        this.gravity = -20;

        // State
        this.isGrounded = true;
        this.isRunning = false;
        this.isRiding = false;
        this.currentMount = null;

        // Interaction
        this.interactionDistance = 3;
        this.nearbyObjects = [];

        // Player mesh (rider visible on horse)
        this.mesh = null;
        this.createPlayerMesh();
    }

    createPlayerMesh() {
        const playerGroup = new THREE.Group();
        playerGroup.name = 'player';

        // Rider materials
        const skinMat = new THREE.MeshStandardMaterial({ color: 0xf5d0b0, roughness: 0.8 });
        const shirtMat = new THREE.MeshStandardMaterial({ color: 0x4466aa, roughness: 0.7 });
        const pantsMat = new THREE.MeshStandardMaterial({ color: 0x5D4037, roughness: 0.8 });
        const bootMat = new THREE.MeshStandardMaterial({ color: 0x2a2a2a, roughness: 0.6 });
        const hairMat = new THREE.MeshStandardMaterial({ color: 0x4a3520, roughness: 0.9 });
        const helmetMat = new THREE.MeshStandardMaterial({ color: 0x2244aa, roughness: 0.4 });

        // Body (torso)
        const torsoGeo = new THREE.CylinderGeometry(0.18, 0.22, 0.5, 12);
        const torso = new THREE.Mesh(torsoGeo, shirtMat);
        torso.position.set(0, 0.55, 0);
        torso.castShadow = true;
        playerGroup.add(torso);

        // Back (slightly curved for riding posture)
        const backGeo = new THREE.SphereGeometry(0.2, 10, 10);
        backGeo.scale(0.9, 1, 0.8);
        const back = new THREE.Mesh(backGeo, shirtMat);
        back.position.set(0, 0.6, 0.05);
        playerGroup.add(back);

        // Head
        const headGeo = new THREE.SphereGeometry(0.15, 12, 10);
        const head = new THREE.Mesh(headGeo, skinMat);
        head.position.set(0, 0.95, 0);
        head.castShadow = true;
        playerGroup.add(head);

        // Riding helmet
        const helmetGeo = new THREE.SphereGeometry(0.17, 12, 8, 0, Math.PI * 2, 0, Math.PI / 2);
        const helmet = new THREE.Mesh(helmetGeo, helmetMat);
        helmet.position.set(0, 0.98, 0);
        helmet.rotation.x = -0.1;
        playerGroup.add(helmet);

        // Helmet brim
        const brimGeo = new THREE.CylinderGeometry(0.18, 0.19, 0.02, 12);
        const brim = new THREE.Mesh(brimGeo, helmetMat);
        brim.position.set(0, 0.88, 0.05);
        brim.rotation.x = 0.3;
        playerGroup.add(brim);

        // Face/hair under helmet
        const faceGeo = new THREE.SphereGeometry(0.10, 8, 8, 0, Math.PI, 0, Math.PI);
        const face = new THREE.Mesh(faceGeo, skinMat);
        face.position.set(0, 0.88, 0.08);
        face.rotation.x = Math.PI / 2;
        playerGroup.add(face);

        // Arms (bent for holding reins)
        const armGeo = new THREE.CylinderGeometry(0.05, 0.06, 0.35, 8);

        // Left upper arm
        const leftArm = new THREE.Mesh(armGeo, shirtMat);
        leftArm.position.set(0.22, 0.55, 0.1);
        leftArm.rotation.set(0.8, 0, 0.5);
        leftArm.castShadow = true;
        playerGroup.add(leftArm);

        // Left forearm
        const leftForearm = new THREE.Mesh(armGeo, shirtMat);
        leftForearm.position.set(0.28, 0.35, 0.25);
        leftForearm.rotation.set(-0.5, 0, 0.2);
        playerGroup.add(leftForearm);

        // Right upper arm
        const rightArm = new THREE.Mesh(armGeo, shirtMat);
        rightArm.position.set(-0.22, 0.55, 0.1);
        rightArm.rotation.set(0.8, 0, -0.5);
        rightArm.castShadow = true;
        playerGroup.add(rightArm);

        // Right forearm
        const rightForearm = new THREE.Mesh(armGeo, shirtMat);
        rightForearm.position.set(-0.28, 0.35, 0.25);
        rightForearm.rotation.set(-0.5, 0, -0.2);
        playerGroup.add(rightForearm);

        // Hands
        const handGeo = new THREE.SphereGeometry(0.05, 8, 8);
        const leftHand = new THREE.Mesh(handGeo, skinMat);
        leftHand.position.set(0.25, 0.22, 0.35);
        playerGroup.add(leftHand);

        const rightHand = new THREE.Mesh(handGeo, skinMat);
        rightHand.position.set(-0.25, 0.22, 0.35);
        playerGroup.add(rightHand);

        // Upper legs (bent for seated position)
        const legGeo = new THREE.CylinderGeometry(0.08, 0.07, 0.4, 10);

        const leftLeg = new THREE.Mesh(legGeo, pantsMat);
        leftLeg.position.set(0.15, 0.15, 0);
        leftLeg.rotation.set(Math.PI / 2.5, 0, 0);
        leftLeg.castShadow = true;
        playerGroup.add(leftLeg);

        const rightLeg = new THREE.Mesh(legGeo, pantsMat);
        rightLeg.position.set(-0.15, 0.15, 0);
        rightLeg.rotation.set(Math.PI / 2.5, 0, 0);
        rightLeg.castShadow = true;
        playerGroup.add(rightLeg);

        // Lower legs
        const lowerLegGeo = new THREE.CylinderGeometry(0.06, 0.055, 0.35, 10);

        const leftLowerLeg = new THREE.Mesh(lowerLegGeo, pantsMat);
        leftLowerLeg.position.set(0.22, -0.1, 0.15);
        leftLowerLeg.rotation.set(0, 0, 0.2);
        playerGroup.add(leftLowerLeg);

        const rightLowerLeg = new THREE.Mesh(lowerLegGeo, pantsMat);
        rightLowerLeg.position.set(-0.22, -0.1, 0.15);
        rightLowerLeg.rotation.set(0, 0, -0.2);
        playerGroup.add(rightLowerLeg);

        // Boots
        const bootGeo = new THREE.BoxGeometry(0.08, 0.12, 0.18);

        const leftBoot = new THREE.Mesh(bootGeo, bootMat);
        leftBoot.position.set(0.24, -0.28, 0.18);
        playerGroup.add(leftBoot);

        const rightBoot = new THREE.Mesh(bootGeo, bootMat);
        rightBoot.position.set(-0.24, -0.28, 0.18);
        playerGroup.add(rightBoot);

        // Player starts hidden (shown when riding)
        playerGroup.visible = false;

        this.mesh = playerGroup;
        this.game.scene.add(this.mesh);
    }


    update(delta) {
        if (this.isRiding) {
            this.updateRiding(delta);
        } else {
            this.updateWalking(delta);
        }

        this.checkInteractions();
    }

    updateWalking(delta) {
        const keys = this.game.keys;

        // Get movement direction
        this.direction.set(0, 0, 0);

        if (keys.forward) this.direction.z -= 1;
        if (keys.backward) this.direction.z += 1;
        if (keys.left) this.direction.x -= 1;
        if (keys.right) this.direction.x += 1;

        // Normalize if moving diagonally
        if (this.direction.length() > 0) {
            this.direction.normalize();
        }

        // Apply camera rotation to movement direction
        const cameraDirection = new THREE.Vector3();
        this.game.camera.getWorldDirection(cameraDirection);
        cameraDirection.y = 0;
        cameraDirection.normalize();

        const cameraRight = new THREE.Vector3();
        cameraRight.crossVectors(new THREE.Vector3(0, 1, 0), cameraDirection).normalize();

        // Calculate final movement
        const moveDirection = new THREE.Vector3();
        moveDirection.addScaledVector(cameraDirection, -this.direction.z);
        moveDirection.addScaledVector(cameraRight, -this.direction.x);

        // Apply speed
        const speed = this.isRunning ? this.runSpeed : this.moveSpeed;
        this.velocity.x = moveDirection.x * speed;
        this.velocity.z = moveDirection.z * speed;

        // Gravity
        if (!this.isGrounded) {
            this.velocity.y += this.gravity * delta;
        }

        // Jump
        if (keys.jump && this.isGrounded) {
            this.velocity.y = this.jumpForce;
            this.isGrounded = false;
        }

        // Apply velocity
        this.position.addScaledVector(this.velocity, delta);

        // Ground check
        if (this.position.y <= 1.7) {
            this.position.y = 1.7;
            this.velocity.y = 0;
            this.isGrounded = true;
        }

        // Update camera position (in first-person mode)
        // For now we use orbit controls, but this is ready for FP mode
    }

    updateRiding(delta) {
        if (!this.currentMount) return;

        const keys = this.game.keys;
        const horse = this.currentMount;

        // Calculate riding direction
        let moveForward = 0;
        let turn = 0;

        if (keys.forward) moveForward = 1;
        if (keys.backward) moveForward = -0.5;
        if (keys.left) turn = 1;
        if (keys.right) turn = -1;

        // Turn the horse
        horse.mesh.rotation.y += turn * delta * 2;

        // Move forward/backward
        const speed = moveForward * (this.isRunning ? 15 : 6);
        const direction = new THREE.Vector3(
            Math.sin(horse.mesh.rotation.y),
            0,
            Math.cos(horse.mesh.rotation.y)
        );

        // Store current Y position before moving
        const currentY = horse.mesh.position.y;

        horse.mesh.position.addScaledVector(direction, speed * delta);

        // Ensure horse stays above ground (baseY minimum)
        horse.mesh.position.y = Math.max(horse.baseY, currentY);
        horse.position.copy(horse.mesh.position);

        // Update horse state based on movement
        if (Math.abs(moveForward) > 0.1) {
            horse.state = this.isRunning ? 'running' : 'walking';
        } else {
            horse.state = 'idle';
            // Reset Y position to baseY when idle
            horse.mesh.position.y = horse.baseY;
        }

        // Update rider (player) position on horse
        if (this.mesh) {
            // Position rider on horse's back (at saddle position)
            const riderOffset = new THREE.Vector3(0, 1.4, 0); // Above horse body
            this.mesh.position.copy(horse.mesh.position).add(riderOffset);
            this.mesh.rotation.y = horse.mesh.rotation.y;

            // Add slight bobbing when moving
            if (Math.abs(moveForward) > 0.1) {
                const bobAmount = Math.sin(Date.now() * 0.01) * 0.03;
                this.mesh.position.y += bobAmount;
            }
        }

        // Update camera to follow horse
        const cameraOffset = new THREE.Vector3(0, 4, 10);
        cameraOffset.applyAxisAngle(new THREE.Vector3(0, 1, 0), horse.mesh.rotation.y);

        const targetCameraPos = horse.mesh.position.clone().add(cameraOffset);
        this.game.camera.position.lerp(targetCameraPos, delta * 3);
        this.game.camera.lookAt(horse.mesh.position.clone().add(new THREE.Vector3(0, 1.5, 0)));
    }


    mountHorse(horse) {
        this.isRiding = true;
        this.currentMount = horse;
        horse.state = 'idle';

        // Show rider on horse
        if (this.mesh) {
            this.mesh.visible = true;
            // Initial position on horse
            const riderOffset = new THREE.Vector3(0, 1.4, 0);
            this.mesh.position.copy(horse.mesh.position).add(riderOffset);
            this.mesh.rotation.y = horse.mesh.rotation.y;
        }

        // Disable orbit controls
        this.game.orbitControls.enabled = false;

        // Position camera behind horse
        const offset = new THREE.Vector3(0, 3, 8);
        offset.applyAxisAngle(new THREE.Vector3(0, 1, 0), horse.mesh.rotation.y);
        this.game.camera.position.copy(horse.mesh.position.clone().add(offset));
        this.game.camera.lookAt(horse.mesh.position);
    }

    dismountHorse() {
        if (!this.currentMount) return;

        const horse = this.currentMount;
        horse.state = 'idle';

        // Hide rider mesh
        if (this.mesh) {
            this.mesh.visible = false;
        }

        // Position player next to horse
        const offset = new THREE.Vector3(2, 0, 0);
        offset.applyAxisAngle(new THREE.Vector3(0, 1, 0), horse.mesh.rotation.y);
        this.position.copy(horse.position).add(offset);
        this.position.y = 1.7;

        this.isRiding = false;
        this.currentMount = null;

        // Re-enable orbit controls
        this.game.orbitControls.enabled = true;
        this.game.orbitControls.target.copy(this.position);
    }

    checkInteractions() {
        this.nearbyObjects = [];

        // Check for nearby horses
        for (const horse of this.game.horses) {
            if (!horse.mesh) continue;

            const distance = this.position.distanceTo(horse.position);
            if (distance < this.interactionDistance) {
                this.nearbyObjects.push({
                    type: 'horse',
                    object: horse,
                    distance
                });
            }
        }

        // Check for stable entrance
        const stableEntrance = new THREE.Vector3(0, 0, 6);
        const stableDistance = this.position.distanceTo(stableEntrance);
        if (stableDistance < 5) {
            this.nearbyObjects.push({
                type: 'stable',
                object: this.game.stable,
                distance: stableDistance
            });
        }

        // Check for water area
        const waterCenter = new THREE.Vector3(-50, 0, 30);
        const waterDistance = this.position.distanceTo(waterCenter);
        if (waterDistance < 20) {
            this.nearbyObjects.push({
                type: 'water',
                distance: waterDistance
            });
        }

        // Sort by distance
        this.nearbyObjects.sort((a, b) => a.distance - b.distance);
    }

    getNearestInteractable() {
        return this.nearbyObjects.length > 0 ? this.nearbyObjects[0] : null;
    }

    // Enter cleaning mode - show player in stall with pitchfork
    enterCleaningMode(stallPosition, pitchfork) {
        this.isCleaning = true;

        // Position player in stall
        if (this.mesh) {
            this.mesh.visible = true;
            this.mesh.position.set(stallPosition.x, stallPosition.y + 0.4, stallPosition.z + 1);
            this.mesh.rotation.y = Math.PI; // Face into stall

            // Attach pitchfork if provided
            if (pitchfork) {
                this.heldItem = pitchfork;
                pitchfork.position.set(0.35, 0.3, 0.2);
                pitchfork.rotation.set(0.3, 0, -0.2);
                this.mesh.add(pitchfork);
            }
        }
    }

    // Exit cleaning mode
    exitCleaningMode() {
        this.isCleaning = false;

        // Remove held item
        if (this.heldItem && this.mesh) {
            this.mesh.remove(this.heldItem);
            this.heldItem = null;
        }

        // Hide player mesh
        if (this.mesh) {
            this.mesh.visible = false;
        }
    }

    // Update player animation during cleaning (called from game loop)
    updateCleaning(delta) {
        if (!this.isCleaning || !this.mesh) return;

        // Gentle idle animation
        const time = Date.now() * 0.001;
        this.mesh.position.y = this.mesh.position.y + Math.sin(time * 2) * 0.002;
    }
}

