/**
 * Western Arena - Western Riding Activity
 * Manages barrel racing and western patterns
 */

import * as THREE from 'three';

export class WesternArena {
    constructor(game) {
        this.game = game;
        this.barrels = [];
        this.currentBarrel = 0;
        this.startTime = 0;
        this.bestTime = null;
        this.isActive = false;
        this.hasStarted = false;
    }

    start(horse) {
        this.horse = horse;
        this.currentBarrel = 0;
        this.hasStarted = false;
        this.isActive = true;

        // Position horse at start line
        horse.mesh.position.set(80, 0, 60);
        horse.mesh.rotation.y = Math.PI;

        // Show western UI
        this.showUI();
    }

    showUI() {
        const hud = document.createElement('div');
        hud.id = 'western-hud';
        hud.innerHTML = `
            <div class="western-info">
                <h3>🤠 Tynnyriratsastus</h3>
                <p class="western-instructions">Kierrä jokainen tynnyri ja palaa maaliin!</p>
                <div class="barrel-progress">
                    <div class="barrel ${this.currentBarrel > 0 ? 'done' : ''}" id="barrel-1">1</div>
                    <div class="barrel ${this.currentBarrel > 1 ? 'done' : ''}" id="barrel-2">2</div>
                    <div class="barrel ${this.currentBarrel > 2 ? 'done' : ''}" id="barrel-3">3</div>
                </div>
                <div class="timer">
                    <span>Aika: </span>
                    <span id="western-time">0.00</span>s
                </div>
                ${this.bestTime ? `<div class="best-time">Paras: ${this.bestTime.toFixed(2)}s</div>` : ''}
            </div>
            <p class="start-hint" id="start-hint">Paina VÄLILYÖNTI aloittaaksesi!</p>
            <button id="stop-western" class="stop-btn">Lopeta</button>
        `;

        const styles = document.createElement('style');
        styles.id = 'western-styles';
        styles.textContent = `
            #western-hud {
                position: fixed;
                top: 80px;
                right: 20px;
                width: 260px;
                background: rgba(26, 26, 46, 0.95);
                border: 1px solid rgba(139, 0, 0, 0.7);
                border-radius: 12px;
                padding: 16px;
                z-index: 200;
                backdrop-filter: blur(10px);
            }
            .western-info h3 {
                margin: 0 0 8px 0;
                color: #8B0000;
            }
            .western-instructions {
                font-size: 0.875rem;
                color: rgba(255, 255, 255, 0.7);
                margin-bottom: 12px;
            }
            .barrel-progress {
                display: flex;
                justify-content: center;
                gap: 12px;
                margin-bottom: 12px;
            }
            .barrel {
                width: 40px;
                height: 40px;
                display: flex;
                align-items: center;
                justify-content: center;
                background: rgba(139, 0, 0, 0.3);
                border: 2px solid #8B0000;
                border-radius: 50%;
                font-weight: 700;
                transition: all 0.3s ease;
            }
            .barrel.done {
                background: #4ade80;
                border-color: #22c55e;
            }
            .barrel.current {
                animation: pulse 1s ease infinite;
            }
            @keyframes pulse {
                0%, 100% { transform: scale(1); }
                50% { transform: scale(1.1); }
            }
            .timer {
                font-size: 1.25rem;
                text-align: center;
                margin-bottom: 8px;
            }
            #western-time {
                font-weight: 700;
                color: #DAA520;
                font-size: 1.5rem;
            }
            .best-time {
                text-align: center;
                font-size: 0.875rem;
                color: #4ade80;
            }
            .start-hint {
                text-align: center;
                color: #DAA520;
                animation: blink 1s ease infinite;
                margin: 12px 0;
            }
            @keyframes blink {
                0%, 100% { opacity: 1; }
                50% { opacity: 0.5; }
            }
        `;

        document.head.appendChild(styles);
        document.body.appendChild(hud);

        document.getElementById('stop-western').addEventListener('click', () => this.stop());
    }

    hideUI() {
        const hud = document.getElementById('western-hud');
        const styles = document.getElementById('western-styles');
        if (hud) hud.remove();
        if (styles) styles.remove();
    }

    update(delta) {
        if (!this.isActive) return;

        // Check for start
        if (!this.hasStarted && this.game.keys.jump) {
            this.startRace();
        }

        if (this.hasStarted) {
            // Update timer
            const elapsed = (Date.now() - this.startTime) / 1000;
            document.getElementById('western-time').textContent = elapsed.toFixed(2);

            // Check barrel progress
            this.checkBarrels();
        }
    }

    startRace() {
        this.hasStarted = true;
        this.startTime = Date.now();

        document.getElementById('start-hint').style.display = 'none';
        document.getElementById('barrel-1').classList.add('current');

        this.game.ui.showNotification('Lähtö! 🏃‍♂️💨');
    }

    checkBarrels() {
        const horsePos = this.horse.mesh.position;

        // Barrel positions (matching arena creation)
        const barrelPositions = [
            { x: 80, z: 25 },  // Top barrel
            { x: 70, z: 50 },  // Left barrel  
            { x: 90, z: 50 }   // Right barrel
        ];

        if (this.currentBarrel < barrelPositions.length) {
            const barrel = barrelPositions[this.currentBarrel];
            const distance = Math.sqrt(
                Math.pow(horsePos.x - barrel.x, 2) +
                Math.pow(horsePos.z - barrel.z, 2)
            );

            if (distance < 3) {
                this.passBarrel();
            }
        } else {
            // Check if back at finish line
            if (horsePos.z > 55) {
                this.finish();
            }
        }
    }

    passBarrel() {
        document.getElementById(`barrel-${this.currentBarrel + 1}`).classList.remove('current');
        document.getElementById(`barrel-${this.currentBarrel + 1}`).classList.add('done');

        this.currentBarrel++;

        if (this.currentBarrel < 3) {
            document.getElementById(`barrel-${this.currentBarrel + 1}`).classList.add('current');
            this.game.ui.showNotification(`Tynnyri ${this.currentBarrel}/3 ✓`);
        } else {
            this.game.ui.showNotification('Kaikki tynnyrit! Palaa maaliin! 🏁');
        }
    }

    finish() {
        const finalTime = (Date.now() - this.startTime) / 1000;

        let message = `Aika: ${finalTime.toFixed(2)}s`;

        if (!this.bestTime || finalTime < this.bestTime) {
            this.bestTime = finalTime;
            message += ' - Uusi ennätys! 🏆';
        }

        this.game.ui.showNotification(message);

        setTimeout(() => this.stop(), 2000);
    }

    stop() {
        this.isActive = false;
        this.hasStarted = false;
        this.hideUI();

        this.game.player.dismountHorse();
        this.horse.moveToStall();
    }
}
