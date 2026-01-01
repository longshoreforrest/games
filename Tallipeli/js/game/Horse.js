/**
 * Horse - Individual Horse Entity
 * Manages horse stats, appearance, and behavior
 */

import * as THREE from 'three';

export class Horse {
    constructor(game, data) {
        this.game = game;
        this.name = data.name;
        this.color = data.color;
        this.stallIndex = data.stallIndex;

        // Stats (0-100)
        this.stats = {
            hunger: 80 + Math.random() * 20,
            thirst: 70 + Math.random() * 30,
            cleanliness: 60 + Math.random() * 40,
            happiness: 85 + Math.random() * 15,
            energy: 90 + Math.random() * 10,
            hooves: 75 + Math.random() * 25
        };

        // State
        this.state = 'idle'; // idle, eating, walking, running, sleeping, swimming
        this.location = 'stall'; // stall, paddock, arena, trail, water
        this.isSelected = false;

        // Equipment state
        this.hasHalter = false;  // Riimu
        this.hasBlanket = false; // Loimi
        this.blanketColor = null;

        // 3D Mesh
        this.mesh = null;
        this.halterMesh = null;
        this.blanketMesh = null;
        this.position = new THREE.Vector3();
        this.rotation = 0;

        // Animation
        this.animationTime = 0;
        this.walkCycle = 0;

        // Horse physical properties
        this.height = 1.6; // meters at withers
        this.bodyLength = 2.4;
        this.baseY = 0.2; // Base height above ground to prevent clipping
    }


    create() {
        this.mesh = this.createHorseMesh();

        // Position in stall - use the stall's Y position which accounts for floor height
        const stallPosition = this.game.stable.getStallPosition(this.stallIndex);
        // Update baseY to match stall floor level for this horse
        this.baseY = stallPosition.y;
        this.mesh.position.copy(stallPosition);
        this.position.copy(stallPosition);

        this.game.scene.add(this.mesh);
    }


    createHorseMesh() {
        const horseGroup = new THREE.Group();
        horseGroup.name = `horse-${this.name}`;

        const bodyMaterial = new THREE.MeshStandardMaterial({
            color: this.color,
            roughness: 0.6,
            metalness: 0.1
        });

        // Body - elongated ellipsoid
        const bodyGeo = new THREE.SphereGeometry(0.5, 16, 12);
        bodyGeo.scale(1.8, 1, 1.2);
        const body = new THREE.Mesh(bodyGeo, bodyMaterial);
        body.position.set(0, 1.2, 0);
        body.castShadow = true;
        horseGroup.add(body);

        // Neck
        const neckGeo = new THREE.CylinderGeometry(0.25, 0.35, 1, 12);
        const neck = new THREE.Mesh(neckGeo, bodyMaterial);
        neck.position.set(0.8, 1.6, 0);
        neck.rotation.z = Math.PI / 4;
        neck.castShadow = true;
        horseGroup.add(neck);

        // Head
        const headGeo = new THREE.SphereGeometry(0.3, 12, 8);
        headGeo.scale(1.6, 1, 0.9);
        const head = new THREE.Mesh(headGeo, bodyMaterial);
        head.position.set(1.4, 2.0, 0);
        head.rotation.z = Math.PI / 8;
        head.castShadow = true;
        horseGroup.add(head);

        // Snout/Muzzle
        const snoutGeo = new THREE.SphereGeometry(0.18, 10, 8);
        snoutGeo.scale(1.4, 1, 1);
        const snoutMaterial = new THREE.MeshStandardMaterial({
            color: this.getLighterColor(),
            roughness: 0.7
        });
        const snout = new THREE.Mesh(snoutGeo, snoutMaterial);
        snout.position.set(1.8, 1.9, 0);
        snout.castShadow = true;
        horseGroup.add(snout);

        // Nostrils
        const nostrilGeo = new THREE.SphereGeometry(0.04, 6, 6);
        const nostrilMat = new THREE.MeshStandardMaterial({ color: 0x1a1a1a });
        const leftNostril = new THREE.Mesh(nostrilGeo, nostrilMat);
        leftNostril.position.set(1.95, 1.85, 0.1);
        horseGroup.add(leftNostril);

        const rightNostril = new THREE.Mesh(nostrilGeo, nostrilMat);
        rightNostril.position.set(1.95, 1.85, -0.1);
        horseGroup.add(rightNostril);

        // Eyes
        const eyeGeo = new THREE.SphereGeometry(0.06, 8, 8);
        const eyeWhiteMat = new THREE.MeshStandardMaterial({ color: 0xffffff });
        const eyePupilMat = new THREE.MeshStandardMaterial({ color: 0x1a1010 });

        const leftEye = new THREE.Mesh(eyeGeo, eyeWhiteMat);
        leftEye.position.set(1.5, 2.1, 0.2);
        horseGroup.add(leftEye);

        const leftPupil = new THREE.Mesh(new THREE.SphereGeometry(0.04, 6, 6), eyePupilMat);
        leftPupil.position.set(1.55, 2.1, 0.23);
        horseGroup.add(leftPupil);

        const rightEye = new THREE.Mesh(eyeGeo, eyeWhiteMat);
        rightEye.position.set(1.5, 2.1, -0.2);
        horseGroup.add(rightEye);

        const rightPupil = new THREE.Mesh(new THREE.SphereGeometry(0.04, 6, 6), eyePupilMat);
        rightPupil.position.set(1.55, 2.1, -0.23);
        horseGroup.add(rightPupil);

        // Ears
        const earGeo = new THREE.ConeGeometry(0.08, 0.2, 8);
        const leftEar = new THREE.Mesh(earGeo, bodyMaterial);
        leftEar.position.set(1.25, 2.35, 0.15);
        leftEar.rotation.x = -0.2;
        leftEar.castShadow = true;
        horseGroup.add(leftEar);

        const rightEar = new THREE.Mesh(earGeo, bodyMaterial);
        rightEar.position.set(1.25, 2.35, -0.15);
        rightEar.rotation.x = 0.2;
        rightEar.castShadow = true;
        horseGroup.add(rightEar);

        // Mane
        const maneMaterial = new THREE.MeshStandardMaterial({
            color: this.getManeColor(),
            roughness: 0.9
        });

        for (let i = 0; i < 8; i++) {
            const maneGeo = new THREE.BoxGeometry(0.15, 0.3 + Math.random() * 0.1, 0.08);
            const manePiece = new THREE.Mesh(maneGeo, maneMaterial);
            manePiece.position.set(1.0 - i * 0.12, 2.0 + Math.sin(i * 0.5) * 0.1, 0);
            manePiece.rotation.z = -0.3 + i * 0.05;
            horseGroup.add(manePiece);
        }

        // Legs
        const legMaterial = bodyMaterial.clone();
        const legGeo = new THREE.CylinderGeometry(0.08, 0.1, 1.0, 8);

        // Front legs
        this.frontLeftLeg = new THREE.Group();
        const frontLeftUpper = new THREE.Mesh(legGeo, legMaterial);
        frontLeftUpper.position.y = 0.5;
        this.frontLeftLeg.add(frontLeftUpper);
        this.frontLeftLeg.position.set(0.6, 0.2, 0.25);
        horseGroup.add(this.frontLeftLeg);

        this.frontRightLeg = new THREE.Group();
        const frontRightUpper = new THREE.Mesh(legGeo, legMaterial);
        frontRightUpper.position.y = 0.5;
        this.frontRightLeg.add(frontRightUpper);
        this.frontRightLeg.position.set(0.6, 0.2, -0.25);
        horseGroup.add(this.frontRightLeg);

        // Back legs
        this.backLeftLeg = new THREE.Group();
        const backLeftUpper = new THREE.Mesh(legGeo, legMaterial);
        backLeftUpper.position.y = 0.5;
        this.backLeftLeg.add(backLeftUpper);
        this.backLeftLeg.position.set(-0.6, 0.2, 0.25);
        horseGroup.add(this.backLeftLeg);

        this.backRightLeg = new THREE.Group();
        const backRightUpper = new THREE.Mesh(legGeo, legMaterial);
        backRightUpper.position.y = 0.5;
        this.backRightLeg.add(backRightUpper);
        this.backRightLeg.position.set(-0.6, 0.2, -0.25);
        horseGroup.add(this.backRightLeg);

        // Hooves
        const hoofGeo = new THREE.CylinderGeometry(0.1, 0.12, 0.15, 8);
        const hoofMat = new THREE.MeshStandardMaterial({ color: 0x2a2a2a });

        const hooves = [this.frontLeftLeg, this.frontRightLeg, this.backLeftLeg, this.backRightLeg];
        hooves.forEach(leg => {
            const hoof = new THREE.Mesh(hoofGeo, hoofMat);
            hoof.position.y = 0.07;
            leg.add(hoof);
        });

        // Tail
        this.tail = new THREE.Group();
        const tailMaterial = maneMaterial.clone();

        for (let i = 0; i < 5; i++) {
            const tailGeo = new THREE.CylinderGeometry(0.05 - i * 0.008, 0.06 - i * 0.008, 0.3, 8);
            const tailPiece = new THREE.Mesh(tailGeo, tailMaterial);
            tailPiece.position.y = -i * 0.25;
            tailPiece.rotation.x = 0.3 + i * 0.1;
            this.tail.add(tailPiece);
        }

        this.tail.position.set(-0.95, 1.3, 0);
        this.tail.rotation.x = 0.5;
        horseGroup.add(this.tail);

        // Store reference to body for dirt overlay
        this.bodyMesh = body;

        return horseGroup;
    }

    getLighterColor() {
        const color = new THREE.Color(this.color);
        color.r = Math.min(1, color.r + 0.2);
        color.g = Math.min(1, color.g + 0.2);
        color.b = Math.min(1, color.b + 0.2);
        return color;
    }

    getManeColor() {
        // Darker mane for most horses, or contrasting color
        const color = new THREE.Color(this.color);
        if (color.r < 0.3 && color.g < 0.3 && color.b < 0.3) {
            // Very dark horse - keep mane black
            return 0x0a0a0a;
        }
        return new THREE.Color(
            Math.max(0, color.r - 0.3),
            Math.max(0, color.g - 0.3),
            Math.max(0, color.b - 0.3)
        );
    }

    update(delta) {
        this.animationTime += delta;

        // Decrease stats over time
        this.decreaseStats(delta);

        // Animate based on state
        this.animate(delta);

        // Update happiness based on other stats
        this.updateHappiness();
    }

    decreaseStats(delta) {
        // Stats decrease slowly over time (per minute of game time)
        const decreaseRate = delta / 60;

        this.stats.hunger = Math.max(0, this.stats.hunger - decreaseRate * 2);
        this.stats.thirst = Math.max(0, this.stats.thirst - decreaseRate * 3);
        this.stats.cleanliness = Math.max(0, this.stats.cleanliness - decreaseRate * 1);
        this.stats.energy = Math.max(0, this.stats.energy - decreaseRate * 0.5);
        this.stats.hooves = Math.max(0, this.stats.hooves - decreaseRate * 0.2);
    }

    updateHappiness() {
        // Happiness is average of other stats
        const avgStats = (
            this.stats.hunger +
            this.stats.thirst +
            this.stats.cleanliness +
            this.stats.energy +
            this.stats.hooves
        ) / 5;

        // Smooth transition
        this.stats.happiness = this.stats.happiness * 0.95 + avgStats * 0.05;
    }

    animate(delta) {
        if (!this.mesh) return;

        switch (this.state) {
            case 'idle':
                this.animateIdle(delta);
                break;
            case 'eating':
                this.animateEating(delta);
                break;
            case 'walking':
                this.animateWalking(delta);
                break;
            case 'running':
                this.animateRunning(delta);
                break;
            case 'swimming':
                this.animateSwimming(delta);
                break;
        }

        // Tail swish animation
        if (this.tail) {
            this.tail.rotation.z = Math.sin(this.animationTime * 2) * 0.2;
        }
    }

    animateIdle(delta) {
        // Subtle breathing animation
        const breathe = Math.sin(this.animationTime * 1.5) * 0.02;
        if (this.bodyMesh) {
            this.bodyMesh.scale.y = 1 + breathe;
        }

        // Occasional ear twitch
        // Slight head movement
    }

    animateEating(delta) {
        // Head bobbing down
        const headBob = Math.sin(this.animationTime * 3) * 0.1;
        // Animate head position
    }

    animateWalking(delta) {
        this.walkCycle += delta * 3;

        // Leg animation
        const legSwing = 0.3;

        if (this.frontLeftLeg) {
            this.frontLeftLeg.rotation.x = Math.sin(this.walkCycle) * legSwing;
        }
        if (this.frontRightLeg) {
            this.frontRightLeg.rotation.x = Math.sin(this.walkCycle + Math.PI) * legSwing;
        }
        if (this.backLeftLeg) {
            this.backLeftLeg.rotation.x = Math.sin(this.walkCycle + Math.PI) * legSwing;
        }
        if (this.backRightLeg) {
            this.backRightLeg.rotation.x = Math.sin(this.walkCycle) * legSwing;
        }

        // Body bob - add baseY to keep horse above ground
        this.mesh.position.y = this.baseY + 0.05 * Math.abs(Math.sin(this.walkCycle * 2));
    }

    animateRunning(delta) {
        this.walkCycle += delta * 6;

        const legSwing = 0.6;

        if (this.frontLeftLeg) {
            this.frontLeftLeg.rotation.x = Math.sin(this.walkCycle) * legSwing;
        }
        if (this.frontRightLeg) {
            this.frontRightLeg.rotation.x = Math.sin(this.walkCycle + Math.PI * 0.3) * legSwing;
        }
        if (this.backLeftLeg) {
            this.backLeftLeg.rotation.x = Math.sin(this.walkCycle + Math.PI) * legSwing;
        }
        if (this.backRightLeg) {
            this.backRightLeg.rotation.x = Math.sin(this.walkCycle + Math.PI * 1.3) * legSwing;
        }

        // More pronounced body movement - add baseY to keep horse above ground
        this.mesh.position.y = this.baseY + 0.1 * Math.abs(Math.sin(this.walkCycle * 2));
    }

    animateSwimming(delta) {
        // Swimming animation - legs paddling
        this.walkCycle += delta * 2;

        const legPaddle = 0.4;

        if (this.frontLeftLeg) {
            this.frontLeftLeg.rotation.x = Math.sin(this.walkCycle) * legPaddle;
        }
        if (this.frontRightLeg) {
            this.frontRightLeg.rotation.x = Math.sin(this.walkCycle + Math.PI) * legPaddle;
        }

        // Body floating motion (swimming is higher)
        this.mesh.position.y = 0.5 + Math.sin(this.animationTime) * 0.1;
    }

    // Activity methods
    brush(progress) {
        // Called during brushing activity
        this.stats.cleanliness = Math.min(100, this.stats.cleanliness + progress * 0.5);
        this.stats.happiness = Math.min(100, this.stats.happiness + progress * 0.2);
    }

    feed(foodType) {
        const foodEffects = {
            hay: { hunger: 30, energy: 10 },
            oats: { hunger: 20, energy: 25 },
            carrot: { hunger: 10, happiness: 15 },
            water: { thirst: 40 }
        };

        const effect = foodEffects[foodType] || { hunger: 10 };

        Object.keys(effect).forEach(stat => {
            if (this.stats[stat] !== undefined) {
                this.stats[stat] = Math.min(100, this.stats[stat] + effect[stat]);
            }
        });
    }

    wash(progress) {
        this.stats.cleanliness = Math.min(100, this.stats.cleanliness + progress * 0.8);
    }

    shoe() {
        this.stats.hooves = 100;
    }

    moveToPaddock() {
        this.location = 'paddock';
        this.state = 'walking';

        // Move horse mesh to paddock area
        const paddockPos = new THREE.Vector3(40, this.baseY, Math.random() * 20 - 10);
        this.mesh.position.copy(paddockPos);
        this.position.copy(paddockPos);

        // Increase happiness from being outside
        this.stats.happiness = Math.min(100, this.stats.happiness + 10);
    }

    moveToStall() {
        this.location = 'stall';
        this.state = 'idle';

        // Move back to stall
        const stallPos = this.game.stable.getStallPosition(this.stallIndex);
        stallPos.y = this.baseY;
        this.mesh.position.copy(stallPos);
        this.position.copy(stallPos);
    }

    startSwimming() {
        this.location = 'water';
        this.state = 'swimming';

        // Move to water area (higher Y for swimming)
        const waterPos = new THREE.Vector3(-50, 0.5, 30);
        this.mesh.position.copy(waterPos);
        this.position.copy(waterPos);

        // Swimming is good for the horse
        this.stats.cleanliness = Math.min(100, this.stats.cleanliness + 20);
        this.stats.happiness = Math.min(100, this.stats.happiness + 15);
    }

    stopSwimming() {
        this.state = 'idle';
        this.moveToStall();
    }

    getStatsForUI() {
        return {
            name: this.name,
            hunger: Math.round(this.stats.hunger),
            thirst: Math.round(this.stats.thirst),
            cleanliness: Math.round(this.stats.cleanliness),
            happiness: Math.round(this.stats.happiness),
            energy: Math.round(this.stats.energy),
            hooves: Math.round(this.stats.hooves)
        };
    }

    // =====================
    // EQUIPMENT METHODS
    // =====================

    putOnHalter() {
        if (this.hasHalter) return;

        this.hasHalter = true;

        // Create halter mesh
        const halterGroup = new THREE.Group();
        halterGroup.name = 'halter';

        const halterMat = new THREE.MeshStandardMaterial({
            color: 0x8B0000,
            roughness: 0.7
        });

        // Noseband
        const nosebandGeo = new THREE.TorusGeometry(0.2, 0.02, 8, 16);
        const noseband = new THREE.Mesh(nosebandGeo, halterMat);
        noseband.position.set(1.75, 1.9, 0);
        noseband.rotation.y = Math.PI / 2;
        halterGroup.add(noseband);

        // Cheek straps
        const strapGeo = new THREE.CylinderGeometry(0.015, 0.015, 0.4, 8);

        const leftCheek = new THREE.Mesh(strapGeo, halterMat);
        leftCheek.position.set(1.5, 2.05, 0.18);
        leftCheek.rotation.x = Math.PI / 2;
        leftCheek.rotation.z = 0.3;
        halterGroup.add(leftCheek);

        const rightCheek = new THREE.Mesh(strapGeo, halterMat);
        rightCheek.position.set(1.5, 2.05, -0.18);
        rightCheek.rotation.x = Math.PI / 2;
        rightCheek.rotation.z = 0.3;
        halterGroup.add(rightCheek);

        // Crown piece (over head)
        const crownGeo = new THREE.TorusGeometry(0.15, 0.015, 8, 12, Math.PI);
        const crown = new THREE.Mesh(crownGeo, halterMat);
        crown.position.set(1.35, 2.25, 0);
        crown.rotation.x = Math.PI / 2;
        crown.rotation.z = Math.PI / 4;
        halterGroup.add(crown);

        // Lead rope ring
        const ringGeo = new THREE.TorusGeometry(0.04, 0.01, 8, 12);
        const ringMat = new THREE.MeshStandardMaterial({ color: 0xc0c0c0, metalness: 0.8 });
        const ring = new THREE.Mesh(ringGeo, ringMat);
        ring.position.set(1.85, 1.75, 0);
        ring.rotation.y = Math.PI / 2;
        halterGroup.add(ring);

        this.halterMesh = halterGroup;
        this.mesh.add(halterGroup);
    }

    takeOffHalter() {
        if (!this.hasHalter) return;

        this.hasHalter = false;

        if (this.halterMesh) {
            this.mesh.remove(this.halterMesh);
            this.halterMesh = null;
        }
    }

    putOnBlanket(color = 0x4169E1) {
        if (this.hasBlanket) return;

        this.hasBlanket = true;
        this.blanketColor = color;

        // Create blanket mesh
        const blanketGroup = new THREE.Group();
        blanketGroup.name = 'blanket';

        const blanketMat = new THREE.MeshStandardMaterial({
            color: color,
            roughness: 0.8,
            side: THREE.DoubleSide
        });

        // Main blanket body
        const blanketGeo = new THREE.BoxGeometry(1.8, 0.05, 1.2);
        const blanket = new THREE.Mesh(blanketGeo, blanketMat);
        blanket.position.set(0, 1.55, 0);
        blanketGroup.add(blanket);

        // Front edge (curved down)
        const frontGeo = new THREE.BoxGeometry(0.3, 0.5, 1.0);
        const front = new THREE.Mesh(frontGeo, blanketMat);
        front.position.set(0.85, 1.35, 0);
        front.rotation.z = 0.4;
        blanketGroup.add(front);

        // Back edge
        const backGeo = new THREE.BoxGeometry(0.3, 0.4, 0.8);
        const back = new THREE.Mesh(backGeo, blanketMat);
        back.position.set(-0.85, 1.35, 0);
        back.rotation.z = -0.3;
        blanketGroup.add(back);

        // Straps (under belly)
        const strapMat = new THREE.MeshStandardMaterial({ color: 0x2a2a2a });
        const strapGeo = new THREE.CylinderGeometry(0.02, 0.02, 0.8, 8);

        const frontStrap = new THREE.Mesh(strapGeo, strapMat);
        frontStrap.position.set(0.3, 0.9, 0);
        frontStrap.rotation.z = Math.PI / 2;
        blanketGroup.add(frontStrap);

        const backStrap = new THREE.Mesh(strapGeo, strapMat);
        backStrap.position.set(-0.3, 0.9, 0);
        backStrap.rotation.z = Math.PI / 2;
        blanketGroup.add(backStrap);

        this.blanketMesh = blanketGroup;
        this.mesh.add(blanketGroup);
    }

    takeOffBlanket() {
        if (!this.hasBlanket) return;

        this.hasBlanket = false;
        this.blanketColor = null;

        if (this.blanketMesh) {
            this.mesh.remove(this.blanketMesh);
            this.blanketMesh = null;
        }
    }

    // Check if horse can be led (needs halter)
    canBeLed() {
        return this.hasHalter;
    }
}

