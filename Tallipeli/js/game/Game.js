/**
 * Game - Main Game Controller
 * Manages the entire game state, 3D world, and UI
 */

import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { PointerLockControls } from 'three/addons/controls/PointerLockControls.js';
import { Horse } from './Horse.js';
import { Stable } from './Stable.js';
import { Player } from './Player.js';
import { UI } from '../utils/UI.js';
import { MobileControls } from '../utils/MobileControls.js';

export class Game {
    constructor() {
        // Game state
        this.state = 'loading'; // loading, menu, playing, paused, activity
        this.time = 8 * 60; // 8:00 AM in minutes
        this.money = 5000;
        this.weather = 'sunny';
        this.temperature = 15;

        // 3D Components
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.controls = null;

        // Game objects
        this.horses = [];
        this.stable = null;
        this.player = null;
        this.selectedHorse = null;

        // UI Manager
        this.ui = new UI(this);

        // Animation
        this.clock = new THREE.Clock();
        this.animationId = null;

        // Raycasting for interactions
        this.raycaster = new THREE.Raycaster();
        this.mouse = new THREE.Vector2();

        // Key states
        this.keys = {
            forward: false,
            backward: false,
            left: false,
            right: false,
            jump: false
        };

        // Current activity
        this.currentActivity = null;

        // Audio system
        this.audioContext = null;
        this.sounds = {};
        this.isMusicPlaying = false;
        this.masterVolume = 0.5;

        // Weather system
        this.rainParticles = null;
        this.isRaining = false;
        this.weatherCheckInterval = null;
    }


    async init() {
        // Show loading progress
        await this.load();

        // Setup 3D world
        this.setupRenderer();
        this.setupScene();
        this.setupCamera();
        this.setupLights();
        this.setupControls();

        // Create game world
        this.createWorld();

        // Create horses
        this.createHorses();

        // Setup player
        this.player = new Player(this);

        // Setup event listeners
        this.setupEventListeners();

        // Setup mobile controls
        this.mobileControls = new MobileControls(this);

        // Start animation loop
        this.animate();

        // Show main menu
        this.showMainMenu();
    }

    async load() {
        const progressFill = document.getElementById('progress-fill');
        const loadingText = document.querySelector('.loading-text');

        const steps = [
            { progress: 20, text: 'Valmistellaan tallia...' },
            { progress: 40, text: 'Tuodaan hevosia...' },
            { progress: 60, text: 'Ladataan maastoa...' },
            { progress: 80, text: 'Viimeistellään...' },
            { progress: 100, text: 'Valmis!' }
        ];

        for (const step of steps) {
            await new Promise(resolve => setTimeout(resolve, 400));
            progressFill.style.width = step.progress + '%';
            loadingText.textContent = step.text;
        }

        await new Promise(resolve => setTimeout(resolve, 500));
    }

    setupRenderer() {
        const container = document.getElementById('game-container');

        this.renderer = new THREE.WebGLRenderer({
            antialias: true,
            alpha: false
        });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
        this.renderer.toneMappingExposure = 1.0;

        container.appendChild(this.renderer.domElement);
    }

    setupScene() {
        this.scene = new THREE.Scene();

        // Sky color based on time of day
        this.scene.background = new THREE.Color(0x87CEEB);
        this.scene.fog = new THREE.Fog(0x87CEEB, 50, 200);
    }

    setupCamera() {
        this.camera = new THREE.PerspectiveCamera(
            70,
            window.innerWidth / window.innerHeight,
            0.1,
            1000
        );
        this.camera.position.set(0, 5, 15);
    }

    setupLights() {
        // Ambient light
        const ambient = new THREE.AmbientLight(0xffffff, 0.4);
        this.scene.add(ambient);

        // Sun light
        this.sunLight = new THREE.DirectionalLight(0xffffff, 1.2);
        this.sunLight.position.set(50, 100, 50);
        this.sunLight.castShadow = true;
        this.sunLight.shadow.mapSize.width = 2048;
        this.sunLight.shadow.mapSize.height = 2048;
        this.sunLight.shadow.camera.near = 0.5;
        this.sunLight.shadow.camera.far = 300;
        this.sunLight.shadow.camera.left = -100;
        this.sunLight.shadow.camera.right = 100;
        this.sunLight.shadow.camera.top = 100;
        this.sunLight.shadow.camera.bottom = -100;
        this.scene.add(this.sunLight);

        // Hemisphere light for sky/ground color
        const hemi = new THREE.HemisphereLight(0x87CEEB, 0x556B2F, 0.5);
        this.scene.add(hemi);
    }

    setupControls() {
        // First-person controls (locked)
        this.fpControls = new PointerLockControls(this.camera, document.body);
        this.scene.add(this.fpControls.getObject());

        // Orbit controls for menu/overview
        this.orbitControls = new OrbitControls(this.camera, this.renderer.domElement);
        this.orbitControls.enableDamping = true;
        this.orbitControls.dampingFactor = 0.05;
        this.orbitControls.maxPolarAngle = Math.PI / 2;
        this.orbitControls.minDistance = 5;
        this.orbitControls.maxDistance = 50;
        this.orbitControls.target.set(0, 2, 0);

        this.controls = this.orbitControls;
    }

    createWorld() {
        // Ground plane - meadow
        const groundGeometry = new THREE.PlaneGeometry(500, 500, 100, 100);

        // Add some terrain variation
        const vertices = groundGeometry.attributes.position.array;
        for (let i = 0; i < vertices.length; i += 3) {
            const x = vertices[i];
            const y = vertices[i + 1];
            // Small hills using simplex-like noise
            vertices[i + 2] = Math.sin(x * 0.02) * Math.cos(y * 0.02) * 2;
        }
        groundGeometry.computeVertexNormals();

        const groundMaterial = new THREE.MeshStandardMaterial({
            color: 0x4a7c23,
            roughness: 0.9,
            metalness: 0
        });

        const ground = new THREE.Mesh(groundGeometry, groundMaterial);
        ground.rotation.x = -Math.PI / 2;
        ground.receiveShadow = true;
        ground.name = 'ground';
        this.scene.add(ground);

        // Create stable
        this.stable = new Stable(this);
        this.stable.create();

        // Create paddock (fenced area)
        this.createPaddock();

        // Create water area for swimming
        this.createWaterArea();

        // Create arenas
        this.createArenas();

        // Add trees and decorations
        this.createTrees();

        // Create trail path
        this.createTrail();
    }

    createPaddock() {
        const fenceGroup = new THREE.Group();
        fenceGroup.name = 'paddock';

        const fenceMaterial = new THREE.MeshStandardMaterial({
            color: 0x8B4513,
            roughness: 0.8
        });

        // Fence posts and rails
        const paddockSize = 30;
        const postSpacing = 3;

        for (let side = 0; side < 4; side++) {
            for (let i = 0; i <= paddockSize / postSpacing; i++) {
                // Post
                const postGeo = new THREE.CylinderGeometry(0.08, 0.1, 1.5, 8);
                const post = new THREE.Mesh(postGeo, fenceMaterial);

                let x, z;
                switch (side) {
                    case 0: x = -paddockSize / 2 + i * postSpacing; z = -paddockSize / 2; break;
                    case 1: x = paddockSize / 2; z = -paddockSize / 2 + i * postSpacing; break;
                    case 2: x = paddockSize / 2 - i * postSpacing; z = paddockSize / 2; break;
                    case 3: x = -paddockSize / 2; z = paddockSize / 2 - i * postSpacing; break;
                }

                post.position.set(x + 40, 0.75, z);
                post.castShadow = true;
                fenceGroup.add(post);
            }

            // Rails
            const railGeo = new THREE.BoxGeometry(paddockSize, 0.08, 0.08);
            const railTop = new THREE.Mesh(railGeo, fenceMaterial);
            const railBottom = new THREE.Mesh(railGeo, fenceMaterial);

            if (side === 0 || side === 2) {
                railTop.position.set(40, 1.3, side === 0 ? -paddockSize / 2 : paddockSize / 2);
                railBottom.position.set(40, 0.8, side === 0 ? -paddockSize / 2 : paddockSize / 2);
            } else {
                railTop.rotation.y = Math.PI / 2;
                railBottom.rotation.y = Math.PI / 2;
                railTop.position.set(side === 1 ? 40 + paddockSize / 2 : 40 - paddockSize / 2, 1.3, 0);
                railBottom.position.set(side === 1 ? 40 + paddockSize / 2 : 40 - paddockSize / 2, 0.8, 0);
            }

            railTop.castShadow = true;
            railBottom.castShadow = true;
            fenceGroup.add(railTop);
            fenceGroup.add(railBottom);
        }

        this.scene.add(fenceGroup);
    }

    createWaterArea() {
        // Lake/pond for swimming
        const waterGeometry = new THREE.CircleGeometry(15, 32);
        const waterMaterial = new THREE.MeshStandardMaterial({
            color: 0x1E90FF,
            transparent: true,
            opacity: 0.7,
            roughness: 0.1,
            metalness: 0.3
        });

        const water = new THREE.Mesh(waterGeometry, waterMaterial);
        water.rotation.x = -Math.PI / 2;
        water.position.set(-50, 0.1, 30);
        water.name = 'water';
        this.scene.add(water);

        // Beach/sand around water
        const sandGeometry = new THREE.RingGeometry(15, 20, 32);
        const sandMaterial = new THREE.MeshStandardMaterial({
            color: 0xC2B280,
            roughness: 1
        });

        const sand = new THREE.Mesh(sandGeometry, sandMaterial);
        sand.rotation.x = -Math.PI / 2;
        sand.position.set(-50, 0.05, 30);
        this.scene.add(sand);
    }

    createArenas() {
        // Jumping arena
        this.createJumpingArena(80, 0, 0);

        // Dressage arena
        this.createDressageArena(80, 0, -40);

        // Western arena
        this.createWesternArena(80, 0, 40);
    }

    createJumpingArena(x, y, z) {
        const arenaGroup = new THREE.Group();
        arenaGroup.name = 'jumping-arena';

        // Arena floor
        const floorGeo = new THREE.PlaneGeometry(40, 60);
        const floorMat = new THREE.MeshStandardMaterial({
            color: 0xD2691E,
            roughness: 0.9
        });
        const floor = new THREE.Mesh(floorGeo, floorMat);
        floor.rotation.x = -Math.PI / 2;
        floor.position.y = 0.05;
        floor.receiveShadow = true;
        arenaGroup.add(floor);

        // Create jumps
        const jumpPositions = [
            { x: 0, z: -20, height: 0.8 },
            { x: -10, z: -10, height: 1.0 },
            { x: 10, z: 0, height: 1.0 },
            { x: -5, z: 10, height: 1.2 },
            { x: 5, z: 20, height: 1.4 }
        ];

        jumpPositions.forEach(pos => {
            const jump = this.createJump(pos.height);
            jump.position.set(pos.x, 0.1, pos.z); // Raised above floor level
            arenaGroup.add(jump);
        });

        // Add riding instructor
        const instructor = this.createRidingInstructor();
        instructor.position.set(-25, 0, 0);
        instructor.rotation.y = Math.PI / 2; // Facing arena
        arenaGroup.add(instructor);

        // Store instructor reference
        this.jumpingInstructor = instructor;

        arenaGroup.position.set(x, y, z);
        this.scene.add(arenaGroup);
    }


    createJump(height) {
        const jumpGroup = new THREE.Group();

        // Colorful pole materials - alternating red/white stripes
        const whiteMat = new THREE.MeshStandardMaterial({ color: 0xffffff });
        const redMat = new THREE.MeshStandardMaterial({ color: 0xff2222 });
        const blueMat = new THREE.MeshStandardMaterial({ color: 0x2244ff });
        const greenMat = new THREE.MeshStandardMaterial({ color: 0x22cc22 });

        // Thicker poles with stripes
        const poleHeight = height + 0.8;
        const poleRadius = 0.08;

        // Left pole - create striped effect with multiple segments
        const leftPoleGroup = new THREE.Group();
        const numStripes = 6;
        const stripeHeight = poleHeight / numStripes;

        for (let i = 0; i < numStripes; i++) {
            const stripeGeo = new THREE.CylinderGeometry(poleRadius, poleRadius, stripeHeight, 12);
            const stripeMat = i % 2 === 0 ? whiteMat : redMat;
            const stripe = new THREE.Mesh(stripeGeo, stripeMat);
            stripe.position.y = stripeHeight * i + stripeHeight / 2;
            stripe.castShadow = true;
            leftPoleGroup.add(stripe);
        }
        leftPoleGroup.position.set(-2, 0, 0);
        jumpGroup.add(leftPoleGroup);

        // Right pole - same striped pattern
        const rightPoleGroup = leftPoleGroup.clone();
        rightPoleGroup.position.set(2, 0, 0);
        jumpGroup.add(rightPoleGroup);

        // Cup holders for the bars
        const cupGeo = new THREE.BoxGeometry(0.15, 0.1, 0.2);
        const cupMat = new THREE.MeshStandardMaterial({ color: 0x333333 });

        const leftCup = new THREE.Mesh(cupGeo, cupMat);
        leftCup.position.set(-1.85, height, 0);
        jumpGroup.add(leftCup);

        const rightCup = new THREE.Mesh(cupGeo, cupMat);
        rightCup.position.set(1.85, height, 0);
        jumpGroup.add(rightCup);

        // Main bar - colorful and thick
        const barGeo = new THREE.CylinderGeometry(0.06, 0.06, 3.7, 12);
        const bar = new THREE.Mesh(barGeo, blueMat);
        bar.rotation.z = Math.PI / 2;
        bar.position.set(0, height, 0);
        bar.castShadow = true;
        jumpGroup.add(bar);

        // Second bar slightly lower (makes it look more like a real jump)
        if (height > 0.9) {
            const lowerBar = new THREE.Mesh(barGeo, greenMat);
            lowerBar.rotation.z = Math.PI / 2;
            lowerBar.position.set(0, height - 0.25, 0);
            lowerBar.castShadow = true;
            jumpGroup.add(lowerBar);

            // Add cups for lower bar
            const leftCup2 = new THREE.Mesh(cupGeo, cupMat);
            leftCup2.position.set(-1.85, height - 0.25, 0);
            jumpGroup.add(leftCup2);

            const rightCup2 = new THREE.Mesh(cupGeo, cupMat);
            rightCup2.position.set(1.85, height - 0.25, 0);
            jumpGroup.add(rightCup2);
        }

        // Base stands for stability
        const baseGeo = new THREE.BoxGeometry(0.5, 0.15, 0.5);
        const baseMat = new THREE.MeshStandardMaterial({ color: 0x666666 });

        const leftBase = new THREE.Mesh(baseGeo, baseMat);
        leftBase.position.set(-2, 0.075, 0);
        leftBase.receiveShadow = true;
        jumpGroup.add(leftBase);

        const rightBase = new THREE.Mesh(baseGeo, baseMat);
        rightBase.position.set(2, 0.075, 0);
        rightBase.receiveShadow = true;
        jumpGroup.add(rightBase);

        return jumpGroup;
    }


    createDressageArena(x, y, z) {
        const arenaGroup = new THREE.Group();
        arenaGroup.name = 'dressage-arena';

        // Arena floor
        const floorGeo = new THREE.PlaneGeometry(20, 60);
        const floorMat = new THREE.MeshStandardMaterial({
            color: 0xD2B48C,
            roughness: 0.8
        });
        const floor = new THREE.Mesh(floorGeo, floorMat);
        floor.rotation.x = -Math.PI / 2;
        floor.position.y = 0.05;
        floor.receiveShadow = true;
        arenaGroup.add(floor);

        // White fence around arena
        const fenceMat = new THREE.MeshStandardMaterial({ color: 0xffffff });
        const fencePositions = [
            { x1: -10, z1: -30, x2: 10, z2: -30 }, // A-side
            { x1: 10, z1: -30, x2: 10, z2: 30 },   // Right side
            { x1: -10, z1: 30, x2: 10, z2: 30 },   // C-side
            { x1: -10, z1: -30, x2: -10, z2: 30 }  // Left side
        ];

        fencePositions.forEach(fp => {
            const length = Math.sqrt(Math.pow(fp.x2 - fp.x1, 2) + Math.pow(fp.z2 - fp.z1, 2));
            const railGeo = new THREE.CylinderGeometry(0.05, 0.05, length, 8);
            const rail = new THREE.Mesh(railGeo, fenceMat);
            rail.rotation.z = Math.PI / 2;
            if (fp.x1 === fp.x2) {
                rail.rotation.y = Math.PI / 2;
            }
            rail.position.set((fp.x1 + fp.x2) / 2, 0.5, (fp.z1 + fp.z2) / 2);
            arenaGroup.add(rail);
        });

        // Letter markers - create visible signs/boards
        const letters = ['A', 'K', 'E', 'H', 'C', 'M', 'B', 'F'];
        const letterPositions = [
            { x: 0, z: -32, rot: 0 },      // A - entrance
            { x: -12, z: -20, rot: Math.PI / 2 },  // K
            { x: -12, z: 0, rot: Math.PI / 2 },    // E
            { x: -12, z: 20, rot: Math.PI / 2 },   // H
            { x: 0, z: 32, rot: Math.PI },  // C - opposite end
            { x: 12, z: 20, rot: -Math.PI / 2 },   // M
            { x: 12, z: 0, rot: -Math.PI / 2 },    // B
            { x: 12, z: -20, rot: -Math.PI / 2 }   // F
        ];

        letters.forEach((letter, i) => {
            const pos = letterPositions[i];
            const signGroup = new THREE.Group();

            // Sign post
            const postGeo = new THREE.CylinderGeometry(0.05, 0.05, 1, 8);
            const postMat = new THREE.MeshStandardMaterial({ color: 0x4a3020 });
            const post = new THREE.Mesh(postGeo, postMat);
            post.position.y = 0.5;
            signGroup.add(post);

            // Sign board
            const boardGeo = new THREE.BoxGeometry(0.6, 0.5, 0.1);
            const boardMat = new THREE.MeshStandardMaterial({ color: 0xffffff });
            const board = new THREE.Mesh(boardGeo, boardMat);
            board.position.y = 1.1;
            signGroup.add(board);

            // Letter on board (using colored box as simple representation)
            const letterBoardGeo = new THREE.BoxGeometry(0.4, 0.35, 0.12);
            const letterMat = new THREE.MeshStandardMaterial({ color: 0x000000 });
            const letterBoard = new THREE.Mesh(letterBoardGeo, letterMat);
            letterBoard.position.y = 1.1;
            letterBoard.position.z = 0.02;
            signGroup.add(letterBoard);

            signGroup.position.set(pos.x, 0, pos.z);
            signGroup.rotation.y = pos.rot;
            arenaGroup.add(signGroup);
        });

        // Center line markers (X in the middle)
        const centerMarkerGeo = new THREE.CircleGeometry(0.3, 16);
        const centerMarkerMat = new THREE.MeshStandardMaterial({ color: 0xffffff });
        const centerX = new THREE.Mesh(centerMarkerGeo, centerMarkerMat);
        centerX.rotation.x = -Math.PI / 2;
        centerX.position.set(0, 0.06, 0);
        arenaGroup.add(centerX);

        // Add riding instructor
        const instructor = this.createRidingInstructor();
        instructor.position.set(-15, 0, 0);
        instructor.rotation.y = Math.PI / 2; // Facing arena
        arenaGroup.add(instructor);

        // Store instructor reference
        this.dressageInstructor = instructor;

        arenaGroup.position.set(x, y, z);
        this.scene.add(arenaGroup);
    }


    createWesternArena(x, y, z) {
        const arenaGroup = new THREE.Group();
        arenaGroup.name = 'western-arena';

        // Arena floor
        const floorGeo = new THREE.PlaneGeometry(50, 60);
        const floorMat = new THREE.MeshStandardMaterial({
            color: 0xC4A35A, // Sandy color
            roughness: 0.9
        });
        const floor = new THREE.Mesh(floorGeo, floorMat);
        floor.rotation.x = -Math.PI / 2;
        floor.position.y = 0.05;
        floor.receiveShadow = true;
        arenaGroup.add(floor);

        // Fence around arena
        const fenceMat = new THREE.MeshStandardMaterial({ color: 0x8B4513 });
        const fencePositions = [
            { x1: -25, z1: -30, x2: 25, z2: -30 },
            { x1: 25, z1: -30, x2: 25, z2: 30 },
            { x1: -25, z1: 30, x2: 25, z2: 30 },
            { x1: -25, z1: -30, x2: -25, z2: 30 }
        ];

        fencePositions.forEach(fp => {
            const length = Math.sqrt(Math.pow(fp.x2 - fp.x1, 2) + Math.pow(fp.z2 - fp.z1, 2));
            const railGeo = new THREE.CylinderGeometry(0.06, 0.06, length, 8);
            const rail = new THREE.Mesh(railGeo, fenceMat);
            rail.rotation.z = Math.PI / 2;
            if (fp.x1 === fp.x2) {
                rail.rotation.y = Math.PI / 2;
            }
            rail.position.set((fp.x1 + fp.x2) / 2, 0.6, (fp.z1 + fp.z2) / 2);
            arenaGroup.add(rail);

            // Lower rail
            const rail2 = rail.clone();
            rail2.position.y = 0.3;
            arenaGroup.add(rail2);
        });

        // Barrels for barrel racing - Classic cloverleaf pattern
        // Barrel 1 (top) - far end
        // Barrel 2 (left bottom)
        // Barrel 3 (right bottom)
        const barrelPositions = [
            { x: 0, z: -20, name: 'Tynnyri 1' },   // Far barrel
            { x: -12, z: 12, name: 'Tynnyri 2' },  // Left barrel
            { x: 12, z: 12, name: 'Tynnyri 3' }    // Right barrel
        ];

        barrelPositions.forEach((pos, i) => {
            const barrelGroup = new THREE.Group();
            barrelGroup.name = pos.name;

            // Barrel body - bigger and more detailed
            const barrelGeo = new THREE.CylinderGeometry(0.8, 0.8, 1.2, 24);
            const barrelMat = new THREE.MeshStandardMaterial({
                color: 0x1E90FF, // Blue barrels
                roughness: 0.5
            });
            const barrel = new THREE.Mesh(barrelGeo, barrelMat);
            barrel.position.y = 0.6;
            barrel.castShadow = true;
            barrelGroup.add(barrel);

            // White rings on barrel
            const ringGeo = new THREE.TorusGeometry(0.82, 0.05, 8, 24);
            const ringMat = new THREE.MeshStandardMaterial({ color: 0xffffff });

            const topRing = new THREE.Mesh(ringGeo, ringMat);
            topRing.rotation.x = Math.PI / 2;
            topRing.position.y = 1.0;
            barrelGroup.add(topRing);

            const bottomRing = topRing.clone();
            bottomRing.position.y = 0.2;
            barrelGroup.add(bottomRing);

            // Number on barrel
            const numberGeo = new THREE.CircleGeometry(0.3, 16);
            const numberMat = new THREE.MeshStandardMaterial({ color: 0xffffff });
            const numberBg = new THREE.Mesh(numberGeo, numberMat);
            numberBg.position.set(0, 0.6, 0.82);
            barrelGroup.add(numberBg);

            barrelGroup.position.set(pos.x, 0, pos.z);
            arenaGroup.add(barrelGroup);
        });

        // Start/Finish line
        const lineGeo = new THREE.PlaneGeometry(10, 0.3);
        const lineMat = new THREE.MeshStandardMaterial({ color: 0xffffff });
        const startLine = new THREE.Mesh(lineGeo, lineMat);
        startLine.rotation.x = -Math.PI / 2;
        startLine.position.set(0, 0.06, 25);
        arenaGroup.add(startLine);

        // Start/Finish banner posts
        const bannerPostGeo = new THREE.CylinderGeometry(0.1, 0.1, 3, 12);
        const bannerPostMat = new THREE.MeshStandardMaterial({ color: 0x8B0000 });

        const leftPost = new THREE.Mesh(bannerPostGeo, bannerPostMat);
        leftPost.position.set(-5, 1.5, 25);
        arenaGroup.add(leftPost);

        const rightPost = new THREE.Mesh(bannerPostGeo, bannerPostMat);
        rightPost.position.set(5, 1.5, 25);
        arenaGroup.add(rightPost);

        // Banner between posts
        const bannerGeo = new THREE.BoxGeometry(10, 0.6, 0.1);
        const bannerMat = new THREE.MeshStandardMaterial({ color: 0xff0000 });
        const banner = new THREE.Mesh(bannerGeo, bannerMat);
        banner.position.set(0, 2.8, 25);
        arenaGroup.add(banner);

        // Timer display stand
        const timerStandGroup = new THREE.Group();
        const standGeo = new THREE.BoxGeometry(1.5, 2, 0.3);
        const standMat = new THREE.MeshStandardMaterial({ color: 0x333333 });
        const stand = new THREE.Mesh(standGeo, standMat);
        stand.position.y = 1;
        timerStandGroup.add(stand);

        const screenGeo = new THREE.BoxGeometry(1.2, 0.6, 0.1);
        const screenMat = new THREE.MeshStandardMaterial({
            color: 0x00ff00,
            emissive: 0x003300,
            emissiveIntensity: 0.5
        });
        const screen = new THREE.Mesh(screenGeo, screenMat);
        screen.position.set(0, 1.5, 0.2);
        timerStandGroup.add(screen);

        timerStandGroup.position.set(-20, 0, 28);
        arenaGroup.add(timerStandGroup);

        arenaGroup.position.set(x, y, z);
        this.scene.add(arenaGroup);
    }

    // Create a riding instructor NPC
    createRidingInstructor() {
        const instructorGroup = new THREE.Group();
        instructorGroup.name = 'riding-instructor';

        // Materials
        const skinMat = new THREE.MeshStandardMaterial({ color: 0xf5d0b0, roughness: 0.8 });
        const jacketMat = new THREE.MeshStandardMaterial({ color: 0x2e4a2e, roughness: 0.6 }); // Dark green jacket
        const pantsMat = new THREE.MeshStandardMaterial({ color: 0xf5f5dc, roughness: 0.7 }); // Beige riding pants
        const bootMat = new THREE.MeshStandardMaterial({ color: 0x1a1a1a, roughness: 0.5 });
        const hairMat = new THREE.MeshStandardMaterial({ color: 0x3d2d1d, roughness: 0.9 });
        const capMat = new THREE.MeshStandardMaterial({ color: 0x111111, roughness: 0.6 });

        // Body/torso
        const torsoGeo = new THREE.CylinderGeometry(0.22, 0.25, 0.6, 12);
        const torso = new THREE.Mesh(torsoGeo, jacketMat);
        torso.position.y = 1.1;
        torso.castShadow = true;
        instructorGroup.add(torso);

        // Jacket collar
        const collarGeo = new THREE.CylinderGeometry(0.18, 0.22, 0.1, 12);
        const collar = new THREE.Mesh(collarGeo, jacketMat);
        collar.position.y = 1.45;
        instructorGroup.add(collar);

        // Head
        const headGeo = new THREE.SphereGeometry(0.18, 12, 10);
        const head = new THREE.Mesh(headGeo, skinMat);
        head.position.y = 1.65;
        head.castShadow = true;
        instructorGroup.add(head);

        // Riding cap
        const capGeo = new THREE.CylinderGeometry(0.19, 0.2, 0.12, 12);
        const cap = new THREE.Mesh(capGeo, capMat);
        cap.position.y = 1.8;
        instructorGroup.add(cap);

        // Cap brim
        const brimGeo = new THREE.CylinderGeometry(0.22, 0.22, 0.02, 12);
        const brim = new THREE.Mesh(brimGeo, capMat);
        brim.position.set(0, 1.74, 0.08);
        brim.rotation.x = 0.2;
        instructorGroup.add(brim);

        // Hair (visible under cap)
        const hairGeo = new THREE.SphereGeometry(0.16, 10, 8);
        hairGeo.scale(1, 0.8, 1);
        const hair = new THREE.Mesh(hairGeo, hairMat);
        hair.position.set(0, 1.7, -0.05);
        instructorGroup.add(hair);

        // Arms
        const armGeo = new THREE.CylinderGeometry(0.06, 0.07, 0.5, 8);

        // Left arm - holding clipboard
        const leftArm = new THREE.Mesh(armGeo, jacketMat);
        leftArm.position.set(0.28, 1.0, 0.1);
        leftArm.rotation.set(0.5, 0, 0.3);
        leftArm.castShadow = true;
        instructorGroup.add(leftArm);

        // Right arm - gesturing
        const rightArm = new THREE.Mesh(armGeo, jacketMat);
        rightArm.position.set(-0.28, 1.0, 0.15);
        rightArm.rotation.set(0.8, 0, -0.5);
        rightArm.castShadow = true;
        instructorGroup.add(rightArm);

        // Hands
        const handGeo = new THREE.SphereGeometry(0.05, 8, 8);
        const leftHand = new THREE.Mesh(handGeo, skinMat);
        leftHand.position.set(0.35, 0.75, 0.35);
        instructorGroup.add(leftHand);

        const rightHand = new THREE.Mesh(handGeo, skinMat);
        rightHand.position.set(-0.35, 0.65, 0.45);
        instructorGroup.add(rightHand);

        // Clipboard
        const clipboardGeo = new THREE.BoxGeometry(0.25, 0.35, 0.02);
        const clipboardMat = new THREE.MeshStandardMaterial({ color: 0x8B4513 });
        const clipboard = new THREE.Mesh(clipboardGeo, clipboardMat);
        clipboard.position.set(0.35, 0.75, 0.35);
        clipboard.rotation.set(-0.3, 0.2, 0);
        instructorGroup.add(clipboard);

        // Paper on clipboard
        const paperGeo = new THREE.PlaneGeometry(0.2, 0.3);
        const paperMat = new THREE.MeshStandardMaterial({ color: 0xffffff });
        const paper = new THREE.Mesh(paperGeo, paperMat);
        paper.position.set(0.35, 0.75, 0.37);
        paper.rotation.set(-0.3, 0.2, 0);
        instructorGroup.add(paper);

        // Legs
        const legGeo = new THREE.CylinderGeometry(0.08, 0.07, 0.5, 10);

        const leftLeg = new THREE.Mesh(legGeo, pantsMat);
        leftLeg.position.set(0.12, 0.55, 0);
        leftLeg.castShadow = true;
        instructorGroup.add(leftLeg);

        const rightLeg = new THREE.Mesh(legGeo, pantsMat);
        rightLeg.position.set(-0.12, 0.55, 0);
        rightLeg.castShadow = true;
        instructorGroup.add(rightLeg);

        // Boots
        const bootGeo = new THREE.BoxGeometry(0.1, 0.35, 0.18);

        const leftBoot = new THREE.Mesh(bootGeo, bootMat);
        leftBoot.position.set(0.12, 0.17, 0.02);
        instructorGroup.add(leftBoot);

        const rightBoot = new THREE.Mesh(bootGeo, bootMat);
        rightBoot.position.set(-0.12, 0.17, 0.02);
        instructorGroup.add(rightBoot);

        // Whistle around neck
        const whistleGeo = new THREE.CylinderGeometry(0.02, 0.03, 0.08, 8);
        const whistleMat = new THREE.MeshStandardMaterial({ color: 0xc0c0c0, metalness: 0.8 });
        const whistle = new THREE.Mesh(whistleGeo, whistleMat);
        whistle.position.set(0, 1.38, 0.2);
        whistle.rotation.x = Math.PI / 2;
        instructorGroup.add(whistle);

        return instructorGroup;
    }


    createTrees() {

        const treePositions = [];

        // Generate random tree positions
        for (let i = 0; i < 50; i++) {
            const x = (Math.random() - 0.5) * 200;
            const z = (Math.random() - 0.5) * 200;

            // Avoid placing trees in key areas
            if (Math.abs(x) < 30 && Math.abs(z) < 30) continue;
            if (x > 20 && x < 100 && Math.abs(z) < 50) continue;

            treePositions.push({ x, z });
        }

        treePositions.forEach(pos => {
            const tree = this.createTree();
            tree.position.set(pos.x, 0, pos.z);
            tree.rotation.y = Math.random() * Math.PI * 2;
            this.scene.add(tree);
        });
    }

    createTree() {
        const treeGroup = new THREE.Group();

        // Trunk
        const trunkGeo = new THREE.CylinderGeometry(0.2, 0.4, 3, 8);
        const trunkMat = new THREE.MeshStandardMaterial({ color: 0x8B4513 });
        const trunk = new THREE.Mesh(trunkGeo, trunkMat);
        trunk.position.y = 1.5;
        trunk.castShadow = true;
        treeGroup.add(trunk);

        // Foliage
        const foliageGeo = new THREE.SphereGeometry(2, 8, 6);
        const foliageMat = new THREE.MeshStandardMaterial({
            color: 0x228B22,
            roughness: 0.9
        });
        const foliage = new THREE.Mesh(foliageGeo, foliageMat);
        foliage.position.y = 4;
        foliage.scale.y = 1.3;
        foliage.castShadow = true;
        treeGroup.add(foliage);

        return treeGroup;
    }

    createTrail() {
        // Trail path for cross-country riding
        const trailPoints = [
            new THREE.Vector3(-20, 0.1, 50),
            new THREE.Vector3(-40, 0.1, 60),
            new THREE.Vector3(-60, 0.1, 55),
            new THREE.Vector3(-80, 0.1, 70),
            new THREE.Vector3(-100, 0.1, 60),
            new THREE.Vector3(-90, 0.1, 40),
            new THREE.Vector3(-70, 0.1, 30),
            new THREE.Vector3(-50, 0.1, 35),
            new THREE.Vector3(-30, 0.1, 50)
        ];

        const trailCurve = new THREE.CatmullRomCurve3(trailPoints, true);
        const trailGeo = new THREE.TubeGeometry(trailCurve, 100, 1.5, 8, true);
        const trailMat = new THREE.MeshStandardMaterial({
            color: 0x8B7355,
            roughness: 1
        });

        const trail = new THREE.Mesh(trailGeo, trailMat);
        trail.position.y = -0.5;
        trail.name = 'trail';
        this.scene.add(trail);
    }

    createHorses() {
        // Create initial horses
        const horseData = [
            { name: 'Helmi', color: 0x8B4513, position: { x: 0, z: 0 }, stallIndex: 0 },
            { name: 'Tähti', color: 0x2F1810, position: { x: 0, z: 0 }, stallIndex: 1 },
            { name: 'Pilvi', color: 0xD3D3D3, position: { x: 0, z: 0 }, stallIndex: 2 },
            { name: 'Mustikka', color: 0x1a1a1a, position: { x: 0, z: 0 }, stallIndex: 3 }
        ];

        horseData.forEach(data => {
            const horse = new Horse(this, data);
            this.horses.push(horse);
            horse.create();
        });
    }

    setupEventListeners() {
        // Window resize
        window.addEventListener('resize', () => this.onResize());

        // Keyboard
        window.addEventListener('keydown', (e) => this.onKeyDown(e));
        window.addEventListener('keyup', (e) => this.onKeyUp(e));

        // Mouse
        window.addEventListener('click', (e) => this.onClick(e));
        window.addEventListener('mousemove', (e) => this.onMouseMove(e));

        // Pointer lock events
        this.fpControls.addEventListener('lock', () => {
            console.log('Controls locked');
        });

        this.fpControls.addEventListener('unlock', () => {
            if (this.state === 'playing') {
                this.pauseGame();
            }
        });

        // UI event listeners are set up in UI.js
    }

    onResize() {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }

    onKeyDown(e) {
        if (this.state !== 'playing') return;

        switch (e.code) {
            case 'KeyW':
            case 'ArrowUp':
                this.keys.forward = true;
                break;
            case 'KeyS':
            case 'ArrowDown':
                this.keys.backward = true;
                break;
            case 'KeyA':
            case 'ArrowLeft':
                this.keys.left = true;
                break;
            case 'KeyD':
            case 'ArrowRight':
                this.keys.right = true;
                break;
            case 'Space':
                this.keys.jump = true;
                break;
            case 'KeyE':
                this.interact();
                break;
            case 'Escape':
                this.pauseGame();
                break;
        }
    }

    onKeyUp(e) {
        switch (e.code) {
            case 'KeyW':
            case 'ArrowUp':
                this.keys.forward = false;
                break;
            case 'KeyS':
            case 'ArrowDown':
                this.keys.backward = false;
                break;
            case 'KeyA':
            case 'ArrowLeft':
                this.keys.left = false;
                break;
            case 'KeyD':
            case 'ArrowRight':
                this.keys.right = false;
                break;
            case 'Space':
                this.keys.jump = false;
                break;
        }
    }

    onClick(e) {
        if (this.state === 'menu') {
            // Menu clicks handled by UI
            return;
        }

        if (this.state === 'playing') {
            // Check for horse selection
            this.checkHorseClick(e);
        }
    }

    onMouseMove(e) {
        this.mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
        this.mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
    }

    checkHorseClick(e) {
        this.raycaster.setFromCamera(this.mouse, this.camera);

        const horseMeshes = this.horses.map(h => h.mesh).filter(m => m);
        const intersects = this.raycaster.intersectObjects(horseMeshes, true);

        if (intersects.length > 0) {
            const clickedObject = intersects[0].object;

            // Find which horse was clicked
            for (const horse of this.horses) {
                if (horse.mesh && (horse.mesh === clickedObject || horse.mesh.children.includes(clickedObject))) {
                    this.selectHorse(horse);
                    break;
                }
            }
        }
    }

    selectHorse(horse) {
        this.selectedHorse = horse;
        this.ui.showHorseStats(horse);
        this.ui.showActionMenu();
    }

    deselectHorse() {
        this.selectedHorse = null;
        this.ui.hideHorseStats();
        this.ui.hideActionMenu();
    }

    interact() {
        // Check what's nearby and interact with it
        if (this.selectedHorse) {
            this.ui.showActionMenu();
        }
    }

    showMainMenu() {
        document.getElementById('loading-screen').classList.add('hidden');
        document.getElementById('main-menu').classList.remove('hidden');
        this.state = 'menu';
    }

    startGame() {
        document.getElementById('main-menu').classList.add('hidden');
        document.getElementById('game-ui').classList.remove('hidden');
        this.state = 'playing';

        // Position camera at stable entrance
        this.camera.position.set(0, 5, 15);
        this.camera.lookAt(0, 2, 0);

        // Enable orbit controls for now (easier to navigate)
        this.controls = this.orbitControls;
        this.controls.enabled = true;

        // Start audio and weather systems
        this.initAudioSystem();
        this.startWeatherSystem();
    }

    pauseGame() {
        this.state = 'paused';
        document.getElementById('main-menu').classList.remove('hidden');
    }

    resumeGame() {
        this.state = 'playing';
        document.getElementById('main-menu').classList.add('hidden');
    }

    animate() {
        this.animationId = requestAnimationFrame(() => this.animate());

        const delta = this.clock.getDelta();

        // Update controls
        if (this.controls && this.controls.update) {
            this.controls.update();
        }

        // Update game time
        if (this.state === 'playing') {
            this.updateGameTime(delta);
            this.updateHorses(delta);
            this.updatePlayer(delta);
            this.updateRain(); // Update rain particles if raining
        }

        // Render
        this.renderer.render(this.scene, this.camera);
    }

    updateGameTime(delta) {
        // 1 real second = 1 game minute
        this.time += delta;

        if (this.time >= 24 * 60) {
            this.time = 0;
        }

        // Update UI time display
        const hours = Math.floor(this.time / 60);
        const minutes = Math.floor(this.time % 60);
        document.getElementById('game-time').textContent =
            `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;

        // Update lighting based on time
        this.updateLighting();
    }

    updateLighting() {
        const hours = this.time / 60;

        // Sun position
        const sunAngle = ((hours - 6) / 12) * Math.PI;
        this.sunLight.position.x = Math.cos(sunAngle) * 100;
        this.sunLight.position.y = Math.sin(sunAngle) * 100;

        // Sky color (simplified day/night cycle)
        let skyColor;
        if (hours >= 6 && hours < 18) {
            // Daytime
            skyColor = new THREE.Color(0x87CEEB);
            this.sunLight.intensity = 1.2;
        } else if (hours >= 18 && hours < 20) {
            // Sunset
            skyColor = new THREE.Color(0xFF6B6B);
            this.sunLight.intensity = 0.8;
        } else if (hours >= 5 && hours < 6) {
            // Sunrise
            skyColor = new THREE.Color(0xFFB347);
            this.sunLight.intensity = 0.6;
        } else {
            // Night
            skyColor = new THREE.Color(0x1a1a3e);
            this.sunLight.intensity = 0.2;
        }

        this.scene.background = skyColor;
        this.scene.fog.color = skyColor;
    }

    updateHorses(delta) {
        this.horses.forEach(horse => horse.update(delta));
    }

    updatePlayer(delta) {
        if (this.player) {
            this.player.update(delta);
        }
    }

    // Activity methods
    startActivity(type) {
        this.currentActivity = type;
        this.state = 'activity';
        this.ui.showActivity(type, this.selectedHorse);
    }

    endActivity() {
        // Call optional cleanup from UI (for 3D objects)
        if (this.ui.cleanupCurrentActivity) {
            this.ui.cleanupCurrentActivity();
            this.ui.cleanupCurrentActivity = null;
        }

        this.currentActivity = null;
        this.state = 'playing';
        this.ui.hideActivity();
    }

    // =====================
    // AUDIO SYSTEM
    // =====================

    initAudioSystem() {
        // Create audio context on user interaction
        if (!this.audioContext) {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        }

        // Start background music
        this.startBackgroundMusic();

        // Start random horse sounds
        this.startRandomHorseSounds();
    }

    startBackgroundMusic() {
        if (this.isMusicPlaying) return;

        // Create simple melody using Web Audio API oscillators
        const playMelody = () => {
            if (!this.audioContext || this.state === 'paused') return;

            const notes = [
                { freq: 392, dur: 0.5 },  // G4
                { freq: 440, dur: 0.5 },  // A4
                { freq: 494, dur: 0.5 },  // B4
                { freq: 523, dur: 1.0 },  // C5
                { freq: 494, dur: 0.5 },  // B4
                { freq: 440, dur: 0.5 },  // A4
                { freq: 392, dur: 1.5 },  // G4
            ];

            let time = this.audioContext.currentTime;

            notes.forEach(note => {
                const osc = this.audioContext.createOscillator();
                const gain = this.audioContext.createGain();

                osc.connect(gain);
                gain.connect(this.audioContext.destination);

                osc.frequency.value = note.freq;
                osc.type = 'sine';

                gain.gain.setValueAtTime(0, time);
                gain.gain.linearRampToValueAtTime(this.masterVolume * 0.15, time + 0.05);
                gain.gain.linearRampToValueAtTime(0, time + note.dur);

                osc.start(time);
                osc.stop(time + note.dur);

                time += note.dur;
            });
        };

        // Play melody every 30 seconds
        playMelody();
        this.musicInterval = setInterval(playMelody, 30000);
        this.isMusicPlaying = true;
    }

    startRandomHorseSounds() {
        // Play random horse neighing sounds
        const playNeigh = () => {
            if (!this.audioContext || this.state === 'paused') return;
            if (Math.random() > 0.3) return; // 30% chance each time

            // Create horse neigh using frequency modulation
            const osc = this.audioContext.createOscillator();
            const gain = this.audioContext.createGain();

            osc.connect(gain);
            gain.connect(this.audioContext.destination);

            const startTime = this.audioContext.currentTime;

            // Horse neigh sweeps from high to low frequency
            osc.type = 'sawtooth';
            osc.frequency.setValueAtTime(800, startTime);
            osc.frequency.exponentialRampToValueAtTime(400, startTime + 0.3);
            osc.frequency.exponentialRampToValueAtTime(600, startTime + 0.5);
            osc.frequency.exponentialRampToValueAtTime(300, startTime + 0.8);

            gain.gain.setValueAtTime(0, startTime);
            gain.gain.linearRampToValueAtTime(this.masterVolume * 0.2, startTime + 0.1);
            gain.gain.linearRampToValueAtTime(this.masterVolume * 0.15, startTime + 0.5);
            gain.gain.linearRampToValueAtTime(0, startTime + 0.9);

            osc.start(startTime);
            osc.stop(startTime + 1);

            // Show notification sometimes
            if (Math.random() > 0.5 && this.horses.length > 0) {
                const randomHorse = this.horses[Math.floor(Math.random() * this.horses.length)];
                this.ui.showNotification(`${randomHorse.name} hirnuu! 🐴`);
            }
        };

        // Check every 15-45 seconds
        const scheduleNext = () => {
            const delay = 15000 + Math.random() * 30000;
            this.neighTimeout = setTimeout(() => {
                playNeigh();
                scheduleNext();
            }, delay);
        };

        scheduleNext();
    }

    playSound(type) {
        if (!this.audioContext) return;

        const sounds = {
            click: { freq: 800, dur: 0.05, type: 'sine' },
            success: { freq: 523, dur: 0.2, type: 'sine' },
            water: { freq: 200, dur: 0.1, type: 'noise' },
        };

        const sound = sounds[type];
        if (!sound) return;

        const osc = this.audioContext.createOscillator();
        const gain = this.audioContext.createGain();

        osc.connect(gain);
        gain.connect(this.audioContext.destination);

        osc.frequency.value = sound.freq;
        osc.type = sound.type === 'noise' ? 'sawtooth' : sound.type;

        gain.gain.setValueAtTime(this.masterVolume * 0.3, this.audioContext.currentTime);
        gain.gain.linearRampToValueAtTime(0, this.audioContext.currentTime + sound.dur);

        osc.start();
        osc.stop(this.audioContext.currentTime + sound.dur);
    }

    // =====================
    // WEATHER SYSTEM
    // =====================

    startWeatherSystem() {
        // Check weather every 3-5 minutes
        const checkWeather = () => {
            const chance = Math.random();

            if (this.isRaining) {
                // 40% chance to stop raining
                if (chance < 0.4) {
                    this.stopRain();
                }
            } else {
                // 20% chance to start raining
                if (chance < 0.2) {
                    this.startRain();
                }
            }
        };

        // Initial check after 2 minutes
        setTimeout(checkWeather, 120000);

        // Then check every 3-5 minutes
        this.weatherCheckInterval = setInterval(checkWeather, 180000 + Math.random() * 120000);
    }

    startRain() {
        if (this.isRaining) return;

        this.isRaining = true;
        this.weather = 'rainy';
        this.ui.showNotification('🌧️ Alkoi sataa vettä!');

        // Create rain particles
        const rainCount = 5000;
        const rainGeometry = new THREE.BufferGeometry();
        const rainPositions = new Float32Array(rainCount * 3);

        for (let i = 0; i < rainCount * 3; i += 3) {
            rainPositions[i] = (Math.random() - 0.5) * 200;     // x
            rainPositions[i + 1] = Math.random() * 100;          // y
            rainPositions[i + 2] = (Math.random() - 0.5) * 200;  // z
        }

        rainGeometry.setAttribute('position', new THREE.BufferAttribute(rainPositions, 3));

        const rainMaterial = new THREE.PointsMaterial({
            color: 0xaaaaee,
            size: 0.2,
            transparent: true,
            opacity: 0.6
        });

        this.rainParticles = new THREE.Points(rainGeometry, rainMaterial);
        this.scene.add(this.rainParticles);

        // Darken the sky
        this.scene.background = new THREE.Color(0x5a5a6e);
        this.scene.fog.color = new THREE.Color(0x5a5a6e);
        this.sunLight.intensity = 0.5;

        // Rain sound loop
        this.rainSoundInterval = setInterval(() => {
            if (!this.audioContext) return;

            // White noise for rain
            const bufferSize = this.audioContext.sampleRate * 0.1;
            const buffer = this.audioContext.createBuffer(1, bufferSize, this.audioContext.sampleRate);
            const output = buffer.getChannelData(0);

            for (let i = 0; i < bufferSize; i++) {
                output[i] = (Math.random() * 2 - 1) * 0.3;
            }

            const noise = this.audioContext.createBufferSource();
            noise.buffer = buffer;

            const gain = this.audioContext.createGain();
            gain.gain.value = this.masterVolume * 0.1;

            noise.connect(gain);
            gain.connect(this.audioContext.destination);

            noise.start();
        }, 100);
    }

    stopRain() {
        if (!this.isRaining) return;

        this.isRaining = false;
        this.weather = 'sunny';
        this.ui.showNotification('☀️ Sade loppui!');

        // Remove rain particles
        if (this.rainParticles) {
            this.scene.remove(this.rainParticles);
            this.rainParticles.geometry.dispose();
            this.rainParticles.material.dispose();
            this.rainParticles = null;
        }

        // Restore sky color
        this.updateLighting();

        // Stop rain sound
        if (this.rainSoundInterval) {
            clearInterval(this.rainSoundInterval);
            this.rainSoundInterval = null;
        }
    }

    updateRain() {
        if (!this.rainParticles) return;

        const positions = this.rainParticles.geometry.attributes.position.array;

        for (let i = 0; i < positions.length; i += 3) {
            positions[i + 1] -= 0.5; // Fall speed

            // Reset to top when below ground
            if (positions[i + 1] < 0) {
                positions[i + 1] = 80 + Math.random() * 20;
            }
        }

        this.rainParticles.geometry.attributes.position.needsUpdate = true;
    }

}

