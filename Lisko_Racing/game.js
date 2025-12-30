// Lisko Racing Game 🦎
// A 3D endless runner starring a cute lizard!

// ============ GAME STATE ============
const state = {
    score: 0,
    speed: 1,
    isRunning: false,
    isGameOver: false,
    lizardLane: 0, // -1 = left, 0 = center, 1 = right
    targetLane: 0,
    obstacles: [],
    flies: [],
    powerups: [],
    groundTiles: [],
    time: 0,
    isInvincible: false,
    invincibleEndTime: 0
};

// ============ CONSTANTS ============
const LANE_WIDTH = 4;
const LANES = [-LANE_WIDTH, 0, LANE_WIDTH];
const SPAWN_DISTANCE = 80;
const DESPAWN_DISTANCE = -15;
const GROUND_LENGTH = 40;
const NUM_GROUND_TILES = 5;

// ============ AUDIO/MUSIC SYSTEM ============
let audioContext = null;
let musicPlaying = false;
let musicNodes = [];

function initAudio() {
    if (!audioContext) {
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
    }
    return audioContext;
}

function playNote(frequency, startTime, duration, type = 'square') {
    const ctx = audioContext;
    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();

    oscillator.type = type;
    oscillator.frequency.setValueAtTime(frequency, startTime);

    gainNode.gain.setValueAtTime(0.08, startTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, startTime + duration * 0.9);

    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);

    oscillator.start(startTime);
    oscillator.stop(startTime + duration);

    musicNodes.push(oscillator);
}

function playBass(frequency, startTime, duration) {
    const ctx = audioContext;
    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();

    oscillator.type = 'triangle';
    oscillator.frequency.setValueAtTime(frequency, startTime);

    gainNode.gain.setValueAtTime(0.12, startTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, startTime + duration * 0.8);

    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);

    oscillator.start(startTime);
    oscillator.stop(startTime + duration);

    musicNodes.push(oscillator);
}

function startMusic() {
    if (musicPlaying) return;
    initAudio();
    musicPlaying = true;

    const melody = [
        392, 440, 494, 523, 587, 523, 494, 440,  // G4 A4 B4 C5 D5 C5 B4 A4
        392, 330, 349, 392, 440, 392, 349, 330,  // G4 E4 F4 G4 A4 G4 F4 E4
        294, 330, 349, 392, 440, 494, 523, 587,  // D4 E4 F4 G4 A4 B4 C5 D5
        523, 494, 440, 392, 349, 330, 294, 330   // C5 B4 A4 G4 F4 E4 D4 E4
    ];

    const bass = [
        196, 196, 220, 220, 247, 247, 262, 262,  // G3 A3 B3 C4
        196, 165, 175, 196, 220, 196, 175, 165,  // G3 E3 F3 G3...
        147, 165, 175, 196, 220, 247, 262, 294,  // D3 E3 F3 G3...
        262, 247, 220, 196, 175, 165, 147, 165   // C4 B3 A3 G3...
    ];

    function playLoop() {
        if (!musicPlaying) return;

        const ctx = audioContext;
        const now = ctx.currentTime;
        const tempo = 0.15; // speed of each note

        melody.forEach((freq, i) => {
            playNote(freq, now + i * tempo, tempo * 0.9, 'square');
        });

        bass.forEach((freq, i) => {
            if (i % 2 === 0) { // Play bass every other beat
                playBass(freq / 2, now + i * tempo, tempo * 1.8);
            }
        });

        // Schedule next loop
        const loopDuration = melody.length * tempo * 1000;
        setTimeout(playLoop, loopDuration - 50);
    }

    playLoop();
}

function stopMusic() {
    musicPlaying = false;
    musicNodes.forEach(node => {
        try { node.stop(); } catch (e) { }
    });
    musicNodes = [];
}

function playCollectSound() {
    if (!audioContext) return;
    const ctx = audioContext;
    const now = ctx.currentTime;

    // Happy ding sound
    [880, 1108, 1318].forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + i * 0.05);
        gain.gain.setValueAtTime(0.15, now + i * 0.05);
        gain.gain.exponentialRampToValueAtTime(0.01, now + i * 0.05 + 0.2);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now + i * 0.05);
        osc.stop(now + i * 0.05 + 0.2);
    });
}

function playCrashSound() {
    if (!audioContext) return;
    const ctx = audioContext;
    const now = ctx.currentTime;

    // Crash/boom sound
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(150, now);
    osc.frequency.exponentialRampToValueAtTime(50, now + 0.3);
    gain.gain.setValueAtTime(0.3, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.3);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.3);
}

// ============ THREE.JS SETUP ============
const canvas = document.getElementById('game-canvas');
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x87CEEB);
scene.fog = new THREE.Fog(0x87CEEB, 40, 120);

const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 200);
camera.position.set(0, 8, -12);
camera.lookAt(0, 2, 10);

// ============ LIGHTING ============
const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
scene.add(ambientLight);

const sunLight = new THREE.DirectionalLight(0xfff5e0, 1.2);
sunLight.position.set(20, 40, -10);
sunLight.castShadow = true;
sunLight.shadow.mapSize.width = 2048;
sunLight.shadow.mapSize.height = 2048;
sunLight.shadow.camera.left = -50;
sunLight.shadow.camera.right = 50;
sunLight.shadow.camera.top = 50;
sunLight.shadow.camera.bottom = -50;
scene.add(sunLight);

// ============ LIZARD MODEL ============
const lizardGroup = new THREE.Group();

// Body - elongated with belly curve
const bodyGeom = new THREE.SphereGeometry(0.5, 16, 16);
const lizardMaterial = new THREE.MeshStandardMaterial({
    color: 0x228b22,  // Forest green
    roughness: 0.7,
    metalness: 0.05
});
const bellyMaterial = new THREE.MeshStandardMaterial({
    color: 0x90ee90,  // Light green belly
    roughness: 0.8,
    metalness: 0
});

var body = new THREE.Mesh(bodyGeom, lizardMaterial);
body.scale.set(0.8, 0.6, 1.8);  // Elongated body
body.position.y = 0.55;
body.castShadow = true;
lizardGroup.add(body);

// Belly (lighter underside)
const bellyGeom = new THREE.SphereGeometry(0.4, 12, 12);
const belly = new THREE.Mesh(bellyGeom, bellyMaterial);
belly.scale.set(0.7, 0.3, 1.6);
belly.position.set(0, 0.35, 0);
lizardGroup.add(belly);

// Spine ridges
const ridgeMaterial = new THREE.MeshStandardMaterial({
    color: 0x006400, // Dark green
    roughness: 0.5
});
for (let i = 0; i < 8; i++) {
    const ridgeGeom = new THREE.ConeGeometry(0.08, 0.15, 4);
    const ridge = new THREE.Mesh(ridgeGeom, ridgeMaterial);
    ridge.position.set(0, 0.85, -0.8 + i * 0.25);
    ridge.rotation.x = -0.2;
    lizardGroup.add(ridge);
}

// Head - tapered snout
const headGeom = new THREE.SphereGeometry(0.35, 16, 16);
var head = new THREE.Mesh(headGeom, lizardMaterial);
head.position.set(0, 0.6, 1.4);
head.scale.set(0.9, 0.7, 1.3);  // Flat and elongated
head.castShadow = true;
lizardGroup.add(head);

// Snout
const snoutGeom = new THREE.SphereGeometry(0.2, 12, 12);
const snout = new THREE.Mesh(snoutGeom, lizardMaterial);
snout.position.set(0, 0.5, 1.85);
snout.scale.set(0.6, 0.4, 0.8);
lizardGroup.add(snout);

// Nostrils
const nostrilGeom = new THREE.SphereGeometry(0.03, 8, 8);
const nostrilMaterial = new THREE.MeshStandardMaterial({ color: 0x1a1a1a });
const leftNostril = new THREE.Mesh(nostrilGeom, nostrilMaterial);
leftNostril.position.set(-0.08, 0.52, 2.05);
lizardGroup.add(leftNostril);
const rightNostril = new THREE.Mesh(nostrilGeom, nostrilMaterial);
rightNostril.position.set(0.08, 0.52, 2.05);
lizardGroup.add(rightNostril);

// Eyes - bulging like a real lizard
const eyeSocketGeom = new THREE.SphereGeometry(0.15, 12, 12);
const eyeSocketMaterial = new THREE.MeshStandardMaterial({ color: 0x1a3d1a });
const eyeGeom = new THREE.SphereGeometry(0.1, 12, 12);
const eyeMaterial = new THREE.MeshStandardMaterial({ color: 0x1a1a1a });
const pupilGeom = new THREE.SphereGeometry(0.04, 8, 8);
const pupilMaterial = new THREE.MeshStandardMaterial({ color: 0xffd700 });  // Golden pupils

// Left eye
const leftSocket = new THREE.Mesh(eyeSocketGeom, eyeSocketMaterial);
leftSocket.position.set(-0.3, 0.75, 1.5);
leftSocket.scale.set(1, 0.8, 0.8);
lizardGroup.add(leftSocket);
const leftEye = new THREE.Mesh(eyeGeom, eyeMaterial);
leftEye.position.set(-0.35, 0.78, 1.6);
lizardGroup.add(leftEye);
const leftPupil = new THREE.Mesh(pupilGeom, pupilMaterial);
leftPupil.position.set(-0.38, 0.79, 1.68);
lizardGroup.add(leftPupil);

// Right eye
const rightSocket = new THREE.Mesh(eyeSocketGeom, eyeSocketMaterial);
rightSocket.position.set(0.3, 0.75, 1.5);
rightSocket.scale.set(1, 0.8, 0.8);
lizardGroup.add(rightSocket);
const rightEye = new THREE.Mesh(eyeGeom, eyeMaterial);
rightEye.position.set(0.35, 0.78, 1.6);
lizardGroup.add(rightEye);
const rightPupil = new THREE.Mesh(pupilGeom, pupilMaterial);
rightPupil.position.set(0.38, 0.79, 1.68);
lizardGroup.add(rightPupil);

// Legs with proper bends and feet
var legs = [];
const upperLegGeom = new THREE.CylinderGeometry(0.08, 0.1, 0.35, 8);
const lowerLegGeom = new THREE.CylinderGeometry(0.06, 0.08, 0.3, 8);
const footGeom = new THREE.SphereGeometry(0.1, 8, 8);

const legPositions = [
    { x: -0.55, z: 0.6, side: -1 },   // Front left
    { x: 0.55, z: 0.6, side: 1 },     // Front right
    { x: -0.55, z: -0.5, side: -1 },  // Back left
    { x: 0.55, z: -0.5, side: 1 }     // Back right
];

legPositions.forEach((pos, i) => {
    // Upper leg
    const upperLeg = new THREE.Mesh(upperLegGeom, lizardMaterial);
    upperLeg.position.set(pos.x * 0.9, 0.45, pos.z);
    upperLeg.rotation.z = pos.side * 0.6;
    upperLeg.castShadow = true;
    lizardGroup.add(upperLeg);

    // Lower leg
    const lowerLeg = new THREE.Mesh(lowerLegGeom, lizardMaterial);
    lowerLeg.position.set(pos.x * 1.2, 0.2, pos.z);
    lowerLeg.rotation.z = pos.side * 0.2;
    lowerLeg.castShadow = true;
    lizardGroup.add(lowerLeg);

    // Foot with toes
    const foot = new THREE.Mesh(footGeom, lizardMaterial);
    foot.position.set(pos.x * 1.3, 0.08, pos.z);
    foot.scale.set(0.8, 0.3, 1.2);
    lizardGroup.add(foot);

    // Add toes
    for (let t = 0; t < 3; t++) {
        const toeGeom = new THREE.CylinderGeometry(0.02, 0.015, 0.12, 6);
        const toe = new THREE.Mesh(toeGeom, lizardMaterial);
        toe.position.set(
            pos.x * 1.3 + (t - 1) * 0.05 * pos.side,
            0.05,
            pos.z + 0.12
        );
        toe.rotation.x = 0.3;
        lizardGroup.add(toe);
    }

    legs.push({ upper: upperLeg, lower: lowerLeg, foot: foot });
});

// Tail - segmented and tapered
var tail = new THREE.Group();
const tailSegments = 6;
for (let i = 0; i < tailSegments; i++) {
    const size = 0.2 - i * 0.025;
    const segGeom = new THREE.SphereGeometry(size, 8, 8);
    const seg = new THREE.Mesh(segGeom, lizardMaterial);
    seg.position.set(0, 0.4 - i * 0.03, -0.9 - i * 0.35);
    seg.scale.set(0.8, 0.6, 1.2);
    tail.add(seg);
}
lizardGroup.add(tail);
tail.castShadow = true;

scene.add(lizardGroup);

// ============ GROUND ============
const groundMaterial = new THREE.MeshStandardMaterial({
    color: 0xdeb887,
    roughness: 0.9
});

function createGroundTile(zPosition) {
    const groundGeom = new THREE.PlaneGeometry(30, GROUND_LENGTH);
    const ground = new THREE.Mesh(groundGeom, groundMaterial);
    ground.rotation.x = -Math.PI / 2;
    ground.position.set(0, 0, zPosition);
    ground.receiveShadow = true;
    scene.add(ground);

    // Add lane markers
    const lineGeom = new THREE.PlaneGeometry(0.15, GROUND_LENGTH);
    const lineMaterial = new THREE.MeshBasicMaterial({ color: 0x8B7355 });

    [-LANE_WIDTH - 2, -2, 2, LANE_WIDTH + 2].forEach(x => {
        const line = new THREE.Mesh(lineGeom, lineMaterial);
        line.rotation.x = -Math.PI / 2;
        line.position.set(x, 0.01, zPosition);
        scene.add(line);
        ground.userData.lines = ground.userData.lines || [];
        ground.userData.lines.push(line);
    });

    return ground;
}

// Initialize ground tiles
for (let i = 0; i < NUM_GROUND_TILES; i++) {
    state.groundTiles.push(createGroundTile(i * GROUND_LENGTH));
}

// ============ DECORATIONS ============
const cactusMaterial = new THREE.MeshStandardMaterial({ color: 0x228B22 });

function createCactus(x, z) {
    const group = new THREE.Group();

    const bodyGeom = new THREE.CylinderGeometry(0.3, 0.4, 2, 8);
    const body = new THREE.Mesh(bodyGeom, cactusMaterial);
    body.position.y = 1;
    body.castShadow = true;
    group.add(body);

    const armGeom = new THREE.CylinderGeometry(0.15, 0.2, 0.8, 8);
    const arm1 = new THREE.Mesh(armGeom, cactusMaterial);
    arm1.position.set(0.4, 1.2, 0);
    arm1.rotation.z = -Math.PI / 3;
    group.add(arm1);

    const arm2 = new THREE.Mesh(armGeom, cactusMaterial);
    arm2.position.set(-0.35, 0.9, 0);
    arm2.rotation.z = Math.PI / 4;
    group.add(arm2);

    group.position.set(x, 0, z);
    return group;
}

// Add side decorations
for (let z = 0; z < 100; z += 15) {
    const leftCactus = createCactus(-12 - Math.random() * 3, z + Math.random() * 10);
    scene.add(leftCactus);

    const rightCactus = createCactus(12 + Math.random() * 3, z + Math.random() * 10);
    scene.add(rightCactus);
}

// ============ OBSTACLES ============
const rockMaterial = new THREE.MeshStandardMaterial({
    color: 0x808080,
    roughness: 0.8
});

function createRock(lane) {
    const group = new THREE.Group();

    // Main rock
    const geom = new THREE.DodecahedronGeometry(0.8 + Math.random() * 0.4, 0);
    const rock = new THREE.Mesh(geom, rockMaterial);
    rock.position.y = 0.6;
    rock.rotation.set(Math.random(), Math.random(), Math.random());
    rock.scale.y = 0.7;
    rock.castShadow = true;
    group.add(rock);

    // Smaller rock
    const smallGeom = new THREE.DodecahedronGeometry(0.4, 0);
    const smallRock = new THREE.Mesh(smallGeom, rockMaterial);
    smallRock.position.set(0.5, 0.3, 0.3);
    smallRock.castShadow = true;
    group.add(smallRock);

    group.position.set(LANES[lane], 0, SPAWN_DISTANCE);
    group.userData.lane = lane;

    return group;
}

function createLog(lane) {
    const geom = new THREE.CylinderGeometry(0.5, 0.5, 3, 12);
    const material = new THREE.MeshStandardMaterial({
        color: 0x8B4513,
        roughness: 0.9
    });
    const log = new THREE.Mesh(geom, material);
    log.rotation.z = Math.PI / 2;
    log.position.set(LANES[lane], 0.5, SPAWN_DISTANCE);
    log.castShadow = true;
    log.userData.lane = lane;

    return log;
}

// ============ FLIES (COLLECTIBLES) ============
function createFly(lane) {
    const group = new THREE.Group();

    // Body
    const bodyGeom = new THREE.SphereGeometry(0.25, 8, 8);
    const flyMaterial = new THREE.MeshStandardMaterial({
        color: 0x222222,
        roughness: 0.4
    });
    const body = new THREE.Mesh(bodyGeom, flyMaterial);
    group.add(body);

    // Wings
    const wingGeom = new THREE.CircleGeometry(0.3, 8);
    const wingMaterial = new THREE.MeshStandardMaterial({
        color: 0xaaddff,
        transparent: true,
        opacity: 0.6,
        side: THREE.DoubleSide
    });

    const leftWing = new THREE.Mesh(wingGeom, wingMaterial);
    leftWing.position.set(-0.2, 0.1, 0);
    leftWing.rotation.y = -0.5;
    group.add(leftWing);

    const rightWing = new THREE.Mesh(wingGeom, wingMaterial);
    rightWing.position.set(0.2, 0.1, 0);
    rightWing.rotation.y = 0.5;
    group.add(rightWing);

    group.position.set(LANES[lane], 1.5, SPAWN_DISTANCE);
    group.userData.lane = lane;
    group.userData.leftWing = leftWing;
    group.userData.rightWing = rightWing;

    return group;
}

// ============ POWER-UPS ============
function createHelmet(lane) {
    const group = new THREE.Group();

    // Helmet dome
    const helmetGeom = new THREE.SphereGeometry(0.5, 16, 12, 0, Math.PI * 2, 0, Math.PI / 2);
    const helmetMaterial = new THREE.MeshStandardMaterial({
        color: 0xffd700,
        roughness: 0.3,
        metalness: 0.8,
        emissive: 0xffa500,
        emissiveIntensity: 0.3
    });
    const helmet = new THREE.Mesh(helmetGeom, helmetMaterial);
    helmet.rotation.x = Math.PI;
    helmet.position.y = 0.3;
    group.add(helmet);

    // Helmet brim
    const brimGeom = new THREE.CylinderGeometry(0.55, 0.55, 0.1, 16);
    const brim = new THREE.Mesh(brimGeom, helmetMaterial);
    brim.position.y = 0.3;
    group.add(brim);

    // Star on top
    const starGeom = new THREE.OctahedronGeometry(0.15);
    const starMaterial = new THREE.MeshStandardMaterial({
        color: 0xffff00,
        emissive: 0xffff00,
        emissiveIntensity: 0.5
    });
    const star = new THREE.Mesh(starGeom, starMaterial);
    star.position.y = 0.8;
    group.add(star);

    group.position.set(LANES[lane], 1.2, SPAWN_DISTANCE);
    group.userData.lane = lane;
    group.userData.type = 'helmet';
    group.userData.star = star;

    return group;
}

function playPowerUpSound() {
    if (!audioContext) return;
    const ctx = audioContext;
    const now = ctx.currentTime;

    // Epic power-up sound
    [523, 659, 784, 1047].forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + i * 0.08);
        gain.gain.setValueAtTime(0.2, now + i * 0.08);
        gain.gain.exponentialRampToValueAtTime(0.01, now + i * 0.08 + 0.3);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now + i * 0.08);
        osc.stop(now + i * 0.08 + 0.3);
    });
}

// ============ SPAWNING ============
var lastSpawnZ = 20;

function spawnObjects() {
    if (state.time * state.speed * 10 > lastSpawnZ) {
        const lane = Math.floor(Math.random() * 3);

        if (Math.random() < 0.5) {
            // Spawn obstacle
            const obstacle = Math.random() < 0.5 ? createRock(lane) : createLog(lane);
            scene.add(obstacle);
            state.obstacles.push(obstacle);
        } else if (Math.random() < 0.85) {
            // Spawn fly
            const fly = createFly(lane);
            scene.add(fly);
            state.flies.push(fly);
        } else {
            // Spawn power-up (helmet)
            const helmet = createHelmet(lane);
            scene.add(helmet);
            state.powerups.push(helmet);
        }

        lastSpawnZ += 8 + Math.random() * 12;
    }
}

// ============ COLLISION DETECTION ============
function checkCollisions() {
    const lizardX = lizardGroup.position.x;
    const lizardZ = lizardGroup.position.z;

    // Check obstacles (skip if invincible)
    if (!state.isInvincible) {
        for (let i = state.obstacles.length - 1; i >= 0; i--) {
            const obs = state.obstacles[i];
            const dx = Math.abs(obs.position.x - lizardX);
            const dz = Math.abs(obs.position.z - lizardZ);

            if (dx < 1.2 && dz < 1.2) {
                gameOver();
                return;
            }
        }
    }

    // Check flies
    for (let i = state.flies.length - 1; i >= 0; i--) {
        const fly = state.flies[i];
        const dx = Math.abs(fly.position.x - lizardX);
        const dz = Math.abs(fly.position.z - lizardZ);

        if (dx < 1.5 && dz < 1.5) {
            scene.remove(fly);
            state.flies.splice(i, 1);
            state.score++;
            playCollectSound();
            updateHUD();
        }
    }

    // Check power-ups
    for (let i = state.powerups.length - 1; i >= 0; i--) {
        const powerup = state.powerups[i];
        const dx = Math.abs(powerup.position.x - lizardX);
        const dz = Math.abs(powerup.position.z - lizardZ);

        if (dx < 1.5 && dz < 1.5) {
            scene.remove(powerup);
            state.powerups.splice(i, 1);
            activateInvincibility();
        }
    }
}

function activateInvincibility() {
    state.isInvincible = true;
    state.invincibleEndTime = state.time + 5; // 5 seconds
    playPowerUpSound();

    // Make lizard glow
    lizardMaterial.emissive.setHex(0xffd700);
    lizardMaterial.emissiveIntensity = 0.5;
}

function updateInvincibility() {
    if (state.isInvincible && state.time >= state.invincibleEndTime) {
        state.isInvincible = false;
        lizardMaterial.emissive.setHex(0x000000);
        lizardMaterial.emissiveIntensity = 0;
    }

    // Flashing effect when invincible
    if (state.isInvincible) {
        const flash = Math.sin(state.time * 20) > 0;
        lizardMaterial.emissiveIntensity = flash ? 0.6 : 0.3;
    }
}

// ============ GAME CONTROLS ============
function handleInput(e) {
    if (!state.isRunning) return;

    if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') {
        state.targetLane = Math.min(1, state.targetLane + 1);
    } else if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') {
        state.targetLane = Math.max(-1, state.targetLane - 1);
    }
}

document.addEventListener('keydown', handleInput);

// ============ GAME LOOP ============
function updateHUD() {
    document.getElementById('score-value').textContent = state.score;
    document.getElementById('speed-value').textContent = state.speed.toFixed(1);
}

function animateLizard(time) {
    // Leg animation - now uses upper/lower structure
    const legSpeed = 15 * state.speed;
    legs.forEach((leg, i) => {
        const offset = i < 2 ? 0 : Math.PI; // Front and back legs alternate
        const phase = i % 2 === 0 ? 0 : Math.PI;
        if (leg.upper) {
            leg.upper.rotation.x = Math.sin(time * legSpeed + offset + phase) * 0.3;
        }
        if (leg.lower) {
            leg.lower.rotation.x = Math.sin(time * legSpeed + offset + phase + 0.5) * 0.2;
        }
    });

    // Tail wag - animate each segment
    if (tail.children) {
        tail.children.forEach((seg, i) => {
            seg.position.x = Math.sin(time * 8 + i * 0.5) * 0.1 * (i + 1);
        });
    }

    // Body bob
    body.position.y = 0.55 + Math.sin(time * legSpeed) * 0.04;
    head.position.y = 0.6 + Math.sin(time * legSpeed) * 0.04;
}

function animate() {
    requestAnimationFrame(animate);

    if (!state.isRunning) {
        renderer.render(scene, camera);
        return;
    }

    const delta = 0.016; // ~60fps
    state.time += delta;

    // Increase speed over time
    state.speed = 1 + state.time * 0.02;
    if (state.speed > 7) state.speed = 7;

    // Move lizard smoothly between lanes
    const targetX = LANES[state.targetLane + 1];
    lizardGroup.position.x += (targetX - lizardGroup.position.x) * 0.15;

    // Animate lizard
    animateLizard(state.time);

    // Move obstacles and flies toward player
    const moveSpeed = 20 * state.speed * delta;

    state.obstacles.forEach((obs, i) => {
        obs.position.z -= moveSpeed;
        if (obs.position.z < DESPAWN_DISTANCE) {
            scene.remove(obs);
            state.obstacles.splice(i, 1);
        }
    });

    state.flies.forEach((fly, i) => {
        fly.position.z -= moveSpeed;
        fly.position.y = 1.5 + Math.sin(state.time * 5 + fly.position.z) * 0.3;
        fly.rotation.y += 0.1;

        // Wing flap
        fly.userData.leftWing.rotation.z = Math.sin(state.time * 30) * 0.5;
        fly.userData.rightWing.rotation.z = -Math.sin(state.time * 30) * 0.5;

        if (fly.position.z < DESPAWN_DISTANCE) {
            scene.remove(fly);
            state.flies.splice(i, 1);
        }
    });

    // Move power-ups
    state.powerups.forEach((powerup, i) => {
        powerup.position.z -= moveSpeed;
        powerup.position.y = 1.2 + Math.sin(state.time * 4) * 0.2;
        powerup.rotation.y += 0.05;
        if (powerup.userData.star) {
            powerup.userData.star.rotation.y += 0.15;
        }

        if (powerup.position.z < DESPAWN_DISTANCE) {
            scene.remove(powerup);
            state.powerups.splice(i, 1);
        }
    });

    // Move ground tiles
    state.groundTiles.forEach((tile, i) => {
        tile.position.z -= moveSpeed;
        if (tile.userData.lines) {
            tile.userData.lines.forEach(line => line.position.z -= moveSpeed);
        }

        if (tile.position.z < -GROUND_LENGTH) {
            const maxZ = Math.max(...state.groundTiles.map(t => t.position.z));
            tile.position.z = maxZ + GROUND_LENGTH;
            if (tile.userData.lines) {
                tile.userData.lines.forEach(line => line.position.z = tile.position.z);
            }
        }
    });

    // Spawn new objects
    spawnObjects();

    // Update invincibility
    updateInvincibility();

    // Check collisions
    checkCollisions();

    // Update HUD
    if (Math.floor(state.time * 10) % 5 === 0) {
        updateHUD();
    }

    renderer.render(scene, camera);
}

// ============ GAME STATE MANAGEMENT ============
function startGame() {
    state.score = 0;
    state.speed = 1;
    state.time = 0;
    state.isRunning = true;
    state.isGameOver = false;
    state.targetLane = 0;
    lastSpawnZ = 20;

    // Clear existing obstacles, flies, and power-ups
    state.obstacles.forEach(obs => scene.remove(obs));
    state.flies.forEach(fly => scene.remove(fly));
    state.powerups.forEach(p => scene.remove(p));
    state.obstacles = [];
    state.flies = [];
    state.powerups = [];

    // Reset invincibility
    state.isInvincible = false;
    state.invincibleEndTime = 0;
    lizardMaterial.emissive.setHex(0x000000);
    lizardMaterial.emissiveIntensity = 0;

    // Reset lizard position
    lizardGroup.position.set(0, 0, 0);

    // Hide overlays
    document.getElementById('start-screen').classList.add('hidden');
    document.getElementById('game-over-screen').classList.add('hidden');

    updateHUD();
    startMusic();
}

function gameOver() {
    state.isRunning = false;
    state.isGameOver = true;

    document.getElementById('final-score').textContent = state.score;
    document.getElementById('game-over-screen').classList.remove('hidden');
    stopMusic();
    playCrashSound();
}

// ============ EVENT LISTENERS ============
document.getElementById('start-btn').addEventListener('click', startGame);
document.getElementById('restart-btn').addEventListener('click', startGame);

document.addEventListener('keydown', (e) => {
    if ((e.key === ' ' || e.key === 'Enter') && !state.isRunning) {
        startGame();
    }
});

window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

// ============ START ============
animate();
