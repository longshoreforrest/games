/**
 * Stable - The Horse Stable Building
 * Creates and manages the stable structure and stalls
 */

import * as THREE from 'three';

export class Stable {
    constructor(game) {
        this.game = game;
        this.mesh = null;
        this.stalls = [];
        this.stallPositions = [];

        // Stable dimensions
        this.width = 20;
        this.depth = 12;
        this.height = 5;
        this.numStalls = 4;
    }

    create() {
        this.mesh = new THREE.Group();
        this.mesh.name = 'stable';

        this.createFoundation();
        this.createWalls();
        this.createRoof();
        this.createStalls();
        this.createAisle();
        this.createDecorations();
        this.createTackRoom(); // Varustehuone

        this.game.scene.add(this.mesh);
    }


    createFoundation() {
        const foundationGeo = new THREE.BoxGeometry(this.width + 2, 0.3, this.depth + 2);
        const foundationMat = new THREE.MeshStandardMaterial({
            color: 0x555555,
            roughness: 0.9
        });

        const foundation = new THREE.Mesh(foundationGeo, foundationMat);
        foundation.position.y = 0.15;
        foundation.receiveShadow = true;
        this.mesh.add(foundation);
    }

    createWalls() {
        const wallMaterial = new THREE.MeshStandardMaterial({
            color: 0xDEB887, // Burlywood
            roughness: 0.8
        });

        const darkWoodMaterial = new THREE.MeshStandardMaterial({
            color: 0x654321,
            roughness: 0.7
        });

        // Back wall
        const backWallGeo = new THREE.BoxGeometry(this.width, this.height, 0.3);
        const backWall = new THREE.Mesh(backWallGeo, wallMaterial);
        backWall.position.set(0, this.height / 2 + 0.3, -this.depth / 2);
        backWall.castShadow = true;
        backWall.receiveShadow = true;
        this.mesh.add(backWall);

        // Side walls
        const sideWallGeo = new THREE.BoxGeometry(0.3, this.height, this.depth);

        const leftWall = new THREE.Mesh(sideWallGeo, wallMaterial);
        leftWall.position.set(-this.width / 2, this.height / 2 + 0.3, 0);
        leftWall.castShadow = true;
        leftWall.receiveShadow = true;
        this.mesh.add(leftWall);

        const rightWall = new THREE.Mesh(sideWallGeo, wallMaterial);
        rightWall.position.set(this.width / 2, this.height / 2 + 0.3, 0);
        rightWall.castShadow = true;
        rightWall.receiveShadow = true;
        this.mesh.add(rightWall);

        // Front wall with door opening
        const frontWallWidth = (this.width - 4) / 2;
        const frontWallGeo = new THREE.BoxGeometry(frontWallWidth, this.height, 0.3);

        const frontWallLeft = new THREE.Mesh(frontWallGeo, wallMaterial);
        frontWallLeft.position.set(-this.width / 2 + frontWallWidth / 2, this.height / 2 + 0.3, this.depth / 2);
        frontWallLeft.castShadow = true;
        frontWallLeft.receiveShadow = true;
        this.mesh.add(frontWallLeft);

        const frontWallRight = new THREE.Mesh(frontWallGeo, wallMaterial);
        frontWallRight.position.set(this.width / 2 - frontWallWidth / 2, this.height / 2 + 0.3, this.depth / 2);
        frontWallRight.castShadow = true;
        frontWallRight.receiveShadow = true;
        this.mesh.add(frontWallRight);

        // Door frame
        const doorTopGeo = new THREE.BoxGeometry(4.5, 0.5, 0.35);
        const doorTop = new THREE.Mesh(doorTopGeo, darkWoodMaterial);
        doorTop.position.set(0, this.height + 0.05, this.depth / 2);
        doorTop.castShadow = true;
        this.mesh.add(doorTop);

        // Add windows on back wall
        this.createWindows();
    }

    createWindows() {
        const windowFrameMat = new THREE.MeshStandardMaterial({
            color: 0x654321,
            roughness: 0.6
        });

        const glassMat = new THREE.MeshStandardMaterial({
            color: 0x87CEEB,
            transparent: true,
            opacity: 0.4,
            roughness: 0.1,
            metalness: 0.3
        });

        const windowPositions = [
            { x: -6, y: 3.5 },
            { x: 0, y: 3.5 },
            { x: 6, y: 3.5 }
        ];

        windowPositions.forEach(pos => {
            // Window frame
            const frameGeo = new THREE.BoxGeometry(1.5, 1.5, 0.35);
            const frame = new THREE.Mesh(frameGeo, windowFrameMat);
            frame.position.set(pos.x, pos.y, -this.depth / 2);
            this.mesh.add(frame);

            // Glass
            const glassGeo = new THREE.PlaneGeometry(1.2, 1.2);
            const glass = new THREE.Mesh(glassGeo, glassMat);
            glass.position.set(pos.x, pos.y, -this.depth / 2 + 0.2);
            this.mesh.add(glass);
        });
    }

    createRoof() {
        const roofMaterial = new THREE.MeshStandardMaterial({
            color: 0x8B0000, // Dark red
            roughness: 0.9,
            metalness: 0.1
        });

        // Triangular roof using a custom geometry
        const roofHeight = 2.5;
        const roofOverhang = 1.5;

        // Left roof panel
        const leftRoofGeo = new THREE.PlaneGeometry(
            this.depth + roofOverhang * 2,
            Math.sqrt(Math.pow(this.width / 2 + roofOverhang, 2) + Math.pow(roofHeight, 2))
        );
        const leftRoof = new THREE.Mesh(leftRoofGeo, roofMaterial);
        leftRoof.position.set(-this.width / 4, this.height + roofHeight / 2 + 0.3, 0);
        leftRoof.rotation.set(0, Math.PI / 2, -Math.atan2(roofHeight, this.width / 2));
        leftRoof.castShadow = true;
        leftRoof.receiveShadow = true;
        this.mesh.add(leftRoof);

        // Right roof panel
        const rightRoof = new THREE.Mesh(leftRoofGeo, roofMaterial);
        rightRoof.position.set(this.width / 4, this.height + roofHeight / 2 + 0.3, 0);
        rightRoof.rotation.set(0, Math.PI / 2, Math.atan2(roofHeight, this.width / 2));
        rightRoof.castShadow = true;
        rightRoof.receiveShadow = true;
        this.mesh.add(rightRoof);

        // Roof ridge
        const ridgeGeo = new THREE.BoxGeometry(0.3, 0.3, this.depth + roofOverhang * 2);
        const ridgeMat = new THREE.MeshStandardMaterial({ color: 0x654321 });
        const ridge = new THREE.Mesh(ridgeGeo, ridgeMat);
        ridge.position.set(0, this.height + roofHeight + 0.45, 0);
        ridge.castShadow = true;
        this.mesh.add(ridge);

        // Triangular gable ends
        const gableShape = new THREE.Shape();
        gableShape.moveTo(-this.width / 2, 0);
        gableShape.lineTo(0, roofHeight);
        gableShape.lineTo(this.width / 2, 0);
        gableShape.lineTo(-this.width / 2, 0);

        const gableGeo = new THREE.ShapeGeometry(gableShape);
        const gableMat = new THREE.MeshStandardMaterial({ color: 0xDEB887 });

        const frontGable = new THREE.Mesh(gableGeo, gableMat);
        frontGable.position.set(0, this.height + 0.3, this.depth / 2 + 0.15);
        frontGable.castShadow = true;
        this.mesh.add(frontGable);

        const backGable = new THREE.Mesh(gableGeo, gableMat);
        backGable.position.set(0, this.height + 0.3, -this.depth / 2 - 0.15);
        backGable.rotation.y = Math.PI;
        backGable.castShadow = true;
        this.mesh.add(backGable);
    }

    createStalls() {
        const stallWidth = this.width / this.numStalls;

        const dividerMaterial = new THREE.MeshStandardMaterial({
            color: 0x8B4513, // Saddle brown
            roughness: 0.7
        });

        for (let i = 0; i < this.numStalls; i++) {
            const stallGroup = new THREE.Group();
            stallGroup.name = `stall-${i}`;

            const stallX = -this.width / 2 + stallWidth / 2 + i * stallWidth;

            // Store stall position (center of each stall) - Y at floor level
            this.stallPositions.push(new THREE.Vector3(stallX, 0.35, -2));

            // Dividers between stalls
            if (i < this.numStalls - 1) {
                // Lower wooden divider
                const dividerGeo = new THREE.BoxGeometry(0.15, 2.5, this.depth * 0.6);
                const divider = new THREE.Mesh(dividerGeo, dividerMaterial);
                divider.position.set(
                    -this.width / 2 + (i + 1) * stallWidth,
                    1.55,
                    -1.5
                );
                divider.castShadow = true;
                this.mesh.add(divider);

                // Upper bars
                for (let bar = 0; bar < 4; bar++) {
                    const barGeo = new THREE.CylinderGeometry(0.03, 0.03, this.depth * 0.6, 8);
                    const barMesh = new THREE.Mesh(barGeo, dividerMaterial);
                    barMesh.rotation.x = Math.PI / 2;
                    barMesh.position.set(
                        -this.width / 2 + (i + 1) * stallWidth,
                        3 + bar * 0.4,
                        -1.5
                    );
                    barMesh.castShadow = true;
                    this.mesh.add(barMesh);
                }
            }

            // Stall floor - bedding
            const beddingGeo = new THREE.PlaneGeometry(stallWidth - 0.3, this.depth * 0.55);
            const beddingMat = new THREE.MeshStandardMaterial({
                color: 0xF5DEB3, // Wheat color (straw)
                roughness: 1
            });
            const bedding = new THREE.Mesh(beddingGeo, beddingMat);
            bedding.rotation.x = -Math.PI / 2;
            bedding.position.set(stallX, 0.32, -2.5);
            bedding.receiveShadow = true;
            this.mesh.add(bedding);

            // Feed bucket
            const bucketGeo = new THREE.CylinderGeometry(0.15, 0.2, 0.3, 12);
            const bucketMat = new THREE.MeshStandardMaterial({
                color: 0x333333,
                metalness: 0.3
            });
            const bucket = new THREE.Mesh(bucketGeo, bucketMat);
            bucket.position.set(stallX - stallWidth / 3, 1, -this.depth / 2 + 0.5);
            bucket.castShadow = true;
            this.mesh.add(bucket);

            // Water bucket
            const waterBucket = new THREE.Mesh(bucketGeo, bucketMat);
            waterBucket.position.set(stallX + stallWidth / 3, 1, -this.depth / 2 + 0.5);
            waterBucket.castShadow = true;
            this.mesh.add(waterBucket);

            // Water inside bucket
            const waterGeo = new THREE.CylinderGeometry(0.13, 0.18, 0.25, 12);
            const waterMat = new THREE.MeshStandardMaterial({
                color: 0x4FC3F7,
                transparent: true,
                opacity: 0.8
            });
            const water = new THREE.Mesh(waterGeo, waterMat);
            water.position.set(stallX + stallWidth / 3, 1.05, -this.depth / 2 + 0.5);
            this.mesh.add(water);

            // Hay rack
            this.createHayRack(stallX, 2.5, -this.depth / 2 + 0.3);

            this.stalls.push(stallGroup);
            this.mesh.add(stallGroup);
        }
    }

    createHayRack(x, y, z) {
        const rackGroup = new THREE.Group();

        const barMat = new THREE.MeshStandardMaterial({ color: 0x2a2a2a });

        // Diagonal bars
        for (let i = 0; i < 5; i++) {
            const barGeo = new THREE.CylinderGeometry(0.02, 0.02, 0.8, 6);
            const bar = new THREE.Mesh(barGeo, barMat);
            bar.rotation.z = Math.PI / 4;
            bar.position.x = -0.4 + i * 0.2;
            rackGroup.add(bar);
        }

        // Top and bottom frames
        const frameGeo = new THREE.BoxGeometry(1, 0.05, 0.3);
        const topFrame = new THREE.Mesh(frameGeo, barMat);
        topFrame.position.y = 0.3;
        rackGroup.add(topFrame);

        const bottomFrame = new THREE.Mesh(frameGeo, barMat);
        bottomFrame.position.y = -0.3;
        rackGroup.add(bottomFrame);

        // Hay inside
        const hayGeo = new THREE.SphereGeometry(0.35, 8, 6);
        hayGeo.scale(1.2, 0.8, 0.6);
        const hayMat = new THREE.MeshStandardMaterial({
            color: 0xDAA520,
            roughness: 1
        });
        const hay = new THREE.Mesh(hayGeo, hayMat);
        hay.position.z = 0.1;
        rackGroup.add(hay);

        rackGroup.position.set(x, y, z);
        this.mesh.add(rackGroup);
    }

    createAisle() {
        // Central aisle floor
        const aisleGeo = new THREE.PlaneGeometry(this.width, this.depth * 0.35);
        const aisleMat = new THREE.MeshStandardMaterial({
            color: 0x696969,
            roughness: 0.95
        });
        const aisle = new THREE.Mesh(aisleGeo, aisleMat);
        aisle.rotation.x = -Math.PI / 2;
        aisle.position.set(0, 0.31, 2);
        aisle.receiveShadow = true;
        this.mesh.add(aisle);
    }

    createDecorations() {
        // Hanging lights
        const lightPositions = [-6, 0, 6];

        lightPositions.forEach(x => {
            const lightGroup = new THREE.Group();

            // Light fixture
            const fixtureGeo = new THREE.ConeGeometry(0.3, 0.4, 12, 1, true);
            const fixtureMat = new THREE.MeshStandardMaterial({
                color: 0x333333,
                side: THREE.DoubleSide
            });
            const fixture = new THREE.Mesh(fixtureGeo, fixtureMat);
            fixture.rotation.x = Math.PI;
            lightGroup.add(fixture);

            // Light bulb
            const bulbGeo = new THREE.SphereGeometry(0.1, 8, 8);
            const bulbMat = new THREE.MeshStandardMaterial({
                color: 0xFFFF99,
                emissive: 0xFFFF00,
                emissiveIntensity: 0.5
            });
            const bulb = new THREE.Mesh(bulbGeo, bulbMat);
            bulb.position.y = -0.15;
            lightGroup.add(bulb);

            // Wire
            const wireGeo = new THREE.CylinderGeometry(0.01, 0.01, 1, 6);
            const wireMat = new THREE.MeshStandardMaterial({ color: 0x111111 });
            const wire = new THREE.Mesh(wireGeo, wireMat);
            wire.position.y = 0.7;
            lightGroup.add(wire);

            // Point light for actual lighting
            const pointLight = new THREE.PointLight(0xFFEECC, 0.5, 10);
            pointLight.position.y = -0.2;
            lightGroup.add(pointLight);

            lightGroup.position.set(x, this.height - 0.5, 0);
            this.mesh.add(lightGroup);
        });

        // Tools on the wall
        this.createTools();

        // Saddle rack
        this.createSaddleRack();
    }

    createTools() {
        const toolGroup = new THREE.Group();

        // Pitchfork
        const pitchforkGroup = new THREE.Group();
        const handleGeo = new THREE.CylinderGeometry(0.03, 0.03, 1.5, 8);
        const handleMat = new THREE.MeshStandardMaterial({ color: 0x8B4513 });
        const handle = new THREE.Mesh(handleGeo, handleMat);
        pitchforkGroup.add(handle);

        const tinesMat = new THREE.MeshStandardMaterial({ color: 0x444444 });
        for (let i = 0; i < 4; i++) {
            const tineGeo = new THREE.CylinderGeometry(0.01, 0.01, 0.4, 6);
            const tine = new THREE.Mesh(tineGeo, tinesMat);
            tine.position.set(-0.06 + i * 0.04, 0.9, 0);
            pitchforkGroup.add(tine);
        }

        pitchforkGroup.rotation.z = 0.2;
        pitchforkGroup.position.set(-9, 2, -this.depth / 2 + 0.5);
        toolGroup.add(pitchforkGroup);

        // Broom
        const broomGroup = new THREE.Group();
        const broomHandle = new THREE.Mesh(handleGeo, handleMat);
        broomGroup.add(broomHandle);

        const bristleGeo = new THREE.BoxGeometry(0.3, 0.15, 0.1);
        const bristleMat = new THREE.MeshStandardMaterial({ color: 0xD2691E });
        const bristles = new THREE.Mesh(bristleGeo, bristleMat);
        bristles.position.y = -0.82;
        broomGroup.add(bristles);

        broomGroup.rotation.z = -0.15;
        broomGroup.position.set(-8, 2, -this.depth / 2 + 0.5);
        toolGroup.add(broomGroup);

        this.mesh.add(toolGroup);
    }

    createSaddleRack() {
        const rackGroup = new THREE.Group();

        const woodMat = new THREE.MeshStandardMaterial({
            color: 0x8B4513,
            roughness: 0.7
        });

        // Rack posts
        const postGeo = new THREE.CylinderGeometry(0.05, 0.05, 1.2, 8);
        const leftPost = new THREE.Mesh(postGeo, woodMat);
        leftPost.position.set(-0.3, 0, 0);
        rackGroup.add(leftPost);

        const rightPost = new THREE.Mesh(postGeo, woodMat);
        rightPost.position.set(0.3, 0, 0);
        rackGroup.add(rightPost);

        // Horizontal bar
        const barGeo = new THREE.CylinderGeometry(0.04, 0.04, 0.7, 8);
        const bar = new THREE.Mesh(barGeo, woodMat);
        bar.rotation.z = Math.PI / 2;
        bar.position.y = 0.3;
        rackGroup.add(bar);

        // Saddle
        const saddleGeo = new THREE.TorusGeometry(0.25, 0.1, 8, 16, Math.PI);
        const saddleMat = new THREE.MeshStandardMaterial({
            color: 0x3D2314,
            roughness: 0.5
        });
        const saddle = new THREE.Mesh(saddleGeo, saddleMat);
        saddle.rotation.x = Math.PI / 2;
        saddle.position.set(0, 0.35, 0.1);
        rackGroup.add(saddle);

        rackGroup.position.set(9, 1.5, -this.depth / 2 + 0.5);
        this.mesh.add(rackGroup);
    }

    getStallPosition(index) {
        if (index >= 0 && index < this.stallPositions.length) {
            return this.stallPositions[index].clone();
        }
        return new THREE.Vector3(0, 0, 0);
    }

    getStallDirtLevel(index) {
        // Returns dirt level for a stall (for cleaning activity)
        return this.stalls[index]?.dirtLevel || 0;
    }

    cleanStall(index) {
        if (this.stalls[index]) {
            this.stalls[index].dirtLevel = 0;
        }
    }

    // Create 3D manure piles in a stall for cleaning activity
    createManurePiles(stallIndex, count = 8) {
        const stallPos = this.getStallPosition(stallIndex);
        const stallWidth = this.width / this.numStalls;
        const manurePiles = [];

        const manureMat = new THREE.MeshStandardMaterial({
            color: 0x5D4037,
            roughness: 1,
            metalness: 0
        });

        for (let i = 0; i < count; i++) {
            const pileGroup = new THREE.Group();
            pileGroup.name = `manure-pile-${i}`;
            pileGroup.userData.isManure = true;
            pileGroup.userData.collected = false;

            // Create messy organic looking pile
            const numLumps = 2 + Math.floor(Math.random() * 3);
            for (let j = 0; j < numLumps; j++) {
                const size = 0.08 + Math.random() * 0.08;
                const lumpGeo = new THREE.SphereGeometry(size, 8, 6);
                const lump = new THREE.Mesh(lumpGeo, manureMat);
                lump.position.set(
                    (Math.random() - 0.5) * 0.15,
                    size * 0.5 + Math.random() * 0.02,
                    (Math.random() - 0.5) * 0.15
                );
                lump.scale.y = 0.5 + Math.random() * 0.3;
                lump.castShadow = true;
                pileGroup.add(lump);
            }

            // Position randomly within stall
            const x = stallPos.x + (Math.random() - 0.5) * (stallWidth * 0.7);
            const z = stallPos.z + (Math.random() - 0.5) * 4;
            pileGroup.position.set(x, 0.33, z);

            this.mesh.add(pileGroup);
            manurePiles.push(pileGroup);
        }

        return manurePiles;
    }

    // Remove manure pile from scene
    removeManurePile(pile) {
        if (pile && pile.parent) {
            pile.parent.remove(pile);
        }
    }

    // Create 3D wheelbarrow object
    createWheelbarrow(stallIndex) {
        const stallPos = this.getStallPosition(stallIndex);
        const wheelbarrowGroup = new THREE.Group();
        wheelbarrowGroup.name = 'wheelbarrow';

        const metalMat = new THREE.MeshStandardMaterial({
            color: 0x444444,
            roughness: 0.4,
            metalness: 0.6
        });

        const woodMat = new THREE.MeshStandardMaterial({
            color: 0x8B4513,
            roughness: 0.8
        });

        // Tray/bucket
        const trayGeo = new THREE.BoxGeometry(0.6, 0.3, 0.8);
        const tray = new THREE.Mesh(trayGeo, metalMat);
        tray.position.y = 0.35;
        wheelbarrowGroup.add(tray);

        // Front slope
        const frontGeo = new THREE.BoxGeometry(0.6, 0.3, 0.1);
        const front = new THREE.Mesh(frontGeo, metalMat);
        front.position.set(0, 0.35, 0.45);
        front.rotation.x = -0.4;
        wheelbarrowGroup.add(front);

        // Wheel
        const wheelGeo = new THREE.CylinderGeometry(0.15, 0.15, 0.08, 16);
        const wheel = new THREE.Mesh(wheelGeo, new THREE.MeshStandardMaterial({ color: 0x111111 }));
        wheel.rotation.z = Math.PI / 2;
        wheel.position.set(0, 0.15, 0.55);
        wheelbarrowGroup.add(wheel);

        // Handles
        const handleGeo = new THREE.CylinderGeometry(0.02, 0.02, 1, 8);
        const leftHandle = new THREE.Mesh(handleGeo, woodMat);
        leftHandle.position.set(0.25, 0.3, -0.3);
        leftHandle.rotation.x = 0.3;
        wheelbarrowGroup.add(leftHandle);

        const rightHandle = new THREE.Mesh(handleGeo, woodMat);
        rightHandle.position.set(-0.25, 0.3, -0.3);
        rightHandle.rotation.x = 0.3;
        wheelbarrowGroup.add(rightHandle);

        // Position near stall
        wheelbarrowGroup.position.set(stallPos.x - 2.5, 0, stallPos.z + 2);

        this.mesh.add(wheelbarrowGroup);
        return wheelbarrowGroup;
    }

    // Create 3D pitchfork for player to hold
    createPitchforkItem() {
        const pitchforkGroup = new THREE.Group();
        pitchforkGroup.name = 'pitchfork-item';

        const handleMat = new THREE.MeshStandardMaterial({ color: 0x8B4513 });
        const metalMat = new THREE.MeshStandardMaterial({ color: 0x444444 });

        // Handle
        const handleGeo = new THREE.CylinderGeometry(0.025, 0.025, 1.2, 8);
        const handle = new THREE.Mesh(handleGeo, handleMat);
        handle.position.y = 0.6;
        pitchforkGroup.add(handle);

        // Head crossbar
        const crossGeo = new THREE.BoxGeometry(0.2, 0.03, 0.03);
        const cross = new THREE.Mesh(crossGeo, metalMat);
        cross.position.y = 1.22;
        pitchforkGroup.add(cross);

        // Tines
        for (let i = 0; i < 4; i++) {
            const tineGeo = new THREE.CylinderGeometry(0.01, 0.008, 0.35, 6);
            const tine = new THREE.Mesh(tineGeo, metalMat);
            tine.position.set(-0.075 + i * 0.05, 1.4, 0);
            pitchforkGroup.add(tine);
        }

        return pitchforkGroup;
    }

    // Get camera position for viewing a specific stall
    getStallCameraPosition(stallIndex) {
        const stallPos = this.getStallPosition(stallIndex);
        return {
            position: new THREE.Vector3(stallPos.x, 3, stallPos.z + 5),
            target: new THREE.Vector3(stallPos.x, 0.5, stallPos.z - 1)
        };
    }

    // Create tack room (varustehuone)
    createTackRoom() {
        const tackRoomGroup = new THREE.Group();
        tackRoomGroup.name = 'tack-room';

        // Position tack room next to stable on the left
        const roomX = -this.width / 2 - 4;
        const roomZ = -2;

        const woodMat = new THREE.MeshStandardMaterial({ color: 0x8B4513, roughness: 0.7 });
        const wallMat = new THREE.MeshStandardMaterial({ color: 0xDEB887, roughness: 0.8 });

        // Floor
        const floorGeo = new THREE.PlaneGeometry(6, 6);
        const floorMat = new THREE.MeshStandardMaterial({ color: 0x654321, roughness: 0.9 });
        const floor = new THREE.Mesh(floorGeo, floorMat);
        floor.rotation.x = -Math.PI / 2;
        floor.position.set(roomX, 0.31, roomZ);
        floor.receiveShadow = true;
        tackRoomGroup.add(floor);

        // Walls
        const wallHeight = 3;

        // Back wall
        const backWallGeo = new THREE.BoxGeometry(6, wallHeight, 0.2);
        const backWall = new THREE.Mesh(backWallGeo, wallMat);
        backWall.position.set(roomX, wallHeight / 2 + 0.3, roomZ - 3);
        backWall.castShadow = true;
        tackRoomGroup.add(backWall);

        // Left wall
        const sideWallGeo = new THREE.BoxGeometry(0.2, wallHeight, 6);
        const leftWall = new THREE.Mesh(sideWallGeo, wallMat);
        leftWall.position.set(roomX - 3, wallHeight / 2 + 0.3, roomZ);
        leftWall.castShadow = true;
        tackRoomGroup.add(leftWall);

        // Sign above door
        const signGeo = new THREE.BoxGeometry(2, 0.4, 0.1);
        const signMat = new THREE.MeshStandardMaterial({ color: 0x2f4f2f });
        const sign = new THREE.Mesh(signGeo, signMat);
        sign.position.set(roomX, wallHeight + 0.5, roomZ + 3);
        tackRoomGroup.add(sign);

        // ===============
        // BLANKETS (LOIMET)
        // ===============
        const blanketColors = [0x4169E1, 0x228B22, 0x8B0000, 0x9932CC];
        const blanketRack = new THREE.Group();
        blanketRack.name = 'blanket-rack';

        // Rack structure
        const rackPostGeo = new THREE.CylinderGeometry(0.05, 0.05, 2, 8);
        const rackPost1 = new THREE.Mesh(rackPostGeo, woodMat);
        rackPost1.position.set(-1, 1, 0);
        blanketRack.add(rackPost1);

        const rackPost2 = new THREE.Mesh(rackPostGeo, woodMat);
        rackPost2.position.set(1, 1, 0);
        blanketRack.add(rackPost2);

        // Horizontal bars with blankets
        for (let i = 0; i < blanketColors.length; i++) {
            const barGeo = new THREE.CylinderGeometry(0.03, 0.03, 2.2, 8);
            const bar = new THREE.Mesh(barGeo, woodMat);
            bar.rotation.z = Math.PI / 2;
            bar.position.y = 0.5 + i * 0.45;
            blanketRack.add(bar);

            // Draped blanket
            const blanketGeo = new THREE.BoxGeometry(1.5, 0.08, 0.4);
            const blanketMat = new THREE.MeshStandardMaterial({ color: blanketColors[i] });
            const blanket = new THREE.Mesh(blanketGeo, blanketMat);
            blanket.position.set(0, 0.5 + i * 0.45 - 0.1, 0.15);
            blanket.rotation.x = 0.3;
            blanket.name = `blanket-${i}`;
            blanket.userData.isBlanket = true;
            blanket.userData.color = blanketColors[i];
            blanketRack.add(blanket);
        }

        blanketRack.position.set(roomX - 2, 0, roomZ - 2);
        tackRoomGroup.add(blanketRack);

        // ===============
        // HALTERS (RIIMUT)
        // ===============
        const halterRack = new THREE.Group();
        halterRack.name = 'halter-rack';

        // Wall hooks
        const hookMat = new THREE.MeshStandardMaterial({ color: 0x333333, metalness: 0.7 });
        const halterColors = [0x8B0000, 0x1E90FF, 0x228B22, 0x800080];

        for (let i = 0; i < 4; i++) {
            // Hook
            const hookGeo = new THREE.TorusGeometry(0.05, 0.015, 8, 12, Math.PI);
            const hook = new THREE.Mesh(hookGeo, hookMat);
            hook.position.set(-1 + i * 0.7, 1.8, -2.8);
            hook.rotation.x = Math.PI;
            halterRack.add(hook);

            // Halter hanging
            const halterGroup = new THREE.Group();
            halterGroup.name = `halter-${i}`;
            halterGroup.userData.isHalter = true;
            halterGroup.userData.color = halterColors[i];

            const halterMat = new THREE.MeshStandardMaterial({ color: halterColors[i] });

            // Main ring
            const ringGeo = new THREE.TorusGeometry(0.12, 0.02, 8, 16);
            const ring = new THREE.Mesh(ringGeo, halterMat);
            ring.position.y = -0.15;
            halterGroup.add(ring);

            // Straps
            const strapGeo = new THREE.CylinderGeometry(0.015, 0.015, 0.4, 8);
            const strap1 = new THREE.Mesh(strapGeo, halterMat);
            strap1.position.set(0.1, -0.35, 0);
            halterGroup.add(strap1);

            const strap2 = new THREE.Mesh(strapGeo, halterMat);
            strap2.position.set(-0.1, -0.35, 0);
            halterGroup.add(strap2);

            halterGroup.position.set(-1 + i * 0.7, 1.65, -2.8);
            halterRack.add(halterGroup);
        }

        halterRack.position.set(roomX, 0, roomZ);
        tackRoomGroup.add(halterRack);

        // ===============
        // LEAD ROPES
        // ===============
        const ropeHookGroup = new THREE.Group();

        for (let i = 0; i < 3; i++) {
            const ropeGeo = new THREE.TorusGeometry(0.15, 0.01, 6, 24);
            const ropeMat = new THREE.MeshStandardMaterial({ color: 0xF5DEB3 });
            const rope = new THREE.Mesh(ropeGeo, ropeMat);
            rope.position.set(-2.5, 1.2 + i * 0.4, -2.8);
            rope.rotation.y = Math.PI / 2;
            rope.name = `lead-rope-${i}`;
            rope.userData.isLeadRope = true;
            ropeHookGroup.add(rope);
        }

        ropeHookGroup.position.set(roomX, 0, roomZ);
        tackRoomGroup.add(ropeHookGroup);

        // Store tack room position
        this.tackRoomPosition = new THREE.Vector3(roomX, 0.35, roomZ);

        this.mesh.add(tackRoomGroup);
    }

    // Get tack room position
    getTackRoomPosition() {
        return this.tackRoomPosition ? this.tackRoomPosition.clone() : new THREE.Vector3(-14, 0.35, -2);
    }
}


