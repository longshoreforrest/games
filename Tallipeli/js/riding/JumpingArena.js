/**
 * Jumping Arena - Show Jumping Activity
 * Manages the jumping course and competition
 */

import * as THREE from 'three';

export class JumpingArena {
    constructor(game) {
        this.game = game;
        this.jumps = [];
        this.currentJumpIndex = 0;
        this.score = 0;
        this.faults = 0;
        this.timeLimit = 90; // seconds
        this.timeRemaining = this.timeLimit;
        this.isActive = false;
    }

    start(horse) {
        this.horse = horse;
        this.currentJumpIndex = 0;
        this.score = 0;
        this.faults = 0;
        this.timeRemaining = this.timeLimit;
        this.isActive = true;

        // Position horse at start
        horse.mesh.position.set(80, 0, -25);
        horse.mesh.rotation.y = 0;

        // Show jumping UI
        this.showUI();

        // Start timer
        this.startTimer();
    }

    showUI() {
        // Create jumping HUD
        const hud = document.createElement('div');
        hud.id = 'jumping-hud';
        hud.innerHTML = `
            <div class="jumping-stats">
                <div class="jump-stat">
                    <span class="stat-label">Aika</span>
                    <span class="stat-value" id="jump-time">${this.timeLimit}</span>s
                </div>
                <div class="jump-stat">
                    <span class="stat-label">Este</span>
                    <span class="stat-value" id="jump-current">1</span>/5
                </div>
                <div class="jump-stat">
                    <span class="stat-label">Virheet</span>
                    <span class="stat-value" id="jump-faults">0</span>
                </div>
            </div>
            <button id="stop-jumping" class="stop-btn">Lopeta</button>
        `;

        // Add styles
        const styles = document.createElement('style');
        styles.id = 'jumping-styles';
        styles.textContent = `
            #jumping-hud {
                position: fixed;
                top: 80px;
                right: 20px;
                background: rgba(26, 26, 46, 0.9);
                border: 1px solid rgba(218, 165, 32, 0.5);
                border-radius: 12px;
                padding: 16px;
                z-index: 200;
                backdrop-filter: blur(10px);
            }
            .jumping-stats {
                display: flex;
                gap: 20px;
            }
            .jump-stat {
                text-align: center;
            }
            .stat-label {
                display: block;
                font-size: 0.75rem;
                color: rgba(255, 255, 255, 0.6);
                margin-bottom: 4px;
            }
            .stat-value {
                font-size: 1.5rem;
                font-weight: 700;
                color: #DAA520;
            }
            .stop-btn {
                display: block;
                width: 100%;
                margin-top: 12px;
                padding: 8px;
                font-family: inherit;
                font-size: 0.875rem;
                background: rgba(248, 113, 113, 0.3);
                border: 1px solid #f87171;
                border-radius: 8px;
                color: #fff;
                cursor: pointer;
                transition: all 0.2s ease;
            }
            .stop-btn:hover {
                background: rgba(248, 113, 113, 0.5);
            }
        `;

        document.head.appendChild(styles);
        document.body.appendChild(hud);

        document.getElementById('stop-jumping').addEventListener('click', () => this.stop());
    }

    hideUI() {
        const hud = document.getElementById('jumping-hud');
        const styles = document.getElementById('jumping-styles');
        if (hud) hud.remove();
        if (styles) styles.remove();
    }

    startTimer() {
        this.timerInterval = setInterval(() => {
            this.timeRemaining--;
            document.getElementById('jump-time').textContent = this.timeRemaining;

            if (this.timeRemaining <= 0) {
                this.finish();
            }
        }, 1000);
    }

    update(delta) {
        if (!this.isActive) return;

        // Check for jump collisions
        this.checkJumps();
    }

    checkJumps() {
        const horsePos = this.horse.mesh.position;

        // Jump positions (matching arena creation)
        const jumpPositions = [
            { x: 80, z: -20, cleared: false },
            { x: 70, z: -10, cleared: false },
            { x: 90, z: 0, cleared: false },
            { x: 75, z: 10, cleared: false },
            { x: 85, z: 20, cleared: false }
        ];

        // Check if horse is near next jump
        if (this.currentJumpIndex < jumpPositions.length) {
            const jump = jumpPositions[this.currentJumpIndex];
            const distance = Math.sqrt(
                Math.pow(horsePos.x - jump.x, 2) +
                Math.pow(horsePos.z - jump.z, 2)
            );

            if (distance < 3) {
                // Check if horse is jumping (space pressed while riding)
                if (this.game.keys.jump) {
                    this.clearJump();
                } else {
                    this.knockJump();
                }
            }
        }
    }

    clearJump() {
        this.currentJumpIndex++;
        document.getElementById('jump-current').textContent =
            Math.min(this.currentJumpIndex + 1, 5);

        this.game.ui.showNotification('Puhdas hyppy! 🎉');

        if (this.currentJumpIndex >= 5) {
            this.finish();
        }
    }

    knockJump() {
        this.faults++;
        document.getElementById('jump-faults').textContent = this.faults;
        this.currentJumpIndex++;
        document.getElementById('jump-current').textContent =
            Math.min(this.currentJumpIndex + 1, 5);

        this.game.ui.showNotification('Este putosi! ❌');

        if (this.currentJumpIndex >= 5) {
            this.finish();
        }
    }

    finish() {
        clearInterval(this.timerInterval);

        const timeUsed = this.timeLimit - this.timeRemaining;
        const finalScore = Math.max(0, 100 - (this.faults * 10) - Math.floor(timeUsed / 5));

        this.game.ui.showNotification(
            `Rata suoritettu! Pisteet: ${finalScore}, Virheet: ${this.faults}, Aika: ${timeUsed}s`
        );

        this.stop();
    }

    stop() {
        this.isActive = false;
        clearInterval(this.timerInterval);
        this.hideUI();

        // Dismount horse
        this.game.player.dismountHorse();
        this.horse.moveToStall();
    }
}
