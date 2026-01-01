/**
 * Dressage Arena - Dressage Riding Activity
 * Manages dressage movements and scoring
 */

import * as THREE from 'three';

export class DressageArena {
    constructor(game) {
        this.game = game;
        this.movements = [];
        this.currentMovement = 0;
        this.score = 0;
        this.isActive = false;

        // Dressage movements/figures
        this.figures = [
            { name: 'Pysähdys X:ssä', description: 'Ratsasta keskelle ja pysähdy', targetLetter: 'X' },
            { name: 'Tervehdi', description: 'Kumarra tuomaristolle', action: 'salute' },
            { name: 'Työravausikle C:hen', description: 'Lähde työraviin ja ratsasta C:hen', targetLetter: 'C' },
            { name: 'Vasenalle M:n kohdalla', description: 'Käänny vasemmalle M:n kohdalla', targetLetter: 'M' },
            { name: 'Ympyrä E:ssä', description: 'Tee 20m ympyrä E-kirjaimen kohdalla', targetLetter: 'E' },
            { name: 'Hartialaukka', description: 'Tee hartialaukka H-K välillä', targetLetter: 'K' }
        ];
    }

    start(horse) {
        this.horse = horse;
        this.currentMovement = 0;
        this.score = 0;
        this.isActive = true;

        // Position horse at arena entrance (A)
        horse.mesh.position.set(80, 0, -70);
        horse.mesh.rotation.y = 0;

        // Show dressage UI
        this.showUI();
    }

    showUI() {
        const hud = document.createElement('div');
        hud.id = 'dressage-hud';
        hud.innerHTML = `
            <div class="dressage-info">
                <h3>Kouluratsastus</h3>
                <div class="current-figure" id="current-figure">
                    <span class="figure-name">${this.figures[0].name}</span>
                    <span class="figure-desc">${this.figures[0].description}</span>
                </div>
                <div class="progress-indicator">
                    <span>Liike <strong id="movement-num">1</strong>/${this.figures.length}</span>
                </div>
                <div class="dressage-score">
                    <span>Pisteet: <strong id="dressage-score">0</strong></span>
                </div>
            </div>
            <button id="complete-movement" class="action-btn-small">Suorita liike</button>
            <button id="stop-dressage" class="stop-btn">Lopeta</button>
        `;

        const styles = document.createElement('style');
        styles.id = 'dressage-styles';
        styles.textContent = `
            #dressage-hud {
                position: fixed;
                top: 80px;
                right: 20px;
                width: 280px;
                background: rgba(26, 26, 46, 0.95);
                border: 1px solid rgba(218, 165, 32, 0.5);
                border-radius: 12px;
                padding: 16px;
                z-index: 200;
                backdrop-filter: blur(10px);
            }
            .dressage-info h3 {
                margin: 0 0 12px 0;
                color: #DAA520;
                font-size: 1rem;
            }
            .current-figure {
                background: rgba(255, 255, 255, 0.1);
                border-radius: 8px;
                padding: 12px;
                margin-bottom: 12px;
            }
            .figure-name {
                display: block;
                font-weight: 600;
                margin-bottom: 4px;
            }
            .figure-desc {
                display: block;
                font-size: 0.875rem;
                color: rgba(255, 255, 255, 0.7);
            }
            .progress-indicator, .dressage-score {
                margin-bottom: 8px;
                font-size: 0.875rem;
            }
            .action-btn-small {
                display: block;
                width: 100%;
                padding: 10px;
                margin-bottom: 8px;
                font-family: inherit;
                font-size: 0.875rem;
                font-weight: 600;
                background: linear-gradient(135deg, #8B4513 0%, #DAA520 100%);
                border: none;
                border-radius: 8px;
                color: #fff;
                cursor: pointer;
                transition: all 0.2s ease;
            }
            .action-btn-small:hover {
                transform: translateY(-2px);
                box-shadow: 0 4px 12px rgba(218, 165, 32, 0.3);
            }
        `;

        document.head.appendChild(styles);
        document.body.appendChild(hud);

        document.getElementById('complete-movement').addEventListener('click', () => this.completeMovement());
        document.getElementById('stop-dressage').addEventListener('click', () => this.stop());
    }

    hideUI() {
        const hud = document.getElementById('dressage-hud');
        const styles = document.getElementById('dressage-styles');
        if (hud) hud.remove();
        if (styles) styles.remove();
    }

    completeMovement() {
        // Calculate score based on position and timing (simplified)
        const movementScore = Math.floor(6 + Math.random() * 4); // 6-10 points
        this.score += movementScore;

        document.getElementById('dressage-score').textContent = this.score;

        this.game.ui.showNotification(`${this.figures[this.currentMovement].name}: ${movementScore} pistettä!`);

        this.currentMovement++;

        if (this.currentMovement >= this.figures.length) {
            this.finish();
        } else {
            // Update UI with next movement
            document.getElementById('movement-num').textContent = this.currentMovement + 1;
            document.getElementById('current-figure').innerHTML = `
                <span class="figure-name">${this.figures[this.currentMovement].name}</span>
                <span class="figure-desc">${this.figures[this.currentMovement].description}</span>
            `;
        }
    }

    finish() {
        const maxScore = this.figures.length * 10;
        const percentage = Math.round((this.score / maxScore) * 100);

        let grade;
        if (percentage >= 70) grade = 'Erinomainen! 🏆';
        else if (percentage >= 60) grade = 'Hyvä! 🥈';
        else if (percentage >= 50) grade = 'Tyydyttävä 🥉';
        else grade = 'Harjoittele lisää 📚';

        this.game.ui.showNotification(
            `Ohjelma suoritettu! Pisteet: ${this.score}/${maxScore} (${percentage}%) - ${grade}`
        );

        setTimeout(() => this.stop(), 2000);
    }

    stop() {
        this.isActive = false;
        this.hideUI();

        this.game.player.dismountHorse();
        this.horse.moveToStall();
    }
}
