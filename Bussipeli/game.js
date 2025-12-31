// Bussipeli - Loputon versio
// Three.js -pohjainen peli

// Globaalit muuttujat
let scene, camera, renderer;
let bus;
let steeringAngle = 0;
let speed = 0;
let maxSpeed = 40;
let acceleration = 0.4;
let friction = 0.98;
let turnSpeed = 0.015;
let isAccelerating = false;
let isReversing = false;

// Ratin ohjaus
let steeringWheel;
let isDraggingSteering = false;
let steeringRotation = 0;
let lastMouseX = 0;

// Ääni
let audioContext;
let engineOsc;
let engineGain;
let audioStarted = false;

// Maailman objektit (kierrätettävät)
let buildings = [];
let roadLines = [];
let busStops = [];
let traffic = [];  // Vastaantuleva liikenne
let totalDistance = 0;

// Matkustajat
let passengers = 0;
let isAtBusStop = false;
let boardingTimer = 0;

// Pelin tila
let gameOver = false;
let score = 0;


// Alustus
function init() {
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x87ceeb);
    scene.fog = new THREE.Fog(0x87ceeb, 80, 250);

    camera = new THREE.PerspectiveCamera(
        60,
        window.innerWidth / window.innerHeight,
        0.1,
        300
    );
    camera.position.set(0, 12, 20);
    camera.lookAt(0, 0, -10);

    const canvas = document.getElementById('game-canvas');
    renderer = new THREE.WebGLRenderer({ canvas, antialias: false });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(1);

    // Valot
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
    scene.add(ambientLight);
    const dirLight = new THREE.DirectionalLight(0xffffff, 0.8);
    dirLight.position.set(30, 50, 30);
    scene.add(dirLight);

    // Luo maailma
    createGround();
    createRoad();
    createBus();
    createBuildings();
    createRoadLines();
    createBusStops();
    createTraffic();
    createPassengerUI();

    setupControls();
    window.addEventListener('resize', onWindowResize);
    animate();
}


function createGround() {
    // Iso maa joka liikkuu bussin mukana
    const groundGeometry = new THREE.PlaneGeometry(400, 600);
    const groundMaterial = new THREE.MeshLambertMaterial({ color: 0x4a7c59 });
    const ground = new THREE.Mesh(groundGeometry, groundMaterial);
    ground.rotation.x = -Math.PI / 2;
    ground.position.set(0, 0, -100);
    ground.name = 'ground';
    scene.add(ground);
}

function createRoad() {
    // Pitkä tie
    const roadGeometry = new THREE.PlaneGeometry(18, 600);
    const roadMaterial = new THREE.MeshLambertMaterial({ color: 0x333333 });
    const road = new THREE.Mesh(roadGeometry, roadMaterial);
    road.rotation.x = -Math.PI / 2;
    road.position.set(0, 0.01, -100);
    road.name = 'road';
    scene.add(road);

    // Reunaviivat
    const edgeMaterial = new THREE.MeshBasicMaterial({ color: 0xffff00 });

    const leftEdge = new THREE.Mesh(new THREE.PlaneGeometry(0.2, 600), edgeMaterial);
    leftEdge.rotation.x = -Math.PI / 2;
    leftEdge.position.set(-8.5, 0.02, -100);
    leftEdge.name = 'leftEdge';
    scene.add(leftEdge);

    const rightEdge = new THREE.Mesh(new THREE.PlaneGeometry(0.2, 600), edgeMaterial);
    rightEdge.rotation.x = -Math.PI / 2;
    rightEdge.position.set(8.5, 0.02, -100);
    rightEdge.name = 'rightEdge';
    scene.add(rightEdge);
}

function createRoadLines() {
    // Keskiviivat - kierrätettävät
    const lineMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });

    for (let i = 0; i < 30; i++) {
        const line = new THREE.Mesh(
            new THREE.PlaneGeometry(0.3, 6),
            lineMaterial
        );
        line.rotation.x = -Math.PI / 2;
        line.position.set(0, 0.02, -i * 15);
        scene.add(line);
        roadLines.push(line);
    }
}

function createBus() {
    bus = new THREE.Group();

    const bodyMaterial = new THREE.MeshLambertMaterial({ color: 0xcc0000 });

    // Alaosa
    const lowerBody = new THREE.Mesh(new THREE.BoxGeometry(3.8, 1, 10), bodyMaterial);
    lowerBody.position.y = 0.9;
    bus.add(lowerBody);

    // Yläosa
    const upperBody = new THREE.Mesh(new THREE.BoxGeometry(3.5, 2.2, 9.5), bodyMaterial);
    upperBody.position.y = 2.5;
    bus.add(upperBody);

    // Katto
    const roof = new THREE.Mesh(
        new THREE.BoxGeometry(3.6, 0.2, 9.6),
        new THREE.MeshLambertMaterial({ color: 0x990000 })
    );
    roof.position.y = 3.7;
    bus.add(roof);

    // Etuikkuna
    const windowMaterial = new THREE.MeshBasicMaterial({ color: 0x88c0d0 });
    const frontWindow = new THREE.Mesh(new THREE.BoxGeometry(3, 1.4, 0.1), windowMaterial);
    frontWindow.position.set(0, 2.6, -4.8);
    bus.add(frontWindow);

    // Sivuikkunat
    for (let i = 0; i < 2; i++) {
        const sideWindow = new THREE.Mesh(new THREE.BoxGeometry(0.1, 1.2, 3.5), windowMaterial);
        sideWindow.position.set(-1.8, 2.6, -2 + i * 4);
        bus.add(sideWindow);
        const rightWindow = sideWindow.clone();
        rightWindow.position.x = 1.8;
        bus.add(rightWindow);
    }

    // Valot
    const lightMaterial = new THREE.MeshBasicMaterial({ color: 0xffffcc });
    const headlight1 = new THREE.Mesh(new THREE.BoxGeometry(0.4, 0.3, 0.1), lightMaterial);
    headlight1.position.set(-1.2, 1, -5.05);
    bus.add(headlight1);
    const headlight2 = headlight1.clone();
    headlight2.position.x = 1.2;
    bus.add(headlight2);

    const tailMaterial = new THREE.MeshBasicMaterial({ color: 0xff2222 });
    const taillight1 = new THREE.Mesh(new THREE.BoxGeometry(0.4, 0.3, 0.1), tailMaterial);
    taillight1.position.set(-1.2, 1, 5.05);
    bus.add(taillight1);
    const taillight2 = taillight1.clone();
    taillight2.position.x = 1.2;
    bus.add(taillight2);

    // Renkaat
    const wheelMaterial = new THREE.MeshLambertMaterial({ color: 0x1a1a1a });
    const wheelPositions = [[-2, 0.5, -3.5], [2, 0.5, -3.5], [-2, 0.5, 3.5], [2, 0.5, 3.5]];
    wheelPositions.forEach(pos => {
        const wheel = new THREE.Mesh(new THREE.CylinderGeometry(0.5, 0.5, 0.4, 8), wheelMaterial);
        wheel.rotation.z = Math.PI / 2;
        wheel.position.set(...pos);
        bus.add(wheel);
    });

    // Kyltti
    const sign = new THREE.Mesh(
        new THREE.BoxGeometry(2, 0.4, 0.1),
        new THREE.MeshBasicMaterial({ color: 0xff6600 })
    );
    sign.position.set(0, 3.5, -4.8);
    bus.add(sign);

    scene.add(bus);
}

function createBuildings() {
    const colors = [0xd4c4a8, 0xc9b8a0, 0xe8dcc8, 0xaaaaaa, 0x999999, 0xbbaa99, 0xd0c0b0];

    // Luo paljon taloja jotka kierrätetään
    for (let i = 0; i < 40; i++) {
        const side = i % 2 === 0 ? -1 : 1;  // Vasen tai oikea
        const color = colors[Math.floor(Math.random() * colors.length)];
        const height = 6 + Math.random() * 12;
        const width = 6 + Math.random() * 5;
        const depth = 6 + Math.random() * 5;

        const building = new THREE.Mesh(
            new THREE.BoxGeometry(width, height, depth),
            new THREE.MeshLambertMaterial({ color: color })
        );

        building.position.set(
            side * (18 + Math.random() * 12),
            height / 2,
            -i * 12  // Alkupositio
        );
        building.userData.baseZ = -i * 12;

        scene.add(building);
        buildings.push(building);
    }
}

function createBusStops() {
    // Luo 5 bussipysäkkiä jotka kierrätetään
    for (let i = 0; i < 5; i++) {
        const stopGroup = new THREE.Group();

        // Tolppa
        const poleMaterial = new THREE.MeshLambertMaterial({ color: 0x666666 });
        const pole = new THREE.Mesh(
            new THREE.CylinderGeometry(0.12, 0.12, 3.5, 6),
            poleMaterial
        );
        pole.position.y = 1.75;
        stopGroup.add(pole);

        // Kyltti (sininen)
        const signMaterial = new THREE.MeshLambertMaterial({ color: 0x0066cc });
        const sign = new THREE.Mesh(
            new THREE.BoxGeometry(1.2, 1.2, 0.1),
            signMaterial
        );
        sign.position.y = 3.2;
        stopGroup.add(sign);

        // Bussi-ikoni (keltainen)
        const iconMaterial = new THREE.MeshBasicMaterial({ color: 0xffcc00 });
        const icon = new THREE.Mesh(
            new THREE.BoxGeometry(0.6, 0.4, 0.12),
            iconMaterial
        );
        icon.position.set(0, 3.2, 0.06);
        stopGroup.add(icon);

        // Odottavat matkustajat (ihmishahmot)
        const numWaiting = 1 + Math.floor(Math.random() * 3);
        stopGroup.userData.waitingPassengers = numWaiting;

        for (let p = 0; p < numWaiting; p++) {
            const person = createPersonFigure();
            person.position.set(1 + p * 1.2, 0, 0);
            stopGroup.add(person);
        }


        // Sijoita pysäkki
        stopGroup.position.set(12, 0, -80 - i * 100);
        stopGroup.userData.hasPassengers = true;

        scene.add(stopGroup);
        busStops.push(stopGroup);
    }
}

function createTraffic() {
    // Luo 6 ajoneuvoa (autoja ja rekkoja)
    for (let i = 0; i < 6; i++) {
        const isTruck = Math.random() > 0.6;  // 40% rekkoja
        const vehicle = isTruck ? createTruck() : createCar();

        // Sijoita vasemmalle kaistalle (vastaantulijat)
        vehicle.position.set(-4, 0, -100 - i * 80);
        vehicle.rotation.y = Math.PI; // Käännetty vastakkaiseen suuntaan
        vehicle.userData.isTruck = isTruck;
        vehicle.userData.speed = 15 + Math.random() * 10;

        scene.add(vehicle);
        traffic.push(vehicle);
    }
}

function createCar() {
    const car = new THREE.Group();

    // Satunnainen väri
    const carColors = [0x3366cc, 0xcc3333, 0x33cc33, 0xcccc33, 0xffffff, 0x333333, 0x9933cc];
    const color = carColors[Math.floor(Math.random() * carColors.length)];

    const bodyMaterial = new THREE.MeshLambertMaterial({ color: color });

    // Auton runko
    const body = new THREE.Mesh(
        new THREE.BoxGeometry(2, 0.8, 4),
        bodyMaterial
    );
    body.position.y = 0.6;
    car.add(body);

    // Katto
    const roof = new THREE.Mesh(
        new THREE.BoxGeometry(1.6, 0.6, 2),
        bodyMaterial
    );
    roof.position.set(0, 1.2, -0.3);
    car.add(roof);

    // Ikkunat
    const windowMaterial = new THREE.MeshBasicMaterial({ color: 0x88ccff });
    const frontWindow = new THREE.Mesh(
        new THREE.BoxGeometry(1.4, 0.5, 0.1),
        windowMaterial
    );
    frontWindow.position.set(0, 1.1, 0.75);
    car.add(frontWindow);

    // Renkaat
    const wheelMaterial = new THREE.MeshLambertMaterial({ color: 0x1a1a1a });
    const wheelPositions = [[-0.9, 0.3, -1.2], [0.9, 0.3, -1.2], [-0.9, 0.3, 1.2], [0.9, 0.3, 1.2]];
    wheelPositions.forEach(pos => {
        const wheel = new THREE.Mesh(
            new THREE.CylinderGeometry(0.3, 0.3, 0.2, 8),
            wheelMaterial
        );
        wheel.rotation.z = Math.PI / 2;
        wheel.position.set(...pos);
        car.add(wheel);
    });

    // Ajovalot
    const lightMaterial = new THREE.MeshBasicMaterial({ color: 0xffffcc });
    const light1 = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.2, 0.1), lightMaterial);
    light1.position.set(-0.6, 0.5, 2.05);
    car.add(light1);
    const light2 = light1.clone();
    light2.position.x = 0.6;
    car.add(light2);

    return car;
}

function createTruck() {
    const truck = new THREE.Group();

    // Ohjaamo (punainen)
    const cabMaterial = new THREE.MeshLambertMaterial({ color: 0xcc2222 });
    const cab = new THREE.Mesh(
        new THREE.BoxGeometry(2.4, 1.5, 2.5),
        cabMaterial
    );
    cab.position.set(0, 1, 2.5);
    truck.add(cab);

    // Lasti (valkoinen/harmaa)
    const cargoMaterial = new THREE.MeshLambertMaterial({ color: 0xdddddd });
    const cargo = new THREE.Mesh(
        new THREE.BoxGeometry(2.6, 2.2, 6),
        cargoMaterial
    );
    cargo.position.set(0, 1.3, -1.5);
    truck.add(cargo);

    // Ikkuna
    const windowMaterial = new THREE.MeshBasicMaterial({ color: 0x88ccff });
    const frontWindow = new THREE.Mesh(
        new THREE.BoxGeometry(2, 0.8, 0.1),
        windowMaterial
    );
    frontWindow.position.set(0, 1.5, 3.8);
    truck.add(frontWindow);

    // Renkaat
    const wheelMaterial = new THREE.MeshLambertMaterial({ color: 0x1a1a1a });
    const wheelPositions = [
        [-1.1, 0.4, 3], [1.1, 0.4, 3],  // Etu
        [-1.1, 0.4, -1], [1.1, 0.4, -1],  // Keski
        [-1.1, 0.4, -3.5], [1.1, 0.4, -3.5]  // Taka
    ];
    wheelPositions.forEach(pos => {
        const wheel = new THREE.Mesh(
            new THREE.CylinderGeometry(0.45, 0.45, 0.3, 8),
            wheelMaterial
        );
        wheel.rotation.z = Math.PI / 2;
        wheel.position.set(...pos);
        truck.add(wheel);
    });

    // Valot
    const lightMaterial = new THREE.MeshBasicMaterial({ color: 0xffffcc });
    const light1 = new THREE.Mesh(new THREE.BoxGeometry(0.4, 0.3, 0.1), lightMaterial);
    light1.position.set(-0.8, 0.7, 3.8);
    truck.add(light1);
    const light2 = light1.clone();
    light2.position.x = 0.8;
    truck.add(light2);

    return truck;
}

function createPersonFigure() {
    const person = new THREE.Group();

    // Satunnainen vaatteiden väri
    const shirtColors = [0x3366ff, 0xff6633, 0x33cc66, 0xcc33cc, 0xffcc00, 0x6699ff];
    const shirtColor = shirtColors[Math.floor(Math.random() * shirtColors.length)];
    const skinColor = 0xffcc99;

    // Pää
    const headMaterial = new THREE.MeshLambertMaterial({ color: skinColor });
    const head = new THREE.Mesh(
        new THREE.SphereGeometry(0.25, 8, 6),
        headMaterial
    );
    head.position.y = 1.6;
    person.add(head);

    // Vartalo (paita)
    const bodyMaterial = new THREE.MeshLambertMaterial({ color: shirtColor });
    const body = new THREE.Mesh(
        new THREE.CylinderGeometry(0.25, 0.2, 0.7, 8),
        bodyMaterial
    );
    body.position.y = 1.1;
    person.add(body);

    // Jalat (housut - tummat)
    const legMaterial = new THREE.MeshLambertMaterial({ color: 0x333366 });

    const leftLeg = new THREE.Mesh(
        new THREE.CylinderGeometry(0.1, 0.1, 0.7, 6),
        legMaterial
    );
    leftLeg.position.set(-0.12, 0.4, 0);
    person.add(leftLeg);

    const rightLeg = new THREE.Mesh(
        new THREE.CylinderGeometry(0.1, 0.1, 0.7, 6),
        legMaterial
    );
    rightLeg.position.set(0.12, 0.4, 0);
    person.add(rightLeg);

    return person;
}

function createPassengerUI() {

    // Matkustajanäyttö
    const passengerDisplay = document.createElement('div');
    passengerDisplay.id = 'passenger-display';
    passengerDisplay.innerHTML = `
        <div style="font-size: 12px; color: #aaa; text-transform: uppercase;">Matkustajia</div>
        <div id="passenger-count" style="font-size: 36px; font-weight: bold; color: #3366ff;">0</div>
    `;
    passengerDisplay.style.cssText = `
        position: fixed; top: 20px; left: 50%; transform: translateX(-50%);
        background: rgba(0,0,0,0.7); padding: 10px 20px; border-radius: 10px;
        text-align: center; font-family: sans-serif; z-index: 100;
    `;
    document.body.appendChild(passengerDisplay);
}


function setupControls() {
    steeringWheel = document.getElementById('steering-wheel');
    const forwardBtn = document.getElementById('forward-btn');
    const backwardBtn = document.getElementById('backward-btn');


    steeringWheel.addEventListener('mousedown', onSteeringStart);
    document.addEventListener('mousemove', onSteeringMove);
    document.addEventListener('mouseup', onSteeringEnd);
    steeringWheel.addEventListener('touchstart', onSteeringStart);
    document.addEventListener('touchmove', onSteeringMove);
    document.addEventListener('touchend', onSteeringEnd);

    forwardBtn.addEventListener('mousedown', () => { isAccelerating = true; forwardBtn.classList.add('active'); });
    forwardBtn.addEventListener('mouseup', () => { isAccelerating = false; forwardBtn.classList.remove('active'); });
    forwardBtn.addEventListener('mouseleave', () => { isAccelerating = false; forwardBtn.classList.remove('active'); });
    forwardBtn.addEventListener('touchstart', (e) => { e.preventDefault(); isAccelerating = true; forwardBtn.classList.add('active'); });
    forwardBtn.addEventListener('touchend', () => { isAccelerating = false; forwardBtn.classList.remove('active'); });

    backwardBtn.addEventListener('mousedown', () => { isReversing = true; backwardBtn.classList.add('active'); });
    backwardBtn.addEventListener('mouseup', () => { isReversing = false; backwardBtn.classList.remove('active'); });
    backwardBtn.addEventListener('mouseleave', () => { isReversing = false; backwardBtn.classList.remove('active'); });
    backwardBtn.addEventListener('touchstart', (e) => { e.preventDefault(); isReversing = true; backwardBtn.classList.add('active'); });
    backwardBtn.addEventListener('touchend', () => { isReversing = false; backwardBtn.classList.remove('active'); });

    document.addEventListener('keydown', onKeyDown);
    document.addEventListener('keyup', onKeyUp);
}

function onSteeringStart(e) {
    isDraggingSteering = true;
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    lastMouseX = clientX;
    steeringWheel.style.cursor = 'grabbing';
}

function onSteeringMove(e) {
    if (!isDraggingSteering) return;
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const deltaX = clientX - lastMouseX;
    steeringRotation += deltaX * 0.5;
    steeringRotation = Math.max(-90, Math.min(90, steeringRotation));
    steeringWheel.style.transform = `rotate(${steeringRotation}deg)`;
    steeringAngle = steeringRotation / 90;
    lastMouseX = clientX;
}

function onSteeringEnd() {
    isDraggingSteering = false;
    steeringWheel.style.cursor = 'grab';
}

function onKeyDown(e) {
    if (e.key === 'ArrowUp' || e.key === 'w' || e.key === 'W') {
        isAccelerating = true;
        document.getElementById('forward-btn').classList.add('active');
    }
    if (e.key === 'ArrowDown' || e.key === 's' || e.key === 'S') {
        isReversing = true;
        document.getElementById('backward-btn').classList.add('active');
    }
    if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') {
        steeringRotation = -60;
        steeringWheel.style.transform = `rotate(${steeringRotation}deg)`;
        steeringAngle = -0.67;
    }
    if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') {
        steeringRotation = 60;
        steeringWheel.style.transform = `rotate(${steeringRotation}deg)`;
        steeringAngle = 0.67;
    }
}

function onKeyUp(e) {
    if (e.key === 'ArrowUp' || e.key === 'w' || e.key === 'W') {
        isAccelerating = false;
        document.getElementById('forward-btn').classList.remove('active');
    }
    if (e.key === 'ArrowDown' || e.key === 's' || e.key === 'S') {
        isReversing = false;
        document.getElementById('backward-btn').classList.remove('active');
    }
    if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A' ||
        e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') {
        steeringRotation = 0;
        steeringWheel.style.transform = 'rotate(0deg)';
        steeringAngle = 0;
    }
}

function updateBus() {
    // Älä päivitä jos peli on ohi
    if (gameOver) return;

    // Kiihdytys
    if (isAccelerating) {
        speed += acceleration;
        if (speed > maxSpeed) speed = maxSpeed;
    } else if (isReversing) {
        speed -= acceleration;
        if (speed < -maxSpeed / 2) speed = -maxSpeed / 2;
    } else {
        speed *= friction;
        if (Math.abs(speed) < 0.1) speed = 0;
    }

    // Sivuttaisliike (kääntyminen) - VOIMAKKAAMPI
    if (Math.abs(speed) > 0.1) {
        const turnAmount = steeringAngle * 0.15 * (Math.abs(speed) / maxSpeed);
        bus.position.x += turnAmount;
    }

    // Päivitä kokonaismatka
    totalDistance += speed * 0.1;

    // Auttava voima - vedä bussia HITAASTI takaisin tielle (vain jos ei käännetä)
    if (Math.abs(bus.position.x) > 6 && Math.abs(steeringAngle) < 0.1) {
        bus.position.x *= 0.995;  // Paljon hitaampi
    }

    // Rajoita sivuttaisliike
    bus.position.x = Math.max(-12, Math.min(12, bus.position.x));

    // Bussin kallistus käännöksissä (näkyvämpi)
    bus.rotation.z = -steeringAngle * 0.08;

    // Päivitä nopeusnäyttö
    document.getElementById('speed-value').textContent = Math.abs(Math.round(speed * 2));
}


function updateWorld() {
    // Liikuta maailmaa bussin ohi (tämä luo loputtomuuden vaikutelman)
    const moveAmount = speed * 0.1;

    // Siirrä keskiviivoja
    roadLines.forEach(line => {
        line.position.z += moveAmount;

        // Kierrätä viiva alkuun kun se menee liian taakse
        if (line.position.z > 50) {
            line.position.z -= 450;
        } else if (line.position.z < -400) {
            line.position.z += 450;
        }
    });

    // Siirrä taloja
    buildings.forEach(building => {
        building.position.z += moveAmount;

        // Kierrätä talo alkuun kun se menee liian taakse
        if (building.position.z > 80) {
            building.position.z -= 520;
            const side = building.position.x > 0 ? 1 : -1;
            building.position.x = side * (18 + Math.random() * 12);
        } else if (building.position.z < -440) {
            building.position.z += 520;
            const side = building.position.x > 0 ? 1 : -1;
            building.position.x = side * (18 + Math.random() * 12);
        }
    });

    // Siirrä bussipysäkkejä ja tarkista matkustajien nouto
    isAtBusStop = false;

    busStops.forEach(stop => {
        stop.position.z += moveAmount;

        // Kierrätä pysäkki
        if (stop.position.z > 60) {
            stop.position.z -= 520;
            // Palauta matkustajat
            resetBusStopPassengers(stop);
        } else if (stop.position.z < -460) {
            stop.position.z += 520;
            resetBusStopPassengers(stop);
        }

        // Tarkista ollaanko pysäkillä
        const distToStop = Math.abs(stop.position.z);
        const isBusNearStop = distToStop < 12 && Math.abs(bus.position.x - 8) < 6;

        if (isBusNearStop && stop.userData.hasPassengers) {
            // Jos nopeus on matala -> matkustajat nousevat kyytiin
            if (Math.abs(speed) < 2) {
                isAtBusStop = true;
                boardingTimer++;

                // Matkustajat nousevat kun on pysähdytty 1 sekunti
                if (boardingTimer > 60) {
                    const boarding = stop.userData.waitingPassengers || 0;
                    if (boarding > 0) {
                        passengers += boarding;
                        stop.userData.hasPassengers = false;
                        stop.userData.waitingPassengers = 0;

                        // Piilota matkustajat pysäkiltä
                        stop.children.forEach((child, index) => {
                            if (index > 2) {
                                child.visible = false;
                            }
                        });

                        // Päivitä näyttö
                        document.getElementById('passenger-count').textContent = passengers;

                        // Ilmoitus
                        showBoardingMessage(boarding);
                    }
                    boardingTimer = 0;
                }
            }
            // Jos nopeus on KORKEA -> matkustajat kuolevat! 💀
            else if (Math.abs(speed) > 10) {
                const killed = stop.userData.waitingPassengers || 0;
                if (killed > 0) {
                    // Miinuspisteet
                    passengers -= killed * 2;  // Kaksinkertainen rangaistus
                    if (passengers < 0) passengers = 0;

                    stop.userData.hasPassengers = false;
                    stop.userData.waitingPassengers = 0;

                    // Piilota matkustajat
                    stop.children.forEach((child, index) => {
                        if (index > 2) {
                            child.visible = false;
                        }
                    });

                    // Päivitä näyttö
                    document.getElementById('passenger-count').textContent = passengers;

                    // Varoitus!
                    showKillMessage(killed);
                }
            }
        }
    });

    if (!isAtBusStop) {
        boardingTimer = 0;
    }


    // Siirrä vastaantulevaa liikennettä
    traffic.forEach(vehicle => {
        // Liikkuu vastakkaiseen suuntaan + maailma liikkuu
        const vehicleSpeed = vehicle.userData.speed || 20;
        vehicle.position.z += moveAmount + vehicleSpeed * 0.05;

        // Kierrätä ajoneuvo kun se menee ohi
        if (vehicle.position.z > 80) {
            vehicle.position.z -= 550;
            // Vaihtele kaistaa (-4 = vasen, satunnaisesti myös keskelle)
            vehicle.position.x = Math.random() > 0.8 ? 0 : -4;
            vehicle.userData.speed = 15 + Math.random() * 15;
        }

        // TÖRMÄYSTARKISTUS
        const dx = Math.abs(vehicle.position.x - bus.position.x);
        const dz = Math.abs(vehicle.position.z);
        const vehicleLength = vehicle.userData.isTruck ? 5 : 3;

        if (dx < 2.5 && dz < vehicleLength + 5) {
            // TÖRMÄYS!
            triggerGameOver();
        }
    });
}

function triggerGameOver() {
    if (gameOver) return;
    gameOver = true;

    // Pysäytä bussi
    speed = 0;

    // Laske pisteet
    score = passengers * 10 + Math.floor(totalDistance / 10);

    // Näytä Game Over -näyttö
    const overlay = document.createElement('div');
    overlay.id = 'game-over-overlay';
    overlay.innerHTML = `
        <div style="background: rgba(0,0,0,0.9); padding: 40px 60px; border-radius: 20px; text-align: center;">
            <h1 style="color: #ff4444; font-size: 48px; margin: 0;">💥 TÖRMÄYS!</h1>
            <p style="color: white; font-size: 24px; margin: 20px 0;">Peli päättyi</p>
            <div style="color: #aaa; font-size: 18px; margin: 15px 0;">
                <div>🧑 Matkustajia: <span style="color: #3366ff; font-weight: bold;">${passengers}</span></div>
                <div>📏 Matka: <span style="color: #33cc33;">${Math.floor(totalDistance)}</span> m</div>
            </div>
            <div style="color: #ffcc00; font-size: 36px; font-weight: bold; margin: 20px 0;">
                Pisteet: ${score}
            </div>
            <button onclick="restartGame()" style="
                background: linear-gradient(145deg, #2ecc71, #27ae60);
                border: none; color: white; padding: 15px 40px;
                font-size: 20px; border-radius: 10px; cursor: pointer;
                margin-top: 20px;
            ">🔄 Pelaa uudelleen</button>
        </div>
    `;
    overlay.style.cssText = `
        position: fixed; top: 0; left: 0; right: 0; bottom: 0;
        display: flex; align-items: center; justify-content: center;
        background: rgba(0,0,0,0.7); z-index: 1000; font-family: sans-serif;
    `;
    document.body.appendChild(overlay);
}

function restartGame() {
    // Poista game over -näyttö
    const overlay = document.getElementById('game-over-overlay');
    if (overlay) overlay.remove();

    // Nollaa muuttujat
    gameOver = false;
    passengers = 0;
    totalDistance = 0;
    speed = 0;
    score = 0;

    // Päivitä näyttö
    document.getElementById('passenger-count').textContent = '0';

    // Nollaa bussin sijainti
    bus.position.set(0, 0, 0);

    // Nollaa liikenne
    traffic.forEach((vehicle, index) => {
        vehicle.position.z = -100 - index * 80;
        vehicle.position.x = -4;
    });
}


function resetBusStopPassengers(stop) {
    const numWaiting = 1 + Math.floor(Math.random() * 3);
    stop.userData.waitingPassengers = numWaiting;
    stop.userData.hasPassengers = true;

    // Näytä matkustajat taas
    stop.children.forEach((child, index) => {
        if (index > 2) {
            child.visible = index - 3 < numWaiting;
        }
    });
}

function showBoardingMessage(count) {
    const msg = document.createElement('div');
    msg.textContent = `+${count} matkustajaa nousi kyytiin! 🚌`;
    msg.style.cssText = `
        position: fixed; top: 100px; left: 50%; transform: translateX(-50%);
        background: rgba(51, 102, 255, 0.9); color: white; padding: 15px 25px;
        border-radius: 25px; font-family: sans-serif; font-size: 18px;
        font-weight: bold; z-index: 1000; animation: fadeOut 2s forwards;
    `;

    // Lisää CSS animaatio
    if (!document.getElementById('boarding-style')) {
        const style = document.createElement('style');
        style.id = 'boarding-style';
        style.textContent = `
            @keyframes fadeOut {
                0% { opacity: 1; transform: translateX(-50%) translateY(0); }
                100% { opacity: 0; transform: translateX(-50%) translateY(-20px); }
            }
        `;
        document.head.appendChild(style);
    }

    document.body.appendChild(msg);
    setTimeout(() => msg.remove(), 2000);
}

function showKillMessage(count) {
    const msg = document.createElement('div');
    msg.textContent = `💀 ${count} matkustajaa kuoli! -${count * 2} pistettä!`;
    msg.style.cssText = `
        position: fixed; top: 100px; left: 50%; transform: translateX(-50%);
        background: rgba(255, 0, 0, 0.9); color: white; padding: 15px 25px;
        border-radius: 25px; font-family: sans-serif; font-size: 18px;
        font-weight: bold; z-index: 1000; animation: fadeOut 2s forwards;
    `;
    document.body.appendChild(msg);
    setTimeout(() => msg.remove(), 2000);
}

function updateCamera() {
    // Kamera seuraa bussia sivuttain, mutta pysyy paikallaan z-suunnassa
    const targetX = bus.position.x * 0.3;
    camera.position.x += (targetX - camera.position.x) * 0.05;
    camera.position.set(camera.position.x, 10, 18);
    camera.lookAt(bus.position.x * 0.5, 2, -20);
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

function animate() {
    requestAnimationFrame(animate);
    updateBus();
    updateWorld();
    updateCamera();
    updateEngineSound();
    renderer.render(scene, camera);
}

// Aloita peli
window.addEventListener('load', init);

// =====================================
// ÄÄNI-JÄRJESTELMÄ
// =====================================

function startAudio() {
    if (audioStarted) return;

    try {
        audioContext = new (window.AudioContext || window.webkitAudioContext)();

        engineOsc = audioContext.createOscillator();
        engineOsc.type = 'sawtooth';
        engineOsc.frequency.setValueAtTime(35, audioContext.currentTime);

        engineGain = audioContext.createGain();
        engineGain.gain.setValueAtTime(0, audioContext.currentTime);

        const filter = audioContext.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(150, audioContext.currentTime);

        engineOsc.connect(filter);
        filter.connect(engineGain);
        engineGain.connect(audioContext.destination);

        engineOsc.start();
        audioStarted = true;

        // Käynnistä musiikki
        startMusic();

        showAudioMessage();
    } catch (e) {
        console.log('Audio error:', e);
    }
}

function updateEngineSound() {
    if (!audioStarted || !engineOsc) return;

    const absSpeed = Math.abs(speed);
    const speedRatio = absSpeed / maxSpeed;

    const freq = 35 + speedRatio * 60;
    engineOsc.frequency.linearRampToValueAtTime(freq, audioContext.currentTime + 0.1);

    const gain = 0.03 + speedRatio * 0.08;
    engineGain.gain.linearRampToValueAtTime(gain, audioContext.currentTime + 0.1);
}

// =====================================
// MUSIIKKI - Iloinen iskelmätyylinen
// =====================================

let musicPlaying = false;
let melodyInterval;
let bassInterval;

function startMusic() {
    if (musicPlaying) return;
    musicPlaying = true;

    // Melodian nuotit (iloinen, iskelmämäinen)
    const melody = [
        392, 440, 494, 523, 587, 523, 494, 440,  // G4, A4, B4, C5, D5, C5, B4, A4
        523, 587, 659, 587, 523, 494, 440, 392,  // C5, D5, E5, D5, C5, B4, A4, G4
        440, 494, 523, 587, 659, 698, 659, 587,  // A4, B4, C5, D5, E5, F5, E5, D5
        523, 494, 440, 392, 440, 494, 523, 392   // C5, B4, A4, G4, A4, B4, C5, G4
    ];

    // Basso (yksinkertainen)
    const bass = [196, 220, 262, 220, 196, 220, 262, 247]; // G3, A3, C4, A3, G3, A3, C4, B3

    let melodyIndex = 0;
    let bassIndex = 0;

    // Melodia-oskillaattori
    function playMelodyNote() {
        if (!audioStarted || gameOver) return;

        const osc = audioContext.createOscillator();
        const gain = audioContext.createGain();

        osc.type = 'sine';
        osc.frequency.value = melody[melodyIndex];

        gain.gain.setValueAtTime(0.08, audioContext.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.25);

        osc.connect(gain);
        gain.connect(audioContext.destination);

        osc.start();
        osc.stop(audioContext.currentTime + 0.3);

        melodyIndex = (melodyIndex + 1) % melody.length;
    }

    // Basso-oskillaattori
    function playBassNote() {
        if (!audioStarted || gameOver) return;

        const osc = audioContext.createOscillator();
        const gain = audioContext.createGain();

        osc.type = 'triangle';
        osc.frequency.value = bass[bassIndex];

        gain.gain.setValueAtTime(0.12, audioContext.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.4);

        osc.connect(gain);
        gain.connect(audioContext.destination);

        osc.start();
        osc.stop(audioContext.currentTime + 0.5);

        bassIndex = (bassIndex + 1) % bass.length;
    }

    // Käynnistä rytmit
    melodyInterval = setInterval(playMelodyNote, 250);  // 4 nuottia per sekunti
    bassInterval = setInterval(playBassNote, 500);      // 2 nuottia per sekunti
}

function stopMusic() {
    musicPlaying = false;
    if (melodyInterval) clearInterval(melodyInterval);
    if (bassInterval) clearInterval(bassInterval);
}

function showAudioMessage() {
    const msg = document.createElement('div');
    msg.textContent = '🔊🎵 Äänet ja musiikki päällä!';
    msg.style.cssText = `
        position: fixed; top: 80px; left: 50%; transform: translateX(-50%);
        background: rgba(46, 204, 113, 0.9); color: white; padding: 10px 20px;
        border-radius: 20px; font-family: sans-serif; z-index: 1000;
    `;
    document.body.appendChild(msg);
    setTimeout(() => msg.remove(), 2000);
}

document.addEventListener('click', startAudio, { once: true });
document.addEventListener('touchstart', startAudio, { once: true });
document.addEventListener('keydown', startAudio, { once: true });

