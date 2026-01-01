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
        this.addTouchClass();
        this.createJoystickElements();
        this.createActionButtons(); // Lisätään toimintnapit
        this.hidePCInstructions();  // Piilotetaan PC-ohjeet
        this.addEventListeners();
    }

    hidePCInstructions() {
        // Hide standard PC control hints
        const hints = document.querySelector('.bottom-controls');
        if (hints) hints.style.display = 'none';

        // Show mobile hint
        const mobileHint = document.createElement('div');
        mobileHint.style.cssText = `
            position: absolute;
            bottom: 10px;
            left: 50%;
            transform: translateX(-50%);
            color: rgba(255,255,255,0.7);
            font-size: 12px;
            text-shadow: 1px 1px 2px black;
            pointer-events: none;
            text-align: center;
            width: 100%;
        `;
        mobileHint.innerText = "Vasen: Liiku | Oikea: Käänny";
        document.getElementById('game-ui').appendChild(mobileHint);
    }

    createActionButtons() {
        // Create interaction button (E key substitute)
        const actionBtn = document.createElement('button');
        actionBtn.id = 'mobile-action-btn';
        actionBtn.innerHTML = '🖐️'; // Hand icon for interaction
        actionBtn.style.cssText = `
            position: absolute;
            bottom: 40px;
            right: 40px;
            width: 80px;
            height: 80px;
            background: rgba(255, 255, 255, 0.3);
            border: 3px solid rgba(255, 255, 255, 0.6);
            border-radius: 50%;
            font-size: 40px;
            cursor: pointer;
            z-index: 1000;
            display: flex;
            align-items: center;
            justify-content: center;
            user-select: none;
            -webkit-user-select: none;
            touch-action: manipulation;
        `;

        // Visual feedback
        actionBtn.addEventListener('touchstart', (e) => {
            e.preventDefault();
            e.stopPropagation();
            actionBtn.style.background = 'rgba(255, 255, 255, 0.6)';
            actionBtn.style.transform = 'scale(0.95)';
            // Trigger interaction
            this.triggerInteraction();
        }, { passive: false });

        actionBtn.addEventListener('touchend', (e) => {
            e.preventDefault();
            actionBtn.style.background = 'rgba(255, 255, 255, 0.3)';
            actionBtn.style.transform = 'scale(1)';
        });

        document.getElementById('game-ui').appendChild(actionBtn);
    }

    triggerInteraction() {
        // Simulate 'E' key press logic
        if (this.game.player) {
            // Find nearest object manually since 'E' listener is elsewhere
            const nearest = this.game.player.getNearestInteractable();
            if (nearest && this.game.ui) {
                // Call UI handler directly as if E was pressed
                this.game.ui.handleInteraction(nearest);

                // Visual feedback for successful interaction
                const btn = document.getElementById('mobile-action-btn');
                if (btn) btn.style.borderColor = '#4CAF50';
                setTimeout(() => { if (btn) btn.style.borderColor = 'rgba(255, 255, 255, 0.6)'; }, 300);
            }
        }
    }

    createJoystickElements() {
        // Joystick container
        const zone = document.createElement('div');
        zone.id = 'joystick-zone';
        zone.style.cssText = `
            position: absolute;
            bottom: 40px;
            left: 40px;
            width: 140px;
            height: 140px;
            z-index: 1000;
            touch-action: none;
            background: rgba(0, 0, 0, 0.1); 
            border-radius: 50%;
        `;

        // Joystick Base
        const base = document.createElement('div');
        base.style.cssText = `
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: 100%;
            height: 100%;
            background: rgba(255, 255, 255, 0.2);
            border: 2px solid rgba(255, 255, 255, 0.5);
            border-radius: 50%;
            pointer-events: none;
            box-shadow: 0 0 10px rgba(0,0,0,0.2);
        `;

        // Joystick Stick - More visible
        const stick = document.createElement('div');
        stick.style.cssText = `
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: 50px;
            height: 50px;
            background: rgba(255, 255, 255, 0.9);
            border: 1px solid #ccc;
            border-radius: 50%;
            pointer-events: none;
            transition: transform 0.1s;
            box-shadow: 0 4px 6px rgba(0,0,0,0.3);
        `;

        // Add label "LIIKU"
        const label = document.createElement('div');
        label.innerText = "LIIKU";
        label.style.cssText = `
            position: absolute;
            top: -30px;
            left: 50%;
            transform: translateX(-50%);
            color: rgba(255,255,255,0.8);
            font-weight: bold;
            font-family: sans-serif;
            text-shadow: 1px 1px 2px black;
            pointer-events: none;
        `;

        zone.appendChild(base);
        zone.appendChild(stick);
        zone.appendChild(label);
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
