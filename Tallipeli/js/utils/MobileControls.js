/**
 * MobileControls - Touch controls for mobile devices
 * Adds a virtual joystick and touch rotation
 */

export class MobileControls {
    constructor(game) {
        this.game = game;
        this.joystick = {
            active: false,
            base: null,
            stick: null,
            origin: { x: 0, y: 0 },
            current: { x: 0, y: 0 },
            vector: { x: 0, y: 0 },
            maxRadius: 50
        };

        this.touchLook = {
            active: false,
            lastX: 0,
            lastY: 0,
            sensitivity: 0.005
        };

        this.init();
    }

    init() {
        // Only initialize on touch devices
        if (!('ontouchstart' in window) && navigator.maxTouchPoints === 0) return;

        console.log("Initializing Mobile Controls");
        this.createJoystickElements();
        this.addEventListeners();
        this.addTouchClass();
    }

    addTouchClass() {
        document.body.classList.add('touch-device');
    }

    createJoystickElements() {
        // Joystick container
        const zone = document.createElement('div');
        zone.id = 'joystick-zone';
        zone.style.cssText = `
            position: absolute;
            bottom: 20px;
            left: 20px;
            width: 150px;
            height: 150px;
            z-index: 1000;
            touch-action: none;
        `;

        // Joystick Base
        const base = document.createElement('div');
        base.style.cssText = `
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: 100px;
            height: 100px;
            background: rgba(255, 255, 255, 0.2);
            border: 2px solid rgba(255, 255, 255, 0.4);
            border-radius: 50%;
            pointer-events: none;
        `;

        // Joystick Stick
        const stick = document.createElement('div');
        stick.style.cssText = `
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: 40px;
            height: 40px;
            background: rgba(255, 255, 255, 0.8);
            border-radius: 50%;
            pointer-events: none;
            transition: transform 0.1s;
        `;

        zone.appendChild(base);
        zone.appendChild(stick);
        document.getElementById('game-ui').appendChild(zone);

        this.joystick.base = base;
        this.joystick.stick = stick;
        this.joystick.element = zone;
    }

    addEventListeners() {
        const zone = this.joystick.element;

        // Joystick events (Left side of screen)
        zone.addEventListener('touchstart', (e) => {
            e.preventDefault();
            const touch = e.changedTouches[0];
            this.joystick.active = true;
            this.joystick.origin = { x: touch.clientX, y: touch.clientY };
            this.joystick.current = { x: touch.clientX, y: touch.clientY };
            this.updateJoystickVisuals();
        }, { passive: false });

        zone.addEventListener('touchmove', (e) => {
            e.preventDefault();
            if (!this.joystick.active) return;

            const touch = e.changedTouches[0];
            this.joystick.current = { x: touch.clientX, y: touch.clientY };

            // Calculate vector
            const dx = this.joystick.current.x - this.joystick.origin.x;
            const dy = this.joystick.current.y - this.joystick.origin.y;

            // Normalize and cap at maxRadius
            const distance = Math.sqrt(dx * dx + dy * dy);
            const angle = Math.atan2(dy, dx);

            const cappedDist = Math.min(distance, this.joystick.maxRadius);

            this.joystick.vector = {
                x: (Math.cos(angle) * cappedDist) / this.joystick.maxRadius,
                y: (Math.sin(angle) * cappedDist) / this.joystick.maxRadius
            };

            this.updateJoystickVisuals(cappedDist * Math.cos(angle), cappedDist * Math.sin(angle));
            this.updateGameMovement();
        }, { passive: false });

        const endJoystick = (e) => {
            if (!this.joystick.active) return;
            this.joystick.active = false;
            this.joystick.vector = { x: 0, y: 0 };
            this.updateJoystickVisuals(0, 0);
            this.updateGameMovement();
        };

        zone.addEventListener('touchend', endJoystick);
        zone.addEventListener('touchcancel', endJoystick);

        // Camera Look Events (Right side of screen + general)
        document.addEventListener('touchstart', (e) => {
            // Check if touch is NOT on joystick and NOT on UI buttons
            const touch = e.changedTouches[0];
            const target = e.target;

            if (target.closest('#joystick-zone') || target.closest('button') || target.closest('.action-menu')) return;

            // Only use right side of screen for looking, or anywhere if not joystick
            if (touch.clientX > window.innerWidth / 2) {
                this.touchLook.active = true;
                this.touchLook.id = touch.identifier;
                this.touchLook.lastX = touch.clientX;
                this.touchLook.lastY = touch.clientY;
            }
        });

        document.addEventListener('touchmove', (e) => {
            if (!this.touchLook.active) return;

            for (let i = 0; i < e.changedTouches.length; i++) {
                const touch = e.changedTouches[i];
                if (touch.identifier === this.touchLook.id) {
                    const dx = touch.clientX - this.touchLook.lastX;
                    const dy = touch.clientY - this.touchLook.lastY;

                    this.rotateCamera(dx, dy);

                    this.touchLook.lastX = touch.clientX;
                    this.touchLook.lastY = touch.clientY;
                    break;
                }
            }
        });

        const endLook = (e) => {
            for (let i = 0; i < e.changedTouches.length; i++) {
                if (e.changedTouches[i].identifier === this.touchLook.id) {
                    this.touchLook.active = false;
                }
            }
        };

        document.addEventListener('touchend', endLook);
        document.addEventListener('touchcancel', endLook);
    }

    updateJoystickVisuals(dx = 0, dy = 0) {
        this.joystick.stick.style.transform = `translate(calc(-50% + ${dx}px), calc(-50% + ${dy}px))`;
    }

    updateGameMovement() {
        // Map joystick vector to game keys
        const threshold = 0.2;
        const v = this.joystick.vector;

        // Reset keys
        this.game.keys.forward = false;
        this.game.keys.backward = false;
        this.game.keys.left = false;
        this.game.keys.right = false;

        if (v.y < -threshold) this.game.keys.forward = true;
        if (v.y > threshold) this.game.keys.backward = true;
        if (v.x < -threshold) this.game.keys.left = true;
        if (v.x > threshold) this.game.keys.right = true;
    }

    rotateCamera(dx, dy) {
        if (!this.game.player) return;

        // Directly rotate player object (yaw)
        // this.game.player.rotation -= dx * this.touchLook.sensitivity;

        // If usign OrbitControls (current setup), rotate them
        if (this.game.controls && this.game.controls.enabled) {
            // OrbitControls handles its own touch, but we might need custom logic if we switch to FPS
            // For now, let OrbitControls handle it naturally or help it
        } else {
            // FPS style rotation for Player class
            // This needs to interface with however Player handles rotation
            if (this.game.player.rotate) {
                this.game.player.rotate(-dx * 0.005);
            }
        }
    }
}
